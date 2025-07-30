import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { customerRepository } from '@modules/customer/customerRepository';
import { TypePayloadCustomer , TypePayloadFilter , TypePayloadAddress , TypePayloadContact , TypePayloadCompany } from '@modules/customer/customerModel';
import { number } from 'zod';


export const customerService = {

    create: async (payload: TypePayloadCustomer, employee_id : string ) => {
        try{
            
            const checkCust = await customerRepository.findByname(payload.company_name);
            if ( checkCust){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            
            await customerRepository.create(
                payload,
                employee_id
            );

            return new ServiceResponse(
                ResponseStatus.Success,
                "Customer created successfully",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create customer :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (cust_id: string) => {
        try{
            const customer = await customerRepository.findById(cust_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by customer id success",
                {customer},
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get by customer id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findAll: async (page: number , limit: number , searchText: string , payload : TypePayloadFilter) => {
        try{
            const totalCount = await customerRepository.count(searchText , payload.team_id , payload.responsible_id , payload.tag_id);
            const customer = await customerRepository.findAll(page , limit , searchText , payload.team_id , payload.responsible_id , payload.tag_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : customer
                },
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get all customer :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (cust_id:string , payload: TypePayloadCompany , emp_id: string) => {
        try{
            const checkCustomer = await customerRepository.findById(cust_id);
            if(!checkCustomer){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }

            const {
                company_name ,
                type ,
                company_email ,
                company_phone ,
                tax_id ,
                note ,
                priority ,
                resp_email ,
                resp_phone ,
                team_id ,
                employee_id,
                place_name,
                address,
                country_id ,
                province_id ,
                district_id ,
            } = { ...checkCustomer , ...payload } 

            const data = await customerRepository.update(
                cust_id , 
                {
                    company_name ,
                    type ,
                    company_email: company_email ?? checkCustomer.email ,
                    company_phone:  company_phone ?? checkCustomer.phone ,
                    tax_id ,
                    note ,
                    priority ,
                    resp_email ,
                    resp_phone ,
                    team_id ,
                    employee_id,
                    place_name,
                    address,
                    country_id ,
                    province_id ,
                    district_id ,
                    tag_id: payload.tag_id
                },
                emp_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update customer success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update customer :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (customer_id : string) => {
        try{
            await customerRepository.delete(customer_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete customer successfully",
                null,
                StatusCodes.OK
            );
        }catch (ex){
            const errorMessage = "Error delete customer :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    addCustContact: async (cust_id:string , payload: TypePayloadCustomer , employee_id: string) => {
        try{
            const custome_contact = await customerRepository.addCustomerContact(
                cust_id,
                payload,
                employee_id
            );

            if (custome_contact === null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "customer contact already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Add customer contact successfully",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error add customer contact :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    addAddress: async (cust_id:string , payload: TypePayloadCustomer , employee_id: string) => {
        try{
            await customerRepository.addAddress(
                cust_id,
                payload,
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Add Address successfully",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error add address :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    mainCustContact: async (cust_id : string , cust_contact_id : string , employee_id : string ) => {
        try{
            const data = await customerRepository.mainCustomerContact(cust_id , cust_contact_id , employee_id)
            if (data === null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer contact already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Change main customer contact success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error Change main customer contact :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    mainAddress: async (cust_id : string , address_id : string , employee_id : string ) => {
        try{
            const data = await customerRepository.mainAddress(cust_id,address_id,employee_id)
            if (data === null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Address already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Change main address success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error Change main address :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    updateCustContact: async (cust_id: string, payload: TypePayloadContact ,  employee_id: string) => {
        try{
            const checkCustContact = await customerRepository.findByIdCustContact(cust_id , payload.customer_contact_id);
            if (!checkCustContact){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer contact not already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            };
            const {
                name,
                phone,
                phone_extension,
                position,
                customer_role_id,
                email,
                social_id,
                detail,
                character_id,
            } = {...checkCustContact , ...payload} as TypePayloadContact
                    
            const data = await customerRepository.updateCustomerContact(
                cust_id , 
                {
                    customer_contact_id: payload.customer_contact_id,
                    name,
                    phone,
                    phone_extension,
                    position,
                    customer_role_id,
                    email,
                    social_id,
                    detail,
                    character_id,
                }  , 
                employee_id 
            );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update customer contact success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update customer contact :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    updateAddress: async (cust_id: string, payload: TypePayloadAddress ,   employee_id: string) => {
        try{
            const checkAddress = await customerRepository.findByIdAddress(cust_id , payload.address_id);
            if (!checkAddress){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Address not already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            
            const {
                place_name,
                address,
                country_id,
                province_id,
                district_id
            } = {...checkAddress , ...payload} as TypePayloadAddress

            await customerRepository.updateAddress(
                cust_id , 
                {
                    address_id: payload.address_id,
                    place_name,
                    address,
                    country_id,
                    province_id,
                    district_id
                } , 

                employee_id 
            );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update address success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update address :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },
    
    deleteCustContact: async(cust_id : string , cust_contact_id : string) => {
        try{
            const checkCustContact = await customerRepository.findByIdCustContact(cust_id , cust_contact_id);
            if (!checkCustContact){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer contact not already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            };
            const custContact = await customerRepository.deleteCustContact(cust_id , cust_contact_id);
            if (custContact === null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer contact is main contact",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            };
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete Customer contact success",
                null,
                StatusCodes.OK
            )
            
        } catch (ex) {
            const errorMessage = "Error delete customer contact :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    deleteAddress: async(cust_id : string , address_id : string) => {
        try{
            const checkAddress = await customerRepository.findByIdAddress(cust_id , address_id);
            if (!checkAddress){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Address not already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            };
            const address = await customerRepository.deleteAddress(cust_id , address_id);
            if (address === null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Address is main address",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            };
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete address success",
                null,
                StatusCodes.OK
            )
            
        } catch (ex) {
            const errorMessage = "Error delete address :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    selectCustContact: async(cust_id : string) => {
        try{
            const check = await customerRepository.findById(cust_id);
            if (!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            };
            const data = await customerRepository.selectCustContact(cust_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Select all success",
                data,
                StatusCodes.OK
            )
            
        } catch (ex) {
            const errorMessage = "Error select all :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    selectAddress: async(cust_id : string) => {
        try{
            const check = await customerRepository.findById(cust_id);
            if (!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            };
            const data = await customerRepository.selectAddress(cust_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Select all success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error select all :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    activity: async (cust_id : string , page: number , limit: number ) => {
        try{
            const checkCustomer = await customerRepository.findById(cust_id);
            if(!checkCustomer){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const totalCount = await customerRepository.countActivity(cust_id);
            const data = await customerRepository.activity(cust_id, page , limit);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all activity success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : data
                },
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get all activity :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    followQuotation: async (cust_id : string ) => {
        try{
            const checkCustomer = await customerRepository.findById(cust_id);
            if(!checkCustomer){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer not found",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const data = await customerRepository.followQuotation(cust_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Quotation grand total fetched success",
                data,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error quotation grand total fetched :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    saleTotal: async (cust_id : string ) => {
        try{
            const checkCustomer = await customerRepository.findById(cust_id);
            if(!checkCustomer){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer not found",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const data = await customerRepository.saleTotal(cust_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Grand Total Sales success",
                data,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error grand Total Sales :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
}
