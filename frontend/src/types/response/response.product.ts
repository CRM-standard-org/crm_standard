
//group
export type TypeGroupProductResponse={
    group_product_id:string;
    group_product_name:string;
}

export type TypeProductGroup = {
    totalCount:number;
    totalPage:number;
    data: TypeGroupProductResponse[];
}

export type ProductGroupResponse ={
    success:boolean;
    message:string;
    responseObject: TypeProductGroup;
    statusCode:number
}
//unit
export type TypeUnitResponse={
    unit_id:string;
    unit_name:string;
}

export type TypeUnit= {
    totalCount:number;
    totalPage:number;
    data: TypeUnitResponse[];
}

export type UnitResponse ={
    success:boolean;
    message:string;
    responseObject: TypeUnit;
    statusCode:number
}

//product
export type TypeProductResponse={
    product_id:string;
    product_name:string;
    product_description:string;
    unit_price:number;
    group_product:{
        group_product_id:string;
        group_product_name:string;
    };
    unit:{
        unit_id:string;
        unit_name:string;
    }
};

export type TypeProduct= {
    totalCount:number;
    totalPage:number;
    data: TypeProductResponse[];
}

export type ProductResponse ={
    success:boolean;
    message:string;
    responseObject: TypeProduct;
    statusCode:number
}

export type ProductByIdResponse ={
    success:boolean;
    message:string;
    responseObject: TypeProductResponse;
    statusCode:number
}