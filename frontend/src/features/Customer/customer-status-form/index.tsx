import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputAction from '@/components/customs/input/input.main.component';
import TextArea from '@/components/customs/textAreas/textarea.main.component';
import Buttons from '@/components/customs/button/button.main.component';
import { useToast } from '@/components/customs/alert/toast.main.component';
import { postCustomerStatus, updateCustomerStatus, getCustomerStatusById } from '@/services/customerStatus.service';
import { useNavigate } from 'react-router-dom';

interface CustomerStatusFormProps { mode: 'create' | 'edit'; id?: string; }

const schema = z.object({
  name: z.string().trim().min(1,'กรอกชื่อสถานะ').max(50,'ยาวเกิน 50 ตัวอักษร'),
  start_condition: z.string().trim().min(1,'กรอกเงื่อนไขเริ่มต้น'),
  end_condition: z.string().trim().min(1,'กรอกเงื่อนไขสิ้นสุด'),
  description: z.string().trim().max(500,'เกิน 500 ตัวอักษร').optional().or(z.literal('')),
  order_no: z.coerce.number().int().positive().default(1),
  is_active: z.boolean().default(true),
  category: z.string().trim().max(30,'เกิน 30 ตัวอักษร').optional().or(z.literal('')),
});

export type CustomerStatusFormData = z.infer<typeof schema>;

export default function CustomerStatusForm({ mode, id }: CustomerStatusFormProps){
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { handleSubmit, setValue, formState:{ errors, isSubmitting }, reset, watch } = useForm<CustomerStatusFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name:'', start_condition:'', end_condition:'', description:'', order_no:1, is_active:true, category:'lifecycle' }
  });

  const values = watch();

  useEffect(()=>{ if(mode==='edit' && id){ (async()=>{ try{ const res = await getCustomerStatusById(id); if(res.statusCode===200 && res.responseObject){ const item = res.responseObject as CustomerStatusFormData & { order_no:number; is_active:boolean; category?:string }; reset({ name:item.name, start_condition:item.start_condition, end_condition:item.end_condition, description:item.description||'', order_no:item.order_no, is_active:item.is_active, category:item.category||'lifecycle' }); } else showToast(res.message||'ไม่พบข้อมูล', false);}catch{ showToast('ไม่สามารถโหลดข้อมูล', false);} })(); } },[mode,id,reset,showToast]);

  const onSubmit = async (data: CustomerStatusFormData) => {
    try {
      if(mode==='create'){
        const res = await postCustomerStatus({ ...data, description: data.description||undefined, category: data.category||undefined });
        if(res.statusCode===200){ showToast('สร้างสถานะสำเร็จ', true); navigate('/customer-info'); } else showToast(res.message||'สร้างไม่สำเร็จ', false);
      } else if(mode==='edit' && id){
        const res = await updateCustomerStatus(id, { ...data, description: data.description||undefined, category: data.category||undefined });
        if(res.statusCode===200){ showToast('แก้ไขสถานะสำเร็จ', true); navigate('/customer-info'); } else showToast(res.message||'แก้ไขไม่สำเร็จ', false);
      }
    } catch { showToast('บันทึกไม่สำเร็จ', false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='p-7 pb-5 bg-white shadow-lg rounded-lg'>
      <h1 className='text-xl font-semibold mb-1'>{mode==='create' ? 'สร้างสถานะลูกค้า' : 'แก้ไขสถานะลูกค้า'}</h1>
      <div className='border-b-2 border-main mb-6'></div>
      <div className='space-y-5 mb-8'>
        <div>
          <InputAction id='cs-name' label='ชื่อสถานะ' placeholder='เช่น ลูกค้าใหม่' value={values.name} onChange={e=>setValue('name', e.target.value, { shouldValidate:true })} labelOrientation='horizontal' classNameLabel='w-60' classNameInput='w-full' require='require' isError={!!errors.name} />
          {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
        </div>
        <div>
          <InputAction id='cs-category' label='หมวดหมู่' placeholder='เช่น lifecycle' value={values.category} onChange={e=>setValue('category', e.target.value, { shouldValidate:true })} labelOrientation='horizontal' classNameLabel='w-60' classNameInput='w-full' isError={!!errors.category} />
          {errors.category && <p className='text-red-500 text-sm mt-1'>{errors.category.message}</p>}
        </div>
        <div>
          <TextArea id='cs-start' label='เงื่อนไขเริ่มต้น' placeholder='เช่น คำสั่งซื้อสำเร็จครั้งแรกภายใน 30 วัน' value={values.start_condition} onChange={e=>setValue('start_condition', e.target.value, { shouldValidate:true })} classNameLabel='w-60' isError={!!errors.start_condition} />
          {errors.start_condition && <p className='text-red-500 text-sm mt-1'>{errors.start_condition.message}</p>}
        </div>
        <div>
          <TextArea id='cs-end' label='เงื่อนไขสิ้นสุด' placeholder='เช่น ไม่มีคำสั่งซื้อใหม่เกิน 60 วัน' value={values.end_condition} onChange={e=>setValue('end_condition', e.target.value, { shouldValidate:true })} classNameLabel='w-60' isError={!!errors.end_condition} />
          {errors.end_condition && <p className='text-red-500 text-sm mt-1'>{errors.end_condition.message}</p>}
        </div>
        <div>
          <TextArea id='cs-desc' label='รายละเอียดเพิ่มเติม' placeholder='บันทึกเพิ่มเติม (ไม่บังคับ)' value={values.description} onChange={e=>setValue('description', e.target.value, { shouldValidate:true })} classNameLabel='w-60' isError={!!errors.description} />
          {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
        </div>
        <div>
          <InputAction id='cs-order' label='ลำดับ' type='number' value={values.order_no?.toString() || ''} onChange={e=>setValue('order_no', Number(e.target.value||1), { shouldValidate:true })} labelOrientation='horizontal' classNameLabel='w-60' classNameInput='w-full' isError={!!errors.order_no} />
          {errors.order_no && <p className='text-red-500 text-sm mt-1'>{errors.order_no.message}</p>}
        </div>
        <div className='flex items-center space-x-2'>
          <label htmlFor='is_active' className=''>เปิดใช้งาน</label>
          <input id='is_active' type='checkbox' className='toggle toggle-primary' checked={values.is_active} onChange={e=>setValue('is_active', e.target.checked, { shouldValidate:true })} />
        </div>
      </div>
      <div className='flex justify-center md:justify-end space-x-5 mt-8'>
        <Buttons btnType='primary' variant='outline' className='w-30' type='submit' disabled={isSubmitting}>{isSubmitting? 'กำลังบันทึก...' : 'บันทึก'}</Buttons>
        <Buttons btnType='cancel' variant='soft' className='w-30' type='button' onClick={()=>navigate('/customer-info')}>ยกเลิก</Buttons>
      </div>
    </form>
  );
}
