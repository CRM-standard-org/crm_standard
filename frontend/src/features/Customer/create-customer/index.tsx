import { useCallback, useEffect, useState } from "react";


import MasterSelectComponent from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";

//
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import TagSelectComponent from "@/components/customs/tagCustomer/tagselect.main.component";
import { OptionColorType } from "@/components/customs/tagCustomer/tagselect.main.component";

//Customer Role
import { useSelectCustomerRole } from "@/hooks/useCustomerRole";
import { TypeCustomerRoleResponse } from "@/types/response/response.customerRole";

//Character 
import { useSelectCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";
import Rating from "@/components/customs/rating/rating.main.component";

import { useSocial } from "@/hooks/useSocial";
import { TypeSocialResponse } from "@/types/response/response.social";
import { useAddress } from "@/hooks/useAddress";
import { TypeAddressResponse } from "@/types/response/response.address";
import { postCustomer } from "@/services/customer.service";
import { useTeam } from "@/hooks/useTeam";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { OptionType } from "@/components/customs/select/select.main.component";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import { useSelectResponsible } from "@/hooks/useEmployee";


//
export default function CreateCustomer() {

    // variable form create customer 
    const [firstContact, setFirstContact] = useState("");
    const [position, setPosition] = useState("");
    const [character, setCharacter] = useState<string | null>(null);
    const [telNo, setTelNo] = useState("");
    const [telNoExtension, setTelNoExtension] = useState("");
    const [email, setEmail] = useState("");
    const [contactNameOption, setContactNameOption] = useState("");
    const [contactOption, setContactOption] = useState<string | null>(null);
    const [contactDetail, setContactDetail] = useState("");
    const [priority, setPriority] = useState<number>(0);

    const [company, setCompany] = useState("");
    const [typeCompany, setTypeCompany] = useState("");
    const [companyPlaceName, setCompanyPlaceName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    const [companyCountry, setCompanyCountry] = useState<string | null>(null);
    const [comCountryOptions, setComCountryOptions] = useState<OptionType[]>([]);

    const [companyProvince, setCompanyProvince] = useState<string | null>(null);
    const [comProvinceOptions, setComProvinceOptions] = useState<OptionType[]>([]);

    const [companyDistrict, setCompanyDistrict] = useState<string | null>(null);
    const [comDistrictOptions, setComDistrictOptions] = useState<OptionType[]>([]);

    const [telNoCompany, setTelNoCompany] = useState("");
    const [selectedTags, setSelectedTags] = useState<OptionColorType[]>([]);
    const [role, setRole] = useState<string | null>(null);
    const [emailCompany, setEmailCompany] = useState("");
    const [taxId, setTaxId] = useState("");
    const [companyValue, setCompanyValue] = useState("");
    const [note, setNote] = useState("");

    const [placeName, setPlaceName] = useState("");
    const [address, setAddress] = useState("");

    const [country, setCountry] = useState<string | null>(null);
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);

    const [province, setProvince] = useState<string | null>(null);
    const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);

    const [district, setDistrict] = useState<string | null>(null);
    const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);

    const [team, setTeam] = useState<string | null>(null);
    const [teamOptions, setTeamOptions] = useState<OptionType[]>([]);
    const [responsible, setResponsible] = useState<string | null>(null);
    const [responsibleOptions, setResponsibleOptions] = useState<OptionType[]>([]);
    const [responsibleRawData, setResponsibleRawData] = useState<any[]>([]);

    const [telNoResponsible, setTelNoResponsible] = useState("");
    const [emailResponsible, setEmailResponsible] = useState("");


    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});


    // const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();
    const { showToast } = useToast();
    //
    const navigate = useNavigate();

    //searchText control
    const [searchCharacter, setSearchCharacter] = useState("");
    const [searchSocial, setSearchSocial] = useState("");
    const [searchTag, setSearchTag] = useState("");
    const [searchRole, setSearchRole] = useState("");

    const [searchAddress, setSearchAddress] = useState("");
    const [searchTeam, setSearchTeam] = useState("");
    const [searchEmployee, setSearchEmployee] = useState("");

    //fetch tag
    const { data: dataTag, refetch: refetchTag } = useSelectTag({
        searchText: searchTag
    })
    const fetchDataTagDropdown = async () => {
        const tagList = dataTag?.responseObject.data ?? [];
        return {
            responseObject: tagList.map((item: TypeTagColorResponse) => ({
                id: item.tag_id,
                name: item.tag_name,
                color: item.color
            }))
        }
    }

    const handleTagSearch = (searchText: string) => {
        setSearchTag(searchText);
        refetchTag();
    };
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



    // สำหรับ Company Address

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setComCountryOptions([]);

        const { options } = useResponseToOptions(dataAddress, "country_id", "country_name");
        setComCountryOptions(options);
    }, [dataAddress]);

    const fetchDataCountryCompany = useCallback(async () => {
        const countryList = dataAddress ?? [];
        return {
            responseObject: countryList.map(item => ({
                id: item.country_id,
                name: item.country_name,
            })),
        };
    }, [dataAddress]);

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setComProvinceOptions([]);

        const selectedCountry = dataAddress.find((item) => item.country_id === companyCountry);
        if (!selectedCountry?.province) return setComProvinceOptions([]);

        const { options } = useResponseToOptions(selectedCountry.province, "province_id", "province_name");
        setComProvinceOptions(options);
    }, [dataAddress, companyCountry]);

    const fetchDataProvinceCompany = useCallback(async () => {
        const selectedCountry = dataAddress?.find((item) => item.country_id === companyCountry);
        const provinceList = selectedCountry?.province ?? [];
        return {
            responseObject: provinceList.map(item => ({
                id: item.province_id,
                name: item.province_name,
            })),
        };
    }, [dataAddress, companyCountry]);

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setComDistrictOptions([]);

        const selectedCountry = dataAddress.find((item) => item.country_id === companyCountry);
        const selectedProvince = selectedCountry?.province?.find((item) => item.province_id === companyProvince);
        if (!selectedProvince?.district) return setComDistrictOptions([]);

        const { options } = useResponseToOptions(selectedProvince.district, "district_id", "district_name");
        setComDistrictOptions(options);
    }, [dataAddress, companyCountry, companyProvince]);

    const fetchDataDistrictCompany = useCallback(async () => {
        const selectedCountry = dataAddress?.find((item) => item.country_id === companyCountry);
        const selectedProvince = selectedCountry?.province?.find((item) => item.province_id === companyProvince);
        const districtList = selectedProvince?.district ?? [];
        return {
            responseObject: districtList.map(item => ({
                id: item.district_id,
                name: item.district_name,
            })),
        };
    }, [dataAddress, companyCountry, companyProvince]);



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

    //fetch team 

    const { data: dataTeam, refetch: refetchTeam } = useTeam({
        page: "1",
        pageSize: "100",
        searchText: searchTeam,
    });

    useEffect(() => {
        if (dataTeam?.responseObject?.data) {
            const teamList = dataTeam.responseObject.data;
            const { options } = useResponseToOptions(teamList, "team_id", "name");
            setTeamOptions(options);
        }
    }, [dataTeam]);

    const fetchDataTeamDropdown = useCallback(async () => {
        const teamList = dataTeam?.responseObject.data ?? [];
        return {
            responseObject: teamList.map(item => ({
                id: item.team_id,
                name: item.name,
            })),
        };
    }, [dataTeam]);

    const handleTeamSearch = (searchText: string) => {
        setSearchTeam(searchText);
        refetchTeam();
    };

    //fetch Member in team 
    const { data: dataTeamMember, refetch: refetchTeamMember } = useSelectResponsible({
        team_id: team ?? "",
        searchText: searchEmployee,
    });

    useEffect(() => {
        // reset ค่าเมื่อ team เปลี่ยน
        setResponsible(null);
        setResponsibleOptions([]);
        setResponsibleRawData([]);
        if (dataTeamMember?.responseObject?.data) {
            const member = dataTeamMember.responseObject.data;
            const { options } = useResponseToOptions(
                member,
                "employee_id",
                (item) => `${item.first_name} ${item.last_name || ""}`
            );
            setResponsibleOptions(options);
            setResponsibleRawData(member);
        }
    }, [team, dataTeamMember]);

    const fetchDataMemberInteam = useCallback(async () => {
        const member = dataTeamMember?.responseObject?.data ?? [];
        return {
            responseObject: member.map(item => ({
                id: item.employee_id,
                name: `${item.first_name} ${item.last_name || ""}`,
            })),
        };
    }, [dataTeamMember]);

    const handleEmployeeSearch = (searchText: string) => {
        setSearchEmployee(searchText);
        refetchTeamMember();
    };

    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {

        const tagIds = selectedTags.map((tag) => String(tag.value));

        const errorMap: Record<string, boolean> = {};

        if (!firstContact) errorMap.firstContact = true;
        if (!telNo) errorMap.telNo = true;
        if (!email) errorMap.email = true;
        if (!tagIds || tagIds.length === 0) errorMap.tagIds = true;
        if (!role) errorMap.role = true;
        if (!company) errorMap.company = true;
        if (!priority) errorMap.priority = true;
        if (!taxId) errorMap.taxId = true;
        if (!placeName) errorMap.placeName = true;
        if (!address) errorMap.address = true;
        if (!country) errorMap.country = true;
        if (!province || provinceOptions.length === 0) { errorMap.province = true; }
        if (!district || districtOptions.length === 0) { errorMap.district = true; }
        if (!responsible || responsibleOptions.length === 0) { errorMap.responsible = true; }
        if (!team) errorMap.team = true;
        if (!telNoResponsible) errorMap.telNoResponsible = true;
        if (!emailResponsible) errorMap.emailResponsible = true;

        setErrorFields(errorMap);

        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }
        const missingFields: string[] = [];


        if (!priority) missingFields.push("ระดับความสำคัญ");


        if (missingFields.length > 0) {
            showToast(`กรุณากรอกข้อมูลให้ครบ: ${missingFields.join(" , ")}`, false);
            return;
        }
        
        try {
            const response = await postCustomer({
                company_name: company, // ใช้ชื่อ field ที่ตรงกับ type
                type: typeCompany,
                company_email: emailCompany,
                company_phone: telNoCompany,
                tax_id: taxId,
                note: note,
                priority: priority,
                place_name: companyPlaceName,
                address: companyAddress,
                country_id: companyCountry ?? "",
                province_id: companyProvince ?? "",
                district_id: companyDistrict ?? "",
                tag_id: tagIds,
                customer_name: firstContact,
                customer_email: email,
                customer_phone: telNo,
                customer_phone_extension: telNoExtension,
                position: position,
                customer_role_id: role ?? "",
                character_id: character ?? "",
                detail: contactDetail,
                social_id: contactOption ?? "",
                customer_place_name: placeName,
                customer_address: address,
                customer_country_id: country ?? "",
                customer_province_id: province ?? "",
                customer_district_id: district ?? "",
                employee_id: responsible ?? "",
                team_id: team ?? "",
                emp_phone: telNoResponsible,
                emp_email: emailResponsible,
            });

            if (response.statusCode === 200) {
                showToast("สร้างลูกค้าเรียบร้อยแล้ว", true);
                setCompany("");
                setTypeCompany("");
                setEmailCompany("");
                setTelNoCompany("");
                setTaxId("");
                setNote("");
                setPriority(0);
                setCompanyPlaceName("");
                setCompanyAddress("");
                setCompanyCountry("");
                setCompanyProvince("");
                setCompanyDistrict("");
                setSelectedTags([]);
                setFirstContact("");
                setEmail("");
                setTelNo("");
                setPosition("");
                setRole("");
                setCharacter("");
                setContactDetail("");
                setContactOption("");
                setPlaceName("");
                setAddress("");
                setCountry("");
                setProvince("");
                setDistrict("");
                setResponsible("");
                setTelNoResponsible("");
                setEmailResponsible("");
                navigate('/manage-customer')

            } else {
                showToast("ลูกค้าท่านนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างลูกค้าได้", false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-3">เพิ่มลูกค้าใหม่</h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลลูกค้า */}
                    <h1 className="text-xl font-semibold mb-1">ข้อมูลลูกค้า</h1>
                    <div className="border-b-2 border-main mb-6"></div>


                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">
                            <InputAction
                                id="contact-person"
                                placeholder=""
                                onChange={(e) => setFirstContact(e.target.value)}
                                value={firstContact}
                                label="ชื่อ - ผู้ติดต่อ (คนแรก)"
                                labelOrientation="horizontal" // vertical mobile screen
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 whitespace-nowrap"
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: "responsible-email", down: "character" }}
                                isError={errorFields.firstContact}
                            />
                        </div>
                        <div className="">
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
                                classNameLabel="w-1/2"
                                classNameSelect="w-full "
                                nextFields={{ up: "contact-person", down: "position" }}

                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="position"
                                placeholder=""
                                onChange={(e) => setPosition(e.target.value)}
                                value={position}
                                label="ตำแหน่ง/หน้าที่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "character", down: "role" }}
                                isError={errorFields.position}
                            />
                        </div>

                        <div className="">
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
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                require="require"
                                nextFields={{ up: "position", down: "tel-no" }}
                                isError={errorFields.role}
                            />
                        </div>

                        <div className="">
                            <InputAction
                                id="tel-no"
                                placeholder=""
                                onChange={(e) => setTelNo(e.target.value)}
                                value={telNo}
                                label="เบอร์โทรศัพท์"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 "
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: "role", down: "email" }}
                                maxLength={10}
                                isError={errorFields.telNo}
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="email"
                                placeholder=""
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                label="อีเมล"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 "
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: "tel-no", down: "telno-extension" }}
                                isError={errorFields.email}
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="telno-extension"
                                placeholder=""
                                onChange={(e) => setTelNoExtension(e.target.value)}
                                value={telNoExtension}
                                label="เบอร์โทรศัพท์ (ต่อ)"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 "
                                classNameInput="w-full"
                                nextFields={{ up: "email", down: "contact-option" }}
                                maxLength={10}
                            />
                        </div>
                        <div className="">
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
                                label="ช่องทางการติดต่อ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2"
                                classNameSelect="w-full"
                                nextFields={{ up: "telno-extension", down: `${contactOption ? contactOption?.toLowerCase() : "company"}` }}
                            />

                        </div>

                        {contactOption && (
                            <>
                                <div></div>
                                <div className="">
                                    <InputAction
                                        id={contactOption.toLowerCase()}
                                        placeholder=""
                                        onChange={(e) => setContactDetail(e.target.value)}
                                        value={contactDetail}
                                        label={contactNameOption}
                                        labelOrientation="horizontal"
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        nextFields={{ up: "contact-option", down: "company" }}

                                    />
                                </div>
                            </>
                        )}

                    </div>

                    {/* รายละเอียดกิจการ */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดกิจการ</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">

                            <InputAction
                                id="company"
                                placeholder=""
                                onChange={(e) => setCompany(e.target.value)}
                                value={company}
                                label="ลูกค้า"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 "
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: `${contactOption ? contactOption?.toLowerCase() : "contact-option"}`, down: "type-company" }}
                                isError={errorFields.company}
                            />
                        </div>
                        <div className="flex flex-row space-x-4 pb-2 pt-2">
                            <label className="whitespace-nowrap">ความสำคัญ<span style={{ color: "red" }}>*</span></label>
                            <Rating value={priority} onChange={setPriority} />
                        </div>
                        <div className="">

                            <InputAction
                                id="type-company"
                                placeholder=""
                                onChange={(e) => setTypeCompany(e.target.value)}
                                value={typeCompany}
                                label="ประเภทบริษัท"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "company", down: "customer-tag" }}

                            />
                        </div>
                        <div className="">

                            <TagSelectComponent
                                id="customer-tag"
                                onChange={(selected) => {
                                    setSelectedTags(selected as OptionColorType[]);
                                }}
                                defaultValue={selectedTags}
                                fetchDataFromGetAPI={fetchDataTagDropdown}
                                onInputChange={handleTagSearch}
                                isClearable
                                label="แท็กของลูกค้า"
                                placeholder="กรุณาเลือกแท็ก"
                                classNameLabel="w-1/2"
                                classNameSelect="w-full"
                                require="require"
                                nextFields={{ up: "type-company", down: "company-placename" }}
                                isError={errorFields.tagIds}
                            />

                        </div>
                        <div className="">

                            <InputAction
                                id="company-placename"
                                placeholder=""
                                onChange={(e) => setCompanyPlaceName(e.target.value)}
                                value={companyPlaceName}
                                label="ชื่อสถานที่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "customer-tag", down: "company-telno" }}
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="company-telno"
                                placeholder=""
                                onChange={(e) => setTelNoCompany(e.target.value)}
                                value={telNoCompany}
                                label="เบอร์โทรศัพท์"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "company-placename", down: "company-address" }}
                                maxLength={10}
                            />
                        </div>
                        <div className="">

                            <TextArea
                                id="company-address"
                                placeholder=""
                                onChange={(e) => setCompanyAddress(e.target.value)}
                                value={companyAddress}
                                label="ที่อยู่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "company-telno", down: "company-email" }}
                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="company-email"
                                placeholder=""
                                onChange={(e) => setEmailCompany(e.target.value)}
                                value={emailCompany}
                                label="อีเมล"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "company-address", down: "company-country" }}

                            />
                        </div>
                        <div className="">
                            <DependentSelectComponent
                                id="company-country"
                                value={comCountryOptions.find((opt) => opt.value === companyCountry) || null}
                                onChange={(option) => setCompanyCountry(option ? String(option.value) : null)}
                                onInputChange={handleAddressSearch}
                                fetchDataFromGetAPI={fetchDataCountryCompany}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ประเทศ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "company-email", down: "identify-no" }}

                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="identify-no"
                                placeholder=""
                                onChange={(e) => setTaxId(e.target.value)}
                                value={taxId}
                                label="เลขประจำตัวผู้เสียภาษี"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 whitespace-nowrap"
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: "company-country", down: "company-province" }}
                                isError={errorFields.taxId}
                            />
                        </div>
                        <div className="">
                            <DependentSelectComponent
                                id="company-province"
                                value={comProvinceOptions.find((opt) => opt.value === companyProvince) || null}
                                onChange={(option) => setCompanyProvince(option ? String(option.value) : null)}
                                onInputChange={handleAddressSearch}
                                fetchDataFromGetAPI={fetchDataProvinceCompany}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="จังหวัด"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "identify-no", down: "company-value" }}

                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="company-value"
                                placeholder=""
                                onChange={(e) => setCompanyValue(e.target.value)}
                                value={companyValue}
                                label="มูลค่าบริษัท"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "company-province", down: "company-district" }}

                            />
                        </div>
                        <div className="">
                            <DependentSelectComponent
                                id="company-district"
                                value={comDistrictOptions.find((opt) => opt.value === companyDistrict) || null}
                                onChange={(option) => setCompanyDistrict(option ? String(option.value) : null)}
                                onInputChange={handleAddressSearch}
                                fetchDataFromGetAPI={fetchDataDistrictCompany}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="อำเภอ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "company-value", down: "note" }}

                            />
                        </div>
                        <div className="">

                            <TextArea
                                id="note"
                                placeholder=""
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                                label="บันทึกเพิ่มเติม"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                onMicrophone={true}
                                nextFields={{ up: "company-district", down: "placename" }}

                            />
                        </div>



                    </div>

                    {/* รายละเอียดที่อยู่จัดส่ง */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดที่อยู่จัดส่ง</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="">

                            <InputAction
                                id="placename"
                                placeholder=""
                                onChange={(e) => setPlaceName(e.target.value)}
                                value={placeName}
                                label="ชื่อสถานที่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "note", down: "address" }}
                                require="require"
                                isError={errorFields.placeName}
                            />
                        </div>
                        <div className="">

                            <TextArea
                                id="address"
                                placeholder=""
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                                label="ที่อยู่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "placename", down: "country" }}
                                require="require"
                                isError={errorFields.address}
                            />
                        </div>


                        <div className="">
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
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "address", down: "district" }}
                                require="require"
                                isError={errorFields.country}
                            />
                        </div>
                        <div className="">
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
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "country", down: "province" }}
                                require="require"
                                isError={errorFields.district}
                            />
                        </div>
                        <div className="">
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
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "district", down: "team" }}
                                require="require"
                                isError={errorFields.province}
                            />
                        </div>
                    </div>

                    {/* ข้อมูลผู้รับผิดชอบ */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">ข้อมูลผู้รับผิดชอบ</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        <div className="">
                            <DependentSelectComponent
                                id="team"
                                value={teamOptions.find((opt) => opt.value === team) || null}
                                onChange={(option) => setTeam(option ? String(option.value) : null)}
                                onInputChange={handleTeamSearch}
                                fetchDataFromGetAPI={fetchDataTeamDropdown}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ทีม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "province", down: "responsible-telno" }}
                                require="require"
                                isError={errorFields.team}
                            />

                        </div>
                        <div className="">

                            <InputAction
                                id="responsible-telno"
                                placeholder=""
                                onChange={(e) => setTelNoResponsible(e.target.value)}
                                value={telNoResponsible}
                                label="เบอร์โทรศัพท์"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "team", down: "responsible" }}
                                require="require"
                                maxLength={10}
                                isError={errorFields.telNoResponsible}
                            />
                        </div>
                        <div className="">

                            <DependentSelectComponent
                                id="responsible"
                                value={responsibleOptions.find((opt) => opt.value === responsible) || null}
                                onChange={(option) => {
                                    const selectedId = option ? String(option.value) : null;
                                    setResponsible(selectedId);

                                    const selectedData = responsibleRawData.find(emp => emp.employee_id === selectedId);
                                    setTelNoResponsible(selectedData?.phone ?? null);
                                    setEmailResponsible(selectedData?.email ?? null);
                                }}
                                onInputChange={handleEmployeeSearch}
                                fetchDataFromGetAPI={fetchDataMemberInteam}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ผู้รับผิดชอบ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "responsible-telno", down: "responsible-email" }}
                                require="require"
                                isError={errorFields.responsible}
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="responsible-email"
                                placeholder=""
                                onChange={(e) => setEmailResponsible(e.target.value)}
                                value={emailResponsible}
                                label="อีเมล"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2  "
                                classNameInput="w-full"
                                nextFields={{ up: "responsible", down: "email" }}
                                require="require"
                                isError={errorFields.emailResponsible}
                            />
                        </div>
                    </div>
                </div>

            </div >
            <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                    onClick={handleConfirm}
                >
                    เพิ่มลูกค้าใหม่
                </Buttons>
                <Link to="/manage-customer">
                    <Buttons
                        btnType="cancel"
                        variant="soft"
                        className="w-30 "
                    >
                        ยกเลิก
                    </Buttons>
                </Link>

            </div>
        </>

    );
}
