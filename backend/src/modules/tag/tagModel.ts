import { z } from "zod";


export type TypePayloadTag = {
    tag_name: string;
    color: string;
    tag_description: string;
    created_by?: string; 
    updated_by?: string; 
    created_at?: Date;
    updated_at?: Date;
};



export const CreateTagSchema = z.object({
    body : z.object({
        tag_name: z.string().min(1).max(50),
        tag_description: z.string(),
        color: z.string().min(1).max(50),
    })
});

export const UpdateTagSchema = z.object({
    body : z.object({
        tag_name: z.string().min(1).max(50).optional(),
        color: z.string().min(1).max(50).optional(),
        tag_description: z.string().optional(),
    })
});

export const DeleteTagSchema = z.object({
    params : z.object({
        tag_id: z.string().min(1).max(50),
    })
});

export const GetAllTagSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    })
});

export const GetTagByIdSchema = z.object({
    params: z.object({
        tag_id: z.string().min(1).max(50),
    })
});


export const SelectSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
});
