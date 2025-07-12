import { Social } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadEmployee } from '@modules/employee/employeeModel';
import { object } from 'zod';
import { skip } from '@prisma/client/runtime/library';


export const Keys = [
    'social_id',
    'name',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];

export const employeeRepository = {

    findByUsername: async (username: string) => {
        username = username.trim();
        return prisma.employees.findFirst({
          where: {username: username }, 
        });
    },

    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await  prisma.employees.count({
            where: { 
                team_id : null ,
                ...(searchText
                    && {
                        OR: [
                            {
                                username: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    

    findAllCreateTeam : async (skip: number , take: number , searchText: string) => {
        return await prisma.employees.findMany({
            where: { team_id : null , ...(searchText 
                && {
                    OR : [{
                        username : {
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
    findAllTeamEmployee : async (skip: number , take: number , searchText: string) => {
        return await prisma.employees.findMany({
            where: { ...(searchText 
                && {
                    OR : [{
                        username : {
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

    selectResponsibleInTeam : async (team_id: string , searchText?: string , skip: number = 1, take: number = 50 ) => {
        return await prisma.employees.findMany({
            where: {
                team_id: team_id ,
                ...(searchText && {
                    OR: [
                        {
                            first_name: {
                                contains: searchText,
                                mode: 'insensitive'
                            }
                        },
                        {
                            last_name: {
                                contains: searchText,
                                mode: 'insensitive'
                            }
                        }
                    ]
                })
            },
            skip: (skip - 1) * take,
            take: take,
            select: {
                employee_id:true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true
            },
            orderBy: [{ first_name: 'asc' },{ last_name: 'asc' }]
        })
    } ,
    selectResponsible : async (searchText?: string , skip: number = 1, take: number = 50 ) => {
        return await prisma.employees.findMany({
            where: {
                ...(searchText && {
                    OR: [
                        {
                            first_name: {
                                contains: searchText,
                                mode: 'insensitive'
                            }
                        },
                        {
                            last_name: {
                                contains: searchText,
                                mode: 'insensitive'
                            }
                        }
                    ]
                })
            },
            skip: (skip - 1) * take,
            take: take,
            select: {
                employee_id:true,
                first_name: true,
                last_name: true,
            },
            orderBy: [{ first_name: 'asc' },{ last_name: 'asc' }]
        })
    } ,

};