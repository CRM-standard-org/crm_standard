import { Social } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadEmployee , Filter } from '@modules/employee/employeeModel';
import { object } from 'zod';
import { skip } from '@prisma/client/runtime/library';
import bcrypt from "bcrypt";

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

    create: async (
        payload: TypePayloadEmployee,
        employee_id: string,
        files: Express.Multer.File[]
    ) => {
        
        const setFormNull: string[] = [];

        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key, value]) => {
                if (typeof value === 'string') {
                    const trimmed = value.trim();
                if (trimmed === '') setFormNull.push(key); // เก็บชื่อ key ไว้ลบภายหลัง
                    return [key, trimmed === '' ? null : trimmed];
                }
                return [key, value === undefined ? null : value];
            })
        ) as TypePayloadEmployee;

        setFormNull.forEach((key) => {
            if (!setForm[key as keyof typeof setForm]) {
                delete setForm[key as keyof typeof setForm];
            }
        })
        employee_id = employee_id.trim();

        // แปลง string to Date
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };

        const password = setForm.password;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);  
        const hashPassword = await bcrypt.hash(password, salt);

        const emp = await prisma.employees.create({
            data: {
                employee_code: setForm.employee_code,
                username: setForm.username,
                password: hashPassword,
                email: setForm.email,
                role_id: setForm.role_id,
                is_active: true,
                position: setForm.position,
                team_id: setForm.team_id,
                first_name: setForm.first_name,
                last_name: setForm.last_name,
                birthdate: toDate(setForm.birthdate),
                phone: setForm.phone,
                profile_picture: files && files.length == 1 ? `/uploads/company/${files[0].filename}` : null,
                salary: setForm.salaly,
                status_id: setForm.status_id,
                start_date: toDate(setForm.start_date),
                end_date: toDate(setForm.start_date),
                created_by: employee_id,
                updated_by: employee_id
            }
        });

        if(setForm.country_id && setForm.province_id && setForm.district_id){
            await prisma.address.create({
                data: {
                    employee_id: emp.employee_id,
                    address: setForm.address,
                    country_id: setForm.country_id,
                    province_id: setForm.province_id,
                    district_id: setForm.district_id,
                    main_address: true,
                    type: "employee",
                    created_by: employee_id,
                    updated_by: employee_id
                }
            });
        }

        if(setForm.detail_social && setForm.social_id){
            await prisma.detailSocial.create({
                data: {
                    employee_id: emp.employee_id,
                    detail: setForm.detail_social,
                    social_id: setForm.social_id,
                    created_by: employee_id,
                    updated_by: employee_id
                }
            });
        }
    },

    count: async (searchText: string,payload : Filter) => {
        searchText = searchText?.trim();
        return await  prisma.employees.count({
            where: {
                is_active : true,
                AND: [
                    {...(searchText && {
                        OR: [
                            {
                                employee_code: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                position: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                first_name: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                last_name: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                team_employee: { 
                                    is: {
                                        name: { contains: searchText , mode : 'insensitive' }
                                    }
                                }
                            },
                            {
                                employee_status: { 
                                    is: {
                                        name: { contains: searchText , mode : 'insensitive' }
                                    }
                                }
                            },
                        ]
                    } )},
                    {
                        AND: [
                            ...(payload.is_active ? [{ is_active : payload.is_active }] : []),
                            ...(payload.status ? [{ 
                                employee_status: {
                                    name : payload.status 
                                }
                            }] : []),
                        ]
                    }
                ]
            },
        });
    },
    
    findAll: async (
        skip: number,
        take: number,
        searchText: string,
        payload : Filter
    ) => {
        searchText = searchText.trim();

        return prisma.employees.findMany({
            where: {
                is_active : true,
                AND: [
                    {...(searchText && {
                        OR: [
                            {
                                employee_code: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                position: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                first_name: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                last_name: { contains: searchText , mode : 'insensitive' }
                            },
                            {
                                team_employee: { 
                                    is: {
                                        name: { contains: searchText , mode : 'insensitive' }
                                    }
                                }
                            },
                            {
                                employee_status: { 
                                    is: {
                                        name: { contains: searchText , mode : 'insensitive' }
                                    }
                                }
                            },
                        ]
                    } )},
                    {
                        AND: [
                            ...(payload.is_active ? [{ is_active : payload.is_active }] : []),
                            ...(payload.status ? [{ 
                                employee_status: {
                                    name : payload.status 
                                }
                            }] : []),
                        ]
                    }
                ]
            },
            skip: (skip - 1) * take,
            take: take,
            select:{
                employee_id: true,
                employee_code: true,
                first_name: true,
                last_name: true,
                position: true,
                team_employee: { select: { team_id: true , name: true }},
                start_date: true,
                employee_status: {select: { status_id: true , name: true }},
                salary: true
            },
            orderBy : { created_at : 'desc' }
        });
    },

    countNoneTeam: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await  prisma.employees.count({
            where: { team_id : null , 
                ...(searchText 
                && {
                    OR : [
                        {
                            first_name : {
                                contains: searchText,
                                mode: 'insensitive' // คือการค้นหาที่ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
                            }
                        },
                        {
                            last_name : {
                                contains: searchText,
                                mode: 'insensitive' // คือการค้นหาที่ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
                            }
                        },
                    ]
                } 
            )},
        });
    },

    findAllNoneTeam : async (skip: number , take: number , searchText: string) => {
        return await prisma.employees.findMany({
            where: { team_id : null , 
                ...(searchText 
                && {
                    OR : [
                        {
                            first_name : {
                                contains: searchText,
                                mode: 'insensitive' // คือการค้นหาที่ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
                            }
                        },
                        {
                            last_name : {
                                contains: searchText,
                                mode: 'insensitive' // คือการค้นหาที่ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
                            }
                        },
                    ]
                } )},
            skip: (skip - 1 ) * take,
            take: take,
            select:{
                employee_id: true,
                first_name: true,
                last_name: true
            },
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