import { SaleOrder } from '@prisma/client';
import prisma from '@src/db';
import { Filter , TypeUpdateCompany , TypeUpdatePaymentDetail , Payment , PaymentUpdate , StatusDelivery } from '@modules/saleOrder/saleOrderModel';
import { number, object, set } from 'zod';
import e from 'express';
import path from "path";
import { create } from 'domain';
import { generateNumber , convertDecimalToNumber } from '@common/models/createCode';
import { isAwaitExpression, isAwaitKeyword } from 'typescript';
import { Decimal } from '@prisma/client/runtime/library';
import { assert } from 'console';
import { email } from 'envalid';
import { select } from '@common/models/selectData';
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

export const saleOrderRepository = {

    
    count: async (
        searchText: string,
        payload : Filter
    ) => {
        searchText = searchText?.trim();
        return await prisma.saleOrder.count({
            where: {
                AND: [
                    {...(searchText && {
                        OR: [
                            {
                                sale_order_number: { contains: searchText , mode : 'insensitive' }
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
                            ...(payload.status ? [{ sale_order_status: payload.status }] : []),
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

        const saleOrder = await prisma.saleOrder.findMany({
            where: {
                AND: [
                    {...(searchText && {
                        OR: [
                            {
                                sale_order_number: { contains: searchText , mode : 'insensitive' }
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
                            ...(payload.status ? [{ sale_order_status: payload.status }] : []),
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
                sale_order_id: true,
                sale_order_number: true,
                customer: {
                    select:{
                        customer_id: true,
                        company_name: true
                    }
                },
                sale_order_status : true ,
                responsible:{
                    select:{
                        employee_id: true,
                        first_name: true,
                        last_name: true
                    }
                },
                issue_date: true,
                price_date: true,
                grand_total: true,
                payment_status: true,
                sale_order_payment_log: {
                    select: {
                        amount_paid: true
                    },
                }
            },
            orderBy : { created_at : 'desc' }
        });

        const saleOrdersWithTotalPaid = saleOrder.map(order => {
            const totalAmountPaid = order.sale_order_payment_log.reduce(
                (sum, log) => sum + Number(log.amount_paid),
                0
            );

            // ลบออกโดย destructuring
            const { sale_order_payment_log, ...rest } = order;

            return {
                ...rest,
                totalAmountPaid
            };
        });

        return saleOrdersWithTotalPaid;
    },

    findById: async (sale_order_id: string) => {
        sale_order_id = sale_order_id.trim();
        const saleOrder = await prisma.saleOrder.findFirst({
            where: { sale_order_id : sale_order_id },
            select: {
                sale_order_number:true,
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
                sale_order_product: {
                    select: {
                        sale_order_item_id: true,
                        product: { select: { product_id: true , product_name: true }},
                        sale_order_item_count: true,
                        unit: { select: { unit_id: true , unit_name: true } },
                        unit_price: true,
                        unit_discount: true,
                        unit_discount_percent: true,
                        sale_order_item_price: true,
                        group_product: { select: { group_product_id: true , group_product_name: true } }
                    }
                },
                currency: { select: { currency_id: true , currency_name: true } },
                total_amount: true,
                special_discount: true,
                amount_after_discount: true,
                vat: { select : { vat_id: true , vat_percentage: true }},
                vat_amount: true,
                grand_total: true,
                additional_notes: true,
                payment_status: true,
                payment_term_name: true,
                payment_term_day: true,
                payment_term_installment: true,
                sale_order_payment_term: {
                    select: { 
                        payment_term_id: true,
                        installment_no: true,
                        installment_price: true
                    }
                },
                payment_method: {select : { payment_method_id : true , payment_method_name: true }},
                remark: true,
                sale_order_file: { select : { sale_order_file_id: true , sale_order_file_url: true }},
                sale_order_payment_log: {
                    select: {
                        payment_log_id: true,
                        payment_date: true,
                        amount_paid: true,
                        payment_term_name:true,
                        payment_method: { select: { payment_method_id: true , payment_method_name: true } },
                        payment_remark: true,
                        payment_file: true
                    }
                },
                manufacture_factory_date: true,
                expected_manufacture_factory_date: true,
                delivery_date_success: true,
                expected_delivery_date_success: true,
                receipt_date: true,
                expected_receipt_date: true,
                status: {
                    select: {
                        sale_order_status_id: true,
                        sale_order_status: true,
                        manufacture_factory_date: true,
                        expected_manufacture_factory_date: true,
                        delivery_date_success: true,
                        expected_delivery_date_success: true,
                        receipt_date: true,
                        expected_receipt_date: true,
                        sale_order_status_remark: true,
                        created_at: true,
                        created_by_employee: { select: { employee_id: true , first_name: true , last_name: true }}
                    },
                    orderBy: { created_at: 'asc' }
                } 
            }
        });

        const resultConvert = convertDecimalToNumber(saleOrder);
        const resultConvertArray = Array.isArray(resultConvert) ? resultConvert : [resultConvert];

        const saleOrdersWithTotalPaid = resultConvertArray.map(order => {
            const totalAmountPaid = order.sale_order_payment_log.reduce(
                (sum: number, log:{ amount_paid: number | string }) => sum + Number(log.amount_paid),
                0
            );

            // ลบออกโดย destructuring
            const { sale_order_payment_log, ...rest } = order;

            return {
                ...order,
                totalAmountPaid
            };
        });

        return saleOrdersWithTotalPaid[0];
    },

    updateCompany: async (sale_order_id: string , payload: TypeUpdateCompany , employee_id: string) => {
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
        ) as TypeUpdateCompany;

        setFormNull.forEach((key) => {
            if (!setForm[key as keyof typeof setForm]) {
                delete setForm[key as keyof typeof setForm];
            }
        })
        sale_order_id = sale_order_id.trim();
        employee_id = employee_id.trim();

        const check = await prisma.saleOrder.findFirst({where: { sale_order_id : sale_order_id , sale_order_status:{ in: ["ระหว่างดำเนินการ"] }}});
        if(!check) return null;

        // แปลง string to Date
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };

        const saleOrder = await prisma.saleOrder.update({
            where: { sale_order_id : sale_order_id },
            data: {
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

        return saleOrder;
    },

    updatePaymentDetail: async (sale_order_id: string , payload:TypeUpdatePaymentDetail , employee_id: string) => {
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
        ) as TypeUpdatePaymentDetail;
        setFormNull.forEach((key) => {
            if (!setForm[key as keyof typeof setForm]) {
                delete setForm[key as keyof typeof setForm];
            }
        })
        sale_order_id = sale_order_id.trim();
        employee_id = employee_id.trim();

        const saleOrderUpdate = await prisma.saleOrder.update({
            where: {sale_order_id: sale_order_id},
            data:{
                additional_notes: setForm.additional_notes,
                remark: setForm.remark,
                updated_by: employee_id
            }
        });
        return saleOrderUpdate;
    },

    addFile: async (sale_order_id: string , employee_id: string, files: Express.Multer.File[]) => {
        sale_order_id = sale_order_id.trim();
        if(files && files.length > 0){
            return await prisma.saleOrderFile.createMany({
                data: files.map(file => ({
                    sale_order_id: sale_order_id,
                    sale_order_file_name: file.filename,
                    sale_order_file_url: `/uploads/sale-order/${file.filename}`,
                    sale_order_file_type: path.extname(file.filename),
                    created_by: employee_id
                }))
            });
        }
    },

    deleteFile: async (sale_order_file_id: string ) => {
        sale_order_file_id = sale_order_file_id.trim();
        const saleOrderFile = await prisma.saleOrderFile.findFirst({where:{sale_order_file_id: sale_order_file_id}});
        if(!saleOrderFile) return null;

        fs.unlink(`src/uploads/sale-order/${saleOrderFile.sale_order_file_name}`, (err: Error) => {
            if (err) console.log("not found file", err);
        });
        return await prisma.saleOrderFile.delete({where: {sale_order_file_id:sale_order_file_id}});
    },

    payment : async (sale_order_id: string, payload: Payment, employee_id:string , files: Express.Multer.File[]) => {
        sale_order_id = sale_order_id.trim();
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as Payment;

        const saleOrder = await prisma.saleOrder.findFirst({where: { sale_order_id }});
        const payment = await prisma.saleOrderPaymentLog.findMany({ where: { sale_order_id}});

        const totalAmountPaid = payment.reduce((sum, item) => {
            return sum + Number(item.amount_paid)
        }, 0);

        if(Number(setForm.amount_paid) <= Number(saleOrder?.grand_total) && totalAmountPaid < Number(saleOrder?.grand_total)){
            const paymentLog = await prisma.saleOrderPaymentLog.create({
                data: {
                    sale_order_id: sale_order_id,
                    payment_date: new Date(setForm.payment_date),
                    payment_term_name: setForm.payment_term_name,
                    amount_paid: setForm.amount_paid,
                    payment_method_id: setForm.payment_method_id,
                    payment_remark: setForm.payment_remark,
                    payment_file: files.map(file => ({ "payment_file_url": `/uploads/sale-order/payment/${file.filename}`})),
                    created_by:employee_id,
                    updated_by: employee_id
                }
            });

            if(Number(totalAmountPaid + setForm.amount_paid) == Number(saleOrder?.grand_total)){
                await prisma.saleOrder.update({
                    where: { sale_order_id: sale_order_id },
                    data: {
                        payment_status: "ชำระเงินแล้ว",
                        updated_by: employee_id
                    }
                });
            }

            return paymentLog;
        }else{ return null }

    },

    findByPaymentId: async (sale_order_id:string ,payment_log_id: string) => {
        sale_order_id = sale_order_id.trim();
        payment_log_id = payment_log_id.trim();
        return await prisma.saleOrderPaymentLog.findFirst({where:{sale_order_id,payment_log_id}});
    },

    updatePayment: async (sale_order_id:string , payload: PaymentUpdate , employee_id: string , files: Express.Multer.File[]) => {
        sale_order_id = sale_order_id.trim();
        employee_id = employee_id.trim();
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as PaymentUpdate;

        const check = await prisma.saleOrder.findFirst({ where: { sale_order_id , sale_order_status: "ระหว่างดำเนินการ" } });
        if(!check) return null;

        const existing  = await prisma.saleOrderPaymentLog.findFirst({where: { sale_order_id, payment_log_id : payload.payment_log_id }});

        const payment = await prisma.saleOrderPaymentLog.findMany({ where: { sale_order_id , NOT:{payment_log_id : payload.payment_log_id}}});
        const totalAmountPaid = payment.reduce((sum, item) => {
            return sum + Number(item.amount_paid)
        }, 0);

        if((Number(setForm.amount_paid) + totalAmountPaid) <= Number(check?.grand_total)){

            // const newFiles = files.map(file => ({ "payment_file_url": `/uploads/sale-order/payment/${file.filename}`}));

            // const mergedFiles = [
            //     ...(existing?.payment_file as string || []),
            //     ...newFiles
            // ];
            // console.log(existing?.payment_file)

            if (Array.isArray(existing?.payment_file)) {
                existing.payment_file.forEach((item) => {
                    const filePath = `src${(item as { payment_file_url: string }).payment_file_url}`;
                    fs.unlink(filePath, (err: Error) => {
                    if (err) console.log(`ไม่พบไฟล์: ${filePath}`, err);
                    });
                });
            };

            const paymentUpdate = await prisma.saleOrderPaymentLog.update({
                where: { payment_log_id: payload.payment_log_id },
                data: {
                    payment_date: new Date(setForm.payment_date),
                    payment_term_name: setForm.payment_term_name,
                    amount_paid: setForm.amount_paid,
                    payment_method_id: setForm.payment_method_id,
                    payment_remark: setForm.payment_remark,
                    payment_file: files.map(file => ({ "payment_file_url": `/uploads/sale-order/payment/${file.filename}`})),
                    updated_by: employee_id
                }
            });

            //  ตรวจสอบว่าจ่ายตังครบไหม
            if(Number(totalAmountPaid + setForm.amount_paid) != Number(check?.grand_total)){
                await prisma.saleOrder.update({
                    where: { sale_order_id: sale_order_id },
                    data: {
                        payment_status: "รอการชำระเงิน",
                        updated_by: employee_id
                    }
                });
            }else{
                await prisma.saleOrder.update({
                    where: { sale_order_id: sale_order_id },
                    data: {
                        payment_status: "ชำระเงินแล้ว",
                        updated_by: employee_id
                    }
                });
            }

            return paymentUpdate;

        }else{ return "failed" }
    },

    findByIdPaymentFile: async (payment_log_id: string) => {
        payment_log_id = payment_log_id.trim();

        return await prisma.saleOrderPaymentLog.findFirst({
            where: { payment_log_id: payment_log_id },
            select: {
                payment_log_id: true,
                payment_file:true
            }
        });
        
    },

    deletePayment: async (sale_order_id:string , payment_log_id: string, employee_id: string) => {
        sale_order_id = sale_order_id.trim();
        payment_log_id = payment_log_id.trim();
        employee_id = employee_id.trim();
        const check = await prisma.saleOrderPaymentLog.findFirst({where: {sale_order_id,payment_log_id}});
        
        
        const checkSaleOrder = await prisma.saleOrder.update({
            where: {sale_order_id , sale_order_status: "ระหว่างดำเนินการ"},
            data: { payment_status: "รอการชำระเงิน" , updated_by: employee_id }
        }); 
        if(!check && !checkSaleOrder) return null;

        const deletePayment = await prisma.saleOrderPaymentLog.delete({where: { sale_order_id , payment_log_id }});
        if (Array.isArray(check?.payment_file)) {
            check.payment_file.forEach((item) => {
                const filePath = `src${(item as { payment_file_url: string }).payment_file_url}`;
                fs.unlink(filePath, (err: Error) => {
                if (err) console.log(`ไม่พบไฟล์: ${filePath}`, err);
                });
            });
        };
        return deletePayment;
    },

    manufactureDate: async (sale_order_id:string, manufacture_factory_date:string, employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        manufacture_factory_date = manufacture_factory_date.trim();
        employee_id = employee_id.trim();
        
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };
        await prisma.saleOrder.update({
            where: {sale_order_id},
            data:{
                manufacture_factory_date: toDate(manufacture_factory_date),
                updated_by: employee_id
            }
        });
        return await prisma.saleOrderStatus.create({
            data:{
                sale_order_id: sale_order_id,
                sale_order_status: "การผลิต",
                manufacture_factory_date: toDate(manufacture_factory_date),
                created_by: employee_id
            }
        })
    },
    expectedManufactureDate: async (sale_order_id:string, expected_manufacture_factory_date:string, employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        expected_manufacture_factory_date = expected_manufacture_factory_date.trim();
        employee_id = employee_id.trim();
        
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };
        await prisma.saleOrder.update({
            where: {sale_order_id},
            data:{
                expected_manufacture_factory_date: toDate(expected_manufacture_factory_date),
                updated_by: employee_id
            }
        });
        return await prisma.saleOrderStatus.create({
            data:{
                sale_order_id: sale_order_id,
                sale_order_status: "การผลิต",
                expected_manufacture_factory_date: toDate(expected_manufacture_factory_date),
                created_by: employee_id
            }
        })
    },
    deliveryDate: async (sale_order_id:string, delivery_date_success:string,  employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        delivery_date_success = delivery_date_success.trim();
        employee_id = employee_id.trim();
        
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };
        await prisma.saleOrder.update({
            where: {sale_order_id},
            data:{
                delivery_date_success: toDate(delivery_date_success),
                updated_by: employee_id
            }
        });
        return await prisma.saleOrderStatus.create({
            data:{
                sale_order_id: sale_order_id,
                sale_order_status: "การจัดส่ง",
                delivery_date_success: toDate(delivery_date_success),
                created_by: employee_id
            }
        })
    },
    expectedDeliveryDate: async (sale_order_id:string, expected_delivery_date_success:string, employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        expected_delivery_date_success = expected_delivery_date_success.trim();
        employee_id = employee_id.trim();
        
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };
        await prisma.saleOrder.update({
            where: {sale_order_id},
            data:{
                expected_delivery_date_success: toDate(expected_delivery_date_success),
                updated_by: employee_id
            }
        });
        return await prisma.saleOrderStatus.create({
            data:{
                sale_order_id: sale_order_id,
                sale_order_status: "การจัดส่ง",
                expected_delivery_date_success: toDate(expected_delivery_date_success),
                created_by: employee_id
            }
        })
    },
    receiptDate: async (sale_order_id:string, receipt_date:string, employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        receipt_date = receipt_date.trim();
        employee_id = employee_id.trim();
        
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };
        await prisma.saleOrder.update({
            where: {sale_order_id},
            data:{
                receipt_date: toDate(receipt_date),
                updated_by: employee_id
            }
        });
        return await prisma.saleOrderStatus.create({
            data:{
                sale_order_id: sale_order_id,
                sale_order_status: "ได้รับสินค้า",
                receipt_date: toDate(receipt_date),
                created_by: employee_id
            }
        })
    },
    expectedReceiptDate: async (sale_order_id:string, expected_receipt_date:string,  employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        expected_receipt_date = expected_receipt_date.trim();
        employee_id = employee_id.trim();
        
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };
        await prisma.saleOrder.update({
            where: {sale_order_id},
            data:{
                expected_receipt_date: toDate(expected_receipt_date),
                updated_by: employee_id
            }
        });
        return await prisma.saleOrderStatus.create({
            data:{
                sale_order_id: sale_order_id,
                sale_order_status: "ได้รับสินค้า",
                expected_receipt_date: toDate(expected_receipt_date),
                created_by: employee_id
            }
        })
    },

    closeSale: async (sale_order_id: string, remark:string, employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        remark = remark.trim();
        employee_id = employee_id.trim();

        const checkStatus = await  prisma.saleOrderStatus.findFirst({
            where: { sale_order_id ,  sale_order_status: "ได้รับสินค้า" , NOT:{ receipt_date: null } , sale_order:{ payment_status: "ชำระเงินแล้ว" } } 
        });

        if(checkStatus){
            await prisma.saleOrder.update({
                where: {sale_order_id, sale_order_status: "ระหว่างดำเนินการ"},
                data:{
                    sale_order_status: "สำเร็จ",
                    updated_by: employee_id
                }
            });
            return await prisma.saleOrderStatus.create({
                data:{
                    sale_order_id: sale_order_id,
                    sale_order_status: "สำเร็จ",
                    sale_order_status_remark: remark,
                    created_by: employee_id
                }
            })
        }else{ return null }
    },
    rejectSale: async (sale_order_id: string, remark:string, employee_id:string) => {
        sale_order_id = sale_order_id.trim();
        remark = remark.trim();
        employee_id = employee_id.trim();

        const updateStatus = await prisma.saleOrder.update({
            where: {sale_order_id, sale_order_status: "ระหว่างดำเนินการ"},
            data:{
                sale_order_status: "ไม่สำเร็จ",
                updated_by: employee_id
            }
        });
        if(!updateStatus) return null;
        return await prisma.saleOrderStatus.create({
            data:{
                sale_order_id: sale_order_id,
                sale_order_status: "ไม่สำเร็จ",
                sale_order_status_remark: remark,
                created_by: employee_id
            }
        })

    },

}
