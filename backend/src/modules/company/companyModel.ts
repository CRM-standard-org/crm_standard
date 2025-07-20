import { z } from "zod";


export type TypePayloadCompany = {
    company_id?: string;
    name_th: string;
    name_en: string;
    type?: string;
    website?: string;
    founded_date?: Date;
    place_name?: string;
    address?: string;
    country_id?: string;
    province_id?: string;
    district_id?: string;
    phone?: string;
    fax_number?: string;
    tax_id?: string;
    updated_by?: string
}


export const GetByIdSchema = z.object({
    params: z.object({
        company_id: z.string().min(1).max(50),
    }),
});



export const UpdateCompanySchema = z.object({
    params: z.object({
        sale_order_id: z.string().min(1).max(50),
    }),
    body : z.object({
        name_th: z.string().max(50).optional(),
        name_en: z.string().max(50).optional(),
        type: z.string().optional(),
        website: z.string().optional(),
        founded_date: z.coerce.date().optional(),
        place_name: z.string().optional(),
        address: z.string().optional(),
        country_id: z.string().max(50).optional(),
        province_id: z.string().max(50).optional(),
        district_id: z.string().max(50).optional(),
        phone: z.string().max(20).optional(),
        fax_number: z.string().max(50).optional(),
        tax_id: z.string().max(50).optional(),
    })
});
