import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { employeeRepository } from '@modules/employee/employeeRepository';
import { TypePayloadEmployee , Filter } from '@modules/employee/employeeModel';
import { employees } from '@prisma/client';


export const employeeService = {
    create: async (payload: TypePayloadEmployee, employee_id : string , files: Express.Multer.File[] ) => {
        try{
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
            // console.log("tag", page , limit , search, tag);
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
}