export type TypeRoleAllResponse ={
    customer_role_id:string;
    name:string;
    description:string;
    create_at:Date;
    create_by:string;
    update_at:Date;
    update_by:string;
}

export type TypeRoleResponse = {
    customer_role_id:string;
    name:string;
    description:string;
}
export type TypeRole ={
    totalCount:number;
    totalPages:number;
    data:TypeRoleAllResponse[];
}

export type RoleResponse = {
    success:boolean;
    message:string;
    responseObject:TypeRole;
    statusCode:number
}