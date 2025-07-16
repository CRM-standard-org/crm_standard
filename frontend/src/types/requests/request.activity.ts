export type PayLoadCreateActivity = {
    customer_id: string,
    issue_date: string,
    activity_time: string,
    activity_description: string,
    team_id: string,
    responsible_id: string
}
export type PayLoadEditActivity = {
    customer_id: string,
    issue_date: string,
    activity_time: string,
    activity_description: string,
    team_id: string,
    responsible_id: string
}
export type PayLoadFilterActivity = {
    customer_id: string,
    team_id: string,
    responsible_id: string
}