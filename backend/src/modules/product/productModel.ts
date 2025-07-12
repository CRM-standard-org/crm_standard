import { z } from "zod";


export type TypePayloadProduct = {
    product_name: string;
    product_description: string;
    unit_price: number;
    unit_id: string;
    group_product_id: string;
    created_by?: string; 
    updated_by?: string; 
    created_at?: Date;
    updated_at?: Date;
};


export const CreateSchema = z.object({
    body : z.object({
        product_name: z.string().min(1).max(50),
        product_description: z.string().min(1).max(50),
        unit_price: z.number().min(1),
        unit_id: z.string().min(1).max(50),
        group_product_id: z.string().min(1).max(50),
    })
});

export const UpdateSchema = z.object({
    params : z.object({
        product_id: z.string().min(1).max(50),
    }),
    body : z.object({
        product_name: z.string().min(1).max(50).optional(),
        product_description: z.string().min(1).max(50).optional(),
        unit_price: z.number().min(1).optional(),
        unit_id: z.string().min(1).max(50).optional(),
        group_product_id: z.string().min(1).max(50).optional(),
    })
});

export const DeleteSchema = z.object({
    params : z.object({
        product_id: z.string().min(1).max(50),
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
        product_id: z.string().min(1).max(50),
    })
});


export const SelectSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
});
