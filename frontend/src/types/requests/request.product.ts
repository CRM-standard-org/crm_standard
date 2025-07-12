export type PayLoadCreateGroupProduct={
    group_product_name:string;
}
export type PayLoadEditGroupProduct = {
    group_product_name:string;
}
export type PayLoadCreateUnit ={
    unit_name:string;
}
export type PayLoadEditUnit ={
    unit_name:string
}
export type PayLoadCreateProduct = {
    product_name:string;
    product_description:string;
    unit_price:number;
    unit_id:string;
    group_product_id:string;
}
export type PayLoadEditProduct = {
    product_name:string;
    product_description:string;
    unit_price:number;
    unit_id:string;
    group_product_id:string;
}