export type TypeTagAllResponse = {
    tag_id: string;
    tag_name: string;
    tag_description: string;
    color: string;
    create_at: Date;
    create_by: string;
    update_at: Date;
    update_by: string;
}
export type TypeTagColorResponse = {
    tag_id: string;
    tag_name: string;
    tag_description: string;
    color: string;
}
export type TypeTag = {
    totalCount: number;
    totalPages: number;
    data: TypeTagAllResponse[];
}

export type TagResponse = {
    success: boolean,
    message: string,
    responseObject: TypeTag;
    statusCode: number
}