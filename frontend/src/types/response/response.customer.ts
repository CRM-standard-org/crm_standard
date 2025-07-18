export type TypeCustomerTags = {
    group_tag: {
        tag_id: string;
        tag_name: string;
        color: string
    }
}

//get customer by id
export type TypeCustomerAddress = {
    address_id: string;
    main_address: boolean;
    place_name: string;
    address: string;
    country: {
        country_id: string;
        country_name: string;
    };
    province: {
        province_id: string
        province_name: string;
    };
    district: {
        district_id: string;
        district_name: string;
    };
}

export type TypeCustomerSocials = {
    social: {
        social_id: string;
        name: string;
    };
    detail_social_id: string;
    detail: string
}
export type TypeCustomerCharacter = {
    character: {
        character_id: string,
        character_name: string,
        character_description: string
    }
}

export type TypeCustomerContacts = {
    customer_contact_id: string;
    main: boolean;
    name: string;
    position: string;
    phone: string;
    phone_extension: string;
    email: string;
    detail_social: TypeCustomerSocials[]
    customer_role: {
        customer_role_id: string
        name: string
    };
    customer_character: TypeCustomerCharacter[];
}
export type TypeCustomerResponse = {
    company_name: string;
    type: string;
    place_name: string;
    address: string;
    country: {
        country_id: string;
        country_name: string;
    };
    province: {
        province_id: string;
        province_name: string;
    };
    district: {
        district_id: string;
        district_name: string;
    };
    phone: string;
    email: string;
    tax_id: string;
    note: string;
    priority: number;
    resp_email: string;
    resp_phone: string;
    customer_contact: TypeCustomerContacts[];
    customer_tags: TypeCustomerTags[];
    responsible: {
        employee_id: string;
        employee_code: string;
        first_name: string;
        last_name?: string;
        team_employee: {
            team_id: string
            name: string;
        }
    }
    customer_address: TypeCustomerAddress[];
}
export type TypeCustomer = {
    customer: TypeCustomerResponse;
}
export type CustomerResponse = {
    success: boolean;
    message: string;
    responseObject: TypeCustomer;
    statusCode: number
}

//get All customer
export type AllCustomerContacts = {
    name: string;
    phone: string;
    main: boolean;
    customer_role: {
        name: string
    }
}
export type TypeAllCustomerResponse = {
    customer_id: string;
    company_name: string;
    priority: number;
    customer_tags: TypeCustomerTags[]
    customer_contact: AllCustomerContacts[]
    responsible: {
        first_name: string;
        last_name?: string;
    }
    team: {
        name: string;
    }
}
export type TypeAllCustomer = {
    totalCount: number;
    totalPages: number;
    data: TypeAllCustomerResponse[];
}

export type AllCustomerResponse = {
    success: boolean;
    message: string;
    responseObject: TypeAllCustomer;
    statusCode: number
}
// get all customer activity

export type TypeCustomerAllActivityResponse = {
    customer: {
        customer_contact: TypeCustomerContacts[]
    },
    issue_date: string,
    activity_time: string,
    activity_description: string,
    team: {
        team_id: string,
        name: string
    },
    responsible: {
        employee_id: string,
        first_name: string,
        last_name: string | null
    }
}
export type TypeCustomerAllActivity = {
    totalCount: number;
    totalPages: number;
    data: TypeCustomerAllActivityResponse[];
}
export type CustomerActivityResponse = {
    success: boolean;
    message: string;
    responseObject: TypeCustomerAllActivity;
    statusCode: number
}

// follow quotation
export type FollowQuotationResponse = {
    success: boolean;
    message: string;
    responseObject: {
        grandTotal:string
    };
    statusCode: number
}
// follow sale total
export type FollowSaleTotalResponse = {
    success: boolean;
    message: string;
    responseObject: {
        grandTotal:string
    };
    statusCode: number
}