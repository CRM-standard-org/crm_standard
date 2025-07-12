export type TypeCurrencyResponse ={
    currency_id:string;
    currency_name:string; 
}

export type TypeCurrency ={
    totalCount:number;
    totalPages:number;
    data:TypeCurrencyResponse[];
}

export type CurrencyResponse = {
    success:boolean;
    message:string;
    responseObject:TypeCurrency;
    statusCode:number
}