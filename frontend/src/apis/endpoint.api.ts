

// Auth
export const LOGIN = "/v1/auth/login";
export const AUTH_STATUS = "/v1/auth/auth-status";
export const LOGOUT = "/v1/auth/logout";
export const GET_USERNAME = "/v1/user/usernames";


export const GET_USER_ALL = "/v1/user/get";
export const GET_USER_PROFILE = "/v1/user/get_profile";
export const POST_REGISTER = "/v1/user/register";
export const UPDATE_USER = "/v1/user/update";

export const Get_ALL_ROLE = "/v1/role/get";

//Tag Color
export const CREATE_TAG = "/v1/tag/create";
export const GET_ALL_TAG = "/v1/tag/get";
export const SELECT_TAG = "/v1/tag/select";
export const GET_TAG_BY_ID = "/v1/tag/get";
export const UPDATE_TAG = "/v1/tag/update";
export const DELETE_TAG = "/v1/tag/delete"

//Customer Role
export const CREATE_CUSTOMER_ROLE = "/v1/customer-role/create";
export const GET_ALL_CUSTOMER_ROLE = "/v1/customer-role/get";
export const SELECT_CUSTOMER_ROLE = "/v1/customer-role/select";
export const GET_CUSTOMER_ROLE_BY_ID = "/v1/customer-role/get";
export const UPDATE_CUSTOMER_ROLE = "/v1/customer-role/update";
export const DELETE_CUSTOMER_ROLE = "/v1/customer-role/delete"

//Character
export const CREATE_CHARACTER = "/v1/character/create";
export const GET_ALL_CHARACTER= "/v1/character/get";
export const SELECT_CHARACTER = "/v1/character/select";
export const GET_CHARACTER_BY_ID = "/v1/character/get";
export const UPDATE_CHARACTER = "/v1/character/update";
export const DELETE_CHARACTER = "/v1/character/delete"

//payment method
export const CREATE_PAYMENTMETHOD = "/v1/payment-method/create";
export const GET_ALL_PAYMENTMETHOD= "/v1/payment-method/get";
export const SELECT_PAYMENTMETHOD = "/v1/payment-method/select";
export const GET_PAYMENTMETHOD_BY_ID = "/v1/payment-method/get";
export const UPDATE_PAYMENTMETHOD = "/v1/payment-method/update";
export const DELETE_PAYMENTMETHOD = "/v1/payment-method/delete"

//currency
export const CREATE_CURRENCY = "/v1/currency/create";
export const GET_ALL_CURRENCY= "/v1/currency/get";
export const SELECT_CURRENCY = "/v1/currency/select";
export const GET_CURRENCY_BY_ID = "/v1/currency/get";
export const UPDATE_CURRENCY = "/v1/currency/update";
export const DELETE_CURRENCY = "/v1/currency/delete"


//team
export const CREATE_TEAM = "/v1/team/create";
export const GET_ALL_TEAM = "/v1/team/get";
export const GET_TEAM = "/v1/team/get";
export const SEARCH_EMPLOYEE = "/v1/team/search-employee";
export const DELETE_MEMBER_TEAM = "/v1/team/delete-member";
export const EDIT_TEAM = "/v1/team/team";
export const EDIT_MEMBER_TEAM  = "/v1/team/team-member";
export const DELETE_TEAM ="/v1/team/delete";

//social 
export const SELECT_SOCIAL = "/v1/social/select"
//role
export const SELECT_ROLE = "/v1/role/select";
//employee status
export const GET_EMPLOYEE_STATUS = "/v1/employee-status/select";
//employee
export const GET_EMPLOYEE_NO_TEAM = "/v1/employee/none-team";
export const GET_ALL_EMPLOYEE ="/v1/employee/get-employee"
export const SELECT_RESPONSIBLE = "/v1/employee/select-responsible";
export const SELECT_EMPLOYEE = "/v1/employee/select-employee";
export const CREATE_EMPLOYEE = "/v1/employee/create";
export const GET_EMPLOYEE_BY_ID = "/v1/employee/get";
export const UPDATE_EMPLOYEE = "/v1/employee/update";

//address
export const SELECT_ADDRESS = "/v1/address/select";

//customer 
export const CREATE_CUSTOMER = "/v1/customer/create";
export const DELETE_CUSTOMER = "/v1/customer/delete";
export const GET_ALL_CUSTOMER = "/v1/customer/get";
export const GET_CUSTOMER_BY_ID = "/v1/customer/get";
export const SELECT_CUSTOMER_CONTACT = "/v1/customer/select-customer-contact";
export const SELECT_CUSTOMER_ADDRESS = "/v1/customer/select-address";
export const ADD_CUSTOMER_CONTACT = "/v1/customer/customer-contact";
export const ADD_CUSTOMER_ADDRESS = "/v1/customer/customer-address";
export const CHANGE_MAIN_CONTACT = "/v1/customer/main-contact";
export const CHANGE_MAIN_ADDRESS = "/v1/customer/main-address";
export const EDIT_CUSTOMER = "/v1/customer/update";
export const EDIT_CUSTOMER_CONTACT = "/v1/customer/update-contact";
export const EDIT_CUSTOMER_ADDRESS = "/v1/customer/update-address";
export const DELETE_CUSTOMER_CONTACT = "/v1/customer/delete-contact";
export const DELETE_CUSTOMER_ADDRESS = "/v1/customer/delete-address";
export const GET_ALL_CUSTOMER_ACTIVITY = "/v1/customer/activity";
export const FOLLOW_QUOTATION = "/v1/customer/follow-quotation";
export const FOLLOW_SALE_TOTAL = "/v1/customer/sale-total";

//activity
export const CREATE_ACTIVITY = "/v1/activity/create";
export const GET_ALL_ACTIVITY = "/v1/activity/get";
export const GET_ACTIVITY_BY_ID = "/v1/activity/get";
export const EDIT_ACTIVITY = "/v1/activity/update";
export const DELETE_ACTIVITY = "/v1/activity/delete";

//product group
export const CREATE_GROUP_PRODUCT = "/v1/group-product/create";
export const SELECT_GROUP_PRODUCT = "/v1/group-product/select";
export const GETALL_GROUP_PRODUCT = "/v1/group-product/get";
export const GET_GROUP_PRODUCT_BYID = "/v1/group-product/get";
export const EDIT_GROUP_PRODUCT = "/v1/group-product/update";
export const DELETE_GROUP_PRODUCT = "/v1/group-product/delete";

//product unit
export const CREATE_UNIT = "/v1/unit/create";
export const SELECT_UNIT = "/v1/unit/select";
export const GET_ALL_UNIT = "/v1/unit/get";
export const GET_UNIT_BY_ID = "/v1/unit/get";
export const EDIT_UNIT = "/v1/unit/update";
export const DELETE_UNIT = "/v1/unit/delete";

//product 
export const CREATE_PRODUCT = "/v1/product/create";
export const SELECT_PRODUCT= "/v1/product/select";
export const GET_ALL_PRODUCT = "/v1/product/get";
export const GET_PRODUCT_BY_ID = "/v1/product/get";
export const EDIT_PRODUCT = "/v1/product/update";
export const DELETE_PRODUCT = "/v1/product/delete";

//quotation
export const SELECT_VAT = "/v1/vat/select";
export const GET_ALL_QUOTATION = "/v1/quotation/get";
export const GET_QUOTATION_BY_ID = "/v1/quotation/get";
export const CREATE_QUOTATION = "/v1/quotation/create";
export const UPDATE_QUOTATION_COMPANY = "/v1/quotation/update-company";
export const UPDATE_ITEM = "/v1/quotation/update-item";
export const DELETE_ITEM = "/v1/quotation/delete-item";
export const ADD_ITEM = "/v1/quotation/add-item";
export const UPDATE_PAYMENT = "/v1/quotation/update-payment";
export const ADD_FILE = "/v1/quotation/file";
export const DELETE_FILE = "/v1/quotation/file";

// quotation status
export const CANCEL_QUOTATION = "/v1/quotation/cancel";
export const REQUEST_APPROVE = "/v1/quotation/request-approve";
export const REQUEST_EDIT = "/v1/quotation/request-edit";
export const APPROVE_QUOTATION = "/v1/quotation/approve";
export const REJECT_QUOTATION = "/v1/quotation/reject";
export const CANCLE_APPROVE = "/v1/quotation/cancel-approve";
export const REJECT_DEAL = "/v1/quotation/reject-deal";
export const CLOSE_DEAL = "/v1/quotation/close-deal";

// sale order
export const GET_ALL_SALEORDER = "/v1/sale-order/get";
export const GET_SALEORDER_BY_ID = "/v1/sale-order/get";
export const UPDATE_SALEORDER_COMPANY = "/v1/sale-order/update-company";
export const UPDATE_SALEORDER_PAYMENT = "/v1/sale-order/payment-detail";
export const ADD_SALEORDER_FILE = "/v1/sale-order/file";
export const DELETE_SALEORDER_FILE = "/v1/sale-order/file";
export const GET_PAYMENT_FILE = "/v1/sale-order/file";
export const CREATE_PAYMENT_LOG = "/v1/sale-order/payment";
export const UPDATE_PAYMENT_LOG = "/v1/sale-order/payment-update";
export const DELETE_PAYMENT_LOG = "/v1/sale-order/delete-payment";

//sale order status
export const UPDATE_MANUFACTURE = "/v1/sale-order/manufacture";
export const UPDATE_EXPECT_MANUFACTURE = "/v1/sale-order/expected-manufacture";
export const UPDATE_DELIVERY = "/v1/sale-order/delivery";
export const UPDATE_EXPECT_DELIVERY = "/v1/sale-order/expected-delivery";
export const UPDATE_RECEIPT = "/v1/sale-order/receipt";
export const UPDATE_EXPECT_RECEIPT = "/v1/sale-order/expected-receipt";
export const CLOSE_SALE = "/v1/sale-order/close-sale";
export const REJECT_SALE = "/v1/sale-order/reject-sale";

//company
export const GET_COMPANY = "/v1/company/get";
export const UPDATE_COMPANY = "/v1/company/update";