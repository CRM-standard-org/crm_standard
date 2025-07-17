import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { activityRepository } from '@modules/activity/activityRepository';
import { TypePayloadActivity , Filter } from '@modules/activity/activityModel';
import { select } from '@common/models/selectData';

export const activityService = {
    
    create: async (payload: TypePayloadActivity, employee_id : string ) => {
        try{
            const data = await activityRepository.create(
                payload,
                employee_id
            );
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Time must be between 00:00 and 23:59 only",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create activity :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    fineAll: async (payload: Filter , page : number , limit : number , search : string ) => {
        try{
            const data = await activityRepository.fineAllAsync(payload , page , limit , search);
            
            const totalCount = await activityRepository.count(payload,search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : data,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all activity :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (activity_id: string ) => {
        try{
            const data = await activityRepository.findById(activity_id);
            if(!data){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Activity not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by id success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get by id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (activity_id : string , payload : TypePayloadActivity , employee_id : string ) => {
        try{
            const check = await activityRepository.findById(activity_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Activity not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                customer_id, 
                issue_date, 
                activity_time, 
                activity_description, 
                team_id, 
                responsible_id
            } = { ...check ,...payload } ;

            const data = await activityRepository.update(    
                activity_id , 
                {
                    customer_id: customer_id ?? check.activity?.customer.customer_id, 
                    issue_date, 
                    activity_time, 
                    activity_description, 
                    team_id: team_id ?? check.activity?.team.team_id, 
                    responsible_id: responsible_id ?? check.activity?.responsible.employee_id
                },
                employee_id
            );
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Time must be between 00:00 and 23:59 only",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update activity :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (activity_id: string) => {
        try{
            const check = await activityRepository.findById(activity_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Activity not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await activityRepository.delete(activity_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete activity :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}