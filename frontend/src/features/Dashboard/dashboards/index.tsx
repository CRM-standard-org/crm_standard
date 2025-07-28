import { useEffect, useState } from "react";

import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";

// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate} from "react-router-dom";
import { Table} from "@radix-ui/themes";

import { Link } from "react-router-dom";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

const COLORS = ["#66FFFF", "#66CCFF", "#3399FF", "#006699", "#000066"];
//
export default function Dashboards() {
    const navigate = useNavigate();
    const [year, setYear] = useState<string | null>(null);
    const [searchYear, setSearchYear] = useState("");

    //fetch year
    const fetchDataYearDropdown = async () => {
        return {
            responseObject: [
                { id: 1, name: "2566" },
                { id: 2, name: "2567" },
                { id: 3, name: "2568" },
                { id: 4, name: "2569" },
            ],
        }
    }
    const handleYearSearch = (searchText: string) => {
        setSearchYear(searchText);
    }
    const barData = [
        { name: "Q1", value: 830993 },
        { name: "Q2", value: 867891 },
        { name: "Q3", value: 841582 },
        { name: "Q4", value: 927364 },
    ];

    const pieData = [
        { name: "ปิดการขายสำเร็จ", value: 83.3 },
        { name: "ปิดการขายไม่สำเร็จ", value: 16.7 },
    ];

    const productShareData = [
        { name: "เครื่องใช้ไฟฟ้า", value: 26.7 },
        { name: "อุปกรณ์สำนักงาน", value: 40 },
        { name: "เฟอร์นิเจอร์สำนักงาน", value: 6.7 },
        { name: "คอมพิวเตอร์", value: 13.3 },
        { name: "ของตกแต่งสำนักงาน", value: 13.3 },
    ];
    const headers = [
        { label: "รายเดือน", colSpan: 1, className: "w-auto" },
        { label: "ลูกค้าใหม่", colSpan: 1, className: "w-auto" },
        { label: "ลูกค้าประจำ", colSpan: 1, className: "w-auto" },
        { label: "ลูกค้าห่างหาย", colSpan: 1, className: "w-auto" },
        { label: "ลูกค้าเป้าหมาย", colSpan: 1, className: "w-auto" },

    ];

    const mockData = [
        {
            className: "",
            cells: [
                { value: "มกราคม", className: "text-center" },
                { value: "+240", className: "text-center" },
                { value: "+7", className: "text-center" },
                { value: "+2", className: "text-center" },
                { value: "+15", className: "text-center" },
            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "กุมภาพันธ์", className: "text-center" },
                { value: "+40", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+21", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "มีนาคม", className: "text-center" },
                { value: "+350", className: "text-center" },
                { value: "-42", className: "text-center" },
                { value: "+42", className: "text-center" },
                { value: "+60", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "เมษายน", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+14", className: "text-center" },
                { value: "+12", className: "text-center" },
                { value: "+21", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "พฤษภาคม", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "-22", className: "text-center" },
                { value: "+22", className: "text-center" },
                { value: "+0", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "มิถุนายน", className: "text-center" },
                { value: "+150", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+50", className: "text-center" },
                { value: "+0", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "กรกฏาคม", className: "text-center" },
                { value: "+190", className: "text-center" },
                { value: "+40", className: "text-center" },
                { value: "+1", className: "text-center" },
                { value: "+61", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "สิงหาคม", className: "text-center" },
                { value: "+140", className: "text-center" },
                { value: "+21", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+41", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "กันยายน", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "-5", className: "text-center" },
                { value: "+4", className: "text-center" },
                { value: "+0", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "ตุลาคม", className: "text-center" },
                { value: "+80", className: "text-center" },
                { value: "+10", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+32", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "พฤศจิกายน", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "-44", className: "text-center" },
                { value: "+44", className: "text-center" },
                { value: "+52", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        },
        {
            className: "",
            cells: [
                { value: "ธันวาคม", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+0", className: "text-center" },
                { value: "+4", className: "text-center" },

            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        }
    ];
    return (
        <>
            <div className="flex mb-3">
                <p className="me-2  text-2xl font-bold">ติดตามตัวชี้วัดสำคัญ</p>
                <div className="">
                    <MasterSelectComponent
                        id="character"
                        onChange={(option) => setYear(option ? String(option.value) : null)}
                        fetchDataFromGetAPI={fetchDataYearDropdown}
                        onInputChange={handleYearSearch}
                        valueKey="id"
                        labelKey="name"
                        placeholder="กรุณาเลือกปี"
                        isClearable
                        label=""
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameSelect="w-full "

                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-5 lg:row-span-4 bg-white rounded-xl shadow-md">
                    <p className="text-xl font-semibold mb-2">การเปลี่ยนแปลงของสถานะลูกค้า</p>

                    <div className="overflow-x-auto"> 
                        <Table.Root className="w-full table-fixed bg-white rounded-md text-sm ">
                            <Table.Header>
                                <Table.Row className="text-center bg-main text-white whitespace-nowrap">
                                    {headers.map((header, index) => (
                                        <Table.ColumnHeaderCell
                                            key={index}
                                            colSpan={header.colSpan}
                                            className={`
                                                ${index === 0 ? "rounded-tl-md" : ""}
                                                ${index === headers.length - 1 ? "rounded-tr-md" : ""}
                                                h-12 px-2 py-2 text-xs
                                            `}
                                            style={{ width: `${100 / headers.length}%` }}
                                        >
                                            {header.label}
                                        </Table.ColumnHeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {mockData.length > 0 ? (
                                    mockData.map((row, index) => (
                                        <Table.Row key={index}>
                                            {row.cells.map((cell, colIndex) => (
                                                <Table.Cell
                                                    key={colIndex}
                                                    className="border border-gray-300 px-2 py-1 text-center text-xs truncate"
                                                >
                                                    {cell.value}
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row>
                                        <Table.Cell
                                            colSpan={headers.length}
                                            className="text-center h-64 align-middle border border-gray-300"
                                        >
                                            No Data Found
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </div>
                </div>



                <div className="p-5 bg-white lg:row-span-2 lg:col-start-2 rounded-xl shadow-md">

                    <p className="text-xl font-semibold text-center mb-2">ค่าเฉลี่ยยอดขายจริงแต่ละไตรมาส</p>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="flex items-center justify-center">

                        <BarChart width={500} height={200} data={barData}
                            margin={{ right: 100, left: 40 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#007bff" />
                        </BarChart>
                    </div>

                </div>
                <div className="p-5 bg-white lg:row-span-2 lg:col-start-2 lg:row-start-3 rounded-xl shadow-md">
                    <p className="text-xl font-semibold text-center mb-2">อัตราการปิดการขาย</p>
                    <div className="border-b-2 border-main mb-6"></div>

                    {/* PieChart*/}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <PieChart width={250} height={250}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>

                        {/* Custom Legend */}
                        <div className="flex flex-col text-lg space-y-2">
                            {pieData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span>{entry.name} ({entry.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="p-5 bg-white rounded-xl shadow-md">
                    <p className="text-xl font-semibold text-center mb-2">สัดส่วนกลุ่มสินค้าตามปิดการขาย</p>
                    <div className="border-b-2 border-main mb-6"></div>

                    {/* PieChart */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <PieChart width={250} height={250}>
                            <Pie
                                data={productShareData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {productShareData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>

                        {/* Custom Legend */}
                        <div className="flex flex-col text-base space-y-2">
                            {productShareData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="font-medium">{entry.name} ({entry.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white rounded-xl shadow-md">
                    <p className="text-xl font-semibold text-center mb-2">สัดส่วนกลุ่มสินค้าตามข้อเสนอ</p>
                    <div className="border-b-2 border-main mb-6"></div>
                    {/* PieChart */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <PieChart width={250} height={250}>
                            <Pie
                                data={productShareData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {productShareData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>

                        {/* Custom Legend */}
                        <div className="flex flex-col text-base space-y-2">
                            {productShareData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="font-medium">{entry.name} ({entry.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>

    );
}
