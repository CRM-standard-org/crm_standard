export type TypeAuth = {
    employee_id: string,
    first_name: string,
    last_name: string,
    role: {
        role_id: string,
        role_name: string
    },
    profile_picture: string
}

export type AuthResponse = {
    success: boolean;
    message: string;
    responseObject: TypeAuth;
    statusCode: number;
};
