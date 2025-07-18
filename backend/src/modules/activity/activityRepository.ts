import { Vat } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadActivity , Filter } from '@modules/activity/activityModel';
import { object } from 'zod';
import e from 'express';

export const activityRepository = {

    count: async (payload: Filter , searchText: string) => {
        searchText = searchText.trim();
        return await prisma.activity.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                customer:{
                                    company_name: {
                                        contains: searchText,
                                        mode: 'insensitive',
                                    },
                                }
                            },
                        ],
                    }
                ),
                AND: [
                    ...(payload.customer_id ? [{ customer_id: payload.customer_id }] : []),
                    ...(payload.team_id ? [{ team_id: payload.team_id }] : []),
                    ...(payload.responsible_id ? [{ responsible_id : payload.responsible_id }] : [])
                ]
            }
        });
    },
    findById: async( activity_id : string) => {
        activity_id = activity_id.trim();
        const data = await prisma.activity.findUnique({
            where: { activity_id: activity_id },
            select: {
                customer:{ select: { customer_id: true , company_name: true } },
                issue_date: true,
                activity_time: true,
                activity_description: true,
                team: { select: { team_id: true , name: true } },
                responsible: { select: { employee_id: true , first_name: true, last_name: true } }
            }
        });

        const activityOther = await prisma.activity.findMany({
            where: { customer: { customer_id : data?.customer.customer_id } , NOT: { activity_id: activity_id }},
            select: {
                activity_id: true,
                customer: { 
                    select: { 
                        customer_id: true , 
                        company_name: true ,
                        customer_tags: {
                            select: {
                                customer_tag_id: true,
                                group_tag:{
                                    select: { tag_id: true , tag_name: true , color: true }
                                }
                            }
                        },
                        customer_contact:{
                            where:{ main: true},
                            select:{
                                customer_contact_id: true,
                                name: true,
                                phone: true
                            }
                        }
                    }
                },
                issue_date: true,
                activity_time: true,
                activity_description: true,
                team: { select: { team_id: true , name: true }},
                responsible: { select: { employee_id: true , first_name: true , last_name: true } },
            }
        });

        return { activity: data , activityOther }
    },

    fineAllAsync : async (payload: Filter , skip: number , take: number , searchText: string) => {
        searchText = searchText.trim();

        return await prisma.activity.findMany({
            where: {
                ...(searchText 
                    && {
                        OR : [{
                            customer:{
                                company_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            }
                        }]
                    } 
                ),
                AND: [
                    ...(payload.customer_id ? [{ customer_id: payload.customer_id }] : []),
                    ...(payload.team_id ? [{ team_id: payload.team_id }] : []),
                    ...(payload.responsible_id ? [{ responsible_id : payload.responsible_id }] : [])
                ]
            },
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                activity_id: true,
                customer: { 
                    select: { 
                        customer_id: true , 
                        company_name: true ,
                        customer_tags: {
                            select: {
                                customer_tag_id: true,
                                group_tag:{
                                    select: { tag_id: true , tag_name: true , color: true }
                                }
                            }
                        },
                        customer_contact:{
                            where:{ main: true},
                            select:{
                                customer_contact_id: true,
                                name: true,
                                phone: true
                            }
                        }
                    }
                },
                issue_date: true,
                activity_time: true,
                activity_description: true,
                team: { select: { team_id: true , name: true }},
                responsible: { select: { employee_id: true , first_name: true , last_name: true } },
            },
            orderBy: { created_at: 'desc' },
        });
    },

    update: async (
        activity_id : string,
        payload: TypePayloadActivity,
        employee_id: string,
    ) => {
        
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadActivity;
        activity_id = activity_id.trim();
        employee_id = employee_id.trim();

        const [h,m] = setForm.activity_time.split(":");
        const hours = parseInt(h, 10);
        const minutes = parseInt(m , 10);
        if( hours>23 || minutes>59 || isNaN(hours) || isNaN(minutes)){
            return null;
        }

        return await prisma.activity.update({
            where: { activity_id: activity_id },
            data: {
                customer_id: setForm.customer_id,
                issue_date: new Date(setForm.issue_date),
                activity_time: setForm.activity_time,
                activity_description: setForm.activity_description,
                team_id: setForm.team_id,
                responsible_id: setForm.responsible_id,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadActivity,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadActivity;
        employee_id = employee_id.trim();

        const [h,m] = setForm.activity_time.split(":");
        const hours = parseInt(h, 10);
        const minutes = parseInt(m , 10);
        if( hours>23 || minutes>59 || isNaN(hours) || isNaN(minutes)){
            return null;
        }
          
        return await prisma.activity.create({
            data: {
                customer_id: setForm.customer_id,
                issue_date: new Date(setForm.issue_date),
                activity_time: setForm.activity_time,
                activity_description: setForm.activity_description,
                team_id: setForm.team_id,
                responsible_id: setForm.responsible_id,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (activity_id: string) => {
        activity_id = activity_id.trim();
        return await prisma.activity.delete({
            where: { activity_id: activity_id },
        });
    },
        
};