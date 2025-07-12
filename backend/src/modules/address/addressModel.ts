import { z } from "zod";


export type TypePayloadAddress = {
    country_name?: string;
    province_name?: string;
    district_name?: string;
    created_by?: string; 
    updated_by?: string; 
    created_at?: Date;
    updated_at?: Date;
};



export const SelectSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
});