import { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { useToast } from "@/components/customs/alert/useToast";
import { useNavigate } from "react-router-dom";
import { FiImage } from "react-icons/fi";
import dayjs from "dayjs";
import { createEmployee } from "@/services/employee.service";
import { PayLoadCreateEmployee } from "@/types/requests/request.employee";
import { useSelectEmployeeStatus } from "@/hooks/useEmployee";
import { TypeSelectEmployeeStatusResponse } from "@/types/response/response.employee";
import { useSelectRole } from "@/hooks/useRole";
import { TypeRoleResponse } from "@/types/response/response.role";
import { useTeam } from "@/hooks/useTeam";
import { useSocial } from "@/hooks/useSocial";
import { TypeSocialResponse } from "@/types/response/response.social";
import { useAddress } from "@/hooks/useAddress";
import { TypeAddressResponse } from "@/types/response/response.address";

// Validation schema
const passwordSchema = z.string().min(8, "อย่างน้อย 8 ตัว").regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "ต้องมีตัวอักษรและตัวเลข");
const employeeSchema = z.object({
  employee_code: z.string().min(1,"กรอก").max(50),
  username: z.string().min(1,"กรอก").max(50),
  password: passwordSchema,
  confirm_password: z.string().min(1,"กรอก"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  first_name: z.string().min(1,"กรอก").max(50),
  last_name: z.string().optional(),
  role_id: z.string().min(1,"เลือก"),
  position: z.string().min(1,"กรอก").max(50),
  phone: z.preprocess(val=>{ const s = String(val??'').replace(/\D/g,''); return s; }, z.string().regex(/^\d{6,15}$/,"เบอร์ไม่ถูกต้อง")),
  social_id: z.string().optional(),
  detail: z.string().max(255).optional(),
  address: z.string().optional(),
  country_id: z.string().min(1,"เลือก"),
  province_id: z.string().min(1,"เลือก"),
  district_id: z.string().min(1,"เลือก"),
  status_id: z.string().min(1,"เลือก"),
  team_id: z.string().optional(),
  salary: z.preprocess(val => {
    if(val === '' || val === null || val === undefined) return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().nonnegative({ message: "ต้องเป็นตัวเลขไม่ติดลบ" }).optional()),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  birthdate: z.date().optional(),
  contact_detail: z.string().optional(),
}).refine(d=> !d.end_date || !d.start_date || d.end_date >= d.start_date, { message: "วันสิ้นสุดต้องหลังวันเริ่ม", path:["end_date"]})
  .refine(d=> d.password === d.confirm_password, { message: "รหัสผ่านไม่ตรงกัน", path:["confirm_password"]});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function CreateEmployee(){
  const { showToast } = useToast();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [uploadedFile,setUploadedFile] = useState<File|undefined>();

  // Search text states
  const [searchStatus,setSearchStatus] = useState("");
  const [searchRole,setSearchRole] = useState("");
  const [searchTeam,setSearchTeam] = useState("");
  const [searchSocial,setSearchSocial] = useState("");
  const [searchAddress,setSearchAddress] = useState("");

  // Remote data hooks
  const { data: dataEmployeeStatus, refetch: refetchEmployeeStatus } = useSelectEmployeeStatus({ searchText: searchStatus });
  const { data: dataRole, refetch: refetchRole } = useSelectRole({ searchText: searchRole });
  const { data: dataTeam, refetch: refetchTeam } = useTeam({ page:"1", pageSize:"100", searchText: searchTeam });
  const { data: dataSocial, refetch: refetchSocial } = useSocial({ searchText: searchSocial });
  const { data: addressData, refetch: refetchAddress } = useAddress({ searchText: searchAddress });
  const [addressTree,setAddressTree] = useState<TypeAddressResponse[]>([]);
  useEffect(()=>{ if(addressData?.responseObject) setAddressTree(addressData.responseObject); },[addressData]);

  // Option builders
  const employeeStatusOptions = useMemo(()=> (dataEmployeeStatus?.responseObject.data||[]).map((i:TypeSelectEmployeeStatusResponse)=>({label:i.name,value:i.status_id})),[dataEmployeeStatus]);
  const roleOptions = useMemo(()=> (dataRole?.responseObject.data||[]).map((r:TypeRoleResponse)=>({label:r.role_name,value:r.role_id})),[dataRole]);
  const teamOptions = useMemo(()=> (dataTeam?.responseObject.data||[]).map((t:{team_id:string; name:string})=>({label:t.name,value:t.team_id})),[dataTeam]);
  const socialOptions = useMemo(()=> (dataSocial?.responseObject.data||[]).map((s:TypeSocialResponse)=>({label:s.name,value:s.social_id})),[dataSocial]);
  const countryOptions = useMemo(()=> addressTree.map(c=>({label:c.country_name,value:c.country_id})),[addressTree]);
  const getProvinceOptions = (countryId:string)=>{ const c = addressTree.find(cc=>cc.country_id===countryId); return (c?.province||[]).map(p=>({label:p.province_name,value:p.province_id})); };
  const getDistrictOptions = (countryId:string, provinceId:string)=>{ const c = addressTree.find(cc=>cc.country_id===countryId); const p = c?.province?.find(pp=>pp.province_id===provinceId); return (p?.district||[]).map(d=>({label:d.district_name,value:d.district_id})); };

  // Form
  const { handleSubmit, setValue, watch, formState:{errors,isSubmitting} } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues:{
      employee_code:"",username:"",password:"",confirm_password:"",email:"",first_name:"",last_name:"",role_id:"",position:"",phone:"",social_id:undefined,detail:undefined,address:undefined,country_id:"",province_id:"",district_id:"",status_id:"",team_id:undefined,salary:undefined,start_date:new Date(),end_date:undefined,birthdate:undefined,contact_detail:undefined,
    }
  });
  const values = watch();

  // Password strength meter
  const passwordStrength = useMemo(()=>{ const p = values.password||""; if(!p) return 0; let s=0; if(p.length>=8) s++; if(/[A-Z]/.test(p)) s++; if(/[a-z]/.test(p)) s++; if(/\d/.test(p)) s++; if(/[^A-Za-z0-9]/.test(p)) s++; return s;},[values.password]);

  // Handlers
  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{ const f = e.target.files?.[0]; if(f){ setUploadedFile(f);} };
  const onSearchStatus = (t:string)=>{ setSearchStatus(t); refetchEmployeeStatus(); };
  const onSearchRole = (t:string)=>{ setSearchRole(t); refetchRole(); };
  const onSearchTeam = (t:string)=>{ setSearchTeam(t); refetchTeam(); };
  const onSearchSocial = (t:string)=>{ setSearchSocial(t); refetchSocial(); };
  const onSearchAddress = (t:string)=>{ setSearchAddress(t); refetchAddress(); };

  // Reset dependent selections when parent changes
  useEffect(()=>{ setValue('province_id',''); setValue('district_id',''); },[values.country_id,setValue]);
  useEffect(()=>{ setValue('district_id',''); },[values.province_id,setValue]);

  const onSubmit = async (data:EmployeeFormData)=>{
    try{
      const payload: PayLoadCreateEmployee = {
        employee_code: data.employee_code,
        username: data.username,
        password: data.password,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name || "",
        role_id: data.role_id,
        position: data.position,
        phone: data.phone,
        social_id: data.social_id || undefined,
        detail: data.detail || undefined,
        address: data.address || undefined,
        country_id: data.country_id,
        province_id: data.province_id,
        district_id: data.district_id,
        status_id: data.status_id,
        team_id: data.team_id || undefined,
        salary: data.salary, // already number or undefined
        start_date: data.start_date ? dayjs(data.start_date).format("YYYY-MM-DD") : undefined,
        end_date: data.end_date ? dayjs(data.end_date).format("YYYY-MM-DD") : undefined,
        birthdate: data.birthdate ? dayjs(data.birthdate).format("YYYY-MM-DD") : undefined,
      };
      const res = await createEmployee(payload, uploadedFile);
      if(res.statusCode===200){ showToast("สร้างพนักงานสำเร็จ",true); navigate('/employee'); }
      else if(res.statusCode===400 && res.message==="Username or employee code already exists") showToast("ชื่อผู้ใช้งานหรือรหัสพนักงานซ้ำ",false);
      else showToast("สร้างพนักงานไม่สำเร็จ",false);
    }catch{ showToast("สร้างพนักงานไม่สำเร็จ",false); }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-3">เพิ่มพนักงาน</h1>
      <form className="p-7 pb-5 bg-white shadow-lg rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-semibold mb-1">ข้อมูลพนักงาน</h2>
        <div className="border-b-2 border-main mb-6"/>
        <div className="flex items-center space-x-4 mb-6">
          <div onClick={()=>inputRef.current?.click()} className="bg-gray-300 text-white text-center rounded-full w-32 h-32 flex items-center justify-center cursor-pointer hover:bg-gray-400">
            {uploadedFile? <img src={URL.createObjectURL(uploadedFile)} alt="preview" className="w-full h-full object-cover rounded-full"/> : <FiImage size={32}/>}          
          </div>
          <div className="space-y-2">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
            {uploadedFile && <button type="button" className="text-sm text-red-600 underline" onClick={()=>{setUploadedFile(undefined);}}>ลบรูป</button>}
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <InputAction id="employee_code" label="รหัสพนักงาน" value={values.employee_code} onChange={e=>setValue('employee_code',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.employee_code} errorMessage={errors.employee_code?.message as string} />
          <InputAction id="username" label="ชื่อผู้ใช้งาน" value={values.username} onChange={e=>setValue('username',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.username} errorMessage={errors.username?.message as string} />
          <InputAction id="password" type="password" label="รหัสผ่าน" value={values.password} onChange={e=>setValue('password',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.password} errorMessage={errors.password?.message as string} />
          <div className='flex items-center space-x-2 -mt-4'>{passwordStrength>0 && <div className='flex space-x-1'>{[1,2,3,4,5].map(i=> <span key={i} className={`h-1 w-6 rounded ${passwordStrength>=i? 'bg-green-500':'bg-gray-300'}`}/> )}</div>}<span className='text-xs text-gray-500'>{passwordStrength>=4?'ดี':passwordStrength>=3?'ปานกลาง':passwordStrength>=2?'พอใช้':''}</span></div>
          <InputAction id="confirm_password" type="password" label="ยืนยันรหัสผ่าน" value={values.confirm_password} onChange={e=>setValue('confirm_password',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.confirm_password} errorMessage={errors.confirm_password?.message as string} />
          <InputAction id="email" label="อีเมล" value={values.email} onChange={e=>setValue('email',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.email} errorMessage={errors.email?.message as string} />
          <InputAction id="first_name" label="ชื่อ" value={values.first_name} onChange={e=>setValue('first_name',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.first_name} errorMessage={errors.first_name?.message as string} />
          <InputAction id="last_name" label="นามสกุล" value={values.last_name||''} onChange={e=>setValue('last_name',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" />
          <InputAction id="position" label="ตำแหน่ง" value={values.position} onChange={e=>setValue('position',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.position} errorMessage={errors.position?.message as string} />
          <InputAction id="salary" type="number" label="เงินเดือน/ค่าแรง" value={values.salary !== undefined ? String(values.salary) : ''} onChange={e=>{ const v = e.target.value; setValue('salary', v === '' ? undefined : Number(v), {shouldValidate:true}); }} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" isError={!!errors.salary} errorMessage={errors.salary?.message as string} />
          <InputAction id="phone" type="tel" label="เบอร์โทรศัพท์" value={values.phone} onChange={e=>{ const digits = e.target.value.replace(/[^0-9]/g,''); setValue('phone',digits,{shouldValidate:true}); }} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" require="require" isError={!!errors.phone} errorMessage={errors.phone?.message as string} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">
          <div>
            <MasterSelectComponent classNameLabel="w-1/2" label="สิทธิ์" require="require" isError={!!errors.role_id} errorMessage={errors.role_id?.message as string} fetchDataFromGetAPI={async()=>({responseObject:roleOptions})} valueKey="value" labelKey="label" onChange={(opt)=> setValue('role_id', String(opt?.value ?? ''),{shouldValidate:true})} onInputChange={onSearchRole} />
          </div>
          <div>
            <MasterSelectComponent classNameLabel="w-1/2" label="สถานะ" require="require" isError={!!errors.status_id} errorMessage={errors.status_id?.message as string} fetchDataFromGetAPI={async()=>({responseObject:employeeStatusOptions})} valueKey="value" labelKey="label" onChange={(opt)=> setValue('status_id', String(opt?.value ?? ''),{shouldValidate:true})} onInputChange={onSearchStatus} />
          </div>
          <div>
            <MasterSelectComponent classNameLabel="w-1/2" label="ทีม" fetchDataFromGetAPI={async()=>({responseObject:teamOptions})} valueKey="value" labelKey="label" onChange={(opt)=> setValue('team_id', opt?.value ? String(opt.value) : undefined,{shouldValidate:true})} onInputChange={onSearchTeam} />
          </div>
          <div>
            <MasterSelectComponent classNameLabel="w-1/2" label="ประเทศ" require="require" isError={!!errors.country_id} errorMessage={errors.country_id?.message as string} fetchDataFromGetAPI={async()=>({responseObject:countryOptions})} valueKey="value" labelKey="label" onChange={(opt)=> { setValue('country_id', String(opt?.value ?? ''),{shouldValidate:true}); }} onInputChange={onSearchAddress} />
          </div>
          <div>
            <MasterSelectComponent classNameLabel="w-1/2" label="จังหวัด" require="require" isError={!!errors.province_id} errorMessage={errors.province_id?.message as string} fetchDataFromGetAPI={async()=>({responseObject:getProvinceOptions(values.country_id)})} valueKey="value" labelKey="label" onChange={(opt)=> { setValue('province_id', String(opt?.value ?? ''),{shouldValidate:true}); }} />
          </div>
            <div>
            <MasterSelectComponent classNameLabel="w-1/2" label="อำเภอ/เขต" require="require" isError={!!errors.district_id} errorMessage={errors.district_id?.message as string} fetchDataFromGetAPI={async()=>({responseObject:getDistrictOptions(values.country_id, values.province_id)})} valueKey="value" labelKey="label" onChange={(opt)=> setValue('district_id', String(opt?.value ?? ''),{shouldValidate:true})} />
          </div>
          <div>
            <MasterSelectComponent classNameLabel="w-1/2" label="ช่องทางติดต่อ" fetchDataFromGetAPI={async()=>({responseObject:socialOptions})} valueKey="value" labelKey="label" onChange={(opt)=> setValue('social_id', opt?.value ? String(opt.value) : undefined,{shouldValidate:true})} onInputChange={onSearchSocial} />
          </div>
          <InputAction id="contact_detail" label="รายละเอียดช่องทาง" value={values.contact_detail||''} onChange={e=>setValue('contact_detail',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" />
          <InputAction id="address" label="ที่อยู่" value={values.address||''} onChange={e=>setValue('address',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" />
          <InputAction id="detail" label="รายละเอียด" value={values.detail||''} onChange={e=>setValue('detail',e.target.value,{shouldValidate:true})} labelOrientation="horizontal" classNameLabel="w-1/2" classNameInput="w-full" />
          {/* Birthdate */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="birthdate" className="w-1/2">วันเกิด</label>
            <div className="flex flex-col w-full">
              <input id="birthdate" type="date" value={values.birthdate? dayjs(values.birthdate).format('YYYY-MM-DD'):''} onChange={e=> setValue('birthdate', e.target.value? new Date(e.target.value): undefined)} className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
          {/* Start date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="start_date" className="w-1/2">วันเริ่มงาน</label>
            <div className="flex flex-col w-full">
              <input id="start_date" type="date" value={values.start_date? dayjs(values.start_date).format('YYYY-MM-DD'):''} onChange={e=> setValue('start_date', e.target.value? new Date(e.target.value): undefined)} className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
          {/* End date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="end_date" className="w-1/2">วันสิ้นสุดงาน</label>
            <div className="flex flex-col w-full">
              <input id="end_date" type="date" value={values.end_date? dayjs(values.end_date).format('YYYY-MM-DD'):''} onChange={e=> setValue('end_date', e.target.value? new Date(e.target.value): undefined,{shouldValidate:true})} className={`border rounded px-2 py-1 w-full ${errors.end_date ? 'ring-2 ring-red-500 animate-shake' : ''}`} />
              {errors.end_date && <div className='text-red-600 pt-1 text-sm'>{errors.end_date.message}</div>}
            </div>
          </div>
        </div>
        <div className='mt-8 flex justify-end space-x-4'>
          <Buttons btnType='primary' variant='outline' type='submit' disabled={isSubmitting}>{isSubmitting? 'กำลังบันทึก...':'เพิ่มพนักงานใหม่'}</Buttons>
          <Buttons btnType='cancel' variant='soft' type='button' onClick={()=>navigate('/employee')}>ยกเลิก</Buttons>
        </div>
      </form>
    </>

  );
}
