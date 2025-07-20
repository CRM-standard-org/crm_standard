import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { companyRepository } from '@modules/company/companyRepository';
import {TypePayloadCompany } from '@modules/company/companyModel';
import { select  } from '@common/models/selectData';
import { rejects } from 'assert';


export const companyService = {
    
    findCompany: async () => {
        try{
            const data = await companyRepository.findCompany();
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get company success",
                data,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get company:" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    updateCompany: async (company_id: string , payload: TypePayloadCompany , employee_id: string ,  files: Express.Multer.File[]) => {
        try{

            const check = await companyRepository.findById(company_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Company not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
    
            const {
                name_th,
                name_en,
                type,
                website,
                founded_date,
                place_name,
                address,
                country_id,
                province_id,
                district_id,
                phone,
                fax_number,
                tax_id,
            } = {...check , ...payload} as TypePayloadCompany
    
            const data = await companyRepository.updateCompany(
                company_id,
                {
                    name_th,
                    name_en,
                    type,
                    website,
                    founded_date,
                    place_name,
                    address,
                    country_id: country_id ?? check.country?.country_id,
                    province_id: province_id ?? check.province?.province_id,
                    district_id: district_id ?? check.district?.district_id,
                    phone,
                    fax_number,
                    tax_id,
                },
                employee_id,
                files
            );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update company success",
                null,
                StatusCodes.OK
            );
        } catch (ex){
            const errorMessage = "Error update company :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    
}