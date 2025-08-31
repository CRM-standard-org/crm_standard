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
    password? : string ; 
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
    team_id?: string;
    remove_profile_picture?: boolean;
}

export type Filter = {
    is_active? : boolean;
    status? : string;
}

const passwordRule = z.string().min(8, "Password at least 8 characters").regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must contain letters and numbers");
const emailRule = z.string().email("Invalid email format");
const phoneRule = z.string().regex(/^\d{6,15}$/,"Phone 6-15 digits");

export const CreateSchema = z.object({
    body : z.object({
        employee_code: z.string().min(1).max(50),   
        username: z.string().min(1).max(50),
        password : passwordRule,
        email: emailRule,
        first_name   : z.string().min(1).max(50),
        last_name: z.string().max(50).optional(),  
        role_id: z.string().min(1).max(50),
        position: z.string().min(1).max(50),     
        phone: phoneRule,
        social_id  : z.string().max(50).optional(),
        detail : z.string().max(255).optional(),
        address: z.string().optional(),  
        country_id   : z.string().min(1).max(50),
        province_id  : z.string().min(1).max(50),
        district_id   : z.string().min(1).max(50),
        status_id: z.string().min(1).max(50), 
        team_id: z.string().max(50).optional(), 
        salary: z.number().nonnegative().optional(), 
        start_date: z.coerce.date().optional(), 
        end_date: z.coerce.date().optional(),
        birthdate: z.coerce.date().optional(), 
    }).refine(d=> !d.end_date || !d.start_date || d.end_date >= d.start_date, { message: "end_date must be after start_date", path:["end_date"]})
});

export const UpdateSchema = z.object({
    params: z.object({ employee_id: z.string().min(1).max(50) }),
    body : z.object({
        username: z.string().min(1).max(50).optional(),
        password : passwordRule.optional(),
        email: emailRule.optional(),
        first_name : z.string().max(50).optional(),
        last_name: z.string().max(50).optional(),  
        role_id: z.string().min(1).max(50).optional(),
        position: z.string().max(50).optional(),     
        phone: phoneRule.optional(),   
        social_id  : z.string().min(1).max(50).optional(),
        detail  : z.string().max(255).optional(),
        address: z.string().optional(),  
        country_id : z.string().min(1).max(50).optional(),
        province_id : z.string().min(1).max(50).optional(),
        district_id : z.string().min(1).max(50).optional(),
        status_id: z.string().min(1).max(50).optional(), 
        salary: z.number().nonnegative().optional(), 
        start_date: z.coerce.date().optional(), 
        end_date: z.coerce.date().optional(),
        birthdate: z.coerce.date().optional(), 
        team_id: z.string().max(50).optional(),
        remove_profile_picture: z.boolean().optional(),
    }).refine(d=> !d.end_date || !d.start_date || d.end_date >= d.start_date, { message: "end_date must be after start_date", path:["end_date"]})
});

// Bulk import employees: array of CreateSchema bodies
export const ImportEmployeesSchema = z.object({
    body: z.object({
        items: z
            .array(CreateSchema.shape.body)
            .min(1, "items is required")
            .max(1000, "maximum 1000 rows per import"),
    }),
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

export const DeleteEmployeeSchema = z.object({
    params: z.object({
        employee_id: z.string().min(1).max(50),
    }),
});