export type TypeCustomerStatusAllResponse = {
  customer_status_id: string;
  name: string;
  start_condition: string;
  end_condition: string;
  description?: string;
  order_no: number;
  is_active: boolean;
  category?: string | null;
  create_at: Date;
  create_by: string;
  update_at: Date;
  update_by: string;
};

export type TypeCustomerStatusResponse = {
  customer_status_id: string;
  name: string;
  start_condition: string;
  end_condition: string;
  description?: string;
  order_no: number;
  is_active: boolean;
  category?: string | null;
};

export type TypeCustomerStatus = {
  totalCount: number;
  totalPages: number;
  data: TypeCustomerStatusAllResponse[];
};

export type CustomerStatusResponse = {
  success: boolean;
  message: string;
  responseObject: TypeCustomerStatus;
  statusCode: number;
};
