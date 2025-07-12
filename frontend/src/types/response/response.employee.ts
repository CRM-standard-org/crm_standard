export type TypeEmployeeResponse = {
    employee_id: string;
    employee_code: string,
    username: string;
    password: string;
    email: string;
    role_id: string;
    is_active: boolean;
    position: null;
    team_id: string;
    first_name: string
    last_name: null;
    birthdate: null;
    phone: null;
    line_id: null;
    contact_id: null;
    contact_name: null;
    company_id: null;
    remark: null;
    profile_picture: null;
    salary: null;
    status_id: null;
    start_date: null;
    end_date: null;
}

export type TypeEmployee = {
    totalCount: number;
    totalPages: number;
    data: TypeEmployeeResponse[];
}

export type EmployeeResponse = {
    success: boolean;
    message: string;
    responseObject: TypeEmployee;
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

