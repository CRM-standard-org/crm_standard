// export type TypeCategoriesAll = {
//     category_name: string,
//     id: string
// }

// export type TypeCategory = {
//     id: string;
//     category_name: string;
//     created_at: string;
//     updated_at: string;
// }

// export type CategoryResponse = {
//     success: boolean;
//     message: string;
//     responseObject: TypeCategory;
//     statusCode: number;
// };
export type MS_USER_ALL = {
  employee_id?: string;
  employee_code?: string;
  company_id?: string;
  username: string;
  password?: string;
  is_active?: boolean;
  role_id?: string;
  job_title?: string;
  right?: string;
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
  employee_image?: string | null;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;

  role?: {
    role_name:string;
  }
};

export type MS_USER = {
  username: string;
  password: string;
  email?: string;
  employee_code: string;
  first_name?: string;
  last_name?: string;
  birthday?: string;
  job_title?: string;
  belief?: string;
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
};

export type MS_USER_RESPONSE = {
  success: boolean;
  message: string;
  responseObject: MS_USER;
  statusCode: number;
};

export type MS_USER_ALL_RESPONSE = {
  success: boolean;
  message: string;
  responseObject: MS_USER_ALL[];
  statusCode: number;
};

export type APIResponseType<T> = {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
};

export type Type_USER_ALLresponse = {
  employee_id: string;
  username?: string;
  password?: string;
  create_at: string;
};
export type Type_USER_All = {
  username: string;
  employee_code: string;
  employee_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  role_id: string;
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  remark?: string;
};

export type Type_USER = {
  employee_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  role_id: string;
  company_id: string;
};

export type USER_Response = {
  success: boolean;
  message: string;
  responseObject: Type_USER;
  statusCode: number;
};
