import { z } from "zod";

export type TypePayloadCustomerRole = {
    name : string;
    description : string;
    creted_by? : string;
    updated_by? : string;
    created_at? : Date;
    updated_at? : Date;
}

export const CustomerRoleSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(50),
        description: z.string(),
    })
})

export const UpdateSchema = z.object({
    params: z.object({ customer_role_id: z.string().min(1).max(50) }),
    body: z.object({
        name: z.string().min(1).max(50).optional(),
        description: z.string().optional(),
    })
})

export const DeleteSchema = z.object({
    params: z.object({
        customer_role_id: z.string().min(1).max(50),
    })
})

export const GetByIdSchema = z.object({
    params: z.object({
        customer_role_id: z.string().min(1).max(50),
    })
});

export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    })
});

export const SelectSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
});
