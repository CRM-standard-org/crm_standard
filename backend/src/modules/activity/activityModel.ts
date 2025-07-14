import { z } from "zod";


export type TypePayloadActivity = {
    customer_id: string; 
    issue_date: Date; 
    activity_time: string; 
    activity_description: string; 
    team_id: string; 
    responsible_id: string; 
    created_by?: string; 
    updated_by?: string; 
    created_at?: Date;
    updated_at?: Date;
};

export type Filter = {
    customer_id? : string;
    team_id? : string;
    responsible_id? : string;
}


export const CreateSchema = z.object({
    body : z.object({
        customer_id: z.string().min(1).max(50),
        issue_date: z.coerce.date(),
        activity_time: z.string().min(1).max(50),
        activity_description: z.string(),
        team_id: z.string().min(1).max(50),
        responsible_id: z.string().min(1).max(50),
    })
});

export const UpdateSchema = z.object({
    params : z.object({
        activity_id: z.string().min(1).max(50),
    }),
    body : z.object({
        customer_id: z.string().min(1).max(50).optional(),
        issue_date: z.coerce.date().optional(),
        activity_time: z.string().min(1).max(50).optional(),
        activity_description: z.string().optional(),
        team_id: z.string().min(1).max(50).optional(),
        responsible_id: z.string().min(1).max(50).optional(),
    })
});

export const DeleteSchema = z.object({
    params : z.object({
        activity_id: z.string().min(1).max(50),
    })
});

export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    }),
    body: z.object({
        customer_id: z.string().optional().nullable(),
        team_id : z.string().optional().nullable(),
        responsible_id: z.string().optional().nullable(),
    })
});

export const GetByIdSchema = z.object({
    params: z.object({
        activity_id: z.string().min(1).max(50),
    })
});


