import { useCallback, useEffect, useRef, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { IconButton } from "@radix-ui/themes";
import { LuPencil } from "react-icons/lu";
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
import { PayLoadEditCompany } from "@/types/requests/request.company";
import { updateCompany } from "@/services/company.service";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { TypeAddressResponse } from "@/types/response/response.address";
import { useAddress } from "@/hooks/useAddress";
import { useResponseToOptions } from "@/hooks/useOptionType";
import dayjs from "dayjs";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { useCompany } from "@/hooks/useCompany";
import { TypeCompanyResponse } from "@/types/response/response.company";
import FileUploadComponent from "@/components/customs/uploadFIle/FileUploadComponent";
import { appConfig } from "@/configs/app.config";
import { FiImage } from "react-icons/fi";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];


//
export default function EditInfoCompany() {
    const [searchText, setSearchText] = useState("");
    const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();
    const { companyId } = useParams<{ companyId: string }>();
    const [dataCompany, setDataCompany] = useState<TypeCompanyResponse>();

    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    //variable for update company
    const [companyName, setCompanyName] = useState("");
    const [companyEngName, setCompanyEngName] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [website, setWebsite] = useState("");
    const [foundDate, setFoundDate] = useState<Date | null>(new Date());
    const [placeName, setPlaceName] = useState("");
    const [address, setAddress] = useState("");

    const [country, setCountry] = useState<string | null>(null);
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [province, setProvince] = useState<string | null>(null);
    const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);
    const [district, setDistrict] = useState<string | null>(null);
    const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);

    const [telNo, setTelNo] = useState("");
    const [faxTelNo, setFaxTelNo] = useState("");
    const [taxId, setTaxId] = useState("");

    const [active, setActive] = useState<'contact' | 'address'>('contact');
    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);



    const [uploadKey, setUploadKey] = useState(0);

    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

    const { data: companyDetails, refetch: refetchCompany } = useCompany();
    useEffect(() => {
        if (companyDetails?.responseObject) {
            setDataCompany(companyDetails.responseObject)
        }
    })
    useEffect(() => {
        fetchDataCompany();
    }, [companyDetails])

    const fetchDataCompany = async () => {
        if (companyDetails?.responseObject) {
            setCompanyName(companyDetails?.responseObject?.name_th ?? "");
            setCompanyEngName(companyDetails?.responseObject?.name_en ?? "");
            setCompanyType(companyDetails?.responseObject?.type ?? "");
            setWebsite(companyDetails?.responseObject?.website ?? "")
            setPlaceName(companyDetails?.responseObject?.place_name ?? "")
            setFoundDate(companyDetails?.responseObject?.founded_date ?
                new Date(companyDetails?.responseObject?.founded_date)
                : null
            );
            setAddress(companyDetails?.responseObject?.address ?? "")

            setCountry(companyDetails?.responseObject?.country.country_id ?? "");
            setProvince(companyDetails?.responseObject?.province.province_id ?? "");
            setDistrict(companyDetails?.responseObject?.district.district_id ?? "")
            setTelNo(companyDetails?.responseObject?.phone ?? "")
            setFaxTelNo(companyDetails?.responseObject?.fax_number ?? "");
            setTaxId(companyDetails?.responseObject?.tax_id ?? "");



        }
    }
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
        "ประวัติกิจกรรมของลูกค้า",
    ];



    //   useEffect(() => {
    //     console.log("Data:", dataColor);
    //     if (dataColor?.responseObject?.data) {
    //       const formattedData = dataColor.responseObject?.data.map(
    //         (item: TypeColorAllResponse, index: number) => ({
    //           className: "",
    //           cells: [
    //             { value: index + 1, className: "text-center" },
    //             { value: item.color_name, className: "text-left" },
    //           ],
    //           data: item,
    //         })
    //       );
    //       setData(formattedData);
    //     }
    //   }, [dataColor]);


    //
    const headers = [
        { label: "วันเวลาของกิจกรรม", colSpan: 1, className: "min-w-20" },
        { label: "รายละเอียดกิจกรรม", colSpan: 1, className: "min-w-60" },
        { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "min-w-60 " },
        { label: "ผู้รับผิดชอบ", colSpan: 1, className: "min-w-20" },
        { label: "ทีม", colSpan: 1, className: "min-w-20" },
    ];



    //fetch Address 
    const { data: Address } = useAddress({
        searchText: "",
    });

    useEffect(() => {
        if (Address?.responseObject) {
            setDataAddress(Address.responseObject);
        }
    }, [Address]);

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



    //ยืนยันไดอะล็อค
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            e.target.value = ""; // เคลียร์ input เพื่อให้เลือกไฟล์เดิมได้
        }
    };

    const handleConfirm = async () => {



        const errorMap: Record<string, boolean> = {};

        if (!companyName) errorMap.companyName = true;
        if (!companyEngName) errorMap.companyEngName = true;
        if (!companyType) errorMap.companyType = true;
        if (!website) errorMap.website = true;
        if (!foundDate) errorMap.foundDate = true;
        if (!placeName) errorMap.placeName = true;
        if (!address) errorMap.address = true;
        if (!country) errorMap.country = true;
        if (!province || provinceOptions.length === 0) { errorMap.province = true; }
        if (!district || districtOptions.length === 0) { errorMap.district = true; }
        if (!telNo) errorMap.telNo = true;
        if (!taxId) errorMap.taxId = true;

        setErrorFields(errorMap);
        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }



        const payload: PayLoadEditCompany = {
            name_th: companyName,
            name_en: companyEngName,
            type: companyType,
            website: website,
            founded_date: foundDate ? dayjs(foundDate).format("YYYY-MM-DD") : "",
            place_name: placeName,
            address: address,
            country_id: country,
            province_id: province,
            district_id: district,
            phone: telNo,
            fax_number: faxTelNo ?? "",
            tax_id: taxId
        };

        console.log("ส่ง payload", payload);
        console.log("ไฟล์แนบ:", uploadedFile);
        try {
            const response = await updateCompany(companyId, payload, uploadedFile);
            if (response.statusCode === 200) {
                setUploadKey(prev => prev + 1); // trigger เพื่อ reset
                refetchCompany();
                navigate("/manage-info-company");
            } else {
                showToast("ไม่สามารถแก้ไขข้อมูลบริษัทได้", false);
            }

        } catch (err) {
            showToast("ไม่สามารถแก้ไขข้อมูลบริษัทได้", false);
            console.error(err);
        }
    };


    return (
        <>
            <div className="flex  text-2xl font-bold mb-3">
                <p className="me-2">จัดการข้อมูลบริษัท</p>

            </div>
            <div className="p-7 pb-5 bg-white shadow-md rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div>

                            <h1 className="text-xl font-semibold mb-1">ข้อมูลบริษัท</h1>
                            <div className="border-b-2 border-main mb-6"></div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-4">
                                    <div
                                        onClick={() => inputRef.current?.click()}
                                        className="bg-gray-300 text-white text-center rounded-full w-40 h-40 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
                                        title="คลิกเพื่อเปลี่ยนรูป"
                                    >
                                        {uploadedFile ? (
                                            <img
                                                src={URL.createObjectURL(uploadedFile)}
                                                alt="preview"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : dataCompany?.logo ? (
                                            <img
                                                src={`${appConfig.baseApi}${dataCompany.logo}`}
                                                alt="Company Logo"
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


                                <div className="">
                                    <InputAction
                                        id="company-name"
                                        placeholder=""
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        value={companyName}
                                        label="ชื่อบริษัท"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "telno-extension", down: "company-engname" }}
                                        isError={errorFields.companyName}

                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="company-engname"
                                        placeholder=""
                                        onChange={(e) => setCompanyEngName(e.target.value)}
                                        value={companyEngName}
                                        label="ชื่ออังกฤษ"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "company-name", down: "business-type" }}
                                        isError={errorFields.companyEngName}

                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="business-type"
                                        placeholder=""
                                        onChange={(e) => setCompanyType(e.target.value)}
                                        value={companyType}
                                        label="ประเภทธุรกิจ"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "company-engname", down: "website" }}
                                        isError={errorFields.companyType}

                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="website"
                                        placeholder=""
                                        onChange={(e) => setWebsite(e.target.value)}
                                        value={website}
                                        label="เว็บไซต์"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "business-type", down: "year" }}
                                        isError={errorFields.website}

                                    />
                                </div>
                                <div className="">

                                    <DatePickerComponent
                                        id="year"
                                        label="ปีที่ก่อตั้ง"
                                        selectedDate={foundDate}
                                        onChange={(date) => setFoundDate(date)}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        required
                                        nextFields={{ up: "website", down: "placename" }}
                                        isError={errorFields.foundDate}
                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="placename"
                                        placeholder=""
                                        onChange={(e) => setPlaceName(e.target.value)}
                                        value={placeName}
                                        label="ชื่อสถานที่"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "year", down: "company-address" }}
                                        isError={errorFields.placeName}

                                    />
                                </div>
                                <div className="">

                                    <TextArea
                                        id="company-address"
                                        placeholder=""
                                        onChange={(e) => setAddress(e.target.value)}
                                        value={address}
                                        label="ที่ตั้งสำนักงานใหญ่"
                                        labelOrientation="horizontal"
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "placename", down: "country" }}
                                        isError={errorFields.address}

                                    />
                                </div>
                                <div className="">
                                    <DependentSelectComponent
                                        id="country"
                                        value={countryOptions.find((opt) => opt.value === country) || null}
                                        onChange={(option) => setCountry(option ? String(option.value) : null)}
                                        fetchDataFromGetAPI={fetchDataCountry}
                                        valueKey="id"
                                        labelKey="name"
                                        placeholder="กรุณาเลือก..."
                                        isClearable
                                        label="ประเทศ"
                                        labelOrientation="horizontal"
                                        classNameLabel="w-1/2 "
                                        classNameSelect="w-full "
                                        nextFields={{ up: "company-address", down: "province" }}
                                        require="require"
                                        isError={errorFields.country}

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
                                        nextFields={{ up: "country", down: "district" }}
                                        require="require"
                                        isError={errorFields.province}

                                    />
                                </div>
                                <div className="">
                                    <DependentSelectComponent
                                        id="district"
                                        value={districtOptions.find((opt) => opt.value === district) || null}
                                        onChange={(option) => setDistrict(option ? String(option.value) : null)}
                                        fetchDataFromGetAPI={fetchDataDistrict}
                                        valueKey="id"
                                        labelKey="name"
                                        placeholder="กรุณาเลือก..."
                                        isClearable
                                        label="อำเภอ"
                                        labelOrientation="horizontal"
                                        classNameLabel="w-1/2 "
                                        classNameSelect="w-full "
                                        require="require"
                                        nextFields={{ up: "province", down: "taxid" }}
                                        isError={errorFields.district}

                                    />
                                </div>



                                <div className="">
                                    <InputAction
                                        id="taxid"
                                        placeholder=""
                                        onChange={(e) => setTaxId(e.target.value)}
                                        value={taxId}
                                        label="เลขประจำตัวผู้เสียภาษี"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "district", down: "telno" }}
                                        isError={errorFields.taxId}

                                    />
                                </div>

                            </div>

                        </div>

                        <div>

                            <h1 className="text-xl font-semibold mb-1">ข้อมูลติดต่อ</h1>
                            <div className="border-b-2 border-main mb-6"></div>

                            <div className="space-y-3 text-gray-700">
                                <div className="">
                                    <InputAction
                                        id="telno"
                                        placeholder=""
                                        onChange={(e) => setTelNo(e.target.value)}
                                        value={telNo}
                                        label="เบอร์โทรศัพท์"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "taxid", down: "telno-extension" }}
                                        isError={errorFields.telNo}

                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="telno-extension"
                                        placeholder=""
                                        onChange={(e) => setFaxTelNo(e.target.value)}
                                        value={faxTelNo}
                                        label="เบอร์โทรสาร"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        nextFields={{ up: "telno", down: "company-name" }}

                                    />
                                </div>
                                {/* <div className="">
                                    <InputAction
                                        id="capital-location"
                                        placeholder=""
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                        value={companyAddress}
                                        label="สำนักงานใหญ่"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "taxid", down: "company-name" }}
                                    />
                                </div> */}

                            </div>
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
                    บันทึก
                </Buttons>
                <Link to="/manage-info-company">
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
