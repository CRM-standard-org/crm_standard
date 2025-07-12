import { Currency } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadCurrency } from '@modules/currency/currencyModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'currency_id',
    'currency_name',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];


export const currencyRepository = {
     
    findByName: async (currency_name: string) => {
        currency_name = currency_name.trim();
        return prisma.currency.findFirst({
          where: { currency_name: currency_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.currency.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                currency_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async <Key extends keyof Currency>(
        currency_id : string,
        keys = Keys as Key[],
    ) => {
        return await prisma.currency.findUnique({
            where: { currency_id: currency_id },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<Currency, Key> | null>;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.currency.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        currency_name : {
                            contains: searchText,
                            mode: 'insensitive' 
                        }
                    }]
                } )},
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                currency_id: true,
                currency_name: true,
            },
            orderBy: { created_at: 'asc' },
        });
    },

    update: async (
        currency_id : string,
        payload: TypePayloadCurrency,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadCurrency;
        employee_id = employee_id.trim();

        return await prisma.currency.update({
            where: { currency_id: currency_id },
            data: {
                currency_name: setForm.currency_name,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadCurrency,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadCurrency;
        employee_id = employee_id.trim();
          
        return await prisma.currency.create({
            data: {
                currency_name: setForm.currency_name,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (currency_id: string) => {
        currency_id = currency_id.trim();
        return await prisma.currency.delete({
            where: { currency_id: currency_id },
        });
    }
        
};