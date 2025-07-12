import { z } from "zod";

export type TypePayloadUser = {
  employee_id: string;
  employee_code: string;
  company?: string;
  username: string;
  password: string;
  is_active: boolean;
  role?: string;
  role_id?: string;
  right?: string;
  email: string;
  first_name: string;
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
  employee_image?: string;
  created_by?: string; 
  updated_by?: string; 
  created_at: Date;
  updated_at?: Date;
};

export const LoginUserSchema = z.object({
  body: z.object({
    username: z.string().min(4).max(50),
    password: z.string().min(4).max(50),
  }),
});

