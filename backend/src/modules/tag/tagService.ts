import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { tagRepository } from '@modules/tag/tagRepository';
import { TypePayloadTag } from '@modules/tag/tagModel';
import { GroupTags } from '@prisma/client';
import { select  } from '@common/models/selectData';


export const tagService = {
    
    create: async (payload: TypePayloadTag, employee_id : string ) => {
        try{
            const checkUser = await tagRepository.findByName(payload.tag_name);
            if(checkUser){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Tag name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            const tag = await tagRepository.createTag(
                {
                    tag_name : payload.tag_name ,
                    color : payload.color ,
                    tag_description : payload.tag_description
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Tag created successfully.",
                tag,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create tag :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    select: async (search : string ) => {
        try{
            const social = await select(
                "groupTags",
                ["tag_name"],
                ["tag_id" , "tag_name" , "color"],
                { name: "created_at" , by : "asc"},
                search
            )
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data : social,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all social :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    fineAll: async (page : number , limit : number , search : string ) => {
        try{
            const tag = await tagRepository.fineAllAsync(page , limit , search);
            
            const totalCount = await tagRepository.count(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : tag,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all tag :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (tag_id: string ) => {
        try{
            const data = await tagRepository.findById(tag_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get tag by tag code success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get tag by tag code :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (tag_id : string , payload : TypePayloadTag , employee_id : string ) => {
        try{
            const checkTag = await tagRepository.findById(tag_id);
            if(!checkTag){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Tag not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                tag_name,
                color,
                tag_description
            } = { ...checkTag ,...payload } as GroupTags;

            const data = await tagRepository.updateTag(    
                tag_id , 
                {
                    tag_name,
                    color,
                    tag_description,
                },
                checkTag.updated_by as string
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update tag success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update tag :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (tag_id: string) => {
        try{
            const checkTag = await tagRepository.findById(tag_id);
            if(!checkTag){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Tag not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await tagRepository.deleteTag(tag_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete tag success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete tag :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}