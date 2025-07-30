import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { IconButton } from "@radix-ui/themes";
import { LuPencil } from "react-icons/lu";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import TextAreaForm from "@/components/customs/textAreas/textAreaForm";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import RadioComponent from "@/components/customs/radios/radio.component";
import { LabelWithValue } from "@/components/ui/label";
import { useCompany } from "@/hooks/useCompany";
import { TypeCompanyResponse } from "@/types/response/response.company";
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
export default function ManageInfoCompany() {
    const [searchText, setSearchText] = useState("");
    const [colorsName, setColorsName] = useState("");
    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);
    const [dataCompany, setDataCompany] = useState<TypeCompanyResponse>();

    const [active, setActive] = useState<'contact' | 'address'>('contact');
    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const [allQuotation, setAllQuotation] = useState<any[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);

    const { data: companyDetails, refetch: refetchCompany } = useCompany();
    useEffect(() => {
        if (companyDetails?.responseObject) {
            setDataCompany(companyDetails.responseObject)
        }
    })
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


    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce(searchText);

        }
    }, [searchText]);


    //ยืนยันไดอะล็อค
  

    const logoUrl = dataCompany?.logo
    ? `${appConfig.baseApi}${dataCompany.logo}`
    : null;
  
    return (
        <>
            <div className="flex  text-2xl font-bold mb-3">
                <p className="me-2">จัดการข้อมูลบริษัท</p>
                <IconButton
                    variant="ghost"
                    aria-label="Edit"
                    onClick={() => navigate(`/edit-info-company/${dataCompany.company_id}`)}
                >
                    <LuPencil style={{ fontSize: "18px" }} /><span>แก้ไข</span>
                </IconButton>
            </div>
            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div>

                            <h1 className="text-xl font-semibold mb-1">ข้อมูลบริษัท</h1>
                            <div className="border-b-2 border-main mb-6"></div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-4">
                                    {dataCompany?.logo ? (
                                        <img
                                            src={logoUrl}
                                            alt="Company Logo"
                                            className="w-40 h-40 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 text-white text-center rounded-full w-40 h-40 flex items-center justify-center">
                                            Logo
                                        </div>
                                    )}
                                </div>
                                

                                <LabelWithValue label="ชื่อบริษัท" value={`${dataCompany?.name_th || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="ชื่ออังกฤษ" value={`${dataCompany?.name_en || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="ประเภทธุรกิจ" value={`${dataCompany?.type || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="เว็บไซต์" value={`${dataCompany?.website || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue
                                    label="ปีที่ก่อตั้ง"
                                    value={
                                        dataCompany?.founded_date
                                            ? new Date(dataCompany.founded_date).toLocaleDateString("th-TH")
                                            : "-"
                                    }
                                    classNameLabel="sm:w-1/2"
                                    classNameValue="w-full"
                                />
                                <LabelWithValue label="ชื่อสถานที่" value={`${dataCompany?.place_name || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="ที่ตั้งสำนักงานใหญ่" value={`${dataCompany?.address || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="ประเทศ" value={`${dataCompany?.country.country_name || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="จังหวัด" value={`${dataCompany?.province.province_name || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="อำเภอ" value={`${dataCompany?.district.district_name || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />

                                <LabelWithValue label="เลขประจำตัวผู้เสียภาษี" value={`${dataCompany?.tax_id || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />

                            </div>

                        </div>

                        <div>

                            <h1 className="text-xl font-semibold mb-1">ข้อมูลติดต่อ</h1>
                            <div className="border-b-2 border-main mb-6"></div>
                            <div className="space-y-3 text-gray-700">
                                <LabelWithValue label="เบอร์โทรศัพท์" value={`${dataCompany?.phone || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="เบอร์โทรสาร" value={`${dataCompany?.fax_number || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                {/* <LabelWithValue label="สำนักงานใหญ่" value="ช่องทางการติดต่อที่ 1" classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="" value="ช่องทางการติดต่อที่ 2" classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="" value="ช่องทางการติดต่อที่ 3" classNameLabel="sm:w-1/2" classNameValue="w-full" /> */}


                            </div>

                        </div>

                    </div>

                </div>


            </div>

        </>

    );
}
