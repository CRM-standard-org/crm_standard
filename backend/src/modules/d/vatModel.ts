import { z } from "zod";


export type TypePayloadVat = {
    vat_percentage: number;
    created_by?: string; 
    updated_by?: string; 
    created_at?: Date;
    updated_at?: Date;
};


export const CreateSchema = z.object({
    body : z.object({
        vat_percentage: z.string().min(1).max(50),
    })
});

export const UpdateSchema = z.object({
    params : z.object({
        vat_id: z.string().min(1).max(50),
    }),
    body : z.object({
        vat_percentage: z.string().min(1).max(50).optional(),
    })
});

export const DeleteSchema = z.object({
    params : z.object({
        vat_id: z.string().min(1).max(50),
    })
});

export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    })
});

export const GetByIdSchema = z.object({
    params: z.object({
        vat_id: z.string().min(1).max(50),
    })
});


export const SelectSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
});
