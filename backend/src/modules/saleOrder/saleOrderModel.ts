import { z } from "zod";

export type Filter = {
    responsible_id? : string;
    status? : string;
    issue_date? : Date;
    price_date? : Date;
    start_date: string;
    end_date: string;
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
    sale_order_id?: string;
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
    sale_order_status?: string;
}

export type TypeUpdatePaymentDetail = {
    total_amount?: number;
    special_discount?: number;
    amount_after_discount?: number;
    vat_id?: string;
    vat_amount?: number;
    grand_total?: number;
    additional_notes?: string;
    payment_term_name?: string;
    payment_term_day?: number;
    payment_term_installment?: number;
    payment_method_id?: string;
    remark?: string;
}

export type Payment = {
    payment_log_id? : string;
    payment_date: Date;
    payment_term_name: string;
    amount_paid: number;
    payment_method_id: string;
    payment_remark: string;
}

export type PaymentUpdate = {
    payment_log_id : string;
    payment_date: Date;
    payment_term_name: string;
    amount_paid: number;
    payment_method_id: string;
    payment_remark: string;
}

export type StatusDelivery = {
    sale_order_id : string;
    manufacture_factory_date?: Date;
    expected_manufacture_factory_date?: Date;
    delivery_date_success?: Date;
    expected_delivery_date_success?: Date;
    receipt_date?: Date;
    expected_receipt_date?: Date;
}


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
        sale_order_id: z.string().min(1).max(50),
    }),
});



export const UpdateCompanySchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        shipping_method: z.string().min(1).max(50).optional(),
        shipping_remark: z.string().optional().optional(),
        expected_delivery_date: z.coerce.date().optional(),
        place_name: z.string().optional(),
        address: z.string().optional(),
        country_id: z.string().min(1).max(50).optional(),
        province_id: z.string().min(1).max(50).optional(),
        district_id: z.string().min(1).max(50).optional(),
        contact_name: z.string().min(1).max(50).optional(),
        contact_email: z.string().email().max(50).optional(),
        contact_phone: z.string().min(1).max(50).optional(),
    })
});

export const UpdatePaymentSchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        additional_notes: z.string().optional(),
        remark: z.string().optional(),
    })
});

export const DeleteFileSchema = z.object({
    params: z.object({
        sale_order_file_id: z.string().min(1).max(50),
    }),
});

export const PaymentSchema = z.object({
    params: z.object({
        sale_order_file_id: z.string().min(1).max(50),
    }),
    body : z.object({
        payment_date: z.coerce.date(),
        payment_term_name: z.string().min(1).max(50),
        amount_paid: z.string().min(0),
        payment_method_id: z.string().min(1).max(50),
        payment_remark: z.string(),
    })
});

export const PaymentUpdateSchema = z.object({
    params: z.object({
        sale_order_file_id: z.string().min(1).max(50),
    }),
    body : z.object({
        payment_log_id: z.string().min(1).max(50),
        payment_date: z.coerce.date().optional(),
        payment_term_name: z.string().max(50).optional(),
        amount_paid: z.string().min(0).optional(),
        payment_method_id: z.string().max(50).optional(),
        payment_remark: z.string().optional(),
    })
});

export const GetByIdFilePaymentSchema = z.object({
    params: z.object({
        payment_log_id: z.string().min(1).max(50),
    }),
});

export const DeletePaymentSchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        payment_log_id: z.string().min(1).max(50),
    })
});


export const ManufactureSchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        manufacture_factory_date: z.coerce.date(),
    })
});

export const ExpectedManufactureSchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        expected_manufacture_factory_date: z.coerce.date(),
    })
});

export const DeliverySchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        delivery_date_success: z.coerce.date(),
    })
});

export const ExpectedDeliverySchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        expected_delivery_date_success: z.coerce.date(),
    })
});

export const ReceiptSchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        receipt_date: z.coerce.date(),
    })
});

export const ExpectedReceiptSchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        expected_receipt_date: z.coerce.date(),
    })
});

export const SaleSchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        sale_order_status_remark: z.string().optional(),
    })
});
