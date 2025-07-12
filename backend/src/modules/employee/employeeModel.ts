import { query } from "express";
import { z } from "zod";


export type TypePayloadEmployee = {
    employee_id : string;
    employee_code : string;   
    username : string;
    password : string ; 
    email : string ;
    is_active : Boolean      
    role?: string;
    role_id?: string;
    position? : string;     
    first_name : string ;   
    last_name? : string;  
    birthdate? : string;  
    phone? : string;   
    line_id?: string;
    contact_name? : string;  
    address? :  string;  
    country? : string;   
    province? : string;  
    district? : string;   
    remark? : string;  
    profile_picture? : string; 
    created_by? : string; 
    updated_by? : string; 
    created_at : Date; 
    updated_at :  Date; 
}

export const CreateSchema = z.object({
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

export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    })
});

export const GetByIdSchema = z.object({
    params: z.object({
        tag_id: z.string().min(1).max(50),
    })
});

export const SelectResponsibleInTeamSchema = z.object({
    params: z.object({ team_id: z.string().min(1).max(50) }),
    query: z.object({ search: z.string().optional() })
});

export const SelectResponsibleSchema = z.object({
    query: z.object({ search: z.string().optional() })
});