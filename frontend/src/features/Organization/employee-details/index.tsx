import { useCallback, useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";

import { OptionType } from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";



import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { LuPencil } from "react-icons/lu";
import { useSocial } from "@/hooks/useSocial";
import { TypeSocialResponse } from "@/types/response/response.social";
import { useTeam } from "@/hooks/useTeam";
import { useAddress } from "@/hooks/useAddress";
import { TypeAddressResponse } from "@/types/response/response.address";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { LabelWithValue } from "@/components/ui/label";
import { useEmployeeById } from "@/hooks/useEmployee";
import { TypeEmployeeResponse, TypeQuotationResponsible, TypeSaleOrderResponsible } from "@/types/response/response.employee";
import { appConfig } from "@/configs/app.config";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeQuotationResponsible | TypeSaleOrderResponsible;
}[];

//
export default function EmployeeDetails() {


    const { employeeId } = useParams<{ employeeId: string }>();

    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);


    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [dataEmployee, setDataEmployee] = useState<TypeEmployeeResponse[]>();


    const [activeTab, setActiveTab] = useState<string | null>('quotation'); // <-- เพิ่มบรรทัดนี้


    //searchText control

    const [searchSocial, setSearchSocial] = useState("");
    const [searchTeam, setSearchTeam] = useState("");
    const [searchAddress, setSearchAddress] = useState("");


    //fetch employee by id
    const { data: employee, refetch: refetchEmployee } = useEmployeeById({ employeeId });


    useEffect(() => {
        let rawData = [];
        let formattedData = [];

        if (activeTab === 'quotation' && employee?.responseObject?.quotation_responsible) {
            // --- ส่วนของ ใบเสนอราคา ---
            rawData = employee.responseObject.quotation_responsible;
            formattedData = rawData.map((item: TypeQuotationResponsible, index: number) => ({
                className: "",
                cells: [
                    { value: index + 1, className: "text-center" },
                    {
                        value: <div className="flex flex-col">
                            {item.customer.company_name}
                            <div className="flex flex-row space-x-1">
                                {item.customer.customer_tags && item.customer.customer_tags.map((tag) => (

                                    <TagCustomer nameTag={`${tag.group_tag.tag_name}`} color={`${tag.group_tag.color}`} />
                                ))}

                            </div>
                        </div>, className: "text-left"
                    },
                    { value: (<RatingShow value={item.priority} className="w-5 h-5" />), className: "text-left" },
                    { value: item.quotation_number, className: "text-center" },
                    { value: new Date(item.issue_date).toLocaleDateString("th-TH"), className: "text-center" },
                    {
                        value: (
                            <div className="flex flex-col">
                                {item.quotation_status}
                                <div className="">
                                    {new Date(item.issue_date).toLocaleDateString("th-TH")}
                                </div>
                            </div>
                        ), className: "text-left"
                    },
                    { value: item.grand_total.toLocaleString(), className: "text-center" },
                ],
                data: item,
            }));

        } else if (activeTab === 'saleorder' && employee?.responseObject?.sale_order_responsible) {
            // --- ส่วนของ ใบสั่งขาย ---
            rawData = employee.responseObject.sale_order_responsible;
            formattedData = rawData.map((item: TypeSaleOrderResponsible, index: number) => ({
                className: "",
                cells: [
                    { value: index + 1, className: "text-center" },
                    {
                        value: <div className="flex flex-col">
                            {item.customer.company_name}
                            <div className="flex flex-row space-x-1">
                                {item.customer.customer_tags && item.customer.customer_tags.map((tag) => (

                                    <TagCustomer nameTag={`${tag.group_tag.tag_name}`} color={`${tag.group_tag.color}`} />
                                ))}

                            </div>
                        </div>, className: "text-left"
                    },
                    { value: (<RatingShow value={item.priority} className="w-5 h-5" />), className: "text-left" },
                    { value: item.sale_order_number, className: "text-center" },
                    { value: new Date(item.created_at).toLocaleDateString("th-TH"), className: "text-center" },
                    {
                        value: (
                            <div className="flex flex-col">
                                {item.sale_order_status}
                                <div className="">
                                    {new Date(item.created_at).toLocaleDateString("th-TH")}
                                </div>
                            </div>
                        ), className: "text-left"
                    },
                    { value: item.grand_total.toLocaleString(), className: "text-center" },
                ],
                data: item,
            }));
        }

        setData(formattedData);

    }, [employee, activeTab]);


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


    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {

    };

    //tabs บน headertable
    const groupTabs = [
        {
            id: "quotation",
            name: "ใบเสนอราคา",
            onChange: () => setActiveTab("quotation")
        },
        {
            id: "saleorder",
            name: "ใบสั่งขาย",
            onChange: () => setActiveTab("saleorder")
        },
    ];
    // const mockData = [
    //     {
    //         className: "",
    //         cells: [
    //             { value: "1", className: "text-center" },
    //             {
    //                 value: (
    //                     <div className="flex flex-col">
    //                         บริษัทจอมมี่ จำกัด
    //                         <div className="flex flex-row space-x-1">
    //                             <TagCustomer nameTag="B2B" color="#CC0033" />

    //                         </div>
    //                     </div>
    //                 ), className: "text-left"
    //             },
    //             { value: (<RatingShow value={3} className="w-5 h-5" />), className: "text-left" },
    //             {
    //                 value: (
    //                     <div className="flex flex-col">
    //                         Q#00000000000
    //                         <div className="">
    //                             p#11223344455

    //                         </div>
    //                     </div>
    //                 ), className: "text-left"
    //             },
    //             { value: "12/2/2024", className: "text-center" },
    //             {
    //                 value: (
    //                     <div className="flex flex-col">
    //                         รับสินค้าแล้ว
    //                         <div className="">
    //                             16/2/2024
    //                         </div>
    //                     </div>
    //                 ), className: "text-left"
    //             },
    //             { value: "", className: "text-left" },
    //         ],
    //         data: {
    //             color_name: "Red",
    //             color_id: 1,
    //         },
    //     }
    // ];
    const headers = [
        { label: "หมายเลขการขาย", colSpan: 1, className: "min-w-20" },
        { label: "ลูกค้า", colSpan: 1, className: "min-w-40" },
        { label: "ความสำคัญ", colSpan: 1, className: "min-w-20" },
        { label: "หมายเลขเอกสารสำคัญ", colSpan: 1, className: "min-w-20 " },
        { label: "วันเริ่ม", colSpan: 1, className: "min-w-20" },
        { label: "สถานะ", colSpan: 1, className: "min-w-40" },
        { label: "มูลค่า", colSpan: 1, className: "min-w-40" },
    ];


    const profileUrl = employee?.responseObject?.profile_picture
        ? `${appConfig.baseApi}${employee?.responseObject?.profile_picture}`
        : null;

    return (
        <>
            <h1 className="text-2xl font-bold mb-3">รายละเอียดพนักงาน</h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลพนักงาน */}
                    <div className="flex justify-between mb-1">
                        <h1 className="text-xl font-semibold">ข้อมูลพนักงาน</h1>


                        <Link to={`/edit-employee-details/${employeeId}`}>
                            <Buttons
                                btnType="primary"
                                variant="outline"
                                className="w-30 "
                            >
                                <LuPencil style={{ fontSize: "18px" }} />
                                แก้ไข
                            </Buttons>
                        </Link>

                    </div>

                    <div className="border-b-2 border-main mb-6"></div>

                    <div className="flex justify-center xl:justify-start items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-4">
                            <img
                                src={
                                    employee?.responseObject.profile_picture
                                        ? profileUrl
                                        : "/images/avatar2.png"
                                }
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        {/* ฝั่งซ้าย */}
                        <div className="space-y-4">

                            <div className="">

                                <LabelWithValue label="ชื่อผู้ใช้งาน" value={`${employee?.responseObject?.username}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="ชื่อ" value={`${employee?.responseObject?.first_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="ตำแหน่ง" value={`${employee?.responseObject?.position}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue
                                    label="วันเริ่มทำงาน"
                                    value={
                                        employee?.responseObject?.start_date
                                            ? new Date(employee?.responseObject?.start_date).toLocaleDateString("th-TH")
                                            : "-"
                                    } classNameLabel="sm:w-1/2" classNameValue="w-80"
                                />
                            </div>
                            <div className="">
                                <LabelWithValue label="สถานะ" value={`${employee?.responseObject?.employee_status?.name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                        </div>

                        {/* ฝั่งขวา*/}
                        <div className="space-y-4">

                            <div className="">

                                <LabelWithValue label="รหัสพนักงาน" value={`${employee?.responseObject?.employee_code}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="นามสกุล" value={`${employee?.responseObject?.last_name ?? "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="บทบาท" value={`${employee?.responseObject?.role.role_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>

                            <div className="">

                                <LabelWithValue
                                    label="วันที่เลิกทำงาน"
                                    value={
                                        employee?.responseObject?.end_date
                                            ? new Date(employee?.responseObject?.end_date).toLocaleDateString("th-TH")
                                            : "-"
                                    } classNameLabel="sm:w-1/2" classNameValue="w-80"
                                />
                            </div>
                            <LabelWithValue
                                label="เงินเดือน/ค่าแรง"
                                value={
                                    employee?.responseObject?.salary != null
                                        ? employee.responseObject.salary.toLocaleString()
                                        : "-"
                                }
                                classNameLabel="sm:w-1/2"
                                classNameValue="w-80"
                            />


                            <div className="">

                                <LabelWithValue label="ทีม" value={`${employee?.responseObject?.team_employee?.name ?? "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                        </div>


                    </div>



                    {/* รายละเอียดพนักงาน */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดพนักงาน</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        {/* ฝั่งซ้าย */}
                        <div className="space-y-4">

                            <div className="">

                                <LabelWithValue label="ประเทศ" value={`${employee?.responseObject?.address[0]?.country?.country_name || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                            <div className="">
                                <LabelWithValue label="จังหวัด" value={`${employee?.responseObject?.address[0]?.province?.province_name || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />


                            </div>
                            <div className="">

                                <LabelWithValue label="อำเภอ" value={`${employee?.responseObject?.address[0]?.district?.district_name || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">


                                <LabelWithValue label="ที่อยู่" value={`${employee?.responseObject?.address[0]?.address || "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">

                            <div className="">
                                <LabelWithValue label="อีเมล" value={`${employee?.responseObject?.email ?? "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="เบอร์โทรศัพท์" value={`${employee?.responseObject?.phone ?? "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">

                                <LabelWithValue
                                    label="วันเกิด"
                                    value={
                                        employee?.responseObject?.birthdate
                                            ? new Date(employee?.responseObject?.birthdate).toLocaleDateString("th-TH")
                                            : "-"
                                    } classNameLabel="sm:w-1/2" classNameValue="w-80"
                                />
                            </div>
                            <div className="">
                                <LabelWithValue label="ช่องทางการติดต่อ" value={`${employee?.responseObject?.detail_social[0]?.social.name ?? "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                            <div className="">
                                <LabelWithValue label="LINE" value={`${employee?.responseObject?.detail_social[0]?.detail ?? "-"}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>


                        </div>


                    </div>

                </div>
            </div>

            <MasterTableFeature
                title=""
                hideTitleBtn={true}
                headers={headers}
                rowData={data}
                totalData={employee?.responseObject?.quotation_responsible?.length}
                onCreateBtn={false} // ให้มีปุ่ม create เพิ่มมารป่าว
                onDropdown={true}
                headerTab={true}
                groupTabs={groupTabs}
            />
            <div className="flex justify-center md:justify-end space-x-5 mt-5">

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
