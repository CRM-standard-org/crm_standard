import {z} from "zod";

export type TypePayloadrole = {
    role_id: string;
    role_name: string;
}


export const SelectSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
});
