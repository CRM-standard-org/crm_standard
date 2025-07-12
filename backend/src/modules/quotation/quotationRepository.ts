import { Quotation , QuotationFile , QuotationItem , QuotationStatus } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadQuotation , Filter , UpdateItem , AddItem , TypeUpdateCompany , TypeUpdatePayment } from '@modules/quotation/quotationModel';
import { object, set } from 'zod';
import e from 'express';
import path from "path";
import { create } from 'domain';
import { generateNumber , convertDecimalToNumber } from '@common/models/createCode';
import { select } from '@common/models/selectData';
import { isAwaitExpression, isAwaitKeyword } from 'typescript';
import { Decimal } from '@prisma/client/runtime/library';
import { assert } from 'console';
const fs = require('fs');

// สำหรับคำนวนราคาในใบเสนอราคา
async function calculateQuotationTotal(quotation_id: string , vat_percentage? : number) {
  const items = await prisma.quotationItem.findMany({
    where: { quotation_id },
  });

  const quotation = await prisma.quotation.findUnique({
    where: { quotation_id },
    include: { vat: true },
  });

  if (!quotation) return null;

  const total_amount = items.reduce((sum, item) => {
    return sum + (item.quotation_item_price instanceof Decimal
      ? item.quotation_item_price.toNumber()
      : Number(item.quotation_item_price));
  }, 0);

  const special_discount = quotation.special_discount instanceof Decimal
    ? quotation.special_discount.toNumber()
    : Number(quotation.special_discount);

  const amount_after_discount = total_amount - special_discount;

  const vat_percent = !vat_percentage ? Number(quotation.vat?.vat_percentage) || 0  :  vat_percentage;
  const vat_amount = (amount_after_discount * vat_percent) / 100;
  const grand_total = amount_after_discount + vat_amount;

  return {
    total_amount,
    special_discount,
    amount_after_discount,
    vat_percent,
    vat_amount,
    grand_total,
  };
}
// สำหรับอัพเดท payment term 
async function updatePaymentTermsAfterTotalChange(quotation_id: string, employee_id: string) {
  const quotation = await prisma.quotation.findUnique({
    where: { quotation_id },
  });

  if (!quotation || !quotation.payment_term_installment || !quotation.grand_total) return null;

  const installmentCount = quotation.payment_term_installment;
  const grandTotal = quotation.grand_total instanceof Decimal
    ? quotation.grand_total.toNumber()
    : Number(quotation.grand_total);

  // ปัดเศษ 2 ตำแหน่ง
  const baseInstallment = Math.floor((grandTotal * 100) / installmentCount) / 100;
  const remainder = +(grandTotal - baseInstallment * installmentCount).toFixed(2);
  const firstInstallment = +(baseInstallment + remainder).toFixed(2);

  const paymentTerms = Array.from({ length: installmentCount }).map((_, i) => ({
    quotation_id,
    installment_no: i + 1,
    installment_price: new Decimal(i === 0 ? firstInstallment : baseInstallment),
    created_by: employee_id,
    updated_by: employee_id,
  }));

  // ลบของเดิมและเพิ่มใหม่
  await prisma.paymentTerm.deleteMany({ where: { quotation_id } });
  await prisma.paymentTerm.createMany({ data: paymentTerms });

  return paymentTerms;
}

export const quotationRepository = {

    create: async (
        payload: TypePayloadQuotation,
        employee_id: string,
        files: Express.Multer.File[],
    ) => {
        
        const setFormNull: string[] = [];

        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key, value]) => {
                if (typeof value === 'string') {
                    const trimmed = value.trim();
                if (trimmed === '') setFormNull.push(key); // เก็บชื่อ key ไว้ลบภายหลัง
                    return [key, trimmed === '' ? null : trimmed];
                }
                return [key, value === undefined ? null : value];
            })
        ) as TypePayloadQuotation;

        setFormNull.forEach((key) => {
            if (!setForm[key as keyof typeof setForm]) {
                delete setForm[key as keyof typeof setForm];
            }
        })

        employee_id = employee_id.trim();

        const quotationNumber = await generateNumber("quotation");

        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };

        
        const quotation = await prisma.quotation.create({
            data: {
                customer_id: setForm.customer_id,
                quotation_number: "Q" + quotationNumber,
                priority: setForm.priority,
                issue_date: toDate(setForm.issue_date)!,
                team_id: setForm.team_id,
                responsible_employee: setForm.responsible_employee,
                price_date: toDate(setForm.price_date)!,
                shipping_method: setForm.shipping_method,
                shipping_remark: setForm.shipping_remark,
                expected_delivery_date: toDate(setForm.expected_delivery_date)!,
                place_name: setForm.place_name,
                address: setForm.address,
                country_id: setForm.country_id,
                province_id: setForm.province_id,
                district_id: setForm.district_id,
                contact_name: setForm.contact_name,
                contact_email: setForm.contact_email,
                contact_phone: setForm.contact_phone,
                currency_id: setForm.currency_id,
                total_amount: setForm.total_amount,
                special_discount: setForm.special_discount,
                amount_after_discount: setForm.amount_after_discount,
                vat_id: setForm.vat_id,
                vat_amount: setForm.vat_amount,
                grand_total: setForm.grand_total,
                additional_notes: setForm.additional_notes,
                payment_term_name: setForm.payment_term_name,
                payment_term_day: setForm.payment_term_day,
                payment_term_installment: setForm.payment_term_installment,
                payment_method_id: setForm.payment_method_id,
                remark: setForm.remark,
                expected_closing_date: toDate(setForm.expected_closing_date)!,
                created_by: employee_id,
                updated_by: employee_id,
                quotation_status : setForm.quotation_status,
            }
        })

        if (setForm.items && setForm.items.length > 0){
            await prisma.quotationItem.createMany({
                data: setForm.items.map((item) => ({
                    quotation_id: quotation.quotation_id,
                    product_id: item.product_id,
                    quotation_item_count: item.quotation_item_count,
                    unit_id: item.unit_id,
                    unit_price: item.unit_price,
                    unit_discount: item.unit_discount,
                    unit_discount_percent: item.unit_discount_percent,
                    quotation_item_price: item.quotation_item_price,
                    group_product_id: item.group_product_id,
                    created_by: employee_id,
                    updated_by: employee_id
                }))
            });
        }

        
        await prisma.paymentTerm.createMany({
            data: setForm.payment_term.map((item) => ({
                quotation_id: quotation.quotation_id,
                installment_no: item.installment_no,
                installment_price: item.installment_price,
                created_by: employee_id,
                updated_by: employee_id,
            }))
        })
        

        if(files && files.length > 0){
            await prisma.quotationFile.createMany({
                data: files.map(file => ({
                    quotation_id: quotation.quotation_id,
                    quotation_file_name: file.filename,
                    quotation_file_url: `/uploads/quotation/${file.filename}`,
                    quotation_file_type: path.extname(file.filename),
                    created_by: employee_id
                }))
            });
        }

        if(setForm.quotation_status == "ระหว่างดำเนินการ"){
            await prisma.quotationStatus.create({
                data: {
                    quotation_id: quotation.quotation_id,
                    quotation_status: setForm.quotation_status,
                    quotation_status_remark: setForm.quotation_status_remark,
                    created_by: employee_id
                }
            });
        }else if(setForm.quotation_status == "รออนุมัติ"){
            await prisma.quotationStatus.create({
                data: {
                    quotation_id: quotation.quotation_id,
                    quotation_status: "ระหว่างดำเนินการ",
                    created_by: employee_id
                }
            });
            await prisma.quotationStatus.create({
                data: {
                    quotation_id: quotation.quotation_id,
                    quotation_status: setForm.quotation_status,
                    quotation_status_remark: setForm.quotation_status_remark,
                    created_by: employee_id
                }
            })
        }


        return quotation;
    },
    count: async (
        searchText: string,
        payload : Filter
    ) => {
        searchText = searchText?.trim();
        return await prisma.quotation.count({
            where: {
                is_active: true,
                AND: [
                    {...(searchText && {
                        OR: [
                            {
                                quotation_number: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                customer: { 
                                    is: {
                                        company_name: { contains: searchText , mode : 'insensitive' }
                                    }
                                }
                            },
                        ]
                    })},
                    {
                        AND: [
                            ...(payload.responsible_id ? [{ responsible_employee: payload.responsible_id }] : []),
                            ...(payload.status ? [{
                                quotation_status : payload.status
                            }] : []),
                            {
                                OR: [
                                    ...(payload.issue_date ? [{ 
                                        issue_date : { gte : new Date(payload.start_date) , lte : new Date(payload.end_date)  }
                                    }] : []),
                                    ...(payload.price_date ? [{ 
                                        price_date : { gte : new Date(payload.start_date) , lte : new Date(payload.end_date)  }
                                    }] : []),
                                ]
                            }
                        ]
                    }
                ]
            },
        });
    },
    
    findAll: async (
        skip: number,
        take: number,
        searchText: string,
        payload : Filter
    ) => {
        searchText = searchText.trim();

        return prisma.quotation.findMany({
            where: {
                is_active : true,
                AND: [
                    {...(searchText && {
                        OR: [
                            {
                                quotation_number: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                customer: { 
                                    is: {
                                        company_name: { contains: searchText , mode : 'insensitive' }
                                    }
                                }
                            },
                        ]
                    } )},
                    {
                        AND: [
                            ...(payload.responsible_id ? [{ responsible_employee: payload.responsible_id }] : []),
                            ...(payload.status ? [{
                                quotation_status : payload.status
                            }] : []),
                            {
                                OR: [
                                    ...(payload.issue_date ? [{ 
                                        issue_date : { gte : new Date(payload.start_date) , lte : new Date(payload.end_date)  }
                                    }] : []),
                                    ...(payload.price_date ? [{ 
                                        price_date : { gte : new Date(payload.start_date) , lte : new Date(payload.end_date)  }
                                    }] : []),
                                ]
                            }
                        ]
                    }
                ]
            },
            skip: (skip - 1) * take,
            take: take,
            select: {
                quotation_id: true,
                quotation_number: true,
                customer: {
                    select:{
                        customer_id: true,
                        company_name: true
                    }
                },
                priority: true,
                quotation_status : true ,
                responsible:{
                    select:{
                        employee_id: true,
                        first_name: true,
                        last_name: true
                    }
                },
                issue_date: true,
                price_date: true,
                grand_total: true
            },
            orderBy : { created_at : 'desc' }
        });
    },

    findById: async (quotation_id: string) => {
        quotation_id = quotation_id.trim();
        const quotation = await prisma.quotation.findFirst({
            where: { quotation_id : quotation_id , is_active : true },
            select: {
                quotation_number: true,
                customer: { select: { customer_id: true ,  company_name: true , tax_id: true }},
                priority: true,
                issue_date: true,
                price_date: true,
                team: { select: { team_id: true , name: true } },
                responsible: { select: { employee_id: true , first_name : true , last_name: true } },
                shipping_method: true,
                shipping_remark: true,
                expected_delivery_date: true,
                place_name: true,
                address: true,
                country: {select:{ country_id: true , country_name: true}},
                province: {select: { province_id: true , province_name: true }},
                district: {select: { district_id: true , district_name: true }},
                contact_name: true,
                contact_email: true,
                contact_phone: true,
                quotation_products: {
                    select: {
                        quotation_item_id: true,
                        product: { select: { product_id : true , product_name: true } },
                        quotation_item_count: true,
                        unit: { select: { unit_id: true , unit_name: true }},
                        unit_price: true,
                        unit_discount: true,
                        unit_discount_percent: true,
                        quotation_item_price: true,
                        group_product: { select: { group_product_id: true , group_product_name: true } }
                    }
                },
                currency: {select: { currency_id: true , currency_name: true }},
                total_amount: true,
                special_discount: true,
                amount_after_discount: true,
                vat: { select : { vat_id: true , vat_percentage: true }},
                vat_amount: true,
                grand_total: true,
                additional_notes: true,
                payment_term_name: true,
                payment_term_day: true,
                payment_term_installment: true,
                payment_term: {
                    select: { 
                        payment_term_id: true,
                        installment_no: true,
                        installment_price: true
                    }
                },
                payment_method: {select : { payment_method_id : true , payment_method_name: true }},
                remark: true,
                expected_closing_date: true,
                quotation_file: { select : { quotation_file_id: true , quotation_file_url: true }},
                status: {
                    select: {
                        quotation_status_id: true,
                        quotation_status: true,
                        quotation_status_remark: true,
                        created_at: true,
                        created_by_employee: { select: { employee_id: true , first_name: true , last_name: true }}
                    }
                }
            },
            orderBy: { created_at: 'asc' }
        })

        return convertDecimalToNumber(quotation)
    },

    updateCompany: async (quotation_id: string , payload: TypeUpdateCompany , employee_id: string) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypeUpdateCompany;
        quotation_id = quotation_id.trim();
        employee_id = employee_id.trim();

        const check = await prisma.quotation.findFirst({where: { quotation_id : quotation_id , quotation_status:{ in: ["ระหว่างดำเนินการ","ปรับปรุง","ยกเลิกคำขออนุมัติ"] }}});
        if(!check) return null;

        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };

        const quotation = await prisma.quotation.update({
            where: { quotation_id : quotation_id , quotation_status:{ in: ["ระหว่างดำเนินการ","ปรับปรุง","ยกเลิกคำขออนุมัติ"] }},
            data: {
                customer_id : setForm.customer_id,
                priority: setForm.priority,
                issue_date : toDate(setForm.issue_date),
                team_id: setForm.team_id,
                responsible_employee: setForm.responsible_employee,
                price_date: toDate(setForm.price_date),
                expected_closing_date: toDate(setForm.expected_closing_date),
                shipping_method: setForm.shipping_method,
                shipping_remark: setForm.shipping_remark,
                expected_delivery_date: toDate(setForm.expected_delivery_date),
                place_name: setForm.place_name,
                address: setForm.address,
                country_id: setForm.country_id,
                province_id: setForm.province_id,
                district_id: setForm.district_id,
                contact_name: setForm.contact_name,
                contact_email: setForm.contact_email,
                contact_phone: setForm.contact_phone,
                updated_by: employee_id
            }
        });

        return quotation;
    },

    addProductItem: async (quotation_id: string , payload: AddItem , employee_id: string) => {
        
        let setForm: { items: AddItem["items"] } = { items: [] };

        if(payload.items ){
            setForm = {
                items: payload.items.map(item =>
                    Object.fromEntries(
                        Object.entries(item).map(([key, value]) => [
                            key,
                            typeof value === 'string' ? value.trim() : value
                        ])
                    ) as AddItem['items'][number] // บอก TypeScript ว่าคือ item เดียวใน AddItem
                )
            };
        }

        payload.currency_id = payload.currency_id.trim();
        quotation_id = quotation_id.trim();
        employee_id = employee_id.trim();

        const check = await prisma.quotationItem.findFirst({where:{quotation_id: quotation_id , quotation: {quotation_status: {in: ["ระหว่างดำเนินการ","ปรับปรุง","ยกเลิกคำขออนุมัติ"]}}}});
        if(!check) return null

        await prisma.quotation.update({where: {quotation_id: quotation_id}, data:{currency_id: payload.currency_id}});

        if (setForm.items && setForm.items.length > 0){
            await prisma.quotationItem.createMany({
                data: setForm.items.map((item) => ({
                    quotation_id: quotation_id,
                    product_id: item.product_id,
                    quotation_item_count: item.quotation_item_count,
                    unit_id: item.unit_id,
                    unit_price: item.unit_price,
                    unit_discount: item.unit_discount,
                    unit_discount_percent: item.unit_discount_percent,
                    quotation_item_price: item.quotation_item_price,
                    group_product_id: item.group_product_id,
                    created_by: employee_id,
                    updated_by: employee_id
                }))
            });
        }

        const result = await calculateQuotationTotal(quotation_id);
        if(result) {
            await prisma.quotation.update({
                where: {quotation_id: quotation_id},
                data:{
                    total_amount: result.total_amount,
                    special_discount: result.special_discount,
                    amount_after_discount: result.amount_after_discount,
                    vat_amount: result.vat_amount,
                    grand_total: result.grand_total,
                    updated_by: employee_id
                }
            });
            await updatePaymentTermsAfterTotalChange(quotation_id, employee_id);
        }
        return {result};
    },

    updateProductItem: async (quotation_id: string , payload: UpdateItem , employee_id: string) =>{
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as UpdateItem;
        quotation_id = quotation_id.trim();
        employee_id = employee_id.trim();

        const check = await prisma.quotationItem.findFirst({where:{quotation_id: quotation_id , quotation_item_id: setForm.quotation_item_id , quotation: {quotation_status: {in: ["ระหว่างดำเนินการ","ปรับปรุง","ยกเลิกคำขออนุมัติ"]}}}});
        if(!check) return null
        
        await prisma.quotationItem.update({
            where: {quotation_item_id: setForm.quotation_item_id},
            data: {
                product_id: setForm.product_id,
                quotation_item_count: setForm.quotation_item_count,
                unit_id: setForm.unit_id,
                unit_price: setForm.unit_price,
                unit_discount: setForm.unit_discount,
                unit_discount_percent: setForm.unit_discount_percent,
                quotation_item_price: setForm.quotation_item_price,
                group_product_id: setForm.group_product_id,
                updated_by: employee_id
            }
        });
        
        const result = await calculateQuotationTotal(quotation_id);
        if(result) {
            await prisma.quotation.update({
                where: {quotation_id: quotation_id},
                data:{
                    total_amount: result.total_amount,
                    special_discount: result.special_discount,
                    amount_after_discount: result.amount_after_discount,
                    vat_amount: result.vat_amount,
                    grand_total: result.grand_total,
                    updated_by: employee_id
                }
            });
            await updatePaymentTermsAfterTotalChange(quotation_id, employee_id);
        }
        return {result};
    },

    deleteProductItem: async (quotation_id:string , quotation_item_id: string , employee_id: string ) => {
        quotation_id = quotation_id.trim();
        quotation_item_id = quotation_item_id.trim();

        const check = await prisma.quotationItem.findFirst({where:{quotation_id: quotation_id , quotation_item_id: quotation_item_id , quotation: {quotation_status: {in: ["ระหว่างดำเนินการ","ปรับปรุง","ยกเลิกคำขออนุมัติ"]}}}});
        if(!check) return null

        const amount = await prisma.quotationItem.count({where: {quotation_id: quotation_id}});
        if(amount <= 1) return "min";

        await prisma.quotationItem.delete({
            where: { quotation_item_id: quotation_item_id }
        });
        
        const result = await calculateQuotationTotal(quotation_id);
        if(result) {
            
            await prisma.quotation.update({
                where: {quotation_id: quotation_id},
                data:{
                    total_amount: result.total_amount,
                    special_discount: result.special_discount,
                    amount_after_discount: result.amount_after_discount,
                    vat_amount: result.vat_amount,
                    grand_total: result.grand_total,
                    updated_by: employee_id
                }
            });
            await updatePaymentTermsAfterTotalChange(quotation_id, employee_id);
        }


        return {result};
    },

    updatePayment: async (quotation_id: string , payload:TypeUpdatePayment , employee_id: string) => {
        const setFormNull: string[] = [];
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key, value]) => {
                if (typeof value === 'string') {
                    const trimmed = value.trim();
                if (trimmed === '') setFormNull.push(key); // เก็บชื่อ key ไว้ลบภายหลัง
                    return [key, trimmed === '' ? null : trimmed];
                }
                return [key, value === undefined ? null : value];
            })
        ) as TypePayloadQuotation;
        setFormNull.forEach((key) => {
            if (!setForm[key as keyof typeof setForm]) {
                delete setForm[key as keyof typeof setForm];
            }
        })
        quotation_id = quotation_id.trim();
        employee_id = employee_id.trim();

        // cal price
        const items = await prisma.quotationItem.findMany({
            where: { quotation_id },
        });

        const quotation = await prisma.quotation.findUnique({
            where: { quotation_id },
            include: { vat: true },
        });

        const vat = await prisma.vat.findFirst({where: {vat_id: setForm.vat_id}});

        if (!quotation) return null;

        const total_amount = items.reduce((sum, item) => {
            return sum + (item.quotation_item_price instanceof Decimal
            ? item.quotation_item_price.toNumber()
            : Number(item.quotation_item_price));
        }, 0);

        const special_discount = Number(setForm.special_discount) 

        const amount_after_discount = total_amount - special_discount;

        const vat_percent = !Number(vat?.vat_percentage) ? Number(quotation.vat?.vat_percentage) || 0 : Number(vat?.vat_percentage);
        const vat_amount = (amount_after_discount * vat_percent) / 100;
        const grand_total = amount_after_discount + vat_amount;

        const total_installment_price = payload.payment_term.reduce((sum, item) => {
            return sum + Number(item.installment_price)
        }, 0)

        // update 
        if(setForm.total_amount == total_amount &&  setForm.special_discount == special_discount && setForm.amount_after_discount == amount_after_discount && setForm.vat_amount == vat_amount && setForm.grand_total == grand_total && total_installment_price == grand_total) {
            
            const quotationUpdate = await prisma.quotation.update({
                where: {quotation_id: quotation_id},
                data:{
                    total_amount: setForm.total_amount,
                    special_discount: setForm.special_discount,
                    amount_after_discount: setForm.amount_after_discount,
                    vat_id: setForm.vat_id,
                    vat_amount: setForm.vat_amount,
                    grand_total: setForm.grand_total,
                    additional_notes: setForm.additional_notes,
                    payment_term_name: setForm.payment_term_name,
                    payment_term_day: setForm.payment_term_day,
                    payment_term_installment: setForm.payment_term_installment,
                    payment_method_id: setForm.payment_method_id,
                    remark: setForm.remark,
                    updated_by: employee_id
                }
            });

            // update payment term
            await prisma.paymentTerm.deleteMany({ where: { quotation_id } });
            await prisma.paymentTerm.createMany({
                data: setForm.payment_term.map((item) => ({
                    quotation_id: quotation_id,
                    installment_no: item.installment_no,
                    installment_price: item.installment_price,
                    created_by: employee_id,
                    updated_by: employee_id,
                }))
            })

            return quotationUpdate;
        }else{ return 'failed'}
    },

    addQuotationFile: async (quotation_id: string , employee_id: string, files: Express.Multer.File[]) => {
        quotation_id = quotation_id.trim();
        if(files && files.length > 0){
            return await prisma.quotationFile.createMany({
                data: files.map(file => ({
                    quotation_id: quotation_id,
                    quotation_file_name: file.filename,
                    quotation_file_url: `/uploads/quotation/${file.filename}`,
                    quotation_file_type: path.extname(file.filename),
                    created_by: employee_id
                }))
            });
        }
    },

    deleteQuotationFile: async (quotation_file_id: string) => {
        quotation_file_id = quotation_file_id.trim();
        const QuotationFile = await prisma.quotationFile.findFirst({where:{quotation_file_id: quotation_file_id}});
        if(!QuotationFile) return null;

        fs.unlink(`src/uploads/quotation/${QuotationFile.quotation_file_name}`, (err: Error) => {
            if (err) throw new Error("not found file : " +  err); 
        });
        return await prisma.quotationFile.delete({where: {quotation_file_id:quotation_file_id}});
    },
    // ยกเลิก
    cancel: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id : quotation_id , NOT: {quotation_status: {in: ["ไม่อนุมัติ","สำเร็จ","ไม่สำเร็จ"]}}}});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id : quotation_id , NOT: {quotation_status: {in: ["ไม่อนุมัติ","สำเร็จ","ไม่สำเร็จ"]}}} , 
            data: { quotation_status: quotation_status , updated_by : employee_id }
        });
        await prisma.quotationStatus.create({
            data: { 
                quotation_id: quotation_id , 
                quotation_status:quotation_status ,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        return quotation;
    },
    // รออนุมัติ
    requestApprove: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id: quotation_id , quotation_status: { in: ["ระหว่างดำเนินการ" , "ปรับปรุง" ,"ยกเลิกคำขออนุมัติ"] } }});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id: quotation_id , quotation_status: { in: ["ระหว่างดำเนินการ" , "ปรับปรุง" ,"ยกเลิกคำขออนุมัติ"] } },
            data: { quotation_status: quotation_status , updated_by: employee_id }
        });
        
        await prisma.quotationStatus.create({
            data:{
                quotation_id: quotation_id,
                quotation_status: quotation_status,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        return quotation;
    },
    // ขอปรับปรุง
    requestEdit: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id: quotation_id , quotation_status: { in: ["อนุมัติ" ,"ไม่อนุมัติ" ] } }});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id: quotation_id , quotation_status: { in: ["อนุมัติ" ,"ไม่อนุมัติ" ] } },
            data: { quotation_status: quotation_status , updated_by: employee_id }
        });
        
        await prisma.quotationStatus.create({
            data:{
                quotation_id: quotation_id,
                quotation_status: quotation_status,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        return quotation;
    },
    // อนุมัติ
    approve: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id: quotation_id , quotation_status: { in: ["รออนุมัติ" ] } }});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id: quotation_id , quotation_status: { in: ["รออนุมัติ" ] } },
            data: { quotation_status: quotation_status , updated_by: employee_id }
        });
        
        await prisma.quotationStatus.create({
            data:{
                quotation_id: quotation_id,
                quotation_status: quotation_status,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        return quotation;
    },
    // ไม่อนุมัติ
    reject: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id: quotation_id , quotation_status: { in: ["รออนุมัติ" ] } }});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id: quotation_id , quotation_status: { in: ["รออนุมัติ" ] } },
            data: { quotation_status: quotation_status , updated_by: employee_id }
        });
        
        await prisma.quotationStatus.create({
            data:{
                quotation_id: quotation_id,
                quotation_status: quotation_status,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        return quotation;
    },
    // ยกเลิกคำขออนุมัติ
    cancelApprove: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id: quotation_id , quotation_status: { in: ["รออนุมัติ" ] } }});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id: quotation_id , quotation_status: { in: ["รออนุมัติ"] } },
            data: { quotation_status: quotation_status , updated_by: employee_id }
        });
        
        await prisma.quotationStatus.create({
            data:{
                quotation_id: quotation_id,
                quotation_status: quotation_status,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        return quotation;
    },
    // ปฏิเสธดีล = ไม่สำเร็จ
    rejectDeal: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id: quotation_id , quotation_status: { in: ["อนุมัติ" ] } }});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id: quotation_id , quotation_status: { in: ["อนุมัติ" ] } },
            data: { quotation_status: quotation_status , updated_by: employee_id }
        });
        
        await prisma.quotationStatus.create({
            data:{
                quotation_id: quotation_id,
                quotation_status: quotation_status,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        return quotation;
    },
    // ปิดดีล = สำเร็จ
    closeDeal: async (quotation_id: string , quotation_status: string , quotation_status_remark: string | null , employee_id: string) => {
        quotation_id = quotation_id.trim();
        quotation_status = quotation_status.trim();
        quotation_status_remark = quotation_status_remark?.trim() === '' ? null : quotation_status_remark;
        employee_id = employee_id.trim();

        const checkQuotation = await prisma.quotation.findFirst({where: { quotation_id: quotation_id , quotation_status: { in: ["อนุมัติ" ] } }});
        if(!checkQuotation) return null

        const quotation = await prisma.quotation.update({
            where: { quotation_id: quotation_id , quotation_status: { in: ["อนุมัติ" ] } },
            data: { quotation_status: quotation_status , updated_by: employee_id }
        });
        
        
        await prisma.quotationStatus.create({
            data:{
                quotation_id: quotation_id,
                quotation_status: quotation_status,
                quotation_status_remark: quotation_status_remark,
                created_by: employee_id
            }
        });

        // list data 
        const paymentTerm = await prisma.paymentTerm.findMany({where: {quotation_id: quotation.quotation_id}});
        const quotationItem = await prisma.quotationItem.findMany({where: {quotation_id: quotation.quotation_id}});

        // duplicate data
        const saleOrderNumber = await generateNumber("saleOrder");
        const saleOrder = await prisma.saleOrder.create({
            data: {
                quotation_id: quotation.quotation_id,
                customer_id: quotation.customer_id,
                sale_order_number: "P" + saleOrderNumber,
                sale_order_status: "ระหว่างดำเนินการ",
                issue_date: quotation.issue_date,
                price_date: quotation.price_date,
                priority: quotation.priority,
                responsible_employee: quotation.responsible_employee,
                team_id: quotation.team_id,
                shipping_method: quotation.shipping_method,
                shipping_remark: quotation.shipping_remark,
                expected_delivery_date: quotation.expected_delivery_date,
                place_name: quotation.place_name,
                address: quotation.address,
                country_id: quotation.country_id,
                province_id: quotation.province_id,
                district_id: quotation.district_id,
                contact_name: quotation.contact_name,
                contact_email: quotation.contact_email,
                contact_phone: quotation.contact_phone,
                currency_id: quotation.currency_id,
                payment_term_name: quotation.payment_term_name,
                payment_term_day: quotation.payment_term_day,
                payment_term_installment: quotation.payment_term_installment,
                payment_method_id: quotation.payment_method_id,
                remark: quotation.remark,
                total_amount: quotation.total_amount,
                special_discount: quotation.special_discount,
                amount_after_discount: quotation.amount_after_discount,
                vat_id: quotation.vat_id,
                vat_amount: quotation.vat_amount,
                grand_total: quotation.grand_total,
                additional_notes: quotation.additional_notes,
                created_by: employee_id,
                updated_by: employee_id
            }
        });

        const status = [{status:"แปลงจากใบเสนอราคา"},{ status: "ระหว่างดำเนินการ"}]

        await prisma.saleOrderStatus.createMany({
            data: status.map((item) => ({
                sale_order_id: saleOrder.sale_order_id,
                sale_order_status: item.status,
                created_by: employee_id
            }))
        });

        await prisma.saleOrderPaymentTerm.createMany({
            data: paymentTerm.map((item) => ({
                sale_order_id: saleOrder.sale_order_id,
                installment_no: item.installment_no,
                installment_price: item.installment_price,
                created_by: item.created_by
            }))
        });

        await prisma.saleOrderItem.createMany({
            data: quotationItem.map((item) => ({
                sale_order_id: saleOrder.sale_order_id,
                product_id: item.product_id,
                sale_order_item_count: item.quotation_item_count,
                unit_id: item.unit_id,
                unit_price: item.unit_price,
                unit_discount: item.unit_discount,
                unit_discount_percent: item.unit_discount_percent,
                sale_order_item_price: item.quotation_item_price,
                group_product_id: item.group_product_id,
                created_by: item.created_by,
                updated_by: item.updated_by
            }))
        })

        return quotation;
    },

};