import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

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
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function EditInfoCustomer() {
    const [searchText, setSearchText] = useState("");
    const [colorsName, setColorsName] = useState("");
    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);


    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const [allQuotation, setAllQuotation] = useState<any[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);

   
    const [conditions, setConditions] = useState<number[]>([1]);
    const [nextId, setNextId] = useState<number>(2);

    const initialStatus = async () => {
        return {
            responseObject: [
                { id: 1, name: "ซื้ออย่างน้อย" },
                { id: 2, name: "หลังจากการซื้อครั้งแรก" },
                { id: 3, name: "หลังจากการซื้อครั้งแรก" },
                { id: 4, name: "มูลค่าการซื้อเฉลี่ยมากกว่า" },
                { id: 5, name: "มูลค่าการซื้อเฉลี่ยน้อยกว่า" },
            ],
        };
    };


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
        { label: "สถานะ", colSpan: 1, className: "w-auto" },
        { label: "ลูกค้า", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "w-auto" },
        { label: "ความสำคัญ", colSpan: 1, className: "w-auto " },
        { label: "บทบาทของลูกค้า", colSpan: 1, className: "w-auto" },
        { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
        { label: "ทีม", colSpan: 1, className: "w-auto" },
        { label: "กิจกรรมล่าสุด", colSpan: 1, className: "w-auto" },
    ];


    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce(searchText);
          
        }
    }, [searchText]);

    //เพิ่มเงื่อนไข
    const handleAddCondition = () => {
        setConditions((prev) => [...prev, nextId]);
        setNextId((prev) => prev + 1);
    };

    //ลบเงื่อนไข
    const handleDeleteCondition = (id: number) => {
        setConditions((prev) => prev.filter((c) => c !== id));
    };
    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        
    };


    return (
        <>
            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลลูกค้า */}
                    <h1 className="text-xl font-semibold mb-1">ข้อมูลสถานะ</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="flex flex-row items-center space-x-4">
                        <label>ชื่อของสถานะลูกค้า</label>
                        <h1 className="font-semibold">ลูกค้าใหม่</h1>

                    </div>
                    <div className="mt-4 space-y-3">
                        {conditions.length > 0 ? (
                            conditions.map((condition, index) => (
                                <div className="">
                                    <div className="flex flex-row md:justify-between items-center mb-3">
                                        <label className="w-full md:w-32 text-blue-400">เงื่อนไขที่ {index + 1}</label>
                                        <Buttons
                                            btnType="delete"
                                            variant="solid"
                                            className="w-10"
                                            onClick={() => handleDeleteCondition(condition)}
                                        >
                                            ลบ
                                        </Buttons>
                                    </div>
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">

                                        {/* ซื้ออย่างน้อย */}
                                        <div className="">
                                            <MasterSelectComponent
                                                id="init-status"
                                                onChange={(option) => setSelectedOption(option ? String(option.value) : null)}
                                                fetchDataFromGetAPI={initialStatus}
                                                valueKey="master_brand_id"
                                                labelKey="name"
                                                placeholder="ซื้ออย่างน้อย"
                                                isClearable
                                                label="เงื่อนไขการเริ่มต้นของสถานะ"
                                                labelOrientation="horizontal"
                                                classNameLabel="w-80 flex"
                                                classNameSelect="w-full lg:ms-2"
                                                nextFields={{ left: "end-status", right: "end-status", up: "init-value", down: "init-count" }}
                                            />

                                        </div>
                                        {/* ซื้ออย่างน้อย */}
                                        <div className="">
                                            <MasterSelectComponent
                                                id="end-status"
                                                onChange={(option) => setSelectedOption(option ? String(option.value) : null)}
                                                fetchDataFromGetAPI={initialStatus}
                                                valueKey="master_brand_id"
                                                labelKey="name"
                                                placeholder="ซื้ออย่างน้อย"
                                                isClearable
                                                label="เงื่อนไขการเริ่มต้นของสถานะ"
                                                labelOrientation="horizontal"
                                                classNameLabel="w-80 flex"
                                                classNameSelect="w-full lg:ms-2"
                                                nextFields={{ left: "init-status", right: "init-status", up: "end-value", down: "end-count" }}
                                            />

                                        </div>
                                        {/* จำนวนครั้ง */}
                                        <div className="flex flex-col sm:flex-row sm:space-x-20 sm:ms-2 gap-2">
                                            <div className="">

                                                <CheckboxMainComponent
                                                    labelName="จำนวนครั้ง"
                                                    onChange={() => { }}
                                                />
                                            </div>
                                            <div className="flex flex-row items-center space-x-3 sm:ps-6">

                                                <InputAction
                                                    id="init-count"
                                                    placeholder="1"
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-full md:w-60 flex"
                                                    classNameInput="w-full "
                                                    nextFields={{ left: "end-count", right: "end-count", up: "init-status", down: "init-year" }}
                                                />
                                                <label>ครั้ง</label>
                                            </div>
                                        </div>
                                        {/* จำนวนครั้ง */}
                                        <div className="flex flex-col sm:flex-row sm:space-x-20 sm:ms-2 gap-2">
                                            <div className="">

                                                <CheckboxMainComponent
                                                    labelName="จำนวนครั้ง"
                                                    onChange={() => { }}
                                                />
                                            </div>
                                            <div className="flex flex-row items-center space-x-3 sm:ps-6">

                                                <InputAction
                                                    id="end-count"
                                                    placeholder="1"
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-full md:w-60 flex"
                                                    classNameInput="w-full "
                                                    nextFields={{ left: "init-count", right: "init-count", up: "end-status", down: "end-year" }}
                                                />
                                                <label>ครั้ง</label>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:ms-2 gap-2">
                                            <div className="sm:me-16">

                                                <CheckboxMainComponent
                                                    labelName="ภายในระยะเวลา"
                                                    onChange={() => { }}
                                                />
                                            </div>
                                            <div className="flex flex-row items-center space-x-3 w-80 sm:ms-3">

                                                <InputAction
                                                    id="init-year"
                                                    placeholder=""
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-25 flex"
                                                    classNameInput="w-full"
                                                    nextFields={{ left: "end-day", right: "init-month", up: "inti-count", down: "init-value" }}
                                                />
                                                <label>ปี</label>
                                                <InputAction
                                                    id="init-month"
                                                    placeholder=""
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-25 flex"
                                                    classNameInput="w-full"
                                                    nextFields={{ left: "init-year", right: "init-day", up: "inti-count", down: "init-value" }}
                                                />
                                                <label>เดือน</label>
                                                <InputAction
                                                    id="init-day"
                                                    placeholder=""
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-25 flex"
                                                    classNameInput="w-full"
                                                    nextFields={{ left: "init-month", right: "end-year", up: "inti-count", down: "init-value" }}
                                                />
                                                <label>วัน</label>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:ms-2 gap-2">
                                            <div className="sm:me-16">

                                                <CheckboxMainComponent
                                                    labelName="ภายในระยะเวลา"
                                                    onChange={() => { }}
                                                />
                                            </div>
                                            <div className="flex flex-row items-center space-x-3 w-80 sm:ms-3">

                                                <InputAction
                                                    id="end-year"
                                                    placeholder=""
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-25 flex"
                                                    classNameInput="w-full"
                                                    nextFields={{ left: "init-day", right: "end-month", up: "end-count", down: "end-value" }}
                                                />
                                                <label>ปี</label>
                                                <InputAction
                                                    id="end-month"
                                                    placeholder=""
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-25 flex"
                                                    classNameInput="w-full"
                                                    nextFields={{ left: "end-year", right: "end-day", up: "end-count", down: "end-value" }}
                                                />
                                                <label>เดือน</label>
                                                <InputAction
                                                    id="end-day"
                                                    placeholder=""
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-25 flex"
                                                    classNameInput="w-full"
                                                    nextFields={{ left: "end-month", right: "init-year", up: "end-count", down: "end-value" }}
                                                />
                                                <label>วัน</label>
                                            </div>
                                        </div>
                                        {/* มูลค่า */}
                                        <div className="flex flex-col sm:flex-row sm:space-x-20 sm:ms-2 gap-2">
                                            <div className="">

                                                <CheckboxMainComponent
                                                    labelName="มูลค่า"
                                                    onChange={() => { }}
                                                />
                                            </div>
                                            <div className="flex flex-row items-center space-x-3 sm:ps-14">

                                                <InputAction
                                                    id="init-value"
                                                    placeholder="1"
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-full md:w-60 flex"
                                                    classNameInput="w-full "
                                                    nextFields={{ left: "end-value", right: "end-value", up: "init-year", down: "init-status" }}
                                                />

                                            </div>
                                        </div>
                                        {/* มูลค่า */}
                                        <div className="flex flex-col sm:flex-row sm:space-x-20 sm:ms-2 gap-2">
                                            <div className="">

                                                <CheckboxMainComponent
                                                    labelName="มูลค่า"
                                                    onChange={() => { }}
                                                />
                                            </div>
                                            <div className="flex flex-row items-center space-x-3 sm:ps-14">

                                                <InputAction
                                                    id="end-value"
                                                    placeholder="1"
                                                    value=""
                                                    label=""
                                                    labelOrientation="horizontal"
                                                    onChange={(e) => setColorsName(e.target.value)}
                                                    onAction={handleConfirm}
                                                    classNameLabel="w-full md:w-60 flex"
                                                    classNameInput="w-full "
                                                    nextFields={{ left: "init-value", right: "init-value", up: "end-year", down: "end-status" }}
                                                />

                                            </div>
                                        </div>

                                    </div>



                                </div>
                            ))
                        ) : (
                            <div className="text-main text-center font-semibold">ยังไม่มีเงื่อนไข</div>
                        )
                        }

                        {/* ปุ่มเพิ่มสถานะ  */}
                        <Buttons
                            btnType="primary"
                            variant="outline"
                            className="w-30"
                            onClick={handleAddCondition}
                        >
                            + เพิ่มเงื่อนไข
                        </Buttons>
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
                    <Link to="/customer-info">
                        <Buttons
                            btnType="cancel"
                            variant="soft"
                            className="w-30 "
                        >
                            ยกเลิก
                        </Buttons>
                    </Link>

                </div>
            </div>

        </>

    );
}
