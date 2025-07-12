export type PayLoadCreateTeam = {
    name:string;
    description:string;
    head_id:string;
    head_name:string;
    employees_id?:string[];
}

export type PayLoadDeleteMemberTeam={
    employee_id:string;
}

export type PayLoadEditTeam= {
    name:string;
    description:string;
    head_id:string;
    head_name:string;
}

export type PayLoadEditMemberTeam = {
    employee_code:string[];
}