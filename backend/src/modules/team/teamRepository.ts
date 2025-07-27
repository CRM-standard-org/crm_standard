import {  Team , employees } from "@prisma/client";
import prisma from "@src/db";
import { TypePayloadTeam , TypePayloadTeamMember} from "@modules/team/teamModel";
import { never, set } from "zod";
import { parseIsolatedEntityName } from "typescript";
import { P } from "pino";


export const Keys = [
    "team_id",
    "name",
    "description",
    "head_id",
    "head_name",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
]

export const teamRepository = {
    findByName : async ( team_name: string) => {
        team_name = team_name.trim();
        return prisma.team.findFirst({
            where: { name : team_name }, 
        });
    },
    
    findByEmployeeCode : async ( 
        employee_code? : string ,
        first_name? : string, 
        last_name? : string 
    ) => {
        employee_code = employee_code?.trim()
        first_name = first_name?.trim()  
        last_name = last_name?.trim()  
        return prisma.employees.findFirst({
            where: { 
                OR : [ 
                    {employee_code: employee_code} , 
                    { 
                        AND : [
                            { first_name : first_name},
                            { last_name : last_name }
                        ] 
                    }
                ] 
                , team_id : null 
            },
            select: {
                employee_id: true,
                employee_code: true,
                first_name: true,
                last_name: true,
                position: true,
                start_date: true,
                employee_status: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.team.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                name : {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    }
                )
            },
        });
    },
    countMemberByTeam: async (team_id : string , searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.employees.count({
            where: { team_id: team_id ,
                ...(searchText
                    && {
                        OR: [
                            {
                                employee_code : {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                first_name : {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                last_name : {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    }
                )
            },
        });
    },
    findById: async ( team_id : string , skip: number = 1 , take: number =12 , searchText: string= "") => {
        const team = await prisma.team.findFirst({
            where: { team_id: team_id },
        })

        
        if(team && team.head_id && skip && take ){
            const head = await prisma.employees.findFirst({
                where: { team_id: team_id , employee_id: team.head_id  },
                select: {
                    employee_id: true,
                    employee_code: true,
                    first_name: true,
                    last_name: true,
                    position: true,
                    phone: true,
                    email: true,
                    start_date: true,
                    employee_status: { select:{ name: true} },
                    address: {
                        where: { main_address: true },
                        select: { 
                            country: true, 
                            province: true , 
                            district: true ,
                            address: true,
                        },
                    },
                    detail_social: {
                        select: {
                            social: { select: { name : true } }  ,
                            detail : true,
                        }
                    }

                }
            })

            const member = await prisma.employees.findMany({
                where: { team_id: team_id , ...(searchText 
                    && {
                        OR : [
                            {
                                employee_code : {
                                    contains: searchText,
                                    mode: 'insensitive' // คือการค้นหาที่ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
                                }
                            },
                            {
                                first_name : {
                                    contains: searchText,
                                    mode: 'insensitive' 
                                }
                            },
                            {
                                last_name : {
                                    contains: searchText,
                                    mode: 'insensitive' 
                                },
                            }
                        ]
                    } )},
                skip: (skip - 1 ) * take,
                take: take,
                select: {
                    employee_id: true,
                    employee_code: true,
                    first_name: true,
                    last_name: true,
                    position: true,
                    start_date: true,
                    employee_status: { select: {name:true} }
                },
                orderBy: { created_at: 'asc' },
            }) 
            const ordered = member.sort((a, b) => {
                if (a.employee_id === team.head_id) return -1;
                if (b.employee_id === team.head_id) return 1;
                return 0;
            });

            return {
                team: {
                    team: team.name,
                    description: team.description
                } ,
                leader: head, 
                member: ordered,
            }
        }
    },
    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.team.findMany({
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
            select: {
                team_id: true,
                name: true,
                head_name: true,
                description: true,
                _count: { select: { employee_team : true } }
            },
            orderBy: { created_at: 'asc' },
        });
    },

    create: async (
        payload: TypePayloadTeam,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadTeam;
        employee_id = employee_id.trim();
        const checkTeam = await prisma.team.findFirst({
            where: { head_id : setForm.head_id }
        })

        if(checkTeam) return null
          
        const createdTeam = await prisma.team.create({
            data: {
              name: setForm.name,
              description: setForm.description,
              head_id: setForm.head_id,
              head_name: setForm.head_name,
              created_by: employee_id,
              updated_by: employee_id,
            },
        });
        
        if (setForm.employees_id && (setForm.employees_id.length > 0 ) && setForm.head_id ) {

            setForm.employees_id.push(setForm.head_id);
            
            await prisma.employees.updateMany({
                where: { employee_id: { in: setForm.employees_id } },
                data: { team_id: createdTeam.team_id },
            });
        }else if (setForm.head_id){
            await prisma.employees.update({
                where: { employee_id: setForm.head_id },
                data: { team_id: createdTeam.team_id },
            });
        }

        return createdTeam;

    },
    updateTeam: async (
        team_id : string, 
        payload: TypePayloadTeam, 
        employee_id: string
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadTeam;
        employee_id = employee_id.trim();
        team_id = team_id.trim();

        const updatedTeam = await prisma.team.update({
            where: { team_id: team_id },
            data: {
                name: setForm.name,
                description: setForm.description,
                head_id: setForm.head_id,
                head_name: setForm.head_name,
                updated_by: employee_id,
            },
        });

        return updatedTeam;
    },
    updateMember: async ( 
        team_id: string , 
        employee_id: string,
        member_code?: string[] , 
        
    ) => {
        team_id = team_id.trim();
        member_code = Array.isArray(member_code) ? member_code.map(id => id.trim()) : [] ; 

        if (member_code && member_code.length > 0) {
            const employee = await prisma.employees.updateMany({
                where: {
                    employee_code: {
                        in: member_code,
                    },
                },
                data: {
                    team_id: team_id, 
                },
            });
            await prisma.team.update({
                where: {team_id:team_id},
                data: { updated_by : employee_id }
            })

            return employee;
        }
        
    },

    deleteMember: async ( team_id: string , employee_id: string ) => {
        team_id = team_id.trim();
        employee_id = employee_id.trim();

        const checkCustomer = await prisma.customer.findFirst({where: {employee_id}});
        if(checkCustomer) return null;
        return await prisma.employees.update({
            where: { employee_id: employee_id },
            data: { team_id: null },
        });
    },
    delete: async ( team_id: string ) => {
        team_id = team_id.trim();
        
        const checkMember = await prisma.team.findUnique({
            where: {  team_id: team_id },
            include: { employee_team: true },
        })

        if(checkMember && checkMember.employee_team.length === 0){
            return await prisma.team.delete({
                where: { team_id: team_id },
            });
        }else{
            return null;
        }
    }
    
}