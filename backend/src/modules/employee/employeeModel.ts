import { query } from "express";
import { z } from "zod";
import { employeeRouter } from "./employeeRouter";


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
    detail : string;  
    address? :  string;  
    country_id : string;   
    province_id : string;  
    district_id : string;   
    status_id? : string; 
    team_id?: string;
    salary? : number; 
    start_date? : Date; 
    end_date? : Date; 
    birthdate? : Date; 
}

export type UpdateEmployee = {
    username? : string;
    password : string ; 
    email? : string ;
    role_id?: string;
    position? : string;     
    first_name? : string ;   
    last_name? : string;  
    birthdate? : Date; 
    phone? : string;   
    salary? : number; 
    status_id? : string; 
    start_date? : Date; 
    end_date? : Date; 
    address? :  string;  
    country_id? : string;   
    province_id? : string;  
    district_id? : string;   
    social_id? : string;  
    detail? : string;  
}

export type Filter = {
    is_active? : boolean;
    status? : string;
}

export const CreateSchema = z.object({
    body : z.object({
        employee_code: z.string().min(1).max(50),   
        username: z.string().min(1).max(50),
        password : z.string().min(6).max(50),
        email: z.string().min(1).max(50),
        first_name   : z.string().min(1).max(50),
        last_name: z.string().max(50).optional(),  
        role_id: z.string().min(1).max(50),
        position: z.string().min(1).max(50),     
        phone: z.string().min(1).max(50),   
        social_id  : z.string().max(50).optional(),
        detail : z.string().max(50).optional(),
        address: z.string().optional(),  
        country_id   : z.string().min(1).max(50),
        province_id  : z.string().min(1).max(50),
        district_id   : z.string().min(1).max(50),
        status_id: z.string().min(1).max(50), 
        team_id: z.string().max(50).optional(), 
        salary: z.number().optional(), 
        start_date: z.coerce.date().optional(), 
        end_date: z.coerce.date().optional(),
        birthdate: z.coerce.date().optional(), 
    })
});

export const UpdateSchema = z.object({
    params: z.object({ employee_id: z.string().min(1).max(50) }),
    body : z.object({
        username: z.string().min(1).max(50).optional(),
        password : z.string().max(50).optional(),
        email: z.string().min(1).max(50).optional(),
        first_name : z.string().max(50).optional(),
        last_name: z.string().max(50).optional(),  
        role_id: z.string().min(1).max(50).optional(),
        position: z.string().max(50).optional(),     
        phone: z.string().max(20).optional(),   
        social_id  : z.string().min(1).max(50).optional(),
        detail  : z.string().max(50).optional(),
        address: z.string().optional(),  
        country_id : z.string().min(1).max(50).optional(),
        province_id : z.string().min(1).max(50).optional(),
        district_id : z.string().min(1).max(50).optional(),
        status_id: z.string().min(1).max(50).optional(), 
        salaly: z.number().optional(), 
        start_date: z.coerce.date().optional(), 
        end_date: z.coerce.date().optional(),
        birthdate: z.coerce.date().optional(), 
    })
});


export const GetAllEmployeeSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    })
});

export const SelectResponsibleInTeamSchema = z.object({
    params: z.object({ team_id: z.string().min(1).max(50) }),
    query: z.object({ search: z.string().optional() })
});

export const SelectResponsibleSchema = z.object({
    query: z.object({ search: z.string().optional() })
});

export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    }),
    body : z.object({
        is_active: z.boolean({message:"Please enter true or flase"}).optional().nullable(),   
        status: z.enum(["ทดลองงาน", "พนักงานประจำ", "เลิกจ้าง", "ฝึกงาน", "ลาหยุด", "ถูกเลิกจ้าง", "เกษียณ"]).optional().nullable(),
    })
});

export const GetByIdSchema = z.object({
    params: z.object({
        employee_id: z.string().min(1).max(50),
    }),
});