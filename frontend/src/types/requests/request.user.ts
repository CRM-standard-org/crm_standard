// import { blobToFile } from "../file";

// export type PayLoadLogin = {
//     username: string;
//     password: string;
// };

// export type PayLoadRegister = {
//     username: string;
//     password: string;
//     email?: string; 
//     first_name?: string;
//     last_name?: string;
//     birthday?: string;
//     phone_number?: string;
//     line_id?: string;
//     addr_number?: string;
//     addr_alley?: string;
//     addr_street?: string;
//     addr_subdistrict?: string;
//     addr_district?: string;
//     addr_province?: string;
//     addr_postcode?: string;
//     position?: string;
//     remark?: string;
//     role_id?: string;
//     create_at?: Date;
//     employee_image?: blobToFile[];
// };

// export type RequestCreateUser={
//     usename: string;
//     password: string;
//     email?: string; 
//     first_name?: string;
//     last_name?: string;
//     birthday?: string;
//     phone_number?: string;
//     line_id?: string;
//     addr_number?: string;
//     addr_alley?: string;
//     addr_street?: string;
//     addr_subdistrict?: string;
//     addr_district?: string;
//     addr_province?: string;
//     addr_postcode?: string;
//     position?: string;
//     remark?: string;
//     role_id?: string;
//     create_at?: Date;
//     employee_image?: string;
// };


import { blobToFile } from "../file";

export type PayLoadLogin = {
    username: string;
    password: string;
};

export type PayLoadRegister = {
    employee_id?:string;
    employee_code?:string;
    company_id?:string;
    username: string;
    password?: string;
    is_active?: boolean;
    role_id?: string;
    job_title?:string;
    right?:string;
    email?: string; 
    first_name?: string;
    last_name?: string;
    birthday?: string;
    phone_number?: string;
    line_id?: string;
    addr_number?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    position?: string;
    remark?: string;
    employee_image?: blobToFile[];
    created_at?: Date;
    created_by?:string
    updated_at?: Date;
    updated_by?:string
    
};

export type RequestCreateUser={
    username: string;
    password?: string;
    company_id?:string;
    email?: string; 
    is_active?: boolean;
    employee_code?:string;
    first_name?: string;
    last_name?: string;
    birthday?: string;
    phone_number?: string;
    line_id?: string;
    addr_number?: string;
    right?:string;
    job_title?:string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    position?: string;
    remark?: string;
    role_id?: string;
    create_at?: Date;
    employee_image?: string;
    //created_at?: Date;
    //created_by?:string
    //updated_at?: Date;
    //updated_by?:string
};