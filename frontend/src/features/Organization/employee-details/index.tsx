import { useCallback, useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";

import { OptionType } from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";

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

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function EmployeeDetails() {
  


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
            name: "งานที่รับผิดชอบ",
            onChange: () => setFilterGroup(null)
        },

    ];
    const mockData = [
        {
            className: "",
            cells: [
                { value: "1", className: "text-center" },
                {
                    value: (
                        <div className="flex flex-col">
                            บริษัทจอมมี่ จำกัด
                            <div className="flex flex-row space-x-1">
                                <TagCustomer nameTag="B2B" color="#CC0033" />

                            </div>
                        </div>
                    ), className: "text-left"
                },
                { value: (<RatingShow value={3} className="w-5 h-5" />), className: "text-left" },
                {
                    value: (
                        <div className="flex flex-col">
                            Q#00000000000
                            <div className="">
                                p#11223344455

                            </div>
                        </div>
                    ), className: "text-left"
                },
                { value: "12/2/2024", className: "text-center" },
                {
                    value: (
                        <div className="flex flex-col">
                            รับสินค้าแล้ว
                            <div className="">
                                16/2/2024
                            </div>
                        </div>
                    ), className: "text-left"
                },
                { value: "", className: "text-left" },
            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        }
    ];
    const headers = [
        { label: "หมายเลขการขาย", colSpan: 1, className: "min-w-20" },
        { label: "ลูกค้า", colSpan: 1, className: "min-w-40" },
        { label: "ความสำคัญ", colSpan: 1, className: "min-w-20" },
        { label: "หมายเลขเอกสารสำคัญ", colSpan: 1, className: "min-w-20 " },
        { label: "วันเริ่ม", colSpan: 1, className: "min-w-20" },
        { label: "สถานะ", colSpan: 1, className: "min-w-40" },
        { label: "มูลค่า", colSpan: 1, className: "min-w-40" },
    ];


    return (
        <>
            <h1 className="text-2xl font-bold mb-3">รายละเอียดพนักงาน</h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลพนักงาน */}
                    <div className="flex justify-between mb-1">
                        <h1 className="text-xl font-semibold">ข้อมูลพนักงาน</h1>


                        <Link to="/edit-employee-details">
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

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        {/* ฝั่งซ้าย */}
                        <div className="space-y-4">

                            <div className="">

                                <LabelWithValue label="รหัสพนักงาน" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="ชื่อ-นามสกุล" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="ตำแหน่ง" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                            <div className="">
                                <LabelWithValue label="ทีม" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                        </div>

                        {/* ฝั่งขวา*/}
                        <div className="space-y-4">

                            <div className="">

                                <LabelWithValue label="วันเริ่มทำงาน" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="สถานะ" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="เงินเดือน/ค่าแรง" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

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

                                <LabelWithValue label="ประเทศ" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="จังหวัด" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="อำเภอ" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">


                                <LabelWithValue label="ที่อยู่" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">

                            <div className="">
                                <LabelWithValue label="เบอร์โทรศัพท์" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="อีเมล" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="LINE" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>


                        </div>


                    </div>

                </div>
            </div>
            <MasterTableFeature
                title=""
                hideTitleBtn={true}
                headers={headers}
                rowData={mockData}
                totalData={mockData?.length}
                onCreateBtn={false} // ให้มีปุ่ม create เพิ่มมารป่าว
                onDropdown={true}
                hidePagination={true}
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
