export type PayLoadCreateCustomerStatus = {
  name: string;
  start_condition: string;
  end_condition: string;
  description?: string;
  order_no?: number;
  is_active?: boolean;
  category?: string | null;
};

export type PayLoadEditCustomerStatus = {
  name?: string;
  start_condition?: string;
  end_condition?: string;
  description?: string;
  order_no?: number;
  is_active?: boolean;
  category?: string | null;
};
