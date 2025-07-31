import { useCallback, useEffect, useRef, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import TextAreaForm from "@/components/customs/textAreas/textAreaForm";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import TagSelectComponent from "@/components/customs/tagCustomer/tagselect.main.component";
import { OptionColorType } from "@/components/customs/tagCustomer/tagselect.main.component";

//Customer Role
import { useCustomerRole } from "@/hooks/useCustomerRole";

//Character 
import { useCustomerCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";
import Rating from "@/components/customs/rating/rating.main.component";
import { setPriority } from "os";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { useTeam } from "@/hooks/useTeam";
import { useSocial } from "@/hooks/useSocial";
import { TypeSocialResponse } from "@/types/response/response.social";
import { useAddress } from "@/hooks/useAddress";
import RatingShow from "@/components/customs/rating/rating.show.component";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import { LuPencil } from "react-icons/lu";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { TypeAddressResponse } from "@/types/response/response.address";
import { FiImage } from "react-icons/fi";
import dayjs from "dayjs";
import { PayLoadEditEmployee } from "@/types/requests/request.employee";
import { useEmployeeById, useSelectEmployeeStatus } from "@/hooks/useEmployee";
import { TypeSelectEmployeeStatusResponse } from "@/types/response/response.employee";
import { updateEmployee } from "@/services/employee.service";
import { useSelectRole } from "@/hooks/useRole";
import { TypeRoleResponse } from "@/types/response/response.role";
import { appConfig } from "@/configs/app.config";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function EditEmployeeDetails() {
    const [searchText, setSearchText] = useState("");
    const { employeeId } = useParams<{ employeeId: string }>();

    // variable form edit employee 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const [employeeCode, setEmployeeCode] = useState("");
    const [employeeRole, setEmployeeRole] = useState<string | null>(null);
    const [employeeRoleName, setEmployeeRoleName] = useState("");

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");

    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [employeeStatusName, setEmployeeStatusName] = useState("");
    const [employeeStatus, setEmployeeStatus] = useState<string | null>(null);
    const [team, setTeam] = useState<string | null>(null);
    const [teamName, setTeamName] = useState("");


    const [country, setCountry] = useState<string | null>(null);
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);

    const [province, setProvince] = useState<string | null>(null);
    const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);

    const [district, setDistrict] = useState<string | null>(null);
    const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);
    const [email, setEmail] = useState("");
    const [telNo, setTelno] = useState("");
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const [address, setAddress] = useState("");
    const [contactNameOption, setContactNameOption] = useState("");
    const [contactOption, setContactOption] = useState<string | null>(null);
    const [contactDetail, setContactDetail] = useState("");

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [uploadKey, setUploadKey] = useState(0);

    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);


    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();
    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});



    const [filterGroup, setFilterGroup] = useState<string | null>(null);
    //searchText control


    const [searchSocial, setSearchSocial] = useState("");
    const [searchTeam, setSearchTeam] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    //fetch employee by id

    const { data: employee, refetch: refetchEmployee } = useEmployeeById({ employeeId });

    useEffect(() => {
        fetchEmployeeById();
    }, [employee])

    const fetchEmployeeById = async () => {
        if (employee?.responseObject) {
            setUsername(employee?.responseObject?.username)
            setFName(employee?.responseObject?.first_name)
            setPosition(employee?.responseObject?.position)
            setStartDate(employee?.responseObject?.start_date ?
                new Date(employee?.responseObject?.start_date)
                : null
            );
            setEmployeeStatus(employee?.responseObject?.employee_status?.status_id)
            setEmployeeStatusName(employee?.responseObject?.employee_status?.name)
            setEmployeeCode(employee?.responseObject?.employee_code)
            setLName(employee?.responseObject?.last_name ?? "")
            setEmployeeRole(employee?.responseObject?.role.role_id)
            setEmployeeRoleName(employee?.responseObject?.role.role_name)
            setSalary(employee?.responseObject?.salary)
            setEndDate(employee?.responseObject?.end_date ?
                new Date(employee?.responseObject?.end_date)
                : null
            );
            setTeam(employee?.responseObject?.team_employee?.team_id ?? "")
            setTeamName(employee?.responseObject?.team_employee?.name ?? "")
            setCountry(employee?.responseObject?.address[0]?.country.country_id)
            setProvince(employee?.responseObject?.address[0]?.province.province_id)
            setDistrict(employee?.responseObject?.address[0]?.district.district_id)
            setAddress(employee?.responseObject?.address[0]?.address ?? "")

            setEmail(employee?.responseObject?.email)
            setTelno(employee?.responseObject?.phone)
            setBirthDate(employee?.responseObject?.birthdate ?
                new Date(employee?.responseObject?.birthdate)
                : null
            );
            setContactOption(employee?.responseObject?.detail_social[0]?.social.social_id ?? "")
            setContactNameOption(employee?.responseObject?.detail_social[0]?.social.name ?? "");
            setContactDetail(employee?.responseObject?.detail_social[0]?.detail ?? "");

        }
    };


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




    //fetch employee status
    const { data: dataEmployeeStatus, refetch: refetchEmployeeStatus } = useSelectEmployeeStatus({
        searchText: searchStatus
    })
    const fetchEmployeeStatusDropdown = async () => {
        const employeeStatusList = dataEmployeeStatus?.responseObject.data ?? [];
        return {
            responseObject: employeeStatusList.map((item: TypeSelectEmployeeStatusResponse) => ({
                id: item.status_id,
                name: item.name
            }))
        }
    }

    const handleStatusSearch = (searchText: string) => {
        setSearchStatus(searchText);
        refetchEmployeeStatus();
    };

    //fetch employee status
    const { data: dataRole, refetch: refetchRole } = useSelectRole({
        searchText: searchStatus
    })
    const fetchRoleDropdown = async () => {
        const roleList = dataRole?.responseObject.data ?? [];
        return {
            responseObject: roleList.map((item: TypeRoleResponse) => ({
                id: item.role_id,
                name: item.role_name
            }))
        }
    }

    const handleRoleSearch = (searchText: string) => {
        setSearchStatus(searchText);
        refetchRole();
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
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            e.target.value = ""; // เคลียร์ input เพื่อให้เลือกไฟล์เดิมได้
        }
    };
    //สำหรับป้องกันรหัสต่ำกว่า 6 ตัว
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);


        if (newPassword && newPassword.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("รหัสผ่านต้องมี 6 ตัวอักษรขึ้นไป");
        } else {
            // ถ้าเงื่อนไขถูกต้อง ให้ล้าง error
            setPasswordError(false);
            setPasswordErrorMessage("");
        }
    };
    const handleConfirm = async () => {



        const errorMap: Record<string, boolean> = {};

        if (!username) errorMap.username = true;
        if (!fName) errorMap.fName = true;
        if (!employeeRole) errorMap.employeeRole = true;
        if (!position) errorMap.position = true;
        if (!telNo) errorMap.telNo = true;
        if (!country) errorMap.country = true;
        if (!province || provinceOptions.length === 0) { errorMap.province = true; }
        if (!district || districtOptions.length === 0) { errorMap.district = true; }
        if (!employeeStatus) errorMap.employeeStatus = true;
        if (!email) errorMap.email = true;

        setErrorFields(errorMap);
        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }


        const payload: PayLoadEditEmployee = {
            username: username,
            password: password,
            email: email,
            first_name: fName,
            last_name: lName ?? "",
            role_id: employeeRole,
            position: position,
            phone: telNo,
            social_id: contactOption ?? "",
            detail: contactDetail ?? "",
            address: address ?? "",
            country_id: country,
            province_id: province,
            district_id: district,
            status_id: employeeStatus,
            team_id: team ?? "",
            salary: salary ?? "",
            start_date: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
            end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
            birthdate: birthDate ? dayjs(birthDate).format("YYYY-MM-DD") : "",
        };

        console.log("ส่ง payload", payload);
        console.log("ไฟล์แนบ:", uploadedFile);
        try {
            const response = await updateEmployee(employeeId, payload, uploadedFile);
            if (response.statusCode === 200) {
                setUploadKey(prev => prev + 1); // trigger เพื่อ reset
                navigate("/employee");
            }
            else if (response.statusCode === 400) {
                if (response.message === "Username or employee code already exists") {
                    showToast("ชื่อผู้ใช้งานหรือรหัสพนักงานซ้ำ", false);
                }
            }
            
            else  {
                showToast("ไม่สามารถแก้ไขพนักงานได้", false);
            }


        } catch (err) {
            showToast("ไม่สามารถแก้ไขพนักงานได้", false);
            console.error(err);
        }
    };


    return (
        <>
            <h1 className="text-2xl font-bold mb-3">แก้ไขรายละเอียดพนักงาน</h1>





            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลพนักงาน */}

                    <h1 className="text-xl font-semibold">ข้อมูลพนักงาน</h1>

                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="flex justify-center xl:justify-start items-center space-x-4 mb-3">
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="bg-gray-300 text-center rounded-full w-40 h-40 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
                            title="คลิกเพื่อเปลี่ยนรูป"
                        >
                            {uploadedFile ? (
                                <img
                                    src={URL.createObjectURL(uploadedFile)}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : employee?.responseObject?.profile_picture ? (
                                <img
                                    src={`${appConfig.baseApi}${employee?.responseObject?.profile_picture}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <FiImage size={40} />
                            )}

                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">
                            <InputAction
                                id="username"
                                placeholder=""
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                label="ชื่อผู้ใช้งาน"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: `${contactOption ? contactOption?.toLowerCase() : "contact-option"}`, down: "password" }}
                                isError={errorFields.username}
                                require="require"
                            />
                        </div>
                        <div className="">
                            <InputAction
                                type="password"
                                id="password"
                                placeholder=""
                                onChange={handlePasswordChange}
                                value={password}
                                label="รหัสผ่านใหม่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "username", down: "employee-code" }}
                                isError={passwordError}
                                errorMessage={passwordErrorMessage}
                              
                            />

                        </div>
            
                        <div className="">
                            <InputAction
                                id="fname"
                                placeholder=""
                                onChange={(e) => setFName(e.target.value)}
                                value={fName}
                                label="ชื่อ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                                nextFields={{ up: "password", down: "lname" }}
                                require="require"
                                isError={errorFields.fName}

                            />
                        </div>

                        <div className="">
                            <InputAction
                                id="lname"
                                placeholder=""
                                onChange={(e) => setLName(e.target.value)}
                                value={lName}
                                label="นามสกุล"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                                nextFields={{ up: "fname", down: "position" }}
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
                                nextFields={{ up: "lname", down: "employee-role" }}
                                require="require"
                                isError={errorFields.position}

                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                id="employee-role"
                                onChange={(option) => setEmployeeRole(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchRoleDropdown}
                                onInputChange={handleRoleSearch}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="บทบาท"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                defaultValue={{ label: employeeRoleName, value: employeeRole }}

                                nextFields={{ up: "position", down: "start-date" }}
                                isError={errorFields.employeeRole}
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
                                nextFields={{ up: "employee-role", down: "end-date" }}

                            />
                        </div>

                        <div className="">
                            <DatePickerComponent
                                id="end-date"
                                label="วันที่เลิกทำงาน"
                                placeholder="dd/mm/yy"
                                selectedDate={endDate}
                                onChange={(date) => setEndDate(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "start-date", down: "employee-status" }}
                                isClearable={true}
                            />
                        </div>
                        
                        <div className="">
                            <MasterSelectComponent
                                id="employee-status"
                                onChange={(option) => setEmployeeStatus(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchEmployeeStatusDropdown}
                                onInputChange={handleStatusSearch}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="สถานะ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                defaultValue={{ label: employeeStatusName, value: employeeStatus }}
                                nextFields={{ up: "end-date", down: "salary" }}
                                require="require"
                                isError={errorFields.employeeStatus}
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
                                nextFields={{ up: "employee-status", down: "team" }}
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
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ทีม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                defaultValue={{ label: teamName, value: team }}
                                nextFields={{ up: "salary", down: "country" }}
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
                                isError={errorFields.country}

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
                                isError={errorFields.email}
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
                                isError={errorFields.province}
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
                                isError={errorFields.telNo}

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
                                nextFields={{ up: "telno", down: "birth-date" }}
                                require="require"
                                isError={errorFields.district}

                            />

                        </div>
                        <div className="">
                            <DatePickerComponent
                                id="birth-date"
                                label="วันเกิด"
                                placeholder="dd/mm/yy"
                                selectedDate={birthDate}
                                onChange={(date) => setBirthDate(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "district", down: "address" }}
                                isClearable={true}
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
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "birth-date", down: `${contactOption ? contactOption?.toLowerCase() : "contact-option"}` }}
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
                                defaultValue={{ label: contactNameOption, value: contactOption }}

                                nextFields={{ up: "district", down: `${contactOption ? contactOption?.toLowerCase() : "username"}` }}
                            />
                            {contactOption && (
                                <>

                                    <div className="mt-6">
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
                                            nextFields={{ up: "contact-option", down: "username" }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>


                    </div>

                </div>
            </div>
            <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                    onClick={handleConfirm}
                >
                    ยืนยันการแก้ไข
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
