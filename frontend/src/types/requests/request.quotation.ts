export type PayLoadCreateQuotation = {
    customer_id: string,
    priority: number,
    issue_date: string,
    team_id: string,
    responsible_employee: string,
    price_date: string,
    shipping_method: string,
    shipping_remark: string
    expected_delivery_date: string,
    place_name: string,
    address: string,
    country_id: string,
    province_id: string,
    district_id: string,
    contact_name: string,
    contact_email: string,
    contact_phone: string,
    items: {
        product_id: string;
        group_product_id: string;
        unit_id: string;
        unit_price: number;
        quotation_item_count: number;
        unit_discount: number;
        unit_discount_percent: number;
        quotation_item_price: number;
    }[],
    currency_id: string,
    total_amount: number,
    special_discount: number,
    amount_after_discount: number,
    vat_id: string,
    vat_amount: number,
    grand_total: number,
    additional_notes: string,
    payment_term_name: string,
    payment_term_day?: number,
    payment_term_installment?: number,
    payment_method_id: string,
    remark: string,
    expected_closing_date: string,
    payment_term: {
        installment_no: number,
        installment_price: number
    }[],
    quotation_status: string
    quotation_status_remark: string
}
export type PayLoadStatusQuotation = {
    quotation_status: string,
    quotation_status_remark: string
}
export type PayLoadAddItemQuotation = {
    currency_id:string,
    items: {
        product_id: string;
        group_product_id: string;
        unit_id: string;
        unit_price: number;
        quotation_item_count: number;
        unit_discount: number;
        unit_discount_percent: number;
        quotation_item_price: number;
    }[],
}
export type PayLoadUpdateItemQuotation = {
    quotation_item_id: string,
    product_id: string,
    quotation_item_count: number,
    unit_id: string,
    unit_price: number,
    unit_discount: number,
    unit_discount_percent: number,
    quotation_item_price: number,
    group_product_id: string
}

export type PayLoadDeleteItemQuotation = {
    quotation_item_id: string,
}
export type PayLoadUpdateCompany = {
    customer_id: string,
    priority: number,
    issue_date: string,
    team_id: string,
    responsible_employee: string,
    price_date: string,
    shipping_method: string,
    shipping_remark: string,
    expected_delivery_date: string,
    place_name: string,
    address: string,
    country_id: string,
    province_id: string,
    district_id: string,
    contact_name: string,
    contact_email: string,
    contact_phone: string,
    expected_closing_date: string
}
export type PayLoadUpdatePayment = {
    total_amount: number,
    special_discount: number,
    amount_after_discount: number,
    vat_id: string,
    vat_amount: number,
    grand_total: number,
    additional_notes: string,
    payment_term_name: string,
    payment_term_day?: number,
    payment_term_installment?: number,
    payment_method_id: string,
    remark: string,
    payment_term: {
        installment_no: number,
        installment_price: number
    }[],
}

export type PayLoadFilterQuotation = {

    responsible_id: string | null;
    status: string | null;
    issue_date?: string | null;
    price_date?: string | null;
    start_date: string | null;
    end_date: string | null;
}
