import { PaymentMethod } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadPaymentMethod } from '@modules/paymentMethod/paymentMethodModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'payment_method_id',
    'payment_method_name',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];


export const paymentMethodRepository = {
     
    findByName: async (payment_method_name: string) => {
        payment_method_name = payment_method_name.trim();
        return prisma.paymentMethod.findFirst({
          where: { payment_method_name: payment_method_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.paymentMethod.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                payment_method_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async <Key extends keyof PaymentMethod>(
        payment_method_id : string,
        keys = Keys as Key[],
    ) => {
        return await prisma.paymentMethod.findUnique({
            where: { payment_method_id: payment_method_id },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<PaymentMethod, Key> | null>;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.paymentMethod.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        payment_method_name : {
                            contains: searchText,
                            mode: 'insensitive' 
                        }
                    }]
                } )},
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                payment_method_id: true,
                payment_method_name: true,
            },
            orderBy: { created_at: 'asc' },
        });
    },

    update: async (
        payment_method_id : string,
        payload: TypePayloadPaymentMethod,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadPaymentMethod;
        employee_id = employee_id.trim();

        return await prisma.paymentMethod.update({
            where: { payment_method_id: payment_method_id },
            data: {
                payment_method_name: setForm.payment_method_name,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadPaymentMethod,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadPaymentMethod;
        employee_id = employee_id.trim();
          
        return await prisma.paymentMethod.create({
            data: {
                payment_method_name: setForm.payment_method_name,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (payment_method_id: string) => {
        payment_method_id = payment_method_id.trim();
        return await prisma.paymentMethod.delete({
            where: { payment_method_id: payment_method_id },
        });
    }
        
};