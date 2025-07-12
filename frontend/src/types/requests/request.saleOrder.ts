export type PayLoadUpdateSaleOrderCompany = {
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
    contact_phone: string
}
export type PayLoadUpdateSaleOrderPayment = {
    additional_notes: string,
    remark: string
}
export type PayLoadCreateSaleOrderPaymentLog = {
    payment_date: string, 
    payment_term_name: string, 
    amount_paid: number, 
    payment_method_id: string, 
    payment_remark: string
}
export type PayLoadUpdateSaleOrderPaymentLog = {
    payment_log_id:string,
    payment_date: string, 
    payment_term_name: string, 
    amount_paid: number, 
    payment_method_id: string, 
    payment_remark: string
}
export type PayLoadDeleteSaleOrderPaymentLog = {
    payment_log_id:string
}
export type PayLoadFilterSaleOrder = {
    
    responsible_id: string | null;
    status: string | null;
    issue_date?: string | null;
    price_date?: string | null;
    start_date: string | null;
    end_date: string | null;
}
