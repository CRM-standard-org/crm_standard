import { object } from "zod";
import prisma from '@src/db';


const tableMap = {
    social: prisma.social,
    character: prisma.character,
    team: prisma.team,
    customerRole: prisma.customerRole,
    groupTags : prisma.groupTags,
    groupProduct : prisma.groupProduct,
    unit : prisma.unit,
    product : prisma.product,
    paymentMethod : prisma.paymentMethod,
    currency : prisma.currency,
    vat : prisma.vat,
    roles : prisma.roles,
    employeeStatus : prisma.employeeStatus,
};
  

export const select = async (
    tableName : keyof typeof tableMap , 
    searchKey: string[] , // column use to search
    columns: string[] , // select
    orderBy: {
        name: string,
        by: 'asc' | 'desc'
    },
    searchText: string = '' ,
    start: number = 1,
    stop: number = 50,
) => {

    const table = tableMap[tableName] as any;
    if(!tableName) return ('Invalid table');
    
    return await table.findMany({
        where: {...(searchText 
            && {
                OR: searchKey.map((key) => ({
                    [key]: {
                      contains: searchText,
                      mode: 'insensitive',
                    },
                  })
                ),
            } 
        )},
        select: Object.fromEntries(columns.map((col) => [col, true])),
        orderBy: {
            [orderBy.name]: orderBy.by,
        },
        skip: (start - 1) * stop,
        take: stop,
    })
}