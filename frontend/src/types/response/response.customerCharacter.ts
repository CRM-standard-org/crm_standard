export type TypeCharacterAllResponse ={
    character_id:string;
    character_name:string;
    character_description:string;
    create_at:Date;
    create_by:string;
    update_at:Date;
    update_by:string;
}
export type TypeCharacterResponse = {
    character_id: string;
    character_name: string;
    character_description:string;
}

export type TypeCharacter ={
    totalCount:number;
    totalPages:number;
    data:TypeCharacterAllResponse[];
}

export type CharacterResponse = {
    success:boolean;
    message:string;
    responseObject:TypeCharacter;
    statusCode:number
}