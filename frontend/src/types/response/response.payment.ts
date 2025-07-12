export type TypePaymentmethodResponse ={
    payment_method_id:string;
    payment_method_name:string; 
}

export type TypePaymentmethod ={
    totalCount:number;
    totalPages:number;
    data:TypePaymentmethodResponse[];
}

export type PaymentmethodResponse = {
    success:boolean;
    message:string;
    responseObject:TypePaymentmethod;
    statusCode:number
}