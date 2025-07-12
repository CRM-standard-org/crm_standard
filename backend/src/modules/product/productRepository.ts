import { Product } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadProduct } from '@modules/product/productModel';
import { object } from 'zod';
import e from 'express';

export const productRepository = {
     
    findByName: async (product_name: string) => {
        product_name = product_name.trim();
        return prisma.product.findFirst({
          where: {product_name: product_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.product.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                product_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async (
        product_id : string,
    ) => {
        return await prisma.product.findUnique({
            where: { product_id: product_id },
            select: {
                product_id: true,
                product_name: true,
                product_description: true,
                unit_price: true,
                group_product:{ select: { group_product_id: true, group_product_name: true } },
                unit: { select: { unit_id: true, unit_name: true }}
            }
        }) ;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.product.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        product_name : {
                            contains: searchText,
                            mode: 'insensitive' 
                        }
                    }]
                } )},
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                product_id: true,
                product_name: true,
                product_description: true,
                unit_price: true,
                group_product:{ select: { group_product_id: true, group_product_name: true } },
                unit: { select: { unit_id: true, unit_name: true }}
            },
            orderBy: { created_at: 'asc' },
        });
    },

    update: async (
        product_id : string,
        payload: TypePayloadProduct,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadProduct;
        employee_id = employee_id.trim();

        return await prisma.product.update({
            where: { product_id: product_id },
            data: {
                product_name: setForm.product_name,
                product_description : setForm.product_description,
                unit_price: setForm.unit_price,
                unit_id: setForm.unit_id,
                group_product_id: setForm.group_product_id,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadProduct,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadProduct;
        employee_id = employee_id.trim();
          
        return await prisma.product.create({
            data: {
                product_name: setForm.product_name,
                product_description : setForm.product_description,
                unit_price: setForm.unit_price,
                unit_id: setForm.unit_id,
                group_product_id: setForm.group_product_id,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (product_id: string) => {
        product_id = product_id.trim();
        return await prisma.product.delete({
            where: { product_id: product_id },
        });
    }
        
};