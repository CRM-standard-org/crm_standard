export type TypeCustomerTags = {
    customer_tag_id: string,
    group_tag: {
        tag_id: string;
        tag_name: string;
        color: string
    }
}
export type TypeCustomerContacts = {
    customer_contact_id: string;
    name: string;
    phone: string;
}
export type TypeAllActivityResponse = {
    activity_id: string,
    customer: {
        customer_id: string,
        company_name: string,
        customer_tags: TypeCustomerTags[]
        customer_contact: TypeCustomerContacts[]
    },
    issue_date: string,
    activity_time: string,
    activity_description: string,
    team: {
        team_id: string,
        name: string
    },
    responsible: {
        employee_id: string,
        first_name: string,
        last_name: string | null
    }
}
export type TypeActivity = {
    totalCount: number;
    totalPages: number;
    data: TypeAllActivityResponse[];
}

export type AllActivityResponse = {
    success: boolean,
    message: string,
    responseObject: TypeActivity;
    statusCode: number
}
//get by id activity
export type TypeOtherActivityResponse = {
    activity_id: string,
    customer: {
        customer_id: string,
        company_name: string,
        customer_tags: TypeCustomerTags[],
        customer_contact: TypeCustomerContacts[],
    },
    issue_date: string,
    activity_time: string,
    activity_description: string,
    team: {
        team_id: string,
        name: string
    },
    responsible: {
        employee_id: string,
        first_name: string,
        last_name: string|null
    }

}
export type TypeActivityResponse = {
    activity: {

        customer: {
            customer_id: string,
            company_name: string,

        },
        issue_date: string,
        activity_time: string,
        activity_description: string,
        team: {
            team_id: string,
            name: string
        },
        responsible: {
            employee_id: string,
            first_name: string,
            last_name: string | null
        }
    },
    activityOther: TypeOtherActivityResponse[]
}
export type ActivityResponse = {
    success: boolean,
    message: string,
    responseObject: TypeActivityResponse;
    statusCode: number
}