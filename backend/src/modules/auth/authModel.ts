import { z } from "zod";


export type TypePayloadAuth = {
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

export const LoginSchema = z.object({
    body: z.object({
        username : z.string().min(4).max(50),
        password : z.string().min(4).max(50),
    })
})