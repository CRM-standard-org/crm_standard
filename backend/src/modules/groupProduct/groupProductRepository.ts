import { GroupProduct } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadGroupProduct } from '@modules/groupProduct/groupProductModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'group_product_id',
    'group_product_name',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];


export const groupProductRepository = {
     
    findByName: async (group_product_name: string) => {
        group_product_name = group_product_name.trim();
        return prisma.groupProduct.findFirst({
          where: {group_product_name: group_product_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.groupProduct.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                group_product_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async <Key extends keyof GroupProduct>(
        group_product_id : string,
        keys = Keys as Key[],
    ) => {
        return await prisma.groupProduct.findUnique({
            where: { group_product_id: group_product_id },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<GroupProduct, Key> | null>;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.groupProduct.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        group_product_name : {
                            contains: searchText,
                            mode: 'insensitive' 
                        }
                    }]
                } )},
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                group_product_id: true,
                group_product_name: true,
            },
            orderBy: { created_at: 'asc' },
        });
    },

    update: async (
        group_product_id : string,
        payload: TypePayloadGroupProduct,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadGroupProduct;
        employee_id = employee_id.trim();

        return await prisma.groupProduct.update({
            where: { group_product_id: group_product_id },
            data: {
                group_product_name: setForm.group_product_name,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadGroupProduct,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadGroupProduct;
        employee_id = employee_id.trim();
          
        return await prisma.groupProduct.create({
            data: {
                group_product_name: setForm.group_product_name,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (group_product_id: string) => {
        group_product_id = group_product_id.trim();
        return await prisma.groupProduct.delete({
            where: { group_product_id: group_product_id },
        });
    }
        
};