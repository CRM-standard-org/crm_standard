
export type TypeTeamResponse = {
    team_id: string;
    name: string;
    head_name: string;
    _count: {
        employee_team: number
    }
}

export type TypeTeam = {
    totalCount: number;
    totalPage: number;
    data: TypeTeamResponse[];
}
export type TeamResponse = {
    success: boolean;
    message: string;
    responseObject: TypeTeam;
    statusCode: number
}
//member in team
export type TypeMemberInTeamResponse = {
    employee_id: string;
    employee_code: string;
    first_name: string;
    last_name: null;
    position: null;
    start_date: null;
    employee_status: {
        name:string
    } | null;

};

export type TypeTeamMember = {
    totalCountOfMember:number;
    totalPagesOfMember:number;
    data:TypeTeamMemberResponse;
    
}
export type TypeTeamMemberResponse ={
    team: {
        team: string;
        description: string;
    }
    leader: leaderResponse;
    member: TypeMemberInTeamResponse[];
}
export type leaderResponse = {
    employee_id: string;
    employee_code: string;
    first_name: string;
    last_name: null;
    position: null;
    phone: null;
    email: string;
    start_date: null;
    employee_status: null;
    address: [];
    detail_social: [];
}
export type TeamMemberResponse = {
    success: boolean;
    message: string;
    responseObject: TypeTeamMember;
    StatusCode: number;
}