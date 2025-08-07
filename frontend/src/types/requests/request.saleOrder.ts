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
    payment_log_id: string,
    payment_date: string,
    payment_term_name: string,
    amount_paid: number,
    payment_method_id: string,
    payment_remark: string
}
export type PayLoadDeleteSaleOrderPaymentLog = {
    payment_log_id: string
}
//จัดการสถานะ
export type PayLoadUpdateManufactureStatus = {
    manufacture_factory_date: string,

}
export type PayLoadUpdateExpectManufactureStatus = {
    expected_manufacture_factory_date: string,

}
export type PayLoadUpdateDeliveryStatus = {
    delivery_date_success: string,

}
export type PayLoadUpdateExpectDeliveryStatus = {
    expected_delivery_date_success: string,

}
export type PayLoadUpdateReceiptStatus = {
    receipt_date: string,

}
export type PayLoadUpdateExpectReceiptStatus = {
    expected_receipt_date: string,

}
export type PayLoadSaleOrderStatus = {
    sale_order_status_remark: string
}

//filter sale order
export type PayLoadFilterSaleOrder = {

    responsible_id: string | null| undefined;
    status: string | null| undefined;
    issue_date?: string | null| undefined;
    price_date?: string | null| undefined;
    start_date: string | null | undefined;
    end_date: string | null| undefined;
    tag_id: string | null| undefined;
    team_id: string | null| undefined;
}
