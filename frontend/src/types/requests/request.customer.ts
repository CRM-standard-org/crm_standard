//สร้างลูกค้า
export type PayLoadCreateCustomer = {
    company_name: string;
    type: string;
    company_email: string;
    company_phone: string;
    tax_id: string;
    note: string;
    priority: number;
    place_name: string;
    address: string;
    country_id: string;
    province_id: string;
    district_id: string;
    tag_id: string[];
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_phone_extension: string;
    position: string;
    customer_role_id: string;
    character_id: string;
    detail: string;
    social_id: string;
    customer_place_name: string;
    customer_address: string;
    customer_country_id: string;
    customer_province_id: string;
    customer_district_id: string;
    employee_id: string;
    team_id: string;
    emp_phone: string;
    emp_email: string;
}
export type PayLoadEditCustomer = {
    company_name: string;
    type: string;
    company_email: string;
    company_phone: string;
    tax_id: string;
    note: string;
    priority: number;
    place_name: string;
    address: string;
    country_id: string;
    province_id: string;
    district_id: string;
    employee_id: string;
    team_id: string;
    resp_phone: string;
    resp_email: string;
    tag_id: string[];
}
//กรองลูกค้า
export type PayLoadFilterCustomer = {
    tag_id: string | null;
    team_id: string | null;
    responsible_id: string | null;
}

//สร้างผู้ติดต่อ
export type PayLoadCreateCustomerContact = {
    customer_name: string;
    customer_phone: string;
    customer_phone_extension: string;
    position: string;
    customer_email: string;
    customer_role_id: string;
    social_id: string;
    detail: string;
    character_id: string;
}

//สร้างที่อยู่
export type PayLoadCreateCustomerAddress = {
    customer_place_name: string;
    customer_address: string;
    customer_country_id: string;
    customer_province_id: string;
    customer_district_id: string;
}

//แก้ไขผู้ติดต่อหลัก
export type PayLoadEditMainContact = {
    customer_contact_id: string;
}

//แก้ไขที่อยู่หลัก
export type PayLoadEditMainAddress = {
    address_id: string;
}

//แก้ไขผู้ติดต่อ
export type PayLoadEditContact = {
    customer_contact_id: string;
    name: string;
    phone: string;
    phone_extension: string;
    position: string;
    customer_role_id: string;
    email: string;
    social_id: string;
    detail: string;
    character_id: string;
}

//แก้ไขที่อยู่
export type PayLoadEditAddress = {
    address_id: string;
    place_name: string;
    address: string;
    country_id: string;
    province_id: string;
    district_id: string;
}

//ลบผู้ติดต่อ
export type PayLoadDeleteContact = {
    customer_contact_id: string;
}

//ลบที่อยู่
export type PayLoadDeleteAddress = {
    address_id: string;
}

