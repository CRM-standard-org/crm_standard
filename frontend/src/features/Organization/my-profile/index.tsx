import { useEffect, useRef, useState } from "react";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { useToast } from "@/components/customs/alert/useToast";
import { useLocalProfileData } from "@/zustand/useProfile";
import { useEmployeeById, useSelectEmployeeStatus } from "@/hooks/useEmployee";
import { useSocial } from "@/hooks/useSocial";
import { useAddress } from "@/hooks/useAddress";
import { useTeam } from "@/hooks/useTeam";
import { useSelectRole } from "@/hooks/useRole";
import dayjs from "dayjs";
import { updateEmployee } from "@/services/employee.service";
import { appConfig } from "@/configs/app.config";

export default function MyProfileFeature() {
  const { profile } = useLocalProfileData();
  const employeeId = profile?.employee_id || "";
  const { data: employee, refetch } = useEmployeeById({ employeeId });
  const { showToast } = useToast();

  // form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [employeeStatusName, setEmployeeStatusName] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");

  const [country, setCountry] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [telNo, setTelNo] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [address, setAddress] = useState("");
  const [contactNameOption, setContactNameOption] = useState("");
  const [contactOption, setContactOption] = useState<string | null>(null);
  const [contactDetail, setContactDetail] = useState("");

  const [employeeRole, setEmployeeRole] = useState<string | null>(null);
  const [employeeRoleName, setEmployeeRoleName] = useState("");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  // dropdown/search
  const [searchSocial, setSearchSocial] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // fetches
  const { data: dataSocial, refetch: refetchSocial } = useSocial({ searchText: searchSocial });
  const { data: Address, refetch: refetchAddress } = useAddress({ searchText: searchAddress });
  const { data: dataTeam, refetch: refetchTeam } = useTeam({ page: "1", pageSize: "100", searchText: searchTeam });
  const { data: dataRole, refetch: refetchRole } = useSelectRole({ searchText: searchStatus });
  const { data: dataEmployeeStatus, refetch: refetchEmployeeStatus } = useSelectEmployeeStatus({ searchText: searchStatus });

  // role-based edit permissions
  const roleName = profile?.role?.role_name || "";
  const canEditAll = roleName === "Admin" || roleName === "Owner";
  const canEditRestricted = !canEditAll;

  const disabled = {
    username: canEditRestricted,
    role: canEditRestricted,
    position: canEditRestricted,
    startDate: canEditRestricted,
    endDate: canEditRestricted,
    status: canEditRestricted,
    team: canEditRestricted,
    salary: canEditRestricted,
  };

  // address options
  const [countryOptions, setCountryOptions] = useState<{ label: string; value: string }[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<{ label: string; value: string }[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (employee?.responseObject) {
      const e = employee.responseObject;
      setUsername(e.username);
      setFName(e.first_name);
      setLName(e.last_name ?? "");
      setPosition(e.position);
      setSalary(e.salary ?? "");
      setStartDate(e.start_date ? new Date(e.start_date) : null);
      setEndDate(e.end_date ? new Date(e.end_date) : null);
      setEmployeeStatus(e.employee_status?.status_id ?? null);
      setEmployeeStatusName(e.employee_status?.name ?? "");
      setTeam(e.team_employee?.team_id ?? "");
      setTeamName(e.team_employee?.name ?? "");
      setCountry(e.address?.[0]?.country.country_id ?? null);
      setProvince(e.address?.[0]?.province.province_id ?? null);
      setDistrict(e.address?.[0]?.district.district_id ?? null);
      setAddress(e.address?.[0]?.address ?? "");

      setEmail(e.email ?? "");
  setTelNo(e.phone ?? "");
      setBirthDate(e.birthdate ? new Date(e.birthdate) : null);
      setContactOption(e.detail_social?.[0]?.social.social_id ?? "");
      setContactNameOption(e.detail_social?.[0]?.social.name ?? "");
      setContactDetail(e.detail_social?.[0]?.detail ?? "");

      setEmployeeRole(e.role?.role_id ?? null);
      setEmployeeRoleName(e.role?.role_name ?? "");
    }
  }, [employee]);

  // address option derivation
  useEffect(() => {
    const list = Address?.responseObject ?? [];
    const raw = list.map((item: { country_id: string; country_name: string }) => ({ id: String(item.country_id), name: String(item.country_name) }));
    const options = raw.map((r) => ({ label: r.name, value: r.id }));
    setCountryOptions(options);
  }, [Address]);

  useEffect(() => {
    const list = Address?.responseObject ?? [];
    const selected = list.find((it: { country_id: string }) => it.country_id === country);
    const provinceList = selected?.province ?? [];
    const raw = provinceList.map((item: { province_id: string; province_name: string }) => ({ id: String(item.province_id), name: String(item.province_name) }));
    const options = raw.map((r) => ({ label: r.name, value: r.id }));
    setProvinceOptions(options);
  }, [Address, country]);

  useEffect(() => {
    const list = Address?.responseObject ?? [];
    const selected = list.find((it: { country_id: string }) => it.country_id === country);
    const selectedProvince = selected?.province?.find((p: { province_id: string }) => p.province_id === province);
    const districtList = selectedProvince?.district ?? [];
    const raw = districtList.map((item: { district_id: string; district_name: string }) => ({ id: String(item.district_id), name: String(item.district_name) }));
    const options = raw.map((r) => ({ label: r.name, value: r.id }));
    setDistrictOptions(options);
  }, [Address, country, province]);

  // dropdown fetch mappers
  const fetchDataSocialDropdown = async () => ({
    responseObject: (dataSocial?.responseObject?.data ?? []).map((it: { social_id: string; name: string }) => ({ id: it.social_id, name: it.name }))
  });
  const handleSocialSearch = (s: string) => { setSearchSocial(s); refetchSocial(); };

  const fetchDataTeamDropdown = async () => ({
    responseObject: (dataTeam?.responseObject?.data ?? []).map((it: { team_id: string; name: string }) => ({ id: it.team_id, name: it.name }))
  });
  const handleTeamSearch = (s: string) => { setSearchTeam(s); refetchTeam(); };

  const fetchRoleDropdown = async () => ({
    responseObject: (dataRole?.responseObject?.data ?? []).map((it: { role_id: string; role_name: string }) => ({ id: it.role_id, name: it.role_name }))
  });
  const handleRoleSearch = (s: string) => { setSearchStatus(s); refetchRole(); };

  const fetchEmployeeStatusDropdown = async () => ({
    responseObject: (dataEmployeeStatus?.responseObject?.data ?? []).map((it: { status_id: string; name: string }) => ({ id: it.status_id, name: it.name }))
  });
  const handleStatusSearch = (s: string) => { setSearchStatus(s); refetchEmployeeStatus(); };

  const handleAddressSearch = (s: string) => { setSearchAddress(s); refetchAddress(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      e.target.value = "";
    }
  };

  const validate = () => {
    const err: Record<string, boolean> = {};
    if (!fName) err.fName = true;
    if (!email) err.email = true;
    if (!telNo) err.telNo = true;
    if (!country) err.country = true;
    if (!province || provinceOptions.length === 0) err.province = true;
    if (!district || districtOptions.length === 0) err.district = true;
    setErrorFields(err);
    if (Object.values(err).some(Boolean)) {
      showToast("กรุณากรอกข้อมูลให้ครบ", false);
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!employeeId) return;
    if (!validate()) return;

    const payload = {
      username,
      password,
      email,
      first_name: fName,
      last_name: lName ?? "",
      role_id: employeeRole, // ignored by backend if not permitted
      position,
      phone: telNo,
      social_id: contactOption ?? "",
      detail: contactDetail ?? "",
      address: address ?? "",
      country_id: country,
      province_id: province,
      district_id: district,
      status_id: employeeStatus,
      team_id: team ?? "",
      salary: salary ? Number(String(salary).replace(/,/g, "")) : undefined,
      start_date: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
      end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
      birthdate: birthDate ? dayjs(birthDate).format("YYYY-MM-DD") : "",
    };

    try {
      const res = await updateEmployee(employeeId, payload, uploadedFile || undefined);
      if (res?.statusCode === 200) {
        showToast("บันทึกโปรไฟล์เรียบร้อย", true);
        refetch();
      } else {
        showToast("บันทึกโปรไฟล์ไม่สำเร็จ", false);
      }
  } catch {
      showToast("บันทึกโปรไฟล์ไม่สำเร็จ", false);
    }
  };

  const profileUrl = employee?.responseObject?.profile_picture
    ? `${appConfig.baseApi}${employee?.responseObject?.profile_picture}`
    : undefined;

  return (
    <>
      <h1 className="text-2xl font-bold mb-3">โปรไฟล์ของฉัน</h1>

      <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
        <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
          <h1 className="text-xl font-semibold">ข้อมูลพนักงาน</h1>
          <div className="border-b-2 border-main mb-6"></div>

          <div className="flex justify-center xl:justify-start items-center space-x-4 mb-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-gray-300 text-center rounded-full w-40 h-40 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
              title="คลิกเพื่อเปลี่ยนรูป"
            >
              {uploadedFile && (
                <img src={URL.createObjectURL(uploadedFile)} alt="preview" className="w-full h-full object-cover rounded-full" />
              )}
              {!uploadedFile && (
                <img src={profileUrl || "/images/avatar2.png"} alt="Profile" className="w-full h-full object-cover rounded-full" />
              )}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
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
                classNameLabel="w-1/2 flex "
                classNameInput="w-full"
                nextFields={{ down: "password" }}
                disabled={disabled.username}
              />
            </div>
            <div className="">
              <InputAction
                type="password"
                id="password"
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                label="รหัสผ่านใหม่"
                labelOrientation="horizontal"
                classNameLabel="w-1/2 flex "
                classNameInput="w-full"
                nextFields={{ up: "username", down: "fname" }}
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
                classNameLabel="w-1/2 flex"
                classNameInput="w-full"
                nextFields={{ up: "lname", down: "employee-role" }}
                disabled={disabled.position}
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
                classNameLabel="w-1/2 flex"
                classNameSelect="w-full "
                defaultValue={{ label: employeeRoleName, value: employeeRole }}
                nextFields={{ up: "position", down: "start-date" }}
                isDisabled={disabled.role}
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
                isDisabled={disabled.startDate}
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
                isDisabled={disabled.endDate}
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
                classNameLabel="w-1/2 flex"
                classNameSelect="w-full "
                defaultValue={{ label: employeeStatusName, value: employeeStatus }}
                nextFields={{ up: "end-date", down: "salary" }}
                isDisabled={disabled.status}
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
                classNameLabel="w-1/2 flex"
                classNameInput="w-full"
                nextFields={{ up: "employee-status", down: "team" }}
                disabled={disabled.salary}
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
                classNameLabel="w-1/2 flex"
                classNameSelect="w-full "
                defaultValue={{ label: teamName, value: team }}
                nextFields={{ up: "salary", down: "country" }}
                isDisabled={disabled.team}
              />
            </div>
          </div>

          <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดพนักงาน</h1>
          <div className="border-b-2 border-main mb-6"></div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="">
              <DependentSelectComponent
                id="country"
                value={countryOptions.find((opt) => opt.value === country) || null}
                onChange={(option) => setCountry(option ? String(option.value) : null)}
                onInputChange={handleAddressSearch}
                fetchDataFromGetAPI={async () => ({ responseObject: countryOptions.map((o) => ({ id: o.value, name: o.label })) })}
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
                fetchDataFromGetAPI={async () => ({ responseObject: provinceOptions.map((o) => ({ id: o.value, name: o.label })) })}
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
                onChange={(e) => setTelNo(e.target.value)}
                value={telNo}
                label="เบอร์โทรศัพท์"
                labelOrientation="horizontal"
                classNameLabel="w-1/2 flex "
                classNameInput="w-full"
                nextFields={{ up: "province", down: "district" }}
                require="require"
                isError={errorFields.telNo}
                type="tel"
              />
            </div>
            <div className="">
              <DependentSelectComponent
                id="district"
                value={districtOptions.find((opt) => opt.value === district) || null}
                onChange={(option) => setDistrict(option ? String(option.value) : null)}
                onInputChange={handleAddressSearch}
                fetchDataFromGetAPI={async () => ({ responseObject: districtOptions.map((o) => ({ id: o.value, name: o.label })) })}
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
                classNameLabel="w-1/2"
                classNameSelect="w-full"
                defaultValue={{ label: contactNameOption, value: contactOption }}
                nextFields={{ up: "district", down: `${contactOption ? contactOption?.toLowerCase() : "username"}` }}
              />
              {contactOption && (
                <div className="mt-6">
                  <InputAction
                    id={contactOption.toLowerCase()}
                    placeholder=""
                    onChange={(e) => setContactDetail(e.target.value)}
                    value={contactDetail}
                    label={contactNameOption}
                    labelOrientation="horizontal"
                    classNameLabel="w-1/2"
                    classNameInput="w-full"
                    nextFields={{ up: "contact-option", down: "username" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end space-x-5 mt-5">
        <Buttons btnType="primary" variant="outline" className="w-30" onClick={handleConfirm}>
          บันทึกโปรไฟล์
        </Buttons>
      </div>
    </>
  );
}
