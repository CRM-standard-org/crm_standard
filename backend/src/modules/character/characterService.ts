import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { characterRepository } from '@modules/character/characterRepository';
import { TypePayloadcharacter } from '@modules/character/characterModel';
import { select  } from '@common/models/selectData';
import { Character } from '@prisma/client';
import { string } from 'zod';

export const characterService = {
    
    create: async (payload: TypePayloadcharacter, employee_id : string ) => {
        try{
            const checkCharacter = await characterRepository.findByname(payload.character_name);
            if(checkCharacter){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Character name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            const character = await characterRepository.create(
                {
                    character_name : payload.character_name ,
                    character_description : payload.character_description
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Character created successfully.",
                character,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create Character :" + (ex as Error).message;
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
            const character = await select(
                "character",
                ["character_name"],
                ["character_id", "character_name"],
                { name: "created_at" , by: "asc"},
                search
            );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data : character,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all character :" + (ex as Error).message;
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
            const character = await characterRepository.fineAllAsync(page , limit , search);
            // console.log("tag", page , limit , search, character);
            const totalCount = await characterRepository.count(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : character,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all character :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (character_id: string ) => {
        try{
            const data = await characterRepository.findById(character_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by character id success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get by character id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (character_id : string , payload : TypePayloadcharacter , employee_id : string ) => {
        try{
            const checkCharacter = await characterRepository.findById(character_id);
            if(!checkCharacter){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Character not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                character_name,
                character_description 
            } = { ...checkCharacter , ...payload } as Character;

            const data = await characterRepository.update(    
                character_id , 
                {
                    character_name,
                    character_description
                },
                checkCharacter.updated_by as string
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update character success",
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

    delete: async (character_id: string) => {
        try{
            const checkCharacter = await characterRepository.findById(character_id);
            if(!checkCharacter){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Character not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await characterRepository.delete(character_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete character success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete character :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}