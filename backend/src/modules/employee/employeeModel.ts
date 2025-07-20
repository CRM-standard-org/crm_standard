import { query } from "express";
import { z } from "zod";


export type TypePayloadEmployee = {
    employee_id : string;
    employee_code? : string;   
    username : string;
    password : string ; 
    email : string ;
    first_name : string ;   
    last_name? : string;  
    role_id: string;
    position? : string;     
    phone? : string;   
    social_id : string;  
    detail_social : string;  
    address? :  string;  
    country_id : string;   
    province_id : string;  
    district_id : string;   
    status_id? : string; 
    team_id?: string;
    salaly? : number; 
    start_date? : Date; 
    end_date? : Date; 
    birthdate? : Date; 
    created_by? : string; 
    updated_by? : string; 
    created_at : Date; 
    updated_at :  Date; 
}

export const CreateSchema = z.object({
    body : z.object({
        employee_code: z.string().min(1).max(50),   
        username: z.string().min(1).max(50),
        password : z.string().min(1).max(50),
        email: z.string().min(1).max(50),
        first_name   : z.string().min(1).max(50),
        last_name: z.string().max(50).optional(),  
        role_id: z.string().min(1).max(50),
        position: z.string().min(1).max(50),     
        phone: z.string().min(1).max(50),   
        social_id  : z.string().max(50).optional(),
        detail_social  : z.string().max(50).optional(),
        address: z.string().optional(),  
        country_id   : z.string().min(1).max(50),
        province_id  : z.string().min(1).max(50),
        district_id   : z.string().min(1).max(50),
        status_id: z.string().min(1).max(50), 
        team_id: z.string().max(50).optional(), 
        salaly: z.number().max(50).optional(), 
        start_date: z.coerce.date().optional(), 
        end_date: z.coerce.date().optional(),
        birthdate: z.coerce.date().optional(), 
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