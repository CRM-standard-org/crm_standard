import { Character } from "@prisma/client";
import prisma from "@src/db";
import { TypePayloadcharacter } from "@modules/character/characterModel";


export const Keys = [
    "character_id",
    "character_name",
    "character_description",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
]

export const characterRepository = {

    findByname : async (character_name: string) => {
        character_name = character_name.trim();
        return prisma.character.findFirst({
            where: { character_name : character_name }, 
        });
    },
    count: async (searchText?: string) => {
        searchText = searchText?.trim();
        return await prisma.character.count({
            where: {
                ...(searchText
                    && {
                        OR: [
                            {
                                character_name: {
                                    contains: searchText,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    })
            },
        });
    },
    findById: async <Key extends keyof Character>(
        character_id : string,
        keys = Keys as Key[],
    ) => {
        return await prisma.character.findUnique({
            where: { character_id: character_id },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<Character, Key> | null>;
    },

    fineAllAsync : async (skip: number , take: number , searchText: string) => {
        return await prisma.character.findMany({
            where: {...(searchText 
                && {
                    OR : [{
                        character_name : {
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

    

    update: async (
        character_id : string,
        payload: TypePayloadcharacter,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadcharacter;

        return await prisma.character.update({
            where: { character_id: character_id },
            data: {
                character_name: setForm.character_name,
                character_description: setForm.character_description,
                updated_by: employee_id,
            }
        });
    },
    create: async (
        payload: TypePayloadcharacter,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadcharacter;
        employee_id = employee_id.trim();
          
        return await prisma.character.create({
            data: {
                character_name : setForm.character_name,
                character_description: setForm.character_description,
                created_by: employee_id,
                updated_by: employee_id,
            }
        });
    },
    delete: async (character_id: string) => {
        character_id = character_id.trim();
        return await prisma.character.delete({
            where: { character_id: character_id },
        });
    }
}