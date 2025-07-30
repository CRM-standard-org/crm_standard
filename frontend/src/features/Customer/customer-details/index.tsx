import { useCallback, useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { IconButton } from "@radix-ui/themes";
import { LuPencil } from "react-icons/lu";
import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";

//
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import RadioComponent from "@/components/customs/radios/radio.component";
import { LabelWithValue } from "@/components/ui/label";
import { useCustomerAllActivity, useCustomerById, useFollowQuotation, useFollowSaleTotal } from "@/hooks/useCustomer";
import { TypeCustomerAddress, TypeCustomerAllActivity, TypeCustomerAllActivityResponse, TypeCustomerContacts, TypeCustomerResponse } from "@/types/response/response.customer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { useSocial } from "@/hooks/useSocial";
import { TypeSocialResponse } from "@/types/response/response.social";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { TypeAddressResponse } from "@/types/response/response.address";
import { useAddress } from "@/hooks/useAddress";
import { useResponseToOptions } from "@/hooks/useOptionType";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import { deleteCustomerAddress, deleteCustomerContact, postCustomerAddress, postCustomerContact, updateCustomerAddress, updateCustomerContact, updateCustomerMainAddress, updateCustomerMainContact } from "@/services/customer.service";
import { useSelectCustomerRole } from "@/hooks/useCustomerRole";
import { TypeCustomerRoleResponse } from "@/types/response/response.customerRole";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelectCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeCustomerAllActivityResponse; //ตรงนี้
}[];


//
export default function CustomerDetails() {

    const { customerId } = useParams<{ customerId: string }>();
    const [colorsName, setColorsName] = useState("");
    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);
    const [dataCustomer, setDataCustomer] = useState<TypeCustomerResponse>();

    const [selectedMainContact, setSelectedMainContact] = useState<string>("");
    const [selectedMainAddress, setSelectedMainAddress] = useState<string>("");



    const [active, setActive] = useState<'contact' | 'address'>('contact');
    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();

    //variable สำหรับสร้าง ผู้ติดต่อใหม่
    const [firstContact, setFirstContact] = useState("");
    const [telNo, setTelNo] = useState("");
    const [telNoExtension, setTelNoExtension] = useState("");
    const [position, setPosition] = useState("");
    const [email, setEmail] = useState("");

    const [role, setRole] = useState<string | null>(null);
    const [roleName, setRoleName] = useState("");

    const [character, setCharacter] = useState<string | null>(null);
    const [characterName, setCharacterName] = useState("");

    const [contactOption, setContactOption] = useState<string | null>(null);
    const [contactDetail, setContactDetail] = useState("");
    const [contactNameOption, setContactNameOption] = useState("");


    const [placename, setPlaceName] = useState("");
    const [address, setAddress] = useState("");

    const [country, setCountry] = useState<string | null>(null);
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);

    const [province, setProvince] = useState<string | null>(null);
    const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);

    const [district, setDistrict] = useState<string | null>(null);
    const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);

    //สำหรับสร้าง ผู้ติดต่อใหม่
    const [isCreateContactOpen, setIsCreateContactOpen] = useState<boolean>(false);
    const [isEditContactOpen, setIsEditContactOpen] = useState<boolean>(false);
    const [isDeleteContactOpen, setIsDeleteContactOpen] = useState<boolean>(false);
    const [selectedContactItem, setSelectedContactItem] = useState<TypeCustomerContacts | null>(null);

    //สำหรับสร้าง ที่อยู่ใหม่
    const [isCreateAddressOpen, setIsCreateAddressOpen] = useState<boolean>(false);
    const [isEditAddressOpen, setIsEditAddressOpen] = useState<boolean>(false);
    const [isDeleteAddressOpen, setIsDeleteAddressOpen] = useState<boolean>(false);
    const [selectedAddressItem, setSelectedAddressItem] = useState<TypeCustomerAddress | null>(null);
    const [searchSocial, setSearchSocial] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchRole, setSearchRole] = useState("");
    const [searchCharacter, setSearchCharacter] = useState("");

    const [filterGroup, setFilterGroup] = useState<string | null>(null);
    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

    //fetch follow quotation
    const { data: dataFollowQuotation } = useFollowQuotation({
        customerId
    });
    //fetch follow sale total
    const { data: dataFollowSaleTotal } = useFollowSaleTotal({
        customerId
    });
    // fetch customer role
    const { data: dataCustomerRole, refetch: refetchRole } = useSelectCustomerRole({
        searchText: searchRole,
    });

    const fetchDataRoleDropdown = async () => {
        const roleList = dataCustomerRole?.responseObject?.data ?? [];
        return {
            responseObject: roleList.map((item: TypeCustomerRoleResponse) => ({
                id: item.customer_role_id,
                name: item.name,
                description: item.description,
            })),
        };
    };
    const handleRoleSearch = (searchText: string) => {
        setSearchRole(searchText);
        refetchRole();
    };

    //fetch character
    const { data: dataCharacter, refetch: refetchCharacter } = useSelectCharacter({
        searchText: searchCharacter,
    })
    const fetchDataCharacterDropdown = async () => {
        const characterList = dataCharacter?.responseObject?.data ?? [];
        return {
            responseObject: characterList.map((item: TypeCharacterResponse) => ({
                id: item.character_id,
                name: item.character_name,
                description: item.character_description,
            })),
        }
    }

    const handleCharacterSearch = (searchText: string) => {
        setSearchCharacter(searchText);
        refetchCharacter();
    };
    //fetch customer detail 
    if (!customerId) {
        throw Error;
    }
    const { data: customerDetails, refetch: refetchCustomer } = useCustomerById({ customerId });
    useEffect(() => {
        if (customerDetails?.responseObject.customer) {
            setDataCustomer(customerDetails.responseObject.customer)
        }
    })
    const mainContact = dataCustomer?.customer_contact.find((c) => c.main)
    const characterMain = mainContact?.customer_character.find((character) => character.character)

    //หาที่อยู่กับผู้ติดต่อหลัก
    useEffect(() => {
        if (dataCustomer) {
            const mainContact = dataCustomer.customer_contact.find((c) => c.main);
            if (mainContact) {
                setSelectedMainContact(mainContact.customer_contact_id);
            }

            const mainAddress = dataCustomer.customer_address.find((a) => a.main_address);
            if (mainAddress) {
                setSelectedMainAddress(mainAddress.address_id);
            }
        }
    }, [dataCustomer]);

    //fetch social
    const { data: dataSocial, refetch: refetchSocial } = useSocial({
        searchText: searchSocial,
    });


    const fetchDataSocialDropdown = async () => {
        const socialList = dataSocial?.responseObject?.data ?? [];

        return {
            responseObject: socialList.map((Item: TypeSocialResponse) => ({
                id: Item.social_id,
                name: Item.name,
            }))
        }
    }
    const handleSocialSearch = (searchText: string) => {
        setSearchSocial(searchText);
        refetchSocial();
    };

    //fetch Address 
    const { data: Address, refetch: refetchAddress } = useAddress({
        searchText: searchAddress,
    });
    useEffect(() => {
        if (Address?.responseObject) {
            setDataAddress(Address.responseObject);
        }
    }, [Address]);
    //  สำหรับ Contact Address

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setCountryOptions([]);

        const { options } = useResponseToOptions(dataAddress, "country_id", "country_name");
        setCountryOptions(options);
    }, [dataAddress]);

    const fetchDataCountry = useCallback(async () => {
        const countryList = dataAddress ?? [];
        return {
            responseObject: countryList.map(item => ({
                id: item.country_id,
                name: item.country_name,
            })),
        };
    }, [dataAddress]);

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setProvinceOptions([]);

        const selectedCountry = dataAddress.find(item => item.country_id === country);
        const provinceList = selectedCountry?.province ?? [];
        const { options } = useResponseToOptions(provinceList, "province_id", "province_name");
        setProvinceOptions(options);
    }, [dataAddress, country]);

    const fetchDataProvince = useCallback(async () => {
        const selectedCountry = dataAddress?.find(item => item.country_id === country);
        const provinceList = selectedCountry?.province ?? [];
        return {
            responseObject: provinceList.map(item => ({
                id: item.province_id,
                name: item.province_name,
            })),
        };
    }, [dataAddress, country]);

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setDistrictOptions([]);

        const selectedCountry = dataAddress.find(item => item.country_id === country);
        const selectedProvince = selectedCountry?.province?.find(item => item.province_id === province);
        const districtList = selectedProvince?.district ?? [];
        const { options } = useResponseToOptions(districtList, "district_id", "district_name");
        setDistrictOptions(options);
    }, [dataAddress, country, province]);

    const fetchDataDistrict = useCallback(async () => {
        const selectedCountry = dataAddress?.find(item => item.country_id === country);
        const selectedProvince = selectedCountry?.province?.find(item => item.province_id === province);
        const districtList = selectedProvince?.district ?? [];
        return {
            responseObject: districtList.map(item => ({
                id: item.district_id,
                name: item.district_name,
            })),
        };
    }, [dataAddress, country, province]);


    const handleAddressSearch = (searchText: string) => {
        setSearchAddress(searchText);
        refetchAddress();
    };
    const mockData = [
        {
            className: "",
            cells: [
                { value: "19 ก.พ. 2568", className: "text-left" },
                { value: "ติดต่อคุณโชคชัย", className: "text-left" },
                { value: "คุณโชคชัย", className: "text-left" },
                { value: "จอมปราชญ์ รักโลก", className: "text-left" },
                { value: "A", className: "text-center" },
            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },

    ];

    //tabs บน headertable
    const groupTabs = [
        {
            id: "customer-activity",
            name: "ประวัติกิจกรรมของลูกค้า",
            onChange: () => setFilterGroup(null)
        },



    ];
    //
    const headers = [
        { label: "วันเวลาของกิจกรรม", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดกิจกรรม", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "w-auto" },
        { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
        { label: "ทีม", colSpan: 1, className: "w-auto" },
    ];
    // fetch customer all activity
    const { data: dataActitvities, refetch: refetchActivity } = useCustomerAllActivity({
        page: page,
        pageSize: pageSize,
        searchText: "",
        customerId
    });
    useEffect(() => {

        if (dataActitvities?.responseObject?.data) {

            const formattedData = dataActitvities.responseObject?.data.map(
                (item: TypeCustomerAllActivityResponse) => ({
                    className: "",
                    cells: [
                        {
                            value: (
                                <div className="flex flex-col">
                                    {new Date(item.issue_date).toLocaleDateString("th-TH")}
                                    <div className="">

                                        เวลา {item.activity_time} น.
                                    </div>
                                </div>
                            )


                            , className: "text-left"
                        },
                        { value: item.activity_description, className: "text-left" },
                        {
                            value: (
                                <div className="flex flex-col">
                                    {item.customer.customer_contact &&
                                        item.customer.customer_contact.map((contact, index) => (
                                            <div key={contact.customer_contact_id ?? index}>
                                                {contact.name}
                                                <div className="flex flex-row space-x-1">
                                                    โทร: {contact.phone}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ),
                            className: "text-left"
                        },
                        { value: item.responsible.first_name + "" + item.responsible.last_name, className: "text-center" },
                        { value: item.team.name, className: "text-center" },

                    ],
                    data: item,
                })

            );
            setData(formattedData);
        }
    }, [dataActitvities]);
    //เปิด
    const handleCreateContactOpen = () => {
        setFirstContact("");
        setTelNo("");
        setTelNoExtension("");
        setEmail("");
        setContactOption(null);
        setContactDetail("");
        setContactNameOption("");
        setIsCreateContactOpen(true);
    };
    const handleEditContactOpen = (id: string) => {
        const contact = dataCustomer?.customer_contact.find((c) => c.customer_contact_id === id);
        const social = contact?.detail_social.find((s) => s !== null);
        const character = contact?.customer_character.find((character) => character !== null);



        if (contact && social && character) {
            setSelectedContactItem(contact);
            setFirstContact(contact.name);
            setTelNo(contact.phone);
            setTelNoExtension(contact.phone_extension);
            setEmail(contact.email);
            setPosition(contact.position)
            setRole(contact.customer_role.customer_role_id);
            setRoleName(contact.customer_role.name);
            setContactOption(social?.social.social_id);
            setContactNameOption(social?.social.name);
            setContactDetail(social?.detail);
            setCharacter(character.character.character_id);
            setCharacterName(character.character.character_name);

        }


        setIsEditContactOpen(true);
    };
    const handleDeleteContactOpen = (id: string) => {

        const contact = dataCustomer?.customer_contact.find((c) => c.customer_contact_id === id);
        if (contact) {
            setSelectedContactItem(contact);
        }
        setIsDeleteContactOpen(true);
    };

    const handleCreateAddressOpen = () => {
        setPlaceName("");
        setAddress("");
        setCountry(null);
        setProvince(null);
        setDistrict(null);
        setIsCreateAddressOpen(true);
    };
    const handleEditAddressOpen = (id: string) => {

        const address = dataCustomer?.customer_address.find((a) => a.address_id === id);
        if (address) {
            setSelectedAddressItem(address);
            setPlaceName(address.place_name);
            setAddress(address.address)
            setCountry(address.country.country_id)
            setDistrict(address.district.district_id)
            setProvince(address.province.province_id)

        }
        setIsEditAddressOpen(true);
    };
    const handleDeleteAddressOpen = (id: string) => {

        const address = dataCustomer?.customer_address.find((a) => a.address_id === id);
        if (address) {
            setSelectedAddressItem(address);
        }
        setIsDeleteAddressOpen(true);
    };

    //ปิด

    const handleCreateContactClose = () => {
        setIsCreateContactOpen(false);
    };
    const handleEditContactClose = () => {
        setIsEditContactOpen(false);
    };
    const handleDeleteContactClose = () => {
        setIsDeleteContactOpen(false);
    };

    const handleCreateAddressClose = () => {
        setIsCreateAddressOpen(false);
    };
    const handleEditAddressClose = () => {
        setIsEditAddressOpen(false);
    };
    const handleDeleteAddressClose = () => {
        setIsDeleteAddressOpen(false);
    };

    //ยืนยันไดอะล็อค
    //สร้างผู้ติดต่อใหม่
    const handleCreateContactConfirm = async () => {

        const errorMap: Record<string, boolean> = {};

        if (!firstContact) errorMap.firstContact = true;
        if (!telNo) errorMap.telNo = true;
        if (!email) errorMap.email = true;
        if (!role) errorMap.role = true;


        setErrorFields(errorMap);

        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }

        try {
            const response = await postCustomerContact(customerId, {
                customer_name: firstContact,
                customer_phone: telNo,
                customer_phone_extension: telNoExtension,
                position: position,
                customer_email: email,
                customer_role_id: role,
                social_id: contactOption,
                detail: contactDetail,
                character_id: character,
            });

            if (response.statusCode === 200) {
                showToast("สร้างผู้ติดต่อเรียบร้อยแล้ว", true);
                setFirstContact("");
                setTelNo("");
                setTelNoExtension("");
                setPosition("");
                setEmail("");
                setContactOption(null);
                setContactDetail("");
                setContactNameOption("");
                handleCreateContactClose();

                refetchCustomer();
            } else {
                showToast("ผู้ติดต่อนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างผู้ติดต่อได้", false);
        }
    };
    //แก้ไขผู้ติดต่อใหม่
    const handleEditContactConfirm = async () => {
        const errorMap: Record<string, boolean> = {};

        if (!firstContact) errorMap.editFirstContact = true;
        if (!telNo) errorMap.editTelNo = true;
        if (!email) errorMap.editEmail = true;
        if (!role) errorMap.editRole = true;


        setErrorFields(errorMap);

        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }

        try {
            const response = await updateCustomerContact(customerId, {
                customer_contact_id: selectedContactItem.customer_contact_id,
                name: firstContact,
                phone: telNo,
                phone_extension: telNoExtension,
                position: position,
                customer_role_id: role,
                email: email,
                social_id: contactOption,
                detail: contactDetail,
                character_id: character,
            });

            if (response.statusCode === 200) {
                showToast("แก้ไขผู้ติดต่อเรียบร้อยแล้ว", true);
                setFirstContact("");
                setTelNo("");
                setTelNoExtension("");
                setPosition("")
                setEmail("");
                setContactOption(null);
                setContactDetail("");
                setContactNameOption("");
                handleEditContactClose();

                refetchCustomer();
            } else {
                showToast("ข้อมูลนี้มีอยู่แล้ว", false);
            }
        } catch (error) {
            showToast("ไม่สามารถแก้ไขแท็กได้", false);
            console.error(error); // Log the error for debugging
        }
    };
    //ลบผู้ติดต่อ
    const handleDeleteContactConfirm = async () => {
        if (!selectedContactItem) {
            showToast("กรุณาระบุผู้ติดต่อที่ต้องการลบ", false);
            return;
        }
        try {
            const response = await deleteCustomerContact(customerId, {
                customer_contact_id: selectedContactItem.customer_contact_id
            });

            if (response.statusCode === 200) {
                showToast("ลบรายการผู้ติดต่อเรียบร้อยแล้ว", true);
                setIsDeleteContactOpen(false);
                refetchCustomer();
            }
            else if (response.statusCode === 400) {
                if (response.message === "Color in quotation") {
                    showToast("ไม่สามารถลบรายการผู้ติดต่อได้ เนื่องจากมีการใช้งานอยู่", false);
                }
                else {
                    showToast("ไม่สามารถลบรายการผู้ติดต่อได้", false);
                }
            }
            else {
                showToast("ไม่สามารถลบรายการผู้ติดต่อได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการผู้ติดต่อได้", false);
        }
    };
    //สร้างที่อยู่ใหม่
    const handleCreateAddressConfirm = async () => {

        const errorMap: Record<string, boolean> = {};

        if (!placename) errorMap.placename = true;
        if (!address) errorMap.address = true;
        if (!country) errorMap.country = true;
        if (!province || provinceOptions.length === 0) { errorMap.province = true; }
        if (!district || districtOptions.length === 0) { errorMap.district = true; }


        setErrorFields(errorMap);

        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }
        try {
            const response = await postCustomerAddress(customerId, {
                customer_place_name: placename,
                customer_address: address,
                customer_country_id: country,
                customer_province_id: province,
                customer_district_id: district
            });

            if (response.statusCode === 200) {
                showToast("สร้างที่อยู่ใหม่เรียบร้อยแล้ว", true);
                setPlaceName("");
                setAddress("");
                setCountry(null);
                setProvince(null);
                setDistrict(null);
                handleCreateAddressClose();
                refetchCustomer();
            } else {
                showToast("ที่อยู่นี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างที่อยู่ใหม่ได้", false);
        }
    };
    //แก้ไขที่อยู่
    const handleEditAddressConfirm = async () => {
        const errorMap: Record<string, boolean> = {};

        if (!placename) errorMap.editPlaceName = true;
        if (!address) errorMap.editAddress = true;
        if (!country) errorMap.editCountry = true;
        if (!province || provinceOptions.length === 0) { errorMap.editProvince = true; }
        if (!district || districtOptions.length === 0) { errorMap.editDistrict = true; }


        setErrorFields(errorMap);

        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }
        try {
            const response = await updateCustomerAddress(customerId, {
                address_id: selectedAddressItem.address_id,
                place_name: placename,
                address: address,
                country_id: country,
                province_id: province,
                district_id: district
            });

            if (response.statusCode === 200) {
                showToast("แก้ไขที่อยู่เรียบร้อยแล้ว", true);
                setAddress("");
                setPlaceName("");
                setCountry(null);
                setProvince(null);
                setDistrict(null);
                handleEditAddressClose();
                refetchCustomer();
            } else {
                showToast("ที่อยู่นี้มีอยู่แล้ว", false);
            }
        } catch (error) {
            showToast("ไม่สามารถแก้ไขที่อยู่ได้", false);
            console.error(error); // Log the error for debugging
        }
    };
    //ลบที่อยู่
    const handleDeleteAddressConfirm = async () => {
        if (!selectedAddressItem) {
            showToast("กรุณาระบุที่อยู่ที่ต้องการลบ", false);
            return;
        }


        try {
            const response = await deleteCustomerAddress(customerId, {
                address_id: selectedAddressItem.address_id
            });

            if (response.statusCode === 200) {
                showToast("ลบรายการที่อยู่เรียบร้อยแล้ว", true);
                setIsDeleteAddressOpen(false);
                refetchCustomer();
            }
            else if (response.statusCode === 400) {
                if (response.message === "Color in quotation") {
                    showToast("ไม่สามารถลบรายการที่อยู่ได้ เนื่องจากมีการใช้งานอยู่", false);
                }
                else {
                    showToast("ไม่สามารถลบรายการที่อยู่ได้", false);
                }
            }
            else {
                showToast("ไม่สามารถลบรายการที่อยู่ได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการที่อยู่ได้", false);
        }
    };

    //handle เลือกที่อยู่
    const handleSelectMainContact = async (contactId: string) => {

        setSelectedMainContact(contactId);

        try {
            const response = await updateCustomerMainContact(customerId, {
                customer_contact_id: contactId
            });
            if (response.statusCode === 200) {
                showToast("เปลี่ยนที่อยู่หลักเรียบร้อย", true);
                refetchCustomer();
            } else {
                showToast("ข้อมูลนี้มีอยู่แล้ว", false);
            }

        } catch (error) {
            showToast("ไม่สามารถเปลี่ยนที่อยู่หลักได้", false);
            console.error(error);
        }

    };
    const handleSelectMainAddress = async (addressId: string) => {

        setSelectedMainAddress(addressId);

        try {
            const response = await updateCustomerMainAddress(customerId, {
                address_id: addressId
            });
            if (response.statusCode === 200) {

                showToast("เปลี่ยนที่อยู่หลักเรียบร้อย", true);
                refetchCustomer();
            }
        } catch (error) {
            showToast("ไม่สามารถเปลี่ยนที่อยู่หลักได้", false);
            console.error(error);
        }
    };


    return (
        <>
            <div className="flex mb-2">
                <p className="me-2">{dataCustomer?.company_name}</p>
                <IconButton
                    variant="ghost"
                    aria-label="Edit"
                    onClick={() => navigate(`/edit-customer-details/${customerId}`)}
                >
                    <LuPencil style={{ fontSize: "18px" }} /><span>แก้ไขข้อมูล</span>
                </IconButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* info */}
                <div className="lg:col-span-2 lg:row-span-4 bg-white rounded-xl shadow-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 ">

                        {/* ข้อมูลลูกค้า */}
                        <div className="p-5">
                            <h1 className="text-xl font-semibold mb-1">ข้อมูลลูกค้า</h1>
                            <div className="border-b-2 border-main mb-3"></div>


                            <div className="space-y-3 ps-2 text-gray-800">
                                <LabelWithValue label="ผู้ติดต่อ(คนแรก)" value={`${mainContact?.name || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="ตำแหน่ง/หน้าที่" value={`${mainContact?.position || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="เบอร์โทรศัพท์" value={`${mainContact?.phone || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="เบอร์โทรศัพท์ (ต่อ)" value={`${mainContact?.phone_extension || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="อีเมล" value={`${mainContact?.email || "-"}`} classNameLabel="sm:w-1/2" />
                                {mainContact?.detail_social.map((social) => (
                                    <LabelWithValue label={`${social.social.name}`} value={`${social.detail || "-"}`} classNameLabel="sm:w-1/2" />

                                ))}
                                <LabelWithValue label="นิสัยของลูกค้า" value={`${characterMain?.character.character_name || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="บทบาทของลูกค้า" value={`${mainContact?.customer_role.name || "-"}`} classNameLabel="sm:w-1/2" />

                            </div>

                            <div className="mt-6">
                                <h1 className="text-xl font-semibold mb-1">บันทึกเพิ่มเติม</h1>
                                <div className="border-b-2 border-main mb-3"></div>
                                <p className="ps-2 text-blue-600">
                                    {dataCustomer?.note}
                                </p>
                            </div>

                        </div>

                        {/* รายละเอียดกิจการ */}
                        <div className="p-5">
                            <h1 className="text-xl font-semibold mb-1">รายละเอียดกิจการ</h1>
                            <div className="border-b-2 border-main mb-3"></div>
                            <div className="space-y-3 ps-2 text-gray-800">
                                <LabelWithValue label="ชื่อบริษัท" value={`${dataCustomer?.company_name || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="ประเภทบริษัท" value={`${dataCustomer?.type || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="ที่อยู่จดทะเบียน" value={`${dataCustomer?.address || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="เบอร์โทรศัพท์" value={`${dataCustomer?.phone || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="อีเมล" value={`${dataCustomer?.email || "-"}`} classNameLabel="sm:w-1/2" />
                                <LabelWithValue label="เลขประจำตัวผู้เสียภาษี" value={`${dataCustomer?.tax_id || "ไม่มีแท็ก"}`} classNameLabel="sm:w-1/2" />

                                <div className="flex mt-5">
                                    <label className="w-32">แท็กของลูกค้า</label>
                                    <div className="flex gap-2">
                                        {dataCustomer?.customer_tags.map((tag) => (
                                            <div>
                                                <TagCustomer nameTag={`${tag.group_tag.tag_name}`} color={`${tag.group_tag.color}`} />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <LabelWithValue label="ความสำคัญ" value={<RatingShow value={dataCustomer?.priority ?? 0} className="w-6 h-6" />} classNameLabel="sm:w-1/2" />
                            </div>

                        </div>

                    </div>


                </div>


                {/* ใบเสนอราคา */}
                <div className="lg:col-start-3 bg-white rounded-xl shadow-md">
                    <div className="flex flex-col p-5">
                        <label className="text-end">ติดตามใบเสนอราคา</label>
                        <h1 className="text-end font-semibold">THB {Number(dataFollowQuotation?.responseObject?.grandTotal).toLocaleString()}</h1>

                    </div>
                </div>

                {/* ยอดขายรวม */}
                <div className="lg:col-start-3 lg:row-start-2 bg-white rounded-xl shadow-md">
                    <div className="flex flex-col p-5">
                        <label className="text-end">ยอดขายรวม</label>
                        <h1 className="text-end font-semibold">THB {Number(dataFollowSaleTotal?.responseObject?.grandTotal).toLocaleString()}</h1>
                    </div>
                </div>

                {/* ผู้รับผิดชอบ */}
                <div className="lg:col-start-3 lg:row-start-3 bg-white rounded-xl shadow-md">
                    <div className="p-5">
                        <h1 className="text-xl font-semibold mb-1">ผู้รับผิดชอบ</h1>
                        <div className="border-b-2 border-main mb-3"></div>
                        <LabelWithValue label="ชื่อ" value={`${dataCustomer?.responsible.first_name || "-"} ${dataCustomer?.responsible.last_name || ""} `} classNameLabel="sm:w-1/2" />
                        <LabelWithValue label="ทีม" value={`${dataCustomer?.responsible.team_employee.name || "-"}`} classNameLabel="sm:w-1/2" />
                        <LabelWithValue label="โทร" value={`${dataCustomer?.resp_phone || "-"}`} classNameLabel="sm:w-1/2" />
                        <LabelWithValue label="อีเมล" value={`${dataCustomer?.resp_email || "-"}`} classNameLabel="sm:w-1/2" />
                    </div>


                </div>
                {/* รายชื่อผู้ติดต่อ ที่อยู่จัดส่ง */}
                <div className="lg:row-span-4 bg-white rounded-xl shadow-md h-[800px] overflow-auto">

                    <div className="mt-4 px-5 pt-2">
                        <div className="flex justify-between items-center border-b pb-1 mb-2">
                            <div className="flex flex-row space-x-5">
                                <button onClick={() => setActive('contact')}
                                    className={`font-semibold ${active === 'contact' ? 'text-main border-b-2 border-main' : 'text-blue-400'}`}
                                >
                                    <p>รายชื่อผู้ติดต่อ</p>
                                </button>

                                <button onClick={() => setActive('address')}
                                    className={`font-semibold ${active === 'address' ? 'text-main border-b-2 border-main' : 'text-blue-400'}`}
                                >
                                    <p>ที่อยู่จัดส่ง</p>
                                </button>
                            </div>
                            {active === "address" ? (

                                <Buttons btnType="primary" variant="outline" className="w-30"
                                    onClick={handleCreateAddressOpen}
                                >
                                    เพิ่มที่อยู่

                                </Buttons>
                            ) : (
                                <Buttons btnType="primary" variant="outline" className="w-30"
                                    onClick={handleCreateContactOpen}
                                >

                                    เพิ่มผู้ติดต่อ

                                </Buttons>
                            )}
                        </div>

                        {active === 'contact' && (
                            <div className="space-y-4">
                                <RadioGroup
                                    value={selectedMainContact}
                                    onValueChange={handleSelectMainContact}
                                >
                                    {(dataCustomer?.customer_contact || [])
                                        .sort((a, b) => (a.main ? -1 : 1))
                                        .map((contact) => (
                                            <div key={contact.customer_contact_id} className="bg-gray-100 p-3 rounded-lg space-y-2">

                                                <div className="flex justify-between items-center">
                                                    <h1>
                                                        {contact.name}
                                                        <span className="text-blue-500 text-xs"> {contact.position}</span>
                                                    </h1>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value={contact.customer_contact_id}
                                                            id={`main-${contact.customer_contact_id}`}
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        </RadioGroupItem>
                                                        <Label htmlFor={`main-${contact.customer_contact_id}`} className="text-sm text-blue-500">
                                                            ผู้ติดต่อหลัก
                                                        </Label>
                                                    </div>
                                                </div>
                                                <LabelWithValue label="เบอร์โทรศัพท์" value={contact.phone} classNameLabel="sm:w-1/2" />
                                                <LabelWithValue label="เบอร์โทรศัพท์ (ต่อ)" value={contact.phone_extension || "-"} classNameLabel="sm:w-1/2" />
                                                <LabelWithValue label="อีเมล" value={contact.email} classNameLabel="sm:w-1/2" />

                                                {contact.detail_social.map((social, index) => (
                                                    <LabelWithValue
                                                        key={index}
                                                        label={social.social.name}
                                                        value={social.detail}
                                                        classNameLabel="sm:w-1/2"
                                                    />
                                                ))}
                                                <div className="flex justify-end space-x-1">

                                                    <IconButton
                                                        variant="ghost"
                                                        aria-label="Edit"
                                                        onClick={() => handleEditContactOpen(contact.customer_contact_id)}
                                                    >
                                                        <LuPencil style={{ fontSize: "18px" }} />
                                                    </IconButton>
                                                    <IconButton
                                                        variant="ghost"
                                                        aria-label="Delete"
                                                        onClick={() => handleDeleteContactOpen(contact.customer_contact_id)}
                                                    >
                                                        <RiDeleteBin6Line
                                                            style={{ color: "red", fontSize: "18px" }}
                                                        />
                                                    </IconButton>

                                                </div>
                                            </div>
                                        ))}
                                </RadioGroup>
                            </div>
                        )}

                        {active === 'address' && (
                            <div className="space-y-4">
                                <RadioGroup
                                    value={selectedMainAddress}
                                    onValueChange={handleSelectMainAddress}
                                >
                                    {(dataCustomer?.customer_address || [])
                                        .sort((a, b) => (a.main_address ? -1 : 1))
                                        .map((address) => (
                                            <div key={address.address_id} className="bg-gray-100 p-3 rounded-lg space-y-2">
                                                <div className="flex justify-between">

                                                    <h1>{address.place_name}</h1>
                                                    <div className="flex items-center space-x-2">

                                                        <RadioGroupItem
                                                            value={address.address_id}
                                                            id={`main-${address.address_id}`}
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        </RadioGroupItem>
                                                        <Label htmlFor={`main-${address.address_id}`} className="text-sm text-blue-500">
                                                            ที่อยู่หลัก
                                                        </Label>
                                                    </div>

                                                </div>
                                                <LabelWithValue label="ประเทศ" value={`${address.country.country_name}`} classNameLabel="sm:w-1/2" />
                                                <LabelWithValue label="จังหวัด" value={`${address.province.province_name}`} classNameLabel="sm:w-1/2" />
                                                <LabelWithValue label="อำเภอ" value={`${address.district.district_name}`} classNameLabel="sm:w-1/2" />
                                                <LabelWithValue label="ที่อยู่" value={`${address.address}`} classNameLabel="sm:w-1/2" />

                                                <div className="flex justify-end space-x-1">

                                                    <IconButton
                                                        variant="ghost"
                                                        aria-label="Edit"
                                                        onClick={() => handleEditAddressOpen(address.address_id)}
                                                    >
                                                        <LuPencil style={{ fontSize: "18px" }} />
                                                    </IconButton>
                                                    <IconButton
                                                        variant="ghost"
                                                        aria-label="Delete"
                                                        onClick={() => handleDeleteAddressOpen(address.address_id)}
                                                    >
                                                        <RiDeleteBin6Line
                                                            style={{ color: "red", fontSize: "18px" }}
                                                        />
                                                    </IconButton>

                                                </div>


                                            </div>
                                        ))}

                                </RadioGroup>
                            </div>
                        )}

                    </div>

                </div>
                {/* ประวัติกิจกรรมของลูกค้า */}
                <div className="lg:col-span-2 lg:row-span-3 lg:row-start-5 bg-white rounded-xl shadow-md">
                    <MasterTableFeature
                        title=""
                        hideTitleBtn={true}
                        headers={headers}
                        rowData={data}
                        totalData={dataActitvities?.responseObject?.totalCount}
                        headerTab={true}
                        groupTabs={groupTabs}
                    />

                </div>
                {/* สร้างผู้ติดต่อใหม่ */}
                <DialogComponent
                    isOpen={isCreateContactOpen}
                    onClose={handleCreateContactClose}
                    title="เพิ่มผู้ติดต่อใหม่"
                    onConfirm={handleCreateContactConfirm}
                    confirmText="ยืนยัน"
                    cancelText="ยกเลิก"
                    confirmBtnType="primary"
                >
                    <div className="flex flex-col space-y-5">
                        <InputAction
                            id="first-contact"
                            placeholder=""
                            onChange={(e) => setFirstContact(e.target.value)}
                            value={firstContact}
                            label="ชื่อผู้ติดต่อ"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: `${contactOption ? contactOption?.toLowerCase() : "character"}`, down: "telno" }}
                            require="require"
                            isError={errorFields.firstContact}

                        />
                        <InputAction
                            id="telno"
                            placeholder=""
                            onChange={(e) => setTelNo(e.target.value)}
                            value={telNo}
                            label="เบอร์โทรศัพท์"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: "first-contact", down: "telno-extension" }}

                            require="require"
                            isError={errorFields.telNo}

                        />
                        <InputAction
                            id="telno-extension"
                            placeholder=""
                            onChange={(e) => setTelNoExtension(e.target.value)}
                            value={telNoExtension}
                            label="เบอร์โทรศัพท์ (ต่อ)"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            nextFields={{ up: "telno", down: "position" }}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                        />
                        <InputAction
                            id="position"
                            placeholder=""
                            onChange={(e) => setPosition(e.target.value)}
                            value={position}
                            label="ตำแหน่ง"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            nextFields={{ up: "telno-extension", down: "email" }}

                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                        />
                        <InputAction
                            id="email"
                            placeholder=""
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            label="อีเมล"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: "position", down: "role" }}
                            require="require"
                            isError={errorFields.email}

                        />
                        <MasterSelectComponent
                            id="role"
                            onChange={(option) => setRole(option ? String(option.value) : null)}
                            onInputChange={handleRoleSearch}
                            fetchDataFromGetAPI={fetchDataRoleDropdown}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="บทบาทลูกค้า"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            require="require"
                            nextFields={{ up: "email", down: "contact-option" }}
                            isError={errorFields.role}

                        />
                        <MasterSelectComponent
                            id="contact-option"
                            onChange={(option) => {
                                setContactOption(option ? String(option.value) : null);
                                setContactNameOption(option?.label ?? "");
                            }}
                            fetchDataFromGetAPI={fetchDataSocialDropdown}
                            onInputChange={handleSocialSearch}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="ช่องทางติดต่อ"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            nextFields={{ up: "role", down: `${contactOption ? contactOption?.toLowerCase() : "character"}` }}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full"
                        />
                        {contactOption && (

                            <InputAction
                                id={contactOption.toLowerCase()}
                                placeholder=""
                                onChange={(e) => setContactDetail(e.target.value)}
                                value={contactDetail}
                                label={contactNameOption}
                                labelOrientation="horizontal"
                                onAction={handleCreateContactConfirm}
                                nextFields={{ up: "contact-option", down: "character" }}
                                classNameLabel="w-40 min-w-20 flex "
                                classNameInput="w-full"
                            />

                        )}
                        <MasterSelectComponent
                            id="character"
                            onChange={(option) => setCharacter(option ? String(option.value) : null)}
                            fetchDataFromGetAPI={fetchDataCharacterDropdown}
                            onInputChange={handleCharacterSearch}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="นิสัยลูกค้า"
                            labelOrientation="horizontal"
                            onAction={handleCreateContactConfirm}
                            nextFields={{ up: `${contactOption ? contactOption?.toLowerCase() : "contact-option"}`, down: "first-contact" }}
                            classNameLabel="w-40 min-w-20 flex"
                            classNameSelect="w-full "
                        />
                    </div>
                </DialogComponent>

                {/* แก้ไขผู้ติดต่อ */}
                <DialogComponent
                    isOpen={isEditContactOpen}
                    onClose={handleEditContactClose}
                    title="แก้ไขผู้ติดต่อ"
                    onConfirm={handleEditContactConfirm}
                    confirmText="ยืนยัน"
                    cancelText="ยกเลิก"
                    confirmBtnType="primary"
                >
                    <div className="flex flex-col space-y-5">
                        <InputAction
                            id="first-contact"
                            placeholder=""
                            onChange={(e) => setFirstContact(e.target.value)}
                            value={firstContact}
                            label="ชื่อผู้ติดต่อ"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: `${contactOption ? contactOption?.toLowerCase() : "character"}`, down: "telno" }}
                            require="require"
                            isError={errorFields.editFirstContact}
                        />
                        <InputAction
                            id="telno"
                            placeholder=""
                            onChange={(e) => setTelNo(e.target.value)}
                            value={telNo}
                            label="เบอร์โทรศัพท์"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: "first-contact", down: "telno-extension" }}
                            require="require"
                            isError={errorFields.editTelNo}
                        />
                        <InputAction
                            id="telno-extension"
                            placeholder=""
                            onChange={(e) => setTelNoExtension(e.target.value)}
                            value={telNoExtension}
                            label="เบอร์โทรศัพท์ (ต่อ)"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            nextFields={{ up: "telno", down: "position" }}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"

                        />
                        <InputAction
                            id="position"
                            placeholder=""
                            onChange={(e) => setPosition(e.target.value)}
                            value={position}
                            label="ตำแหน่ง"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            nextFields={{ up: "telno-extension", down: "email" }}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                        />
                        <InputAction
                            id="email"
                            placeholder=""
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            label="อีเมล"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: "position", down: "role" }}
                            require="require"
                            isError={errorFields.editEmail}
                        />
                        <MasterSelectComponent
                            id="role"
                            onChange={(option) => setRole(option ? String(option.value) : null)}
                            onInputChange={handleRoleSearch}
                            fetchDataFromGetAPI={fetchDataRoleDropdown}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="บทบาทลูกค้า"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            defaultValue={{ label: roleName, value: role }}
                            nextFields={{ up: "email", down: "contact-option" }}
                            require="require"
                            isError={errorFields.editRole}
                        />
                        <MasterSelectComponent
                            id="contact-option"
                            onChange={(option) => {
                                setContactOption(option ? String(option.value) : null);
                                setContactNameOption(option?.label ?? "");
                            }}
                            fetchDataFromGetAPI={fetchDataSocialDropdown}
                            onInputChange={handleSocialSearch}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="ช่องทางติดต่อ"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            nextFields={{ up: "role", down: `${contactOption ? contactOption?.toLowerCase() : "character"}` }}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full"
                            defaultValue={{ label: contactNameOption, value: contactOption }}
                        />
                        {contactOption && (

                            <InputAction
                                id={contactOption.toLowerCase()}
                                placeholder=""
                                onChange={(e) => setContactDetail(e.target.value)}
                                value={contactDetail}
                                label={contactNameOption}
                                labelOrientation="horizontal"
                                onAction={handleEditContactConfirm}
                                nextFields={{ up: "contact-option", down: "character" }}
                                classNameLabel="w-40 min-w-20 flex "
                                classNameInput="w-full"
                            />

                        )}
                        <MasterSelectComponent
                            id="character"
                            onChange={(option) => setCharacter(option ? String(option.value) : null)}
                            fetchDataFromGetAPI={fetchDataCharacterDropdown}
                            onInputChange={handleCharacterSearch}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="นิสัยลูกค้า"
                            labelOrientation="horizontal"
                            onAction={handleEditContactConfirm}
                            nextFields={{ up: `${contactOption ? contactOption?.toLowerCase() : "contact-option"}`, down: "first-contact" }}
                            classNameLabel="w-40 min-w-20 flex"
                            classNameSelect="w-full "
                            defaultValue={{ label: characterName, value: character }}
                        />
                    </div>
                </DialogComponent>

                {/* สร้างที่อยู่ใหม่ */}
                <DialogComponent
                    isOpen={isCreateAddressOpen}
                    onClose={handleCreateAddressClose}
                    title="เพิ่มที่อยู่ใหม่"
                    onConfirm={handleCreateAddressConfirm}
                    confirmText="ยืนยัน"
                    cancelText="ยกเลิก"
                    confirmBtnType="primary"
                >
                    <div className="flex flex-col space-y-5">
                        <InputAction
                            id="placename"
                            placeholder=""
                            onChange={(e) => setPlaceName(e.target.value)}
                            value={placename}
                            label="ชื่อสถานที่"
                            labelOrientation="horizontal"
                            onAction={handleCreateAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex  "
                            classNameInput="w-full"
                            nextFields={{ up: "district", down: "address" }}
                            require="require"
                            isError={errorFields.placename}
                        />
                        <TextArea
                            id="address"
                            placeholder=""
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            label="ที่อยู่"
                            labelOrientation="horizontal"
                            onAction={handleCreateAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: "placename", down: "country" }}
                            require="require"
                            isError={errorFields.address}
                        />
                        <DependentSelectComponent
                            id="country"
                            value={countryOptions.find((opt) => opt.value === country) || null}
                            onChange={(option) => setCountry(option ? String(option.value) : null)}
                            onInputChange={handleAddressSearch}
                            fetchDataFromGetAPI={fetchDataCountry}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="ประเทศ"
                            labelOrientation="horizontal"
                            onAction={handleCreateAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            nextFields={{up: "address", down: "province" }}
                            require="require"
                            isError={errorFields.country}
                        />
                        <DependentSelectComponent
                            id="province"
                            value={provinceOptions.find((opt) => opt.value === province) || null}
                            onChange={(option) => setProvince(option ? String(option.value) : null)}
                            fetchDataFromGetAPI={fetchDataProvince}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="จังหวัด"
                            labelOrientation="horizontal"
                            onAction={handleCreateAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            nextFields={{up: "country", down: "district" }}
                            require="require"
                            isError={errorFields.province}
                        />
                        <DependentSelectComponent
                            id="district"
                            value={districtOptions.find((opt) => opt.value === district) || null}
                            onChange={(option) => setDistrict(option ? String(option.value) : null)}
                            onInputChange={handleAddressSearch}
                            fetchDataFromGetAPI={fetchDataDistrict}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="อำเภอ"
                            labelOrientation="horizontal"
                            onAction={handleCreateAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            nextFields={{ up: "province", down: "placename" }}
                            require="require"
                            isError={errorFields.district}
                        />
                    </div>
                </DialogComponent>

                {/* แก้ไขที่อยู่ */}
                <DialogComponent
                    isOpen={isEditAddressOpen}
                    onClose={handleEditAddressClose}
                    title="แก้ไขที่อยู่"
                    onConfirm={handleEditAddressConfirm}
                    confirmText="ยืนยัน"
                    cancelText="ยกเลิก"
                    confirmBtnType="primary"
                >
                    <div className="flex flex-col space-y-5">
                        <InputAction
                            id="placename"
                            placeholder=""
                            onChange={(e) => setPlaceName(e.target.value)}
                            value={placename}
                            label="ชื่อสถานที่"
                            labelOrientation="horizontal"
                            onAction={handleEditAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex"
                            classNameInput="w-full"
                            nextFields={{ up: "district", down: "address" }}
                            require="require"
                            isError={errorFields.editPlaceName}
                        />
                        <TextArea
                            id="address"
                            placeholder=""
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            label="ที่อยู่"
                            labelOrientation="horizontal"
                            onAction={handleEditAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameInput="w-full"
                            nextFields={{ up: "placename", down: "country" }}
                            require="require"
                            isError={errorFields.editAddress}
                        />
                        <DependentSelectComponent
                            id="country"
                            value={countryOptions.find((opt) => opt.value === country) || null}
                            onChange={(option) => setCountry(option ? String(option.value) : null)}
                            onInputChange={handleAddressSearch}
                            fetchDataFromGetAPI={fetchDataCountry}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="ประเทศ"
                            labelOrientation="horizontal"
                            onAction={handleEditAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            nextFields={{up: "address", down: "province" }}
                            require="require"
                            isError={errorFields.editCountry}
                        />
                        <DependentSelectComponent
                            id="province"
                            value={provinceOptions.find((opt) => opt.value === province) || null}
                            onChange={(option) => setProvince(option ? String(option.value) : null)}
                            fetchDataFromGetAPI={fetchDataProvince}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="จังหวัด"
                            labelOrientation="horizontal"
                            onAction={handleEditAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            nextFields={{up: "country", down: "district" }}
                            require="require"
                            isError={errorFields.editProvince}
                        />
                        <DependentSelectComponent
                            id="district"
                            value={districtOptions.find((opt) => opt.value === district) || null}
                            onChange={(option) => setDistrict(option ? String(option.value) : null)}
                            onInputChange={handleAddressSearch}
                            fetchDataFromGetAPI={fetchDataDistrict}
                            valueKey="id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="อำเภอ"
                            labelOrientation="horizontal"
                            onAction={handleEditAddressConfirm}
                            classNameLabel="w-40 min-w-20 flex "
                            classNameSelect="w-full "
                            nextFields={{ up: "province", down: "placename" }}
                            require="require"
                            isError={errorFields.editDistrict}
                        />
                    </div>
                </DialogComponent>

                {/* ลบผู้ติดต่อ */}
                <DialogComponent
                    isOpen={isDeleteContactOpen}
                    onClose={handleDeleteContactClose}
                    title="ยืนยันการลบผู้ติดต่อ"
                    onConfirm={handleDeleteContactConfirm}
                    confirmText="ยืนยัน"
                    cancelText="ยกเลิก"
                >
                    <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบผู้ติดต่อนี้?</p>
                    <p>ชื่อ : <span className="text-red-500">{selectedContactItem?.name}</span></p>
                </DialogComponent>

                {/* ลบที่อยู่ใหม่ */}
                <DialogComponent
                    isOpen={isDeleteAddressOpen}
                    onClose={handleDeleteAddressClose}
                    title="ยืนยันการลบที่อยู่"
                    onConfirm={handleDeleteAddressConfirm}
                    confirmText="ยืนยัน"
                    cancelText="ยกเลิก"
                >
                    <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?</p>
                    <p>ชื่อ : <span className="text-red-500">{selectedAddressItem?.place_name}</span></p>
                </DialogComponent>

            </div>





        </>

    );
}
