export type TypeSocialAllResponse = {
    social_id:string;
    name:string;
    create_at:string;
    create_by:null;
    updated_at:string;
    updated_by:null;
}

export type TypeSocialResponse = {
    social_id:string;
    name:string;

}
export type TypeSocial ={
    totalCount:number;
    totalPages:number;
    data:TypeSocialResponse[];
}


export type SocialResponse = {
    success:boolean;
    message:string;
    responseObject:TypeSocial;
    statusCode:number
}