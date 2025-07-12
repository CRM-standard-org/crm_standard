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
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import RadioComponent from "@/components/customs/radios/radio.component";
import { LabelWithValue } from "@/components/ui/label";
import TextArea from "@/components/customs/textAreas/textarea.main.component";

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
    const [colorsName, setColorsName] = useState("");
    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [firstContact, setFirstContact] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

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

            } else {
                showToast("รายการสีนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างรายการสีได้", false);
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

                            <h1 className="text-xl font-semibold mb-1">ข้อมูลลูกค้า</h1>
                            <div className="border-b-2 border-main mb-6"></div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-400 text-white text-center rounded-full w-28 h-28 flex items-center justify-center">Logo</div>
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="ชื่อบริษัท"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="ชื่อย่อ"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="ประเภทธุรกิจ"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="เว็บไซต์"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="ปีที่ก่อตั้ง"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>

                                <div className="">

                                    <TextArea
                                        id="company-address"
                                        placeholder=""
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                        value={companyAddress}
                                        label="ที่ตั้งสำนักงานใหญ่"
                                        labelOrientation="horizontal"
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2  "
                                        classNameInput="w-full"
                                        nextFields={{ left: "company-email", right: "company-email", up: "company-placename", down: "company-country" }}

                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="เบอร์โทรศัพท์"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="เบอร์โทรสาร"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>
                                <div className="">
                                    <InputAction
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="เลขประจำตัวผู้เสียภาษี"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
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
                                        id="contact-person"
                                        placeholder=""
                                        onChange={(e) => setFirstContact(e.target.value)}
                                        value={firstContact}
                                        label="สำนักงานใหญ่"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        onAction={handleConfirm}
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ left: "email", right: "email", up: "responsible", down: "position" }}
                                    />
                                </div>
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
