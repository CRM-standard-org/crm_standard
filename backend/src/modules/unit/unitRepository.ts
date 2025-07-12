import { Unit } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadUnit } from '@modules/unit/unitModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'unit_id',
    'unit_name',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];


export const unitRepository = {
     
    findByName: async (unit_name: string) => {
        unit_name = unit_name.trim();
        return prisma.unit.findFirst({
          where: {unit_name: unit_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.unit.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                unit_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async <Key extends keyof Unit>(
        unit_id : string,
        keys = Keys as Key[],
    ) => {
        return await prisma.unit.findUnique({
            where: { unit_id: unit_id },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<Unit, Key> | null>;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.unit.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        unit_name : {
                            contains: searchText,
                            mode: 'insensitive' 
                        }
                    }]
                } )},
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                unit_id: true,
                unit_name: true,
            },
            orderBy: { created_at: 'asc' },
        });
    },

    update: async (
        unit_id : string,
        payload: TypePayloadUnit,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadUnit;
        employee_id = employee_id.trim();

        return await prisma.unit.update({
            where: { unit_id: unit_id },
            data: {
                unit_name: setForm.unit_name,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadUnit,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadUnit;
        employee_id = employee_id.trim();
          
        return await prisma.unit.create({
            data: {
                unit_name: setForm.unit_name,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (unit_id: string) => {
        unit_id = unit_id.trim();
        return await prisma.unit.delete({
            where: { unit_id: unit_id },
        });
    }
        
};