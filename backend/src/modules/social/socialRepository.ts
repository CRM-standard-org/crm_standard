import { Social } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadSocial } from '@modules/social/socialModel';
import { object } from 'zod';
import e from 'express';

export const Keys = [
    'social_id',
    'name',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
];

export const SocialRepository = {
    findByName: async (social_name: string) => {
        social_name = social_name.trim();
        return prisma.social.findFirst({
          where: {name: social_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.social.count({
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
    

    // select : async (searchText: string) => {
    //     const config = selectSocial;
    //     return await prisma.social.findMany({
    //         where: {...(searchText 
    //             && {
    //                 OR : [{
    //                     [config.object.search] : {
    //                         contains: searchText,
    //                         mode: 'insensitive' // คือการค้นหาที่ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
    //                     }
    //                 }]
    //             } )},
    //         skip: (config.start - 1 ) * config.stop,
    //         take: config.stop,
    //         select: config.column_name.reduce((acc, col) => ({ ...acc, [col]: true }), {}),
    //         orderBy: { [config.orderby.name]: config.orderby.by },
    //     });
    // },

    
        
};