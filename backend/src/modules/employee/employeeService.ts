import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { employeeRepository } from '@modules/employee/employeeRepository';
import { TypePayloadEmployee , Filter , UpdateEmployee } from '@modules/employee/employeeModel';
import { employees } from '@prisma/client';


export const employeeService = {
    create: async (payload: TypePayloadEmployee, employee_id : string , files: Express.Multer.File[] ) => {
        try{
            const checkNameReplace = await employeeRepository.findByUsername(payload.username);
            if(checkNameReplace){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Username or employee code already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await employeeRepository.create(payload , employee_id , files);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Employee create success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create employee :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findAllNoneTeam: async (page : number , limit : number , search : string ) => {
        try{
            const employee = await employeeRepository.findAllNoneTeam(page , limit , search);
            const totalCount = await employeeRepository.countNoneTeam(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : employee,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all employee :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    

    selectResponsibleInTeam: async (team_id : string , search : string ) => {
        try{
            const employee = await employeeRepository.selectResponsibleInTeam(team_id , search);
            if(!team_id){
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "Responsible empty",
                    null,
                    StatusCodes.OK
                )
            }
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "select responsible success",
                {
                    data : employee,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error select responsible :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    selectResponsible: async (search : string ) => {
        try{
            const data = await employeeRepository.selectResponsible(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data : data,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all responsible :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findAll: async (page: number , limit: number , searchText: string , payload : Filter ) => {
        try{
            const totalCount = await employeeRepository.count(searchText , payload );
            const data = await employeeRepository.findAll(page , limit , searchText , payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : data
                },
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get all :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
  
    findById: async (employee_id: string) => {
        try{
            const data = await employeeRepository.findById(employee_id);
            if(!data){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Employee not found",
                    data,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by employee id success",
                data,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get by employee id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (employee_id: string , payload: UpdateEmployee , employee_id_by: string ,  files: Express.Multer.File[]) => {
        try{

            const check = await employeeRepository.findById(employee_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Employee not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
    
            const {
                username,
                password,
                email,
                role_id,
                position,
                first_name,
                last_name,
                birthdate,
                phone,
                salary,
                status_id,
                start_date,
                end_date,
                address,
                country_id,
                province_id,
                district_id,
                social_id,
                detail,
            } = {...check , ...payload} as UpdateEmployee
            const checkUsernameReplace = await employeeRepository.findByUsername(check.username);
            const checkUsernameAlright = await employeeRepository.checkUsername(check.username , employee_id);
            if(checkUsernameReplace && checkUsernameAlright){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Username or employee code already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const pass = await employeeRepository.findPass(employee_id);
            const addressEmp = await employeeRepository.findAddress(employee_id);
            const socialEmp = await employeeRepository.findSocial(employee_id);

            const data = await employeeRepository.update(
                employee_id,
                {
                    username,
                    password : (password !== '' ? password : pass?.password ) as string,
                    email,
                    role_id: role_id ?? check.role.role_id,
                    position,
                    first_name,
                    last_name,
                    birthdate,
                    phone,
                    salary,
                    status_id: status_id ?? check.employee_status?.status_id,
                    start_date,
                    end_date,
                    address,
                    social_id: social_id ?? socialEmp?.social.social_id,
                    detail: detail ?? socialEmp?.detail,
                    country_id: country_id ?? addressEmp?.country.country_id,
                    province_id: province_id ?? addressEmp?.province.province_id,
                    district_id: district_id ?? addressEmp?.district.district_id,
                },
                employee_id_by,
                files
            );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update employee success",
                null,
                StatusCodes.OK
            );
        } catch (ex){
            const errorMessage = "Error update employee :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
}