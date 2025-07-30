import { TypeCustomerTags } from './response.activity';
//get all employee
export type TypeAllEmployeeResponse = {
    employee_id: string,
    employee_code: string,
    first_name: string,
    last_name: string,
    position: string,
    team_employee: {
        team_id: string,
        name: string
    } | null,
    start_date: string,
    employee_status: {
        status_id: string,
        name: string
    },
    salary: string
}

export type TypeAllEmployee = {
    totalCount: number;
    totalPages: number;
    data: TypeAllEmployeeResponse[];
}

export type AllEmployeeResponse = {
    success: boolean;
    message: string;
    responseObject: TypeAllEmployee;
    statusCode: number
}
//get employee by id
export type TypeEmployeeAddressResponse = {
    address_id: string,
    address: string,
    country: {
        country_id: string,
        country_name: string
    },
    province: {
        province_id: string,
        province_name: string
    },
    district: {
        district_id: string,
        district_name: string
    }
}
export type TypeEmployeeSocialResponse = {

    detail_social_id:string,
    social: {
        social_id: string,
        name: string
    },
    detail: string

}
export type TypeSaleOrderResponsible = {
    sale_order_id: string,
    sale_order_number: string,
    customer: {
        customer_id: string,
        company_name: string,
        customer_tags: TypeCustomerTags[]
    },
    priority: number,
    issue_date: string,
    created_at: string,
    grand_total: number,
    sale_order_status: string
}
export type TypeQuotationResponsible = {
    quotation_id: string,
    quotation_number: string,
    customer: {
        customer_id: string,
        company_name: string,
        customer_tags: TypeCustomerTags[]
    },
    priority: number,
    issue_date: string,
    grand_total: number,
    quotation_status: string
}
export type TypeEmployeeResponse = {
    employee_code: string,
    username: string,
    email: string,
    role: {
        role_id: string,
        role_name: string
    },
    is_active: boolean,
    position: string | null,
    team_employee: {
        team_id: string,
        name: string
    },
    first_name: string,
    last_name: string | null,
    birthdate: string | null,
    phone: string | null,
    profile_picture: string | null,
    salary: string | null,
    employee_status: {
        status_id: string,
        name: string
    } | null,
    start_date: string | null,
    end_date: string | null,
    address: TypeEmployeeAddressResponse[],
    detail_social: TypeEmployeeSocialResponse[]
    quotation_responsible: TypeQuotationResponsible[],
    sale_order_responsible: TypeSaleOrderResponsible[]
}


export type EmployeeResponse = {
    success: boolean;
    message: string;
    responseObject: TypeEmployeeResponse;
    statusCode: number
}

export type TypeSearchEmployeeResponse = {
    employee_id: string;
    employee_code: string,
    first_name: string,
    last_name: null,
    position: null,
    start_date: null,
    employee_status: null

}
export type SearchEmployeeResponse = {
    success: boolean;
    message: string;
    responseObject: TypeSearchEmployeeResponse;
    statusCode: number
}
//select employee status
export type TypeSelectEmployeeStatusResponse = {
    status_id: string,
    name: string
}
export type TypeSelectEmployeeStatus = {
    data: TypeSelectEmployeeStatusResponse[];
}
export type EmployeeStatusResponse = {
    success: boolean;
    message: string;
    responseObject: TypeSelectEmployeeStatus;
    statusCode: number
}

export type PayLoadFilterEmployee = {
    is_active: boolean;
    status: string | null;
}