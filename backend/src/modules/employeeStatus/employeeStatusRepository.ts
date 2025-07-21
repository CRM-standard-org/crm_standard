import { Social } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloademployeeStatus } from '@modules/employeeStatus/employeeStatusModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'status_id',
    'name',
];

export const employeeStatusRepository = {
    findByName: async (status_name: string) => {
        status_name = status_name.trim();
        return prisma.employeeStatus.findFirst({
          where: {name: status_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.employeeStatus.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.employeeStatus.findMany({
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

    
        
};