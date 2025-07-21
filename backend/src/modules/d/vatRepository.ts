import { Vat } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadVat } from '@modules/vat/vatModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'vat_id',
    'vat_percentage',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];


export const vatRepository = {
     
    select : async ( searchText: string , skip: number = 1 , take: number = 50) => {
        const numericSearch = parseFloat(searchText);
        return await prisma.vat.findMany({
            where: {
                ...(searchText && !isNaN(numericSearch) && {
                    vat_percentage: numericSearch,
                }),
            },
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                vat_id: true,
                vat_percentage: true,
            },
            orderBy: { vat_percentage: 'asc' },
        });
    },

    
};