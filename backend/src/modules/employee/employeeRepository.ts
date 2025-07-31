import { Social } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadEmployee , Filter , UpdateEmployee } from '@modules/employee/employeeModel';
import { boolean, object } from 'zod';
import { skip } from '@prisma/client/runtime/library';
import bcrypt from "bcrypt";
import { convertDecimalToNumber } from '@common/models/createCode';
import { bool } from 'envalid';
const fs = require('fs');


export const Keys = [
    'social_id',
    'name',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];

export const employeeRepository = {

    findByUsername: async (username: string , employee_code?: string ) => {
        username = username.trim();
        employee_code = employee_code?.trim();
        return prisma.employees.findFirst({
          where: {username: username , employee_code }, 
        });
    },
    checkUsername: async (username: string , employee_code?: string , employee_id?: string) => {
        username = username.trim();
        employee_code = employee_code?.trim();
        return prisma.employees.findFirst({
          where: {username: username , employee_code ,  employee_id: employee_id }, 
        });
    },

    create: async (
        payload: TypePayloadEmployee,
        employee_id_by: string,
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
        employee_id_by = employee_id_by.trim();

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
                profile_picture: files && files.length == 1 ? `/uploads/employee/${files[0].filename}` : null,
                salary: setForm.salary,
                status_id: setForm.status_id,
                start_date: toDate(setForm.start_date),
                end_date: toDate(setForm.start_date),
                created_by: employee_id_by,
                updated_by: employee_id_by
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
                    created_by: employee_id_by,
                    updated_by: employee_id_by
                }
            });
        }

        if(setForm.detail && setForm.social_id){
            await prisma.detailSocial.create({
                data: {
                    employee_id: emp.employee_id,
                    detail: setForm.detail,
                    social_id: setForm.social_id,
                    created_by: employee_id_by,
                    updated_by: employee_id_by
                }
            });
        }
    },

    count: async (searchText: string,payload : Filter) => {
        searchText = searchText?.trim();
        return await  prisma.employees.count({
            where: {
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
                            ...(payload.is_active !== undefined ? [{ is_active : payload.is_active }] : []),
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
                            ...(payload.is_active !== undefined ? [{ is_active : payload.is_active }] : []),
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
                employee_code: true,
                first_name: true,
                last_name: true,
                position: true,
                team_employee: true,
                start_date: true,
                employee_status: { select: { status_id: true , name: true }},
                salary: true
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

    findById: async (employee_id: string) => {
        employee_id = employee_id.trim();
        const data = await prisma.employees.findFirst({
            where: { employee_id : employee_id },
            select:{
                employee_code: true,
                username: true,
                email: true,
                role: {select: { role_id: true , role_name: true }},
                is_active: true,
                position: true,
                team_employee: { select: { team_id: true , name: true} },
                first_name: true,
                last_name: true,
                birthdate: true,
                phone: true,
                profile_picture: true,
                salary: true,
                employee_status: { select: { status_id: true , name: true} },
                start_date: true,
                end_date: true,
                address:{
                    select: {
                        address_id: true,
                        address:true,
                        country: { select: { country_id: true , country_name: true }},
                        province: { select: { province_id: true , province_name: true }},
                        district: { select: {district_id: true , district_name : true}}
                    }
                },
                detail_social:{
                    select: { 
                        detail_social_id: true ,  
                        social: { select:{social_id: true , name: true}},
                        detail: true
                    }
                },
                quotation_responsible:{
                    select: {
                        quotation_id: true,
                        quotation_number: true,
                        customer: { 
                            select: { 
                                customer_id: true ,  
                                company_name: true,
                                customer_tags: { 
                                    select: { 
                                        customer_tag_id: true,
                                        group_tag: {select: {tag_id: true , tag_name: true , color: true}}
                                    } 
                                }
                            } 
                        },
                        priority: true,
                        issue_date: true,
                        grand_total: true,
                        quotation_status: true
                    }
                },
                sale_order_responsible:{
                    select: {
                        sale_order_id: true,
                        sale_order_number: true,
                        customer: { 
                            select: { 
                                customer_id: true ,  
                                company_name: true,
                                customer_tags: { 
                                    select: { 
                                        customer_tag_id: true,
                                        group_tag: {select: {tag_id: true , tag_name: true , color: true}}
                                    } 
                                }
                            } 
                        },
                        priority: true,
                        issue_date: true,
                        created_at: true,
                        grand_total: true,
                        sale_order_status: true
                    }
                }
            },
        })

        return convertDecimalToNumber(data)
    },

    findAddress: async (employee_id: string) => {
        employee_id = employee_id.trim();
        const data = await prisma.address.findFirst({
            where: { employee_id : employee_id },
            select:{
                country: { select: { country_id: true , country_name: true }},
                province: { select: { province_id: true , province_name: true }},
                district: { select: {district_id: true , district_name : true}}
            },
        })

        return data
    },
    findPass: async (employee_id: string) => {
        employee_id = employee_id.trim();
        const data = await prisma.employees.findFirst({
            where: { employee_id : employee_id },
            select:{
                password: true ,  
            },
        })

        return data
    },
    findSocial: async (employee_id: string) => {
        employee_id = employee_id.trim();
        const data = await prisma.detailSocial.findFirst({
            where: { employee_id : employee_id },
            select:{
                detail_social_id: true ,  
                social: { select:{social_id: true , name: true}},
                detail: true
            },
        })

        return data
    },

    update: async (employee_id: string , payload: UpdateEmployee , employee_id_by: string , files: Express.Multer.File[]) => {
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
        ) as UpdateEmployee;

        setFormNull.forEach((key) => {
            if (!setForm[key as keyof typeof setForm]) {
                delete setForm[key as keyof typeof setForm];
            }
        })
        employee_id = employee_id.trim();
        employee_id_by = employee_id_by.trim();

        // แปลง string to Date
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };

        const check = await prisma.employees.findFirst({ where: { employee_id } });

        if(check && files && files.length == 1){
            fs.unlink(`src${check?.profile_picture}`, (err: Error) => {
                if (err) console.log("not found file", err);
            });
        }

        let hashPassword: string | undefined = undefined;
        if (setForm.password && setForm.password !== "") {
            const password = setForm.password;
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);  
            hashPassword = await bcrypt.hash(password, salt);
        };

        const checkIsActive = setForm.end_date ? new Date(setForm.end_date) <= new Date() ? false : true : true;

        const emp = await prisma.employees.update({
            where: { employee_id },
            data: {
                username: setForm.username,
                password: hashPassword,
                email: setForm.email,
                role_id: setForm.role_id,
                is_active: checkIsActive,
                position: setForm.position,
                first_name: setForm.first_name,
                last_name: setForm.last_name,
                birthdate: toDate(setForm.birthdate),
                phone: setForm.phone,
                profile_picture: files && files.length == 1 ? `/uploads/employee/${files[0].filename}` : check?.profile_picture,
                salary: setForm.salary,
                status_id:  setForm.status_id  ,
                start_date: toDate(setForm.start_date),
                end_date: toDate(setForm.start_date),
                updated_by: employee_id_by
            }
        });

        const addressEmp = await prisma.address.findFirst({where: { employee_id: employee_id }});

        if(!addressEmp && setForm.country_id && setForm.province_id && setForm.district_id){
            await prisma.address.create({
                data: {
                    employee_id: emp.employee_id,
                    address: setForm.address,
                    country_id: setForm.country_id,
                    province_id: setForm.province_id,
                    district_id: setForm.district_id,
                    main_address: true,
                    type: "employee",
                    created_by: employee_id_by,
                    updated_by: employee_id_by
                }
            });
        }else{
            await prisma.address.updateMany({
                where:{ employee_id: employee_id , main_address: true, type: "employee" },
                data: {
                    address: setForm.address,
                    country_id: setForm.country_id,
                    province_id: setForm.province_id,
                    district_id: setForm.district_id,
                    updated_by: employee_id_by
                }
            });
        }

        const socialEmp = await prisma.detailSocial.findFirst({where: { employee_id: employee_id }});

        if(!socialEmp && setForm.detail && setForm.social_id){
            await prisma.detailSocial.create({
                data: {
                    employee_id: emp.employee_id,
                    detail: setForm.detail,
                    social_id: setForm.social_id,
                    created_by: employee_id_by,
                    updated_by: employee_id_by
                }
            });
        }else{
            await prisma.detailSocial.update({
                where:{ employee_id: employee_id },
                data: {
                    social_id: setForm.social_id,
                    detail: setForm.detail,
                    updated_by: employee_id_by
                }
            });
        }


        return emp;
    },

};