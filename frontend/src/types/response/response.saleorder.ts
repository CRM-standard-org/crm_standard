export type TypeAllSaleOrderResponse = {
    sale_order_id: string,
    sale_order_number: string,
    customer: {
        customer_id: string,
        company_name: string
    },
    sale_order_status: string
    responsible: {
        employee_id: string,
        first_name: string,
        last_name: string | null
    },
    issue_date: Date,
    price_date: Date,
    grand_total: string,
    payment_status: string,
    totalAmountPaid: number
}

export type TypeAllSaleOrder = {
    totalCount: number;
    totalPages: number;
    data: TypeAllSaleOrderResponse[];
}

export type AllSaleOrderResponse = {
    success: boolean,
    message: string,
    responseObject: TypeAllSaleOrder,
    statusCode: number
}
//get saleorder by id 
export type TypeSaleOrderProducts = {
    sale_order_item_id: string,
    product: {
        product_id: string,
        product_name: string
    },
    sale_order_item_count: number,
    unit: {
        unit_id: string,
        unit_name: string
    },
    unit_price: number,
    unit_discount: number,
    unit_discount_percent: number,
    sale_order_item_price: number,
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
export type TypeSaleOrderFile = {
    sale_order_file_id: string,
    sale_order_file_url: string
}
export type TypeSaleOrderPaymentLog = {

    payment_log_id: string,
    payment_date: string,
    amount_paid: number,
    payment_term_name: string,
    payment_method: {
        payment_method_id: string,
        payment_method_name: string
    },
    payment_remark: string,
    payment_file: payment_file[]

}
export type payment_file = {
    payment_file_url: string
}
export type TypeSaleOrderStatus = {
    sale_order_status_id: string,
    sale_order_status: string,
    manufacture_factory_date: string | null,
    expected_manufacture_factory_date: string | null,
    delivery_date_success: string | null,
    expected_delivery_date_success: string | null,
    receipt_date: string | null,
    expected_receipt_date: string | null,
    sale_order_status_remark: string,
    created_at: string,
    created_by_employee: {
        employee_id: string,
        first_name: string,
        last_name: string | null
    }
}
export type TypeSaleOrderResponse = {
    sale_order_number: string,
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
    sale_order_product: TypeSaleOrderProducts[],
    currency: {
        currency_id: string,
        currency_name: string,
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
    payment_status: string,
    payment_term_name: string,
    payment_term_day: number,
    payment_term_installment: number,
    sale_order_payment_term: TypePaymentTerm[],
    payment_method: {
        payment_method_id: string,
        payment_method_name: string
    },
    remark: string,
    expected_closing_date: string,
    sale_order_file: TypeSaleOrderFile[],
    sale_order_payment_log: TypeSaleOrderPaymentLog[],
    manufacture_factory_date: string | null,
    expected_manufacture_factory_date: string | null,
    delivery_date_success: string | null,
    expected_delivery_date_success: string | null,
    receipt_date: string | null,
    expected_receipt_date: string | null,
    status: TypeSaleOrderStatus[]
    totalAmountPaid: number
}
export type SaleOrderResponse = {
    success: boolean,
    message: string,
    responseObject: TypeSaleOrderResponse,
    statusCode: number
}
export type TypeSaleOrderPaymentFileResponse = {
    payment_log_id: string,
    payment_file: payment_file[]
}