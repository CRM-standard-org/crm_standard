import { employees , roles } from "@prisma/client";
import prisma from "@src/db";
import { TypePayloadAuth } from "@modules/auth/authModel";
import bcrypt from "bcrypt";
import { UUID } from "crypto";


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
    authCurrentUser: async (user_id: UUID) => {
      return prisma.employees.findUnique({
        where: { employee_id: user_id }, 
        select: { 
          employee_id: true, 
          first_name: true,
          last_name: true,
          role: {
            select: {
              role_id: true,
              role_name: true,
            }
          },
          profile_picture: true
        }
      })
    }
};