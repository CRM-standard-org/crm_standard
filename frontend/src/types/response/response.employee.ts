
export type TypeEmployeeResponse = {
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