//select employee status
export type TypeRoleResponse = {
    role_id: string,
    role_name: string
}
export type TypeRole = {
    data: TypeRoleResponse[];
}
export type RoleResponse = {
    success: boolean;
    message: string;
    responseObject: TypeRole;
    statusCode: number
}
