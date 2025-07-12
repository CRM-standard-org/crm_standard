import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadColor={
    color_id:string
    color_name:string
}


export const CreateColorSchema =z.object({ 
    body: z.object({
        color_name: z.string().max(50),
    })
});

export const GetColorSchema = z.object({
    params: z.object({
        color_name: z.string().max(50),
    })
});

export const UpdateColorSchema = z.object({
    body: z.object({
        color_name: z.string().max(50),
    })
});

export const deleteColorSchema = z.object({
    params: z.object({
        color_id: z.string().max(50),
    })
});
