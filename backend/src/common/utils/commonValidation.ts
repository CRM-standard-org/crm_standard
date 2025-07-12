import { z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  uuid: z
    .string()
    .uuid()
    .refine((data) => String(data), "ID must be a uuid value")
    .transform(String),
  // ... other common validations
  isPhoneNumber: (value: string) => {
    // ตรวจสอบให้เป็นตัวเลขและมีความยาว 10 หลัก (เช่นหมายเลขไทย)
    const phoneNumberPattern = /^0\d{9}$/;
    return phoneNumberPattern.test(value);
}
};
