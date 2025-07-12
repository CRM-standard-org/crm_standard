import { users,roles } from "@prisma/client";
import prisma from "@src/db";

import { TypePayloadUser } from "@modules/users/userModel";
import bcrypt from "bcrypt";

export const Keys = [
  "employee_id",
  "employee_code",
  "username",
  "password",
  "is_active",
  "role_id",
  "email",
  "first_name",
  "last_name",
  "birthday",
  "phone_number",
  "line_id",
  "addr_number",
  "addr_alley",
  "addr_street",
  "addr_subdistrict",
  "addr_district",
  "addr_province",
  "addr_postcode",
  "position",
  "remark",
  "created_at",
  "updated_at",
  "employee_image",
];

export const KeysFindUsername = [
  "employee_id",
  "username",
  "password",
  "role_id",
];

export const userRepository = {

  findByUsername: async <Key extends keyof users>(
    username: string,
    keys = KeysFindUsername as Key[]
  ) => {
    return prisma.users.findUnique({
      where: { username: username },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<users, Key> | null>;
  },
  
      
};
