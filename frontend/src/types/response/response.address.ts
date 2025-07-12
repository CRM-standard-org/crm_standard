
export type DistrictResponse = {
    district_id:string;
    district_name:string;
    province_id:string;
}

export type ProvinceResponse ={
    province_id:string;
    province_name:string;
    country_id:string;
    district: DistrictResponse[]
}

export type TypeAddressResponse = {
    country_id:string;
    country_name:string;
    province:ProvinceResponse[];
}


export type AddressResponse = {
    success: boolean;
    message: string;
    responseObject: TypeAddressResponse[];
    statusCode:number
}