import { z } from "zod";


export type TypePayloadQuotation = {
    quotation_id?: string;
    customer_id: string;
    // quotation_number: number;
    issue_date: Date;
    price_date: Date;
    priority: number;
    responsible_employee: string;
    team_id: string;
    shipping_method: string;
    shipping_remark?: string;
    expected_delivery_date: Date;
    // status_expexted_delivery_date: boolean;
    place_name: string;
    address: string;
    country_id: string;
    province_id: string;
    district_id: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    // status_product_id: boolean;
    currency_id: string;
    payment_term_name: string;
    payment_term_day: number;
    payment_term_installment: number;
    payment_method_id: string;
    remark?: string;
    total_amount: number;
    special_discount: number;
    amount_after_discount: number;
    vat_id: string;
    vat_amount: number;
    grand_total: number;
    additional_notes?: string;
    expected_closing_date: Date;

    payment_term_id?: string;
    payment_term: {
        installment_no: number;
        installment_price: number;
    }[];

    vat_percentage: string;
    
    quotation_item_id?: string;
    items: {
        product_id: string;
        quotation_item_count: number;
        unit_id: string;
        unit_price: number;
        unit_discount: number;
        unit_discount_percent: number;
        quotation_item_price: number;
        group_product_id: string;
    }[];

    quotation_status_id?: string;
    quotation_status: string;
    quotation_status_remark?: string;

    quotation_file_id?: string;
    quotation_file_name: string;
    quotation_file_url: string;
    quotation_type: string;

};

export type Filter = {
    responsible_id? : string;
    status? : string;
    issue_date? : Date;
    price_date? : Date;
    start_date: string;
    end_date: string;
}

export type AddItem = {
    currency_id: string;
    items: {
        product_id: string;
        quotation_item_count: number;
        unit_id: string;
        unit_price: number;
        unit_discount: number;
        unit_discount_percent: number;
        quotation_item_price: number;
        group_product_id: string;
    }[];
}

export type UpdateItem = {
    quotation_item_id: string;
    product_id: string;
    quotation_item_count: number;
    unit_id: string;
    unit_price: number;
    unit_discount: number;
    unit_discount_percent: number;
    quotation_item_price: number;
    group_product_id: string;
}

export type UpdatePaymentTerm = {
    payment_term_name: string;
    payment_term_day: number;
    payment_term_installment: number;
    payment_term_id?: string;
    payment_term: {
        installment_no: number;
        installment_price: number;
    }[];
}

export type TypeUpdateCompany = {
    quotation_id?: string;
    customer_id: string;
    priority: number;
    team_id: string;
    responsible_employee: string;
    issue_date: Date;
    price_date: Date;
    expected_closing_date: Date;
    shipping_method: string;
    shipping_remark: string;
    expected_delivery_date: Date;
    place_name: string;
    address: string;
    country_id: string;
    province_id: string;
    district_id: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    quotation_status?: string;
}

export type TypeUpdatePayment = {
    total_amount: number;
    special_discount: number;
    amount_after_discount: number;
    vat_id: string;
    vat_amount: number;
    grand_total: number;
    additional_notes?: string;
    payment_term_name: string;
    payment_term_day: number;
    payment_term_installment: number;
    payment_method_id: string;
    remark?: string;
    payment_term: {
        installment_no: number;
        installment_price: number;
    }[];
}

export const CreateSchema = z.object({
    body : z.object({
        customer_id: z.string().min(1).max(50),
        priority: z.number().min(1).max(5),
        issue_date: z.coerce.date(),
        team_id: z.string().min(1).max(50),
        responsible_employee: z.string().min(1).max(50),
        price_date: z.coerce.date(),
        shipping_method: z.string().min(1).max(50),
        shipping_remark: z.string().optional(),
        expected_delivery_date: z.coerce.date(),
        place_name: z.string().min(1),
        address: z.string().min(1),
        country_id: z.string().min(1).max(50),
        province_id: z.string().min(1).max(50),
        district_id: z.string().min(1).max(50),
        contact_name: z.string().min(1).max(50),
        contact_email: z.string().email().max(50),
        contact_phone: z.string().min(1).max(50),
        items: z.array(z.object(
            {
                product_id: z.string().min(1).max(50),
                quotation_item_count: z.number().min(1),
                unit_id: z.string().min(1).max(50),
                unit_price: z.number().min(0),
                unit_discount: z.number().min(0),
                unit_discount_percent: z.number().min(0),
                quotation_item_price: z.number().min(0),
                group_product_id: z.string().min(1).max(50),
            }
        )),
        currency_id: z.string().min(1).max(50),
        total_amount: z.number().min(0), 
        special_discount: z.number().min(0).max(100),
        amount_after_discount: z.number().min(0),
        vat_id: z.string().min(1).max(50),
        vat_amount: z.number().min(0),
        grand_total: z.number().min(0),
        additional_notes: z.string().optional(),
        payment_term_name: z.string().min(1).max(50),
        payment_term_day: z.number().min(1).optional(),
        payment_term_installment: z.number().min(1).optional(), 
        payment_method_id: z.string().min(1).max(50),
        remark: z.string().optional(),
        expected_closing_date: z.coerce.date(),
        payment_term: z.array(z.object(
            {
                installment_no: z.number().min(1).optional(),
                installment_price: z.number().min(0),
            }
        )),
        quotation_status: z.enum([
            "ระหว่างดำเนินการ",
            "รออนุมัติ",
            "ปรับปรุง",
            "ยกเลิกคำขออนุมัติ",
            "ไม่อนุมัติ",
            "อนุมัติ",
            "ยกเลิก",
            "สำเร็จ",
            "ไม่สำเร็จ"
        ]),
        quotation_status_remark: z.string().optional(),
    })
});



export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    }),
    body: z.object({
        responsible_id: z.string().optional().nullable(),
        status: z.string().optional().nullable(),
        issue_date : z.string().optional().nullable(),
        price_date : z.string().optional().nullable(),
        start_date: z.string().optional().nullable(),
        end_date: z.string().optional().nullable(),
    })
});

export const GetByIdSchema = z.object({
    params: z.object({
        quotation_id: z.string().min(1).max(50),
    }),
});


export const UpdateCompanySchema = z.object({
    params: z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body : z.object({
        customer_id: z.string().min(1).max(50).optional(),
        priority: z.number().min(1).max(5).optional(),
        issue_date: z.coerce.date().optional(),
        team_id: z.string().min(1).max(50).optional(),
        responsible_employee: z.string().min(1).max(50).optional(),
        price_date: z.coerce.date().optional(),
        shipping_method: z.string().min(1).max(50).optional(),
        shipping_remark: z.string().optional().optional(),
        expected_delivery_date: z.coerce.date().optional(),
        expected_closing_date: z.coerce.date().optional(),
        place_name: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        country_id: z.string().min(1).max(50).optional(),
        province_id: z.string().min(1).max(50).optional(),
        district_id: z.string().min(1).max(50).optional(),
        contact_name: z.string().min(1).max(50).optional(),
        contact_email: z.string().email().max(50).optional(),
        contact_phone: z.string().min(1).max(50).optional(),
    })
});

export const AddQuotationItemSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        currency_id: z.string().min(1).max(50).optional(),
        items: z.array(z.object(
            {
                product_id: z.string().min(1).max(50),
                quotation_item_count: z.number().min(1),
                unit_id: z.string().min(1).max(50),
                unit_price: z.number().min(0),
                unit_discount: z.number().min(0),
                unit_discount_percent: z.number().min(0),
                quotation_item_price: z.number().min(0),
                group_product_id: z.string().min(1).max(50),
            }
        )).optional(),
    })
});

export const UpdateQuotationItemSchema = z.object({
    params: z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body : z.object({
        quotation_item_id: z.string().min(1).max(50),
        product_id: z.string().min(1).max(50).optional(),
        quotation_item_count: z.number().min(1).optional(),
        unit_id: z.string().min(1).max(50).optional(),
        unit_price: z.number().min(0).optional(),
        unit_discount: z.number().min(0).optional(),
        unit_discount_percent: z.number().min(0).optional(),
        quotation_item_price: z.number().min(0).optional(),
        group_product_id: z.string().min(1).max(50).optional(),
    })
});


export const DeleteQuotationItemSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_item_id: z.string().min(1).max(50)
    })
});

export const UpdatePaymentSchema = z.object({
    params: z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body : z.object({
        total_amount: z.number().min(0).optional(), 
        special_discount: z.number().min(0).optional(),
        amount_after_discount: z.number().min(0).optional(),
        vat_id: z.string().min(1).max(50).optional(),
        vat_amount: z.number().min(0).optional(),
        grand_total: z.number().min(0).optional(),
        additional_notes: z.string().optional(),
        payment_term_name: z.string().min(1).max(50).optional(),
        payment_term_day: z.number().min(1).optional(),
        payment_term_installment: z.number().min(1).optional(), 
        payment_method_id: z.string().min(1).max(50).optional(),
        remark: z.string().optional(),
        payment_term: z.array(z.object(
            {
                installment_no: z.number().min(1).optional(),
                installment_price: z.number().min(0).optional(),
            }
        )).optional(),
    })
});

export const DeleteFileSchema = z.object({
    params: z.object({
        quotation_file_id: z.string().min(1).max(50),
    }),
});


export const CancelSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['ยกเลิก']),
        quotation_status_remark: z.string().optional()
    })
});

export const ResqustApproveSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['รออนุมัติ']),
        quotation_status_remark: z.string().optional()
    })
});

export const ResqustEditSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['ปรับปรุง']),
        quotation_status_remark: z.string().optional()
    })
});

export const ApproveSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['อนุมัติ']),
        quotation_status_remark: z.string().optional()
    })
});

export const RejectSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['ไม่อนุมัติ']),
        quotation_status_remark: z.string().optional()
    })
});

export const CancelApproveSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['ยกเลิกคำขออนุมัติ']),
        quotation_status_remark: z.string().optional()
    })
});

export const RejectDealSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['ไม่สำเร็จ']),
        quotation_status_remark: z.string().optional()
    })
});

export const CloseDealSchema = z.object({
    params : z.object({
        quotation_id: z.string().min(1).max(50),
    }),
    body: z.object({
        quotation_status: z.enum(['สำเร็จ']),
        quotation_status_remark: z.string().optional()
    })
});