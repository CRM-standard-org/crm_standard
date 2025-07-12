import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import MasterSelectComponent from "@/components/customs/select/select.main.component";
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
import { useColor } from "@/hooks/useColor";
import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";


type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function EditCustomerActivity() {
    const [searchText, setSearchText] = useState("");
    const [colorsName, setColorsName] = useState("");
    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [dateActivity, setDateActivity] = useState<Date | null>(null);
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [activityDetail, setActivityDetail] = useState("");

    const [customer, setCustomer] = useState<string | null>(null);
    const [team, setTeam] = useState<string | null>(null);
    const [responsible, setResponsible] = useState<string | null>(null);

    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const [allQuotation, setAllQuotation] = useState<any[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);

    const [filterGroup, setFilterGroup] = useState<string | null>(null);


    const { data: dataColor, refetch: refetchColor } = useColor({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });

    const activityDay = async () => {
        return {
            responseObject: [
                { id: 1, name: "19 ก.พ. 2568" },
                { id: 2, name: "20 ก.พ. 2568" },
                { id: 3, name: "21 ก.พ. 2568" },
                { id: 4, name: "22 ก.พ. 2568" },
            ],
        };
    };

    const customerName = async () => {
        return {
            responseObject: [
                { id: 1, name: "ลูกค้า A" },
                { id: 2, name: "ลูกค้า B" },
                { id: 3, name: "ลูกค้า C" },
                { id: 4, name: "ลูกค้า D" },
            ],
        };
    };
    const teamName = async () => {
        return {
            responseObject: [
                { id: 1, name: "ทีม A" },
                { id: 2, name: "ทีม B" },
                { id: 3, name: "ทีม C" },
                { id: 4, name: "ทีม D" },
            ],
        };
    };
    const personName = async () => {
        return {
            responseObject: [
                { id: 1, name: "นาย A" },
                { id: 2, name: "นาย B" },
                { id: 3, name: "นาย C" },
                { id: 4, name: "นาย D" },
            ],
        };
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
        }, {
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
        }, {
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
            name: "บันทึกกิจกรรมของลูกค้า: บริษัทจอมมี่จำกัด",
            onChange: () => setFilterGroup(null)
        },


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
        { label: "วันเวลาของกิจกรรม", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดกิจกรรม", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "w-auto " },
        { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
        { label: "ทีม", colSpan: 1, className: "w-auto" },
        { label: "แก้ไข", colSpan: 1, className: "w-auto" },
    ];

    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce(searchText);
            refetchColor();
        }
    }, [searchText]);

    //handle
    const handleSearch = () => {
        setSearchTextDebouce(searchText);
        refetchColor();
        console.log("Search:", { searchText });
    };
    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        if (!colorsName) {
            showToast("กรุณาระบุสี", false);
            return;
        }
        try {
            const response = await postColor({
                color_name: colorsName, // ใช้ชื่อ field ที่ตรงกับ type
            });

            if (response.statusCode === 200) {
                setColorsName("");
                showToast("สร้างรายการสีเรียบร้อยแล้ว", true);
                refetchColor();
            } else {
                showToast("รายการสีนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างรายการสีได้", false);
        }
    };
    //เปิด
    const handleEditOpen = () => {
        navigate('/edit-customer-activity');
    };


    return (
        <>
            <div className="p-7 bg-white shadow-lg rounded-lg">

                {/* ข้อมูลกิจกรรม */}
                <h1 className="text-xl font-semibold mb-1">ข้อมูลกิจกรรม</h1>
                <div className="border-b-2 border-main mb-6"></div>


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                    <div className="">

                        <div className="">
                            <DatePickerComponent
                                id="doc-date"
                                label="วันออกเอกสาร"
                                placeholder="dd/mm/yy"
                                selectedDate={dateActivity}
                                onChange={(date) => setDateActivity(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="">

                        <MasterSelectComponent
                            id="customer"
                            onChange={(option) => setCustomer(option ? String(option.value) : null)}
                            fetchDataFromGetAPI={customerName}
                            valueKey="master_brand_id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="ลูกค้า"
                            labelOrientation="horizontal"
                            classNameLabel="w-1/2"
                            classNameSelect="w-full"
                            nextFields={{ left: "date-activity", right: "date-activity", up: "responsible", down: "team" }}
                        />
                    </div>
                    <div className="flex sm:flex-nowrap sm:items-center gap-2">

                        <label className="whitespace-nowrap w-1/2">เวลาของกิจกรรม</label>

                        <InputAction
                            id="hour"
                            placeholder="hh"
                            label=""
                            labelOrientation="horizontal"
                            onChange={(e) => setHour(e.target.value)}
                            value={hour}
                            onAction={handleConfirm}
                            classNameLabel=""
                            classNameInput="w-full"
                            nextFields={{ left: "team", right: "minute", up: "date-activity", down: "activity-detail" }}
                        />
                        <label>:</label>
                        <InputAction
                            id="minute"
                            placeholder="mm"
                            label=""
                            labelOrientation="horizontal"
                            onChange={(e) => setMinute(e.target.value)}
                            value={minute}
                            onAction={handleConfirm}
                            classNameLabel=""
                            classNameInput="w-full"
                            nextFields={{ left: "hour", right: "team", up: "date-activity", down: "activity-detail" }}
                        />

                        <label className="">น.</label>

                    </div>
                    <div className="">

                        <MasterSelectComponent
                            id="team"
                            onChange={(option) => setTeam(option ? String(option.value) : null)}
                            fetchDataFromGetAPI={teamName}
                            valueKey="master_brand_id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="ทีมผู้รับผิดชอบ"
                            labelOrientation="horizontal"
                            classNameLabel="w-1/2"
                            classNameSelect="w-full"
                            nextFields={{ left: "minute", right: "hour", up: "customer", down: "responsible" }}
                        />
                    </div>
                    <div className="">

                        <TextArea
                            id="activity-detail"
                            placeholder=""
                            onChange={(e) => setActivityDetail(e.target.value)}
                            value={activityDetail}
                            label="รายละเอียดกิจกรรม"
                            labelOrientation="horizontal"
                            classNameLabel="w-1/2 "
                            classNameInput="w-full"
                            onMicrophone={true}
                            nextFields={{ left: "responsible", right: "responsible", up: "hour", down: "date-activity" }}
                        />
                    </div>
                    <div className="">

                        <MasterSelectComponent
                            id="responsible"
                            onChange={(option) => setResponsible(option ? String(option.value) : null)}
                            fetchDataFromGetAPI={teamName}
                            valueKey="master_brand_id"
                            labelKey="name"
                            placeholder="กรุณาเลือก..."
                            isClearable
                            label="ผู้รับผิดชอบ"
                            labelOrientation="horizontal"
                            classNameLabel="w-1/2  "
                            classNameSelect="w-full"
                            nextFields={{ left: "activity-detail", right: "activity-detail", up: "team", down: "customer" }}

                        />
                    </div>




                </div>


            </div>
            <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="submit"
                    variant="solid"
                    className="w-30"
                >
                    บันทึก
                </Buttons>
                <Link to="/customer-activity">
                    <Buttons
                        btnType="cancel"
                        variant="soft"
                        className="w-30 "
                    >
                        ยกเลิก
                    </Buttons>
                </Link>

            </div>
            <MasterTableFeature
                title=""
                hideTitleBtn={true}
                headers={headers}
                rowData={mockData}
                totalData={mockData.length}
                onEdit={handleEditOpen}
                headerTab={true}
                groupTabs={groupTabs}
                hidePagination={false}
            />
        </>

    );
}
