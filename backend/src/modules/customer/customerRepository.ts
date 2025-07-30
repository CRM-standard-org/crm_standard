import { Customer } from "@prisma/client";
import prisma from "@src/db";
import { TypePayloadCustomer , TypePayloadAddress , TypePayloadContact , TypePayloadCompany} from "@modules/customer/customerModel";
import { set } from "zod";
import e from "express";
import { P } from "pino";
import { select } from "@common/models/selectData";


export const customerRepository = {

    findByname : async (customer_name: string) => {
        customer_name = customer_name.trim();
        return prisma.customer.findFirst({
            where: { company_name : customer_name }, 
        });
    },
    count: async (searchText?: string , teamFilter?: string, responsibleFilter?: string, tagFilter?: string) => {
        searchText = searchText?.trim();
        return await prisma.customer.count({
            where: {
                AND: [
                    searchText ? {
                        company_name: { contains: searchText, mode: 'insensitive' }
                    } : {},
                
                    {
                        OR: [
                            ...(teamFilter ? [{ team_id: teamFilter }] : []),
                            ...(responsibleFilter ? [{
                                    responsible: {
                                    is: { employee_id: responsibleFilter }
                                }
                            }] : []),
                            ...(tagFilter ? [{
                                    customer_tags: {
                                    some: { tag_id: tagFilter }
                                }
                            }] : [])
                        ]
                    }
                ]
            },
        });
    },

    create: async (
        payload: TypePayloadCustomer,
        employee_id: string,
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key, value]) => {
                if (typeof value === 'string') {
                const trimmed = value.trim();
                return [key, trimmed === '' ? null : trimmed];
                }
                // หากเป็น undefined ให้แปลงเป็น null
                return [key, value === undefined ? null : value];
            })
        ) as TypePayloadCustomer;

        employee_id = employee_id.trim();
       
        const createCustomer = await prisma.customer.create({
            data : {
                company_name : setForm.company_name,
                type : setForm.type,
                email : setForm.company_email,
                phone : setForm.company_phone,
                tax_id : setForm.tax_id,
                note : setForm.note,
                priority : setForm.priority,
                employee_id : setForm.employee_id,
                team_id : setForm.team_id,
                resp_phone : setForm.emp_phone,
                resp_email : setForm.emp_email,
                place_name : setForm.place_name,
                address : setForm.address,
                country_id : setForm.country_id,
                province_id : setForm.province_id,
                district_id : setForm.district_id,
                created_by : employee_id,
                updated_by : employee_id
            }
        });

        await Promise.all(
            setForm.tag_id.map((tagId: string) => 
              prisma.customerTags.create({
                data: {
                  customer_id: createCustomer.customer_id,
                  tag_id: tagId,
                  created_by: employee_id,
                  updated_by: employee_id,
                }
              })
            )
        );
          
        
        const createCustomerContact = await prisma.customerContact.create({
            data : {
                customer_id : createCustomer.customer_id,
                name: setForm.customer_name,
                email: setForm.customer_email,
                phone: setForm.customer_phone,
                phone_extension: setForm.customer_phone_extension,
                position: setForm.position,
                main: true,
                customer_role_id: setForm.customer_role_id,
                created_by : employee_id,
                updated_by : employee_id
            }
        });

        if (setForm.character_id){
            await prisma.customerCharacter.create({
                data : {
                    customer_contact_id : createCustomerContact.customer_contact_id,
                    character_id : setForm.character_id,
                    created_by : employee_id,
                    updated_by : employee_id
                }
            });
        }
        
        if(setForm.social_id) {
            await prisma.detailSocial.create({
                data : {
                    detail : setForm.detail,
                    customer_contact_id : createCustomerContact.customer_contact_id,
                    social_id : setForm.social_id,
                    created_by: employee_id,
                    updated_by: employee_id
                }
            });
        }

        await prisma.address.create({
            data : {
                customer_id : createCustomer.customer_id,
                place_name : setForm.customer_place_name,
                address : setForm.customer_address,
                country_id : setForm.customer_country_id,
                province_id : setForm.customer_province_id,
                district_id : setForm.customer_district_id,
                main_address : true,
                type: "customer",
                created_by : employee_id,
                updated_by : employee_id
            }
        });
        return  createCustomer;

    },

    findById: async (cust_id: string) => {
        cust_id = cust_id.trim();
        return await prisma.customer.findFirst({
            where: { customer_id : cust_id },
            select: {
                company_name: true,
                type: true,
                place_name: true,
                address: true,
                country : { select : { country_id: true , country_name : true } },
                province : { select : { province_id: true , province_name : true } },
                district : { select : { district_id: true , district_name : true } },
                phone: true,
                email: true,
                tax_id: true,
                note: true,
                priority: true,
                resp_email: true,
                resp_phone: true,
                customer_contact: {
                    select: {
                        customer_contact_id : true,
                        main: true,
                        name: true,
                        position: true,
                        phone: true,
                        phone_extension: true,
                        email: true,
                        detail_social: { 
                            select: { social : { select: { social_id: true , name: true} }, detail_social_id : true , detail: true } 
                        },
                        customer_role: { select: { customer_role_id: true , name : true } },
                        customer_character: { 
                            select : { character : { select : { character_id : true , character_name : true , character_description : true}} }
                        }
                    }
                },
                customer_tags: { select:{  group_tag: { select: { tag_id : true , tag_name : true , color : true }  } } },
                responsible: { 
                    select: { 
                        employee_id : true,
                        employee_code: true,
                        first_name: true, 
                        last_name: true, 
                        team_employee: { select : { team_id:true , name : true }}
                    }  
                },
                customer_address: { 
                    select: { 
                        address_id : true,
                        main_address: true , 
                        place_name: true , 
                        address: true , 
                        country: { select: { country_id : true , country_name: true }} , 
                        province: { select: { province_id: true ,  province_name: true }} , 
                        district: { select: { district_id: true , district_name: true }}  
                    }
                }
            }
        })
    },

    findAll: async (
        skip: number,
        take: number,
        searchText: string,
        teamFilter?: string,
        responsibleFilter?: string,
        tagFilter?: string
      ) => {
        searchText = searchText.trim();
        
        return prisma.customer.findMany({
            where: {
                AND: [
                    searchText ? {
                        company_name: { contains: searchText, mode: 'insensitive' }
                    } : {},
                
                    {
                        AND: [
                            ...(teamFilter ? [{ team_id: teamFilter }] : []),
                            ...(responsibleFilter ? [{
                                    responsible: {
                                    is: { employee_id: responsibleFilter }
                                }
                            }] : []),
                            ...(tagFilter ? [{
                                    customer_tags: {
                                    some: { tag_id: tagFilter }
                                }
                            }] : [])
                        ]
                    }
                ]
            },
              
        
            skip: (skip - 1) * take,
            take: take,
        
            select: {
                customer_id: true,
                company_name: true,
                priority: true,
                customer_tags: {
                    select: {
                        group_tag: {
                            select: { tag_name: true , color : true }
                        },
                    }
                },
                customer_contact: {
                    select: {
                        name: true,
                        phone: true,
                        main:true,
                        customer_role: {
                            select: { name: true }  
                        }
                    }
                },
                responsible: {
                    select: {
                        first_name: true,
                        last_name: true
                    }
                },
                team: {
                    select: { name: true }
                }
            },
            orderBy : { created_at : 'asc' }
        });
    },

    update: async (cust_id: string , payload: TypePayloadCompany, employee_id: string) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key, value]) => {
                if (typeof value === 'string') {
                const trimmed = value.trim();
                return [key, trimmed === '' ? null : trimmed];
                }
                // หากเป็น undefined ให้แปลงเป็น null
                return [key, value === undefined ? null : value];
            })
        ) as TypePayloadCompany;
        cust_id = cust_id.trim();
        employee_id = employee_id.trim();

        
        
        if (Array.isArray(setForm.tag_id) && setForm.tag_id.length > 0) {
            await prisma.customerTags.deleteMany({
                where: {
                    customer_id: cust_id
                }
            });
            
            await Promise.all(
                setForm.tag_id.map((tagId: string) => 
                    prisma.customerTags.create({
                        data: {
                            customer_id: cust_id,
                            tag_id: tagId,
                            created_by: employee_id,
                            updated_by: employee_id,
                        }
                    })
                )
            );
        }


        return await prisma.customer.update({
            where: { customer_id: cust_id },
            data: {
                company_name: setForm.company_name,
                type: setForm.type,
                email: setForm.company_email,
                phone: setForm.company_phone,
                tax_id: setForm.tax_id,
                note: setForm.note,
                priority: setForm.priority,
                resp_phone: setForm.resp_phone,
                resp_email: setForm.resp_email,
                team_id: setForm.team_id,
                employee_id: setForm.employee_id,
                place_name: setForm.place_name,
                address: setForm.address,
                country_id: setForm.country_id,
                province_id: setForm.province_id,
                district_id: setForm.district_id,
                updated_by: employee_id
            }
        })
    },

    delete: async (cust_id : string) => {
        cust_id = cust_id.trim();

        const checkCust = await prisma.customer.findFirst({
            where : { customer_id : cust_id }
        });
        if (!checkCust) return null;

        const contacts = await prisma.customerContact.findMany({
            where: { customer_id: cust_id },
            select: { customer_contact_id: true }
        });
        const contactIds = contacts.map(c => c.customer_contact_id);
        
        
        if (contactIds.length > 0) {
            await prisma.detailSocial.deleteMany({
                where: { customer_contact_id: { in: contactIds } }
            });

            await prisma.customerCharacter.deleteMany({
                where: { customer_character_id: { in: contactIds } }
            });
        }
        await prisma.address.deleteMany({ where : { customer_id : cust_id } });
        await prisma.customerContact.deleteMany({ where : { customer_id : cust_id } });
        await prisma.customerTags.deleteMany({ where : { customer_id : cust_id } });
        const deleted = await prisma.customer.delete({ where : { customer_id : cust_id } });

        return deleted;
    },

    addCustomerContact: async (cust_id : string , payload: TypePayloadCustomer , employee_id : string) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key, value]) => {
                if (typeof value === 'string') {
                const trimmed = value.trim();
                return [key, trimmed === '' ? null : trimmed];
                }
                // หากเป็น undefined ให้แปลงเป็น null
                return [key, value === undefined ? null : value];
            })
        ) as TypePayloadCustomer;
        cust_id = cust_id.trim();
        employee_id = employee_id.trim();

        const checkCustContact = await prisma.customerContact.findFirst({
            where: {
                customer_id : cust_id,
                OR: [
                    { name : setForm.customer_name },
                    { email : setForm.customer_email },
                ]
            }
        }) 
        if (checkCustContact) return null;

        const custContact =  await prisma.customerContact.create({
            data: {
                customer_id : cust_id,
                name: setForm.customer_name,
                phone: setForm.customer_phone,
                phone_extension: setForm.customer_phone_extension,
                position: setForm.position,
                customer_role_id: setForm.customer_role_id,
                email: setForm.customer_email,
                main: false,
                created_by: employee_id,
                updated_by: employee_id,
            }
        })

        if(setForm.character_id){
            await prisma.customerCharacter.create({
                data: {
                    character_id: setForm.character_id,
                    customer_contact_id: custContact.customer_contact_id,
                    created_by: employee_id,
                    updated_by: employee_id,
                }
            });
        }

        if(setForm.social_id){
            await prisma.detailSocial.create({
                data: {
                    social_id: setForm.social_id,
                    detail: setForm.detail,
                    customer_contact_id: custContact.customer_contact_id,
                    created_by: employee_id,
                    updated_by: employee_id,
                }
            });
        }

        

        return custContact;
    },

    addAddress: async (cust_id : string , payload: TypePayloadCustomer , employee_id : string) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadCustomer;
        cust_id = cust_id.trim();
        employee_id = employee_id.trim();

        return await prisma.address.create({
            data: {
                customer_id: cust_id,
                place_name: setForm.customer_place_name,
                address: setForm.customer_address,
                country_id: setForm.customer_country_id,
                province_id: setForm.customer_province_id,
                district_id: setForm.customer_district_id,
                main_address: false,
                type: "customer",
                created_by: employee_id,
                updated_by: employee_id,
            }
        })

    },

    mainCustomerContact: async (cust_id: string , cust_contact_id: string , employee_id: string) => {
        cust_id = cust_id.trim();
        cust_contact_id = cust_contact_id.trim();
        employee_id = employee_id.trim();

        const checkCustomerContact = await prisma.customerContact.findFirst({
            where: {customer_id : cust_id , customer_contact_id : cust_contact_id}
        })
        if(!checkCustomerContact) return null;

        await prisma.customerContact.updateMany({
            where: { customer_id: cust_id , NOT: { customer_contact_id : cust_contact_id } },
            data: { main: false }
        })
        return await prisma.customerContact.update({
            where: { customer_id : cust_id , customer_contact_id : cust_contact_id },
            data: {
                main : true,
                updated_by: employee_id
            }
        })
    },

    mainAddress: async (cust_id: string , address_id: string , employee_id: string) => {
        cust_id = cust_id.trim();
        address_id = address_id.trim();
        employee_id = employee_id.trim();

        const checkAddress = await prisma.address.findFirst({
            where: {customer_id : cust_id , address_id : address_id}
        })
        if(!checkAddress) return null;
        
        await prisma.address.updateMany({
            where: { customer_id: cust_id , NOT: { address_id : address_id } },
            data: { main_address: false }
        })

        return await prisma.address.update({
            where: { customer_id : cust_id , address_id : address_id },
            data: {
                main_address : true,
                updated_by: employee_id
            }
        })
    },

    findByIdCustContact: async (cust_id: string , cust_contact_id: string) => {
        cust_id = cust_id.trim();
        cust_contact_id = cust_contact_id.trim();

        return await prisma.customerContact.findFirst({
            where: { customer_id: cust_id , customer_contact_id: cust_contact_id }
        })
    },

    findByIdAddress: async (cust_id: string , address_id: string) => {
        cust_id = cust_id.trim();
        address_id = address_id.trim();

        return await prisma.address.findFirst({
            where: { address_id: address_id , customer_id: cust_id }
        })
    },
    
    updateCustomerContact: async (
        cust_id: string , 
        payload: TypePayloadContact , 
        employee_id: string
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadContact;
        cust_id = cust_id.trim();
        employee_id = employee_id.trim();

        const checkCustContact =  await prisma.customerContact.findFirst({ 
            where: { customer_contact_id : setForm.customer_contact_id , customer_id : cust_id } 
        });

        const checkSocial = await prisma.detailSocial.findFirst({ where : { customer_contact_id: setForm.customer_contact_id }})

        const checkCharacter = await prisma.customerCharacter.findFirst({ where: {customer_contact_id: setForm.customer_contact_id}})
        
        if(!checkCustContact ) return null;
        

        const customerContact = await prisma.customerContact.update({
            where: { 
                customer_id: cust_id,
                customer_contact_id : setForm.customer_contact_id
            },
            data : {
                name: setForm.name,
                phone: setForm.phone,
                phone_extension: setForm.phone_extension,
                position: setForm.position,
                customer_role_id: setForm.customer_role_id,
                email: setForm.email,
                updated_by: employee_id
            }
        })

        if(checkSocial){
            await prisma.detailSocial.update({
                where: { customer_contact_id: customerContact.customer_contact_id },
                data: {
                    social_id: setForm.social_id,
                    detail: setForm.detail,
                    updated_by: employee_id
                }
            });
        }else{
            await prisma.detailSocial.create({
                data: {
                    social_id: setForm.social_id,
                    detail: setForm.detail,
                    customer_contact_id: customerContact.customer_contact_id,
                    created_by: employee_id,
                    updated_by: employee_id,
                }
            });
        }

        if(checkCharacter){
            await prisma.customerCharacter.update({
                where: { customer_contact_id : customerContact.customer_contact_id },
                data: {
                    customer_character_id : setForm.character_id,
                    updated_by: employee_id
                }
            });
        }else{
            await prisma.customerCharacter.create({
                data: {
                    character_id: setForm.character_id,
                    customer_contact_id: customerContact.customer_contact_id,
                    created_by: employee_id,
                    updated_by: employee_id,
                }
            });
        }

        return customerContact;
    },

    updateAddress: async (
        cust_id: string , 
        payload: TypePayloadAddress , 
        employee_id: string
    ) => {
        const setForm = Object.fromEntries(
            Object.entries(payload).map(([key,value]) => [
                key,
                typeof value === 'string' ? value.trim() : value    
            ])
        ) as TypePayloadAddress;
        cust_id = cust_id.trim();
        employee_id = employee_id.trim();
        
        const checkAddress = await prisma.address.findFirst({ where: { customer_id: cust_id , address_id : setForm.address_id }});
        if(!checkAddress) return null;


        return await prisma.address.update({
            where: { customer_id: cust_id , address_id : setForm.address_id },
            data: {
                place_name: setForm.place_name,
                address: setForm.address,
                country_id: setForm.country_id,
                province_id: setForm.province_id,
                district_id: setForm.district_id,
                updated_by: employee_id,
            }
        })
    },

    deleteCustContact: async (cust_id:string , cust_contact_id: string) => {
        cust_id = cust_id.trim();
        cust_contact_id = cust_contact_id.trim();

        const custContact = await prisma.customerContact.findFirst({
            where: { 
                customer_id: cust_id , 
                customer_contact_id: cust_contact_id,
                main: false,
            }
        })
        if (!custContact) return null;

        const detailSocial = await prisma.detailSocial.findFirst({where:{customer_contact_id:custContact.customer_contact_id}});
        const customerCharacter = await prisma.customerCharacter.findFirst({where:{customer_contact_id:custContact.customer_contact_id}});
        
        if(detailSocial){
            await prisma.customerCharacter.deleteMany({where: {customer_contact_id: cust_contact_id}});
        }
        if(customerCharacter){
            await prisma.detailSocial.deleteMany({where: {customer_contact_id: cust_contact_id}});
        }
        await prisma.customerContact.deleteMany({ where: {  customer_id: cust_id ,  customer_contact_id: cust_contact_id } });
        return custContact;
    },

    deleteAddress: async (cust_id:string , address_id: string) => {
        cust_id = cust_id.trim();
        address_id = address_id.trim();

        const address = await prisma.address.findFirst({
            where: { 
                customer_id: cust_id , 
                address_id: address_id,
                main_address: false,
            }
        })
        if (!address) return null;
        
        await prisma.address.deleteMany({ where: {  customer_id: cust_id ,  address_id: address_id } });
        return address;
    },

    selectCustContact: async (cust_id: string) => {
        cust_id = cust_id.trim();

        return await prisma.customerContact.findMany({
            where: { customer_id : cust_id },
            select: {
                customer_contact_id: true,
                name: true,
                phone: true,
                email: true,
            }
        })
    },
    selectAddress: async (cust_id: string) => {
        cust_id = cust_id.trim();

        return await prisma.address.findMany({
            where: { customer_id : cust_id },
            select: {
                address_id: true,
                place_name: true,
                address: true,
                country: { select : { country_id: true , country_name: true }},
                province: { select : { province_id: true , province_name: true }},
                district: { select : { district_id: true , district_name: true }}
            }
        })
    },

    countActivity: async (customer_id : string) => {
        customer_id = customer_id?.trim();
        return await prisma.activity.count({
            where: { customer: { customer_id }}
        });
    },

    activity: async( customer_id : string , skip: number , take: number) => {
        customer_id = customer_id.trim();

        return await prisma.activity.findMany({
            where: { customer: { customer_id }},
            skip: (skip - 1 ) * take,
            take: take,
            select: {
                customer: { 
                    select: { 
                        customer_contact:{
                            where:{ main: true},
                            select:{
                                customer_contact_id: true,
                                name: true,
                                phone: true
                            }
                        }
                    }
                },
                issue_date: true,
                activity_time: true,
                activity_description: true,
                team: { select: { team_id: true , name: true }},
                responsible: { select: { employee_id: true , first_name: true , last_name: true } },
            }
        });

    },

    followQuotation: async( customer_id : string ) => {
        customer_id = customer_id.trim();

        const result = await prisma.quotation.aggregate({
            where: { customer_id , NOT: { quotation_status: { in: ["ยกเลิก","สำเร็จ","ไม่สำเร็จ"] } }},
            _sum: { grand_total: true }
        });

        return {grandTotal : result._sum.grand_total ?? 0}

    },

    saleTotal: async( customer_id : string ) => {
        customer_id = customer_id.trim();

        const result = await prisma.quotation.aggregate({
            where: { customer_id , quotation_status: "สำเร็จ" },
            _sum: { grand_total: true }
        });

        return {grandTotal : result._sum.grand_total ?? 0}

    },


}