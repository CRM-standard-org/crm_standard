import { useCallback, useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import TextAreaForm from "@/components/customs/textAreas/textAreaForm";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {

    postColor,
    updateColor,
    deleteColor,
} from "@/services/color.service";
import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import TagSelectComponent from "@/components/customs/tagCustomer/tagselect.main.component";
import { OptionColorType } from "@/components/customs/tagCustomer/tagselect.main.component";

//Customer Role
import { useCustomerRole } from "@/hooks/useCustomerRole";
import { TypeRoleResponse } from "@/types/response/response.customerRole";

//Character 
import { useCustomerCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";
import Rating from "@/components/customs/rating/rating.main.component";
import { setPriority } from "os";
import { TypeAddressResponse } from "@/types/response/response.address";
import { useSocial } from "@/hooks/useSocial";
import { useTeam } from "@/hooks/useTeam";
import { TypeSocialResponse } from "@/types/response/response.social";
import { useAddress } from "@/hooks/useAddress";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { LuPencil } from "react-icons/lu";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import DependentSelectComponent from "@/components/customs/select/select.dependent";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function CreateEmployee() {
    const [searchText, setSearchText] = useState("");

    // variable form edit employee 
    const [employeeCode, setEmployeeCode] = useState("");
    const [position, setPosition] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [contactNameOption, setContactNameOption] = useState("");
    const [contactOption, setContactOption] = useState<string | null>(null);
    const [contactDetail, setContactDetail] = useState("");
    const [salary, setSalary] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [team, setTeam] = useState<string | null>(null);

    const [employeeStatus, setEmployeeStatus] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);

    const [province, setProvince] = useState<string | null>(null);
    const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);

    const [district, setDistrict] = useState<string | null>(null);
    const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);
    const [telNo, setTelno] = useState("");

    const [note, setNote] = useState("");

    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);


    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();



    const [filterGroup, setFilterGroup] = useState<string | null>(null);
    //searchText control

    const [searchSocial, setSearchSocial] = useState("");
    const [searchTeam, setSearchTeam] = useState("");
    const [searchAddress, setSearchAddress] = useState("");




    const roleCustomer = async () => {
        return {
            responseObject: [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
                { id: 4, name: "D" },
            ],
        };
    };

    const dataProvince = async () => {
        return {
            responseObject: [
                { id: 1, name: "กรุงเทพ" },
                { id: 2, name: "นนทบุรี" },
                { id: 3, name: "ปทุมธานี" },
                { id: 4, name: "ชุมพร" },
            ],
        };
    };

    const dataDistrict = async () => {
        return {
            responseObject: [
                { id: 1, name: "ปากเกร็ด" },
                { id: 2, name: "บางใหญ่" },
                { id: 3, name: "พระนคร" },
                { id: 4, name: "เมือง" },
            ],
        };
    };

    const contactLabels: Record<string, string> = {
        Line: "LINE",
        Instragram: "Instragram",
        Facebook: "Facebook",
        Tiktok: "Tiktok",
    };

    const listContact = async () => {
        return {
            responseObject: [
                { id: 1, name: "Line" },
                { id: 2, name: "Instragram" },
                { id: 3, name: "Facebook" },
                { id: 4, name: "Tiktok" },
            ],
        };
    };

    //fetch team 

    const { data: dataTeam, refetch: refetchTeam } = useTeam({
        page: "1",
        pageSize: "100",
        searchText: searchTeam,
    });



    const fetchDataTeamDropdown = async () => {
        const teamList = dataTeam?.responseObject.data ?? [];
        return {
            responseObject: teamList.map(item => ({
                id: item.team_id,
                name: item.name,
            })),
        };
    }

    const handleTeamSearch = (searchText: string) => {
        setSearchTeam(searchText);
        refetchTeam();
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

    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {

    };


    return (
        <>
            <h1 className="text-2xl font-bold mb-3">เพิ่มพนักงาน</h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลพนักงาน */}
                    <h1 className="text-xl font-semibold">ข้อมูลพนักงาน</h1>

                    <div className="border-b-2 border-main mb-6"></div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">
                            <InputAction
                                id="employee-code"
                                placeholder=""
                                onChange={(e) => setEmployeeCode(e.target.value)}
                                value={employeeCode}
                                label="รหัสพนักงาน"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: `${contactOption ? contactOption?.toLowerCase() : "note"}`, down: "start-date" }}
                                require="require"
                            />
                        </div>
                        <div className="">
                            <DatePickerComponent
                                id="start-date"
                                label="วันเริ่มทำงาน"
                                placeholder="dd/mm/yy"
                                selectedDate={startDate}
                                onChange={(date) => setStartDate(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "employee-code", down: "name" }}
                                required
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="name"
                                placeholder=""
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                label="ชื่อ-นามสกุล"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                                nextFields={{ up: "start-date", down: "employee-status" }}
                                require="require"
                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                id="employee-status"
                                onChange={(option) => setEmployeeStatus(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={listContact}
                                valueKey="id"
                                labelKey="name"
                                placeholder="พนักงานประจำ"
                                isClearable
                                label="สถานะ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                nextFields={{ up: "name", down: "position" }}
                                require="require"
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="position"
                                placeholder=""
                                onChange={(e) => setPosition(e.target.value)}
                                value={position}
                                label="ตำแหน่ง"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                                nextFields={{ up: "employee-status", down: "salary" }}
                                require="require"
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="salary"
                                placeholder=""
                                onChange={(e) => setSalary(e.target.value)}
                                value={salary}
                                label="เงินเดือน/ค่าแรง"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                                nextFields={{ up: "position", down: "team" }}
                                require="require"
                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                id="team"
                                onChange={(option) => setTeam(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataTeamDropdown}
                                onInputChange={handleTeamSearch}
                                valueKey="id"
                                labelKey="name"
                                placeholder="รายชื่อทีม"
                                isClearable
                                label="ทีม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                nextFields={{ up: "salary", down: "country" }}
                                require="require"
                            />
                        </div>


                    </div>



                    {/* รายละเอียดพนักงาน */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดพนักงาน</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

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
                                nextFields={{ up: "team", down: "email" }}
                                require="require"

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
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "country", down: "province" }}
                                require="require"
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
                                nextFields={{ up: "email", down: "telno" }}
                                require="require"

                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="telno"
                                placeholder=""
                                onChange={(e) => setTelno(e.target.value)}
                                value={telNo}
                                label="เบอร์โทรศัพท์"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "province", down: "district" }}
                                require="require"
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
                                nextFields={{ up: "telno", down: "contact-option" }}
                                require="require"

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
                                nextFields={{ up: "district", down: "note" }}
                                require="require"
                            />

                        </div>



                        <div className="">

                            <TextArea
                                id="note"
                                placeholder=""
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                                label="ที่อยู่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "contact-option", down: `${contactOption ? contactOption?.toLowerCase() : "employee-code"}` }}
                                require="require"
                            />
                        </div>

                        {contactOption && (
                            <>
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
                                        nextFields={{ up: "contact-option", down: "employee-code" }}
                                        require="require"
                                    />
                                </div>
                            </>
                        )}

                    </div>

                </div>
            </div>
            <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                >
                    เพิ่มพนักงานใหม่
                </Buttons>
                <Link to="/employee">
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
