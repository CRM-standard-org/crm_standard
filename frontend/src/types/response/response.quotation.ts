//get All quotation

export type TypeAllQuotationResponse = {
    quotation_id: string,
    quotation_number: string,
    customer: {
        customer_id: string,
        company_name: string
    },
    priority: number,
    quotation_status: string
    responsible: {
        employee_id: string,
        first_name: string,
        last_name: string | null
    },
    issue_date: Date,
    price_date: Date,
    grand_total: string
}
export type TypeAllQuotation = {
    totalCount: number;
    totalPages: number;
    data: TypeAllQuotationResponse[];
}

export type AllQuotationResponse = {
    success: boolean;
    message: string;
    responseObject: TypeAllQuotation;
    statusCode: number
}
//get quotation by id 
export type TypeQuotationProducts = {
    quotation_item_id: string,
    product: {
        product_id: string,
        product_name: string
    },
    quotation_item_count: number,
    unit: {
        unit_id: string,
        unit_name: string
    },
    unit_price: number,
    unit_discount: number,
    unit_discount_percent: number,
    quotation_item_price: number,
    group_product: {
        group_product_id: string,
        group_product_name: string
    }
}
export type TypePaymentTerm = {
    payment_term_id: string,
    installment_no: number,
    installment_price: number
}
export type TypeQuotationFile = {
    quotation_file_id: string,
    quotation_file_url: string
}
export type TypeQuotationStatus = {
    quotation_status_id: string,
    quotation_status: string,
    quotation_status_remark: string | null,
    created_at: string,
    created_by_employee: {
        employee_id: string,
        first_name: string,
        last_name: string | null
    }
}
export type TypeQuotationResponse = {
    quotation_number: string,
    customer: {
        customer_id: string,
        company_name: string,
        tax_id: string
    },
    priority: number,
    issue_date: string,
    price_date: string,
    team: {
        team_id: string,
        name: string
    },
    responsible: {
        employee_id: string,
        first_name: string,
        last_name: string | null
    },
    shipping_method: string,
    shipping_remark: string | null,
    expected_delivery_date: string | null,
    place_name: string,
    address: string,
    country: {
        country_id: string,
        country_name: string
    },
    province: {
        province_id: string,
        province_name: string
    },
    district: {
        district_id: string,
        district_name: string
    },
    contact_name: string,
    contact_email: string,
    contact_phone: string,
    quotation_products: TypeQuotationProducts[],
    currency: {
        currency_id:string,
        currency_name:string,
    },
    total_amount: number,
    special_discount: number,
    amount_after_discount: number,
    vat: {
        vat_id: string,
        vat_percentage: number
    },
    vat_amount: number,
    grand_total: number,
    additional_notes: string | null,
    payment_term_name: string,
    payment_term_day: number,
    payment_term_installment: number,
    payment_term: TypePaymentTerm[],
    payment_method: {
        payment_method_id: string,
        payment_method_name: string
    },
    remark: string,
    expected_closing_date: string,
    quotation_file: TypeQuotationFile[]
    status: TypeQuotationStatus[]
}
export type QuotationResponse = {
    success: boolean,
    message: string,
    responseObject: TypeQuotationResponse,
    statusCode: number
}
export type TypeVatResponse = {
    vat_id: string;
    vat_percentage: number;
}
export type TypeVat = {
    totalCount: number;
    totalPages: number;
    data: TypeVatResponse[];
}
export type VatResponse = {
    success: boolean;
    message: string;
    responseObject: TypeVat
    statusCode: number;
}

