import { employees , roles } from "@prisma/client";
import prisma from "@src/db";
import { TypePayloadAuth } from "@modules/auth/authModel";
import bcrypt from "bcrypt";


export const Keys = [
    "employee_id",
    "employee_code",
    "username",
    "password",
    "email",
    "is_active",
    "role_id",
    "first_name",
    "last_name",
    "birthday",
    "phone_number",
    "line_id",
    "contact_name",
    "country",
    "province",
    "district",
    "position",
    "remark",
    "created_at",
    "updated_at",
    "picture",
];

export const KeysFindUsername = [
  "employee_id",
  "username",
  "password",
  "role_id",
];

export const KeysFineEmployee = [
    "employee_id",
    "username",
    "password",
    "role_id",
];

export const authRepository = {

    findByUsername: async <Key extends keyof employees>(
      username: string,
      keys = KeysFineEmployee as Key[]
    ) => {
      return prisma.employees.findUnique({
        where: { username: username },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
      }) as Promise<Pick<employees, Key> | null>;
    },
    findById: async <Key extends keyof employees>(
      uuid : string,
      keys = KeysFindUsername as Key[]
    ) => {
        return prisma.employees.findUnique({
            where: { employee_id : uuid},
            select: keys.reduce(( obj, k) => ({...obj, [k]: true}), {}),
        }) as Promise<Pick<employees, Key> | null>;
    },
};