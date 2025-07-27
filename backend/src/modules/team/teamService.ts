import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { teamRepository } from '@modules/team/teamRepository';
import { TypePayloadTeam , TypePayloadTeamMember } from '@modules/team/teamModel';
import { Team , employees } from '@prisma/client';
import { number } from 'zod';
import { select  } from '@common/models/selectData';

export const teamService = {

    create: async (payload: TypePayloadTeam, employee_id : string ) => {
        try{
            const checkTeam = await teamRepository.findByName(payload.name);
            if(checkTeam){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Team name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            const team = await teamRepository.create(
                {
                    name : payload.name ,
                    description : payload.description,
                    head_id : payload.head_id,
                    head_name : payload.head_name,
                    employees_id : payload.employees_id,
                },
                employee_id
            );

            if(team == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Members already have a team",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Team created successfully",
                team,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create team :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findAll: async (page : number , limit : number , search : string ) => {
        try{
            const team = await teamRepository.fineAllAsync(page , limit , search);
            
            const totalCount = await teamRepository.count(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : team,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all team :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (team_id: string , page : number , limit : number , search : string) => {
        try{
            const data = await teamRepository.findById(team_id , page , limit , search);
            const totalCount = await teamRepository.countMemberByTeam(team_id , search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by team id success",
                {
                    totalCountOfMember : totalCount,
                    totalPagesOfMember: Math.ceil(totalCount / limit),
                    data,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get by customer role id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    updateTeam: async (team_id : string , payload : TypePayloadTeam , employee_id : string) => {
        try{
            const checkTeam = await teamRepository.findById(team_id);
            if(!checkTeam){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "team not found.",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            const {
                name,
                description,
                head_id,
                head_name
            } = { ...checkTeam , ...payload } as TypePayloadTeam;

            const data = await teamRepository.updateTeam(
                team_id , 
                {
                    name,
                    description,
                    head_id,
                    head_name
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update team success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update team :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },  
    updateTeamMember: async (team_id : string , employee_code : string[] ,employee_id:string ) => {
        try{
            
            const data = await teamRepository.updateMember(team_id , employee_id ,employee_code );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update team member success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update team member :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },  

    searchEmployee: async (payload: TypePayloadTeam) => {
        try{
            const employee = await teamRepository.findByEmployeeCode(payload.employee_code, payload.first_name , payload.last_name);
            if(!employee){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Employee not found or employee already in team.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get employee success",
                employee,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get employee :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    deleteMember: async (team_id: string , employee_id: string) => {
        try{
            const checkTeam = await teamRepository.findById(team_id);
            if(!checkTeam){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Team not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }

            const data = await teamRepository.deleteMember( team_id, employee_id );
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Responsible for customers",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete customer role success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete team :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    deleteTeam: async (team_id: string) => {
        try{
            const checkTeam = await teamRepository.findById(team_id);
            if(!checkTeam){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Team not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const team = await teamRepository.delete(team_id);
            if(team === null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "There are still members in the team.",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }else{
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "Delete team success",
                    null,
                    StatusCodes.OK
                )
            }
        } catch (ex) {
            const errorMessage = "Error delete team :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    
}