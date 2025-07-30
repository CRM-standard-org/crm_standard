import { z } from "zod";

export type TypePayloadCustomer = {
    customer_id? : string;
    company_name : string;
    type? : string;
    company_email? : string;
    company_phone? : string;
    emp_email : string;
    emp_phone : string;
    tax_id : string;
    note? : string;
    priority : number;
    tag_id : string[];
    
    character_id? : string;
    employee_id : string;
    
    customer_role_id : string;
    
    customer_tag_id : string;
    
    country_id? : string;
    province_id? : string;
    district_id? : string;
    place_name? : string;
    address? : string;
    
    address_id? : string;
    customer_country_id : string;
    customer_province_id : string;
    customer_district_id : string;
    customer_place_name? : string;
    customer_address? : string;
    main_address? : string;
    
    customer_contact_id : string;
    customer_name : string;
    position? : string;
    customer_phone? : string;
    customer_phone_extension? : string;
    customer_email : string;
    
    
    social_id? : string;

    detail_social_id? : string;
    detail : string;
    team_id : string;
    
    created_by? : string;
    updated_by? : string;
    created_at? : string;
    updated_at? : string;
}

export type TypePayloadCompany = {
    company_name : string;
    type : string;
    company_email : string;
    company_phone : string;
    tax_id : string;
    note : string;
    priority : number;
    resp_email : string;
    resp_phone : string;
    team_id : string;
    employee_id: string;
    place_name: string;
    address: string;
    country_id : string;
    province_id : string;
    district_id : string;
    tag_id : string[];
}

export type TypePayloadFilter = {
    team_id?: string
    responsible_id?: string
    tag_id?: string
}

export type TypePayloadAddress = {
    address_id : string;
    address : string;
    place_name : string;
    country_id : string;
    province_id : string;
    district_id : string;
}

export type TypePayloadContact = {
    customer_contact_id : string,
    name: string,
    phone: string,
    phone_extension: string,
    position: string,
    customer_role_id: string,
    email: string,
    social_id: string,
    detail: string,
    character_id: string,
}


export const CreateSchema = z.object({
    body: z.object({
        company_name: z.string().min(1).max(50),
        type: z.string().max(50).optional(),
        company_email: z.string().max(50).optional(),
        company_phone: z.string().max(10).optional(),
        tax_id: z.string().min(1).max(50),
        note: z.string().optional(),
        priority: z.number().min(1).max(5),
        place_name: z.string().max(50).optional(),
        address: z.string().optional(),
        country_id: z.string().max(50).optional(),
        province_id: z.string().max(50).optional(),
        district_id: z.string().max(50).optional(),
        tag_id: z.array(z.string().min(1)),
        customer_name: z.string().min(1).max(50),
        customer_email: z.string().min(1).max(50),
        customer_phone: z.string().min(1).max(10),
        customer_phone_extension: z.string().max(50).optional(),
        position: z.string().max(50).optional(),
        customer_role_id: z.string().min(1).max(50),
        character_id: z.string().max(50).optional(),
        detail: z.string().max(50).optional(),
        social_id: z.string().max(50).optional(),
        customer_place_name: z.string().min(1).max(50),
        customer_address: z.string().min(1).max(50),
        customer_country_id: z.string().min(1).max(50),
        customer_province_id: z.string().min(1).max(50),
        customer_district_id: z.string().min(1).max(50),
        employee_id: z.string().min(1).max(50),
        team_id: z.string().min(1).max(50),
        emp_phone: z.string().min(1).max(10),
        emp_email: z.string().min(1).max(50),
    })
})

export const UpdateSchema = z.object({
    params : z.object({ customer_id : z.string().min(1).max(50) }),
    body: z.object({
        company_name: z.string().min(1).max(50).optional(),
        type: z.string().max(50).optional(),
        company_email: z.string().max(50).optional(),
        company_phone: z.string().max(15).optional(),
        tax_id: z.string().max(50).optional(),
        note: z.string().max(50).optional(),
        priority: z.number().min(1).max(5).optional(),
        resp_phone: z.string().max(10).optional(),
        resp_email: z.string().max(50).optional(),
        team_id: z.string().min(1).max(50).optional(),
        employee_id: z.string().min(1).max(50).optional(),
        place_name: z.string().max(50).optional(),
        address: z.string().max(50).optional(),
        country_id: z.string().max(50).optional(),
        province_id: z.string().max(50).optional(),
        district_id: z.string().max(50).optional(),
        tag_id: z.array(z.string().min(1)).optional(),
    })
})


export const DeleteSchema = z.object({
    params : z.object({ customer_id : z.string().min(1).max(50) })
})


export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    }),

    body: z.object({
        team_id: z.string().max(50).optional().nullable(),
        responsible_id: z.string().max(50).optional().nullable(),
        tag_id: z.string().max(50).optional().nullable(),
    })
});

export const GetByIdSchema = z.object({
    params: z.object({
        customer_id: z.string().min(1).max(50),
    })
});


export const AddCustContactSchema = z.object({
    params: z.object({
        customer_id: z.string().min(1).max(50),
    }),
    body: z.object({
        customer_name : z.string().min(1).max(50),
        customer_phone : z.string().min(1).max(10),
        customer_phone_extension : z.string().max(50).optional(),
        position : z.string().min(1).max(50),
        customer_email : z.string().min(1).max(50),
        customer_role_id : z.string().min(1).max(50),
        social_id: z.string().max(50).optional(),
        detail: z.string().max(50).optional(),
        character_id: z.string().max(50).optional(),
    })
})

export const AddAddressSchema = z.object({
    params: z.object({
        customer_id: z.string().min(1).max(50),
    }),
    body: z.object({
        customer_place_name: z.string().min(1).max(50),
        customer_address: z.string().min(1).max(50),
        customer_country_id: z.string().min(1).max(50),
        customer_province_id: z.string().min(1).max(50),
        customer_district_id: z.string().min(1).max(50),
    })
})


export const MainContactSchema = z.object({
    params: z.object({ customer_id: z.string().min(1).max(50) }),
    body: z.object({
        customer_contact_id : z.string().min(1).max(50),
    })
})

export const MainAddressSchema = z.object({
    params: z.object({ customer_id: z.string().min(1).max(50) }),
    body: z.object({
        address_id : z.string().min(1).max(50),
    })
})

export const UpdateContactSchema = z.object({
    params: z.object({ customer_id: z.string().min(1).max(50) }),
    body: z.object({
        customer_contact_id : z.string().min(1).max(50),
        name: z.string().min(1).max(50).optional(),
        phone: z.string().min(1).max(10).optional(),
        phone_extension: z.string().min(1).max(50).optional(),
        position: z.string().min(1).max(50).optional(),
        customer_role_id: z.string().min(1).max(50).optional(),
        email: z.string().min(1).max(50).optional(),
        social_id: z.string().min(1).max(50).optional(),
        detail: z.string().min(1).max(50).optional(),
        character_id: z.string().min(1).max(50).optional(),
    })
})


export const UpdateAddressSchema = z.object({
    params: z.object({ customer_id: z.string().min(1).max(50) }),
    body: z.object({
        address_id : z.string().min(1).max(50),
        place_name: z.string().min(1).max(50).optional(),
        address: z.string().min(1).max(50).optional(),
        country_id: z.string().min(1).max(50).optional(),
        province_id: z.string().min(1).max(50).optional(),
        district_id: z.string().min(1).max(50).optional(),
    })
})

export const DeleteContactSchema = z.object({
    params: z.object({ customer_id: z.string().min(1).max(50) }),
    body: z.object({
        customer_contact_id : z.string().min(1).max(50),
    })
})

export const DeleteAddressSchema = z.object({
    params: z.object({ customer_id: z.string().min(1).max(50) }),
    body: z.object({
        address_id : z.string().min(1).max(50),
    })
})