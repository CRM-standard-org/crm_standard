import {z} from "zod";

export type TypePayloadrole = {
    role_id: string;
    role_name: string;
}

export const GetroleSchema = z.object({
    params: z.object({
        role_id: z.string().uuid(),
        role_name: z.string()
        
    })
});
export const GetRoleByIdSchema = z.object({
    params: z.object({
        role_id: z.string().uuid(),
    })
});