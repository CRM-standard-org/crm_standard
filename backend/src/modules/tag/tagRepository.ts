import { GroupTags } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadTag } from '@modules/tag/tagModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'tag_id',
    'tag_name',
    'color',
    'tag_description',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];

export const KeysFindTag = [
    'tag_id',
    'tag_name',
    'color',
    'tag_description',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];



export const tagRepository = {
    findByName: async (tag_name: string) => {
        tag_name = tag_name.trim();
        return prisma.groupTags.findFirst({
          where: {tag_name: tag_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.groupTags.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                tag_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async <Key extends keyof GroupTags>(
        tag_id : string,
        keys = Keys as Key[],
    ) => {
        return await prisma.groupTags.findUnique({
            where: { tag_id: tag_id },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<GroupTags, Key> | null>;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.groupTags.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        tag_name : {
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

    updateTag: async (
        tag_id : string,
        payload: TypePayloadTag,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadTag;

        return await prisma.groupTags.update({
            where: { tag_id: tag_id },
            data: {
                tag_name: setForm.tag_name,
                color: setForm.color,
                tag_description: setForm.tag_description,
                updated_by: employee_id,
            }
        });
    },
    createTag: async (
        payload: TypePayloadTag,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadTag;
        employee_id = employee_id.trim();
          
        return await prisma.groupTags.create({
            data: {
                tag_name: setForm.tag_name,
                color: setForm.color,
                tag_description: setForm.tag_description,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    deleteTag: async (tag_id: string) => {
        tag_id = tag_id.trim();
        return await prisma.groupTags.delete({
            where: { tag_id: tag_id },
        });
    }
        
};