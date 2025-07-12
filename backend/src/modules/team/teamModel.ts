import e from "express";
import { z } from "zod";

export type TypePayloadTeam = {
    name : string;
    description : string;
    head_id? : string;
    head_name? : string;
    creted_by? : string;
    updated_by? : string;
    created_at? : Date;
    updated_at? : Date;
    my_team? : string;
    team_id? : string;
    employees_id? : string[];
    employee_code?: string;
    first_name? : string;
    last_name? : string;
}

export type TypePayloadTeamMember =  {
    team_id? : string
    employee_code? : string
    employee_id? : string
    first_name? : string;
    last_name? : string;
}


export type TypePayloadEmployee = {
    team_id : string;
}

export const TeamSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(50),
        description: z.string(),
        head_id: z.string().min(1).max(50),
        head_name: z.string().min(1).max(50),
        employees_id: z.array(z.string().min(1)).optional(),
    })
})

export const FindEmployeeSchema = z.object({
    body: z.object({    
        employee_code : z.string().min(1).max(50).optional(),
        first_name : z.string().min(1).max(50).optional(),
        last_name : z.string().min(1).max(50).optional(),
    })
})

// export const UpdateSchema = z.object({
//     params: z.object({ team_id: z.string().min(1).max(50) }),
//     body: z.object({
//         name: z.string().min(1).max(50).optional(),
//         description: z.string().optional(),
//         head_id: z.string().min(1).max(50).optional(),
//         head_name: z.string().min(1).max(50).optional(),
//     })
// })

export const UpdateTeamSchema = z.object({
    params: z.object({ team_id : z.string().min(1).max(50)}),
    body : z.object({
        name: z.string().min(1).max(50).optional(),
        description: z.string().optional(),
    })
})

export const UpdateTeamMemberSchema = z.object({
    params: z.object({ team_id : z.string().min(1).max(50)}),
    body : z.object({
        employee_code: z.array(z.string().min(1)).optional(),
    })
})

export const DeleteSchema = z.object({
    params: z.object({
        team_id: z.string().min(1).max(50),
    })
})

export const DeleteMemberSchema = z.object({
    params: z.object({
        team_id: z.string().min(1).max(50),
    }),
    body: z.object({
        employee_id: z.string().min(1).max(50),
    })
})

export const GetByIdSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    }),
    params: z.object({
        team_id: z.string().min(1).max(50),
    })
});

export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    })
});