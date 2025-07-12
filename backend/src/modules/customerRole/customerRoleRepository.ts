import { CustomerRole } from "@prisma/client";
import prisma from "@src/db";
import { TypePayloadCustomerRole } from "@modules/customerRole/customerRoleModel";


export const Keys = [
    "customer_role_id",
    "name",
    "description",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
]

export const customerRoleRepository = {

    findByname : async (customer_role_name: string) => {
        customer_role_name = customer_role_name.trim();
        return prisma.customerRole.findFirst({
            where: { name : customer_role_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.customerRole.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                name : {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async <Key extends keyof CustomerRole>(
        customer_role_id : string,
        keys = Keys as Key[],
    ) => {
        return await prisma.customerRole.findUnique({
            where: { customer_role_id: customer_role_id },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<CustomerRole, Key> | null>;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.customerRole.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        name : {
                            contains: searchText,
                            mode: 'insensitive' // คือการค้นหาที่ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
                        }
                    }]
                } )},
            skip: (skip - 1 ) * take,
            take: take,
            orderBy: { created_at: 'asc' },
        });
    },

    update: async (
        customer_role_id : string,
        payload: TypePayloadCustomerRole,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadCustomerRole;

        return await prisma.customerRole.update({
            where: { customer_role_id: customer_role_id },
            data: {
                name: setForm.name,
                description: setForm.description,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadCustomerRole,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadCustomerRole;
        employee_id = employee_id.trim();
          
        return await prisma.customerRole.create({
            data: {
                name : setForm.name,
                description: setForm.description,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (customer_role_id: string) => {
        customer_role_id = customer_role_id.trim();
        return await prisma.customerRole.delete({
            where: { customer_role_id: customer_role_id },
        });
    }
}