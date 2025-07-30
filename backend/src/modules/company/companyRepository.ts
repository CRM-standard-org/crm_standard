import { SaleOrder } from '@prisma/client';
import prisma from '@src/db';
import { TypePayloadCompany } from '@modules/company/companyModel';
import { number, object, set } from 'zod';
import e from 'express';
import path from "path";
import { create } from 'domain';
import { isAwaitExpression, isAwaitKeyword } from 'typescript';
import { Decimal } from '@prisma/client/runtime/library';
import { assert } from 'console';
import { email } from 'envalid';
const fs = require('fs');

export const companyRepository = {

    findCompany: async () => {
        return await prisma.company.findFirst({
            select: {
                company_id: true,
                name_th: true,
                name_en: true,
                type: true,
                website: true,
                founded_date: true,
                place_name: true,
                address: true,
                country: { select: { country_id: true , country_name: true } },
                province: { select: { province_id: true , province_name: true }},
                district: { select: { district_id: true , district_name: true} },
                phone: true,
                fax_number: true,
                tax_id: true,
                logo: true
            }
        });
    },

    findById: async (company_id: string) => {
        company_id = company_id.trim();
        return await prisma.company.findFirst({
            where: { company_id : company_id },
            select: {
                name_th: true,
                name_en: true,
                type: true,
                website: true,
                founded_date: true,
                place_name: true,
                address: true,
                country: { select: { country_id: true , country_name: true } },
                province: { select: { province_id: true , province_name: true }},
                district: { select: { district_id: true , district_name: true} },
                phone: true,
                fax_number: true,
                tax_id: true,
                logo: true
            }
        });
    },

    updateCompany: async (company_id: string , payload: TypePayloadCompany , employee_id: string , files: Express.Multer.File[]) => {
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
        ) as TypePayloadCompany;

        setFormNull.forEach((key) => {
            if (!setForm[key as keyof typeof setForm]) {
                delete setForm[key as keyof typeof setForm];
            }
        })
        company_id = company_id.trim();

        // แปลง string to Date
        const toDate = (val: unknown): Date | undefined => {
            if (typeof val === 'string' || val instanceof Date) return new Date(val);
            return undefined;
        };

        const check = await prisma.company.findFirst({ where: { company_id } });

        if(check && files && files.length == 1){
            fs.unlink(`src${check?.logo}`, (err: Error) => {
                if (err) console.log("not found file", err);
            });
        }

        return await prisma.company.update({
            where: { company_id },
            data: {
                name_th: setForm.name_th,
                name_en: setForm.name_en,
                type: setForm.type,
                website: setForm.website,
                founded_date: toDate(setForm.founded_date) ,
                place_name: setForm.place_name,
                address: setForm.address,
                country_id: setForm.country_id,
                province_id: setForm.province_id,
                district_id: setForm.district_id,
                phone: setForm.phone,
                fax_number: setForm.fax_number,
                tax_id: setForm.tax_id,
                logo: files && files.length == 1 ? `/uploads/company/${files[0].filename}` : null,
                updated_by: employee_id
            }
        })
    },

}
