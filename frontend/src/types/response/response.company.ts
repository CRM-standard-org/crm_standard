export type TypeCompanyResponse = {
    company_id: string,
    name_th: string,
    name_en: string,
    type: string | null,
    website: string | null,
    founded_date: string | null,
    place_name: string | null,
    address: string | null,
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
    phone: string,
    fax_number: string,
    tax_id: string,
    logo: string
}
export type CompanyResponse = {
    success: boolean;
    message: string;
    responseObject: TypeCompanyResponse
    statusCode: number;
}
