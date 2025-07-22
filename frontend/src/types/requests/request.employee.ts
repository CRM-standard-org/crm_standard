export type PayLoadCreateEmployee={
    employee_code: string,
    username: string,
    password: string,
    email: string,
    first_name: string,
    last_name?: string, // ไม่จำเป็น 
    role_id: string, 
    position: string, 
    phone: string, 
    social_id?: string, // ไม่จำเป็น 
    detail_social?: string, // ไม่จำเป็น 
    address?: string, // ไม่จำเป็น 
    country_id: string,
    province_id: string, 
    district_id: string, 
    status_id: string, 
    team_id?: string, // ไม่จำเป็น 
    salaly?: string, // ไม่จำเป็น 
    start_date?: string, // ไม่จำเป็น 
    end_date?: string, // ไม่จำเป็น 
    birthdate?: string // ไม่จำเป็น 
}