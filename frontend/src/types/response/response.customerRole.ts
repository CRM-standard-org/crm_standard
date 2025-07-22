export type TypeCustomerRoleAllResponse ={
    customer_role_id:string;
    name:string;
    description:string;
    create_at:Date;
    create_by:string;
    update_at:Date;
    update_by:string;
}

export type TypeCustomerRoleResponse = {
    customer_role_id:string;
    name:string;
    description:string;
}
export type TypeCustomerRole ={
    totalCount:number;
    totalPages:number;
    data:TypeCustomerRoleAllResponse[];
}

export type CustomerRoleResponse = {
    success:boolean;
    message:string;
    responseObject:TypeCustomerRole;
    statusCode:number
}