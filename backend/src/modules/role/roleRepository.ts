import { roles } from "@prisma/client";
import prisma from "@src/db";

export const Keys = [
    "role_id", 
    "role_name",
];

export const key2=[
    "role_name"
]

export const roleRepository = {
    findById: async <Key extends keyof roles>(
        uuid : string,
        keys = Keys as Key[]
    ) => {
        return prisma.roles.findUnique({
            where: {role_id: uuid},
            select: keys.reduce(( obj, k) => ({...obj, [k]: true}), {}),
        }) as Promise<Pick<roles, Key> | null>;
    },
    findAll: async (
    
      ) => {
        return await prisma.roles.findMany({
          orderBy: { created_at: "asc" },
        });
      },
      findById2: async ( role_id: string,) => {
        return prisma.roles.findFirst({
          where: {
            //company_id: companyId,
            role_id: role_id,
          },
          select: key2.reduce((obj, k) => ({ ...obj, [k]: true }), {}), // Use Keys array
        });
      },
}
