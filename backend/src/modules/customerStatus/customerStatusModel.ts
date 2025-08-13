import { z } from "zod";

export type TypePayloadCustomerStatus = {
  name: string;
  start_condition: string;
  end_condition: string;
  description?: string | null;
  order_no?: number;
  is_active?: boolean;
  category?: string | null;
  created_by?: string;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
};

export const CreateCustomerStatusSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50),
    start_condition: z.string().min(1),
    end_condition: z.string().min(1),
    description: z.string().optional().nullable(),
    order_no: z.number().int().positive().optional(),
    is_active: z.boolean().optional(),
    category: z.string().max(30).optional().nullable(),
  }),
});

export const UpdateCustomerStatusSchema = z.object({
  params: z.object({ customer_status_id: z.string().min(1).max(50) }),
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    start_condition: z.string().min(1).optional(),
    end_condition: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    order_no: z.number().int().positive().optional(),
    is_active: z.boolean().optional(),
    category: z.string().max(30).optional().nullable(),
  }),
});

export const DeleteCustomerStatusSchema = z.object({
  params: z.object({ customer_status_id: z.string().min(1).max(50) }),
});

export const GetAllCustomerStatusSchema = z.object({
  query: z.object({
    page: z.string().min(1).optional(),
    limit: z.string().min(1).optional(),
    search: z.string().optional(),
  }),
});

export const GetCustomerStatusByIdSchema = z.object({
  params: z.object({ customer_status_id: z.string().min(1).max(50) }),
});

export const SelectCustomerStatusSchema = z.object({
  query: z.object({ search: z.string().optional() }),
});
