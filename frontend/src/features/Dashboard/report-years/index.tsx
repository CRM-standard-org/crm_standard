import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Table, Box, Text } from "@radix-ui/themes";
import { useNavigate, useSearchParams } from "react-router-dom";


import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { FiLayers, FiPrinter } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlinePerson } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { Button } from "@radix-ui/themes";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { pdf } from "@react-pdf/renderer";
import ReportYearPDF from "../pdf/print-report-year/ReportYearPDF";

import html2canvas from "html2canvas-pro";
import { useRef } from "react";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllCustomerResponse; //ตรงนี้
}[];

//
export default function ReportYears() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);



  const [year, setYear] = useState<Date | null>(new Date());

  const [searchYear, setSearchYear] = useState("");
  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const chartRef = useRef<HTMLDivElement>(null);

  const handleOpenPdf = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imageData = canvas.toDataURL("image/png");

      const blob = await pdf(<ReportYearPDF chartImage={imageData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };



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
  //

  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  // mockup table
  const salesDataTable = [
    {
      label: 'เป้าหมาย 2024',
      values: [916859, 844316, 855697, 872106, 916769, 904125, 856576, 980155, 836722, 955851, 950295, 985710],
    },
    {
      label: 'ยอดขาย 2023',
      values: [859837, 827474, 805669, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: 'ยอดขาย 2024',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    }, {
      label: '%การเติบโต',
      values: [15.38, 15.58, 6.74, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: 'เฉลี่ยต่อคำสั่งซื้อ 2023',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
    {
      label: 'เฉลี่ยต่อคำสั่งซื้อ 2024',
      values: [859837, 827474, 805669, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: '%การเติบโต',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
    {
      label: 'จำนวนลูกค้า 2023',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
    {
      label: 'จำนวนลูกค้า 2024',
      values: [859837, 827474, 805669, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: '%การเติบโต',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
  ];
  //mockup chart
  const salesData = [
    { month: 'ม.ค.', sales2023: 859837, sales2024: 880082, target2024: 916859 },
    { month: 'ก.พ.', sales2023: 827474, sales2024: 677175, target2024: 844316 },
    { month: 'มี.ค.', sales2023: 805669, sales2024: 675333, target2024: 855697 },
    { month: 'เม.ย.', sales2023: 782765, sales2024: 818799, target2024: 872106 },
    { month: 'พ.ค.', sales2023: 879842, sales2024: 790505, target2024: 916769 },
    { month: 'มิ.ย.', sales2023: 941068, sales2024: 832800, target2024: 904125 },
    { month: 'ก.ค.', sales2023: 781089, sales2024: 907190, target2024: 856576 },
    { month: 'ส.ค.', sales2023: 999466, sales2024: 963810, target2024: 980155 },
    { month: 'ก.ย.', sales2023: 744191, sales2024: 726755, target2024: 836722 },
    { month: 'ต.ค.', sales2023: 980393, sales2024: 869910, target2024: 955851 },
    { month: 'พ.ย.', sales2023: 863313, sales2024: 727310, target2024: 950295 },
    { month: 'ธ.ค.', sales2023: 938388, sales2024: 1005770, target2024: 985710 },
  ];




  return (
    <div>

      <p className="text-2xl font-bold">รายงานยอดขายประจำปี</p>
      <div className="p-3 px-5 flex flex-wrap gap-3 items-center bg-white mb-3 shadow-md w-full">
        <div className="w-full sm:w-auto">
          <DatePickerComponent
            id="doc-date"
            label="ปี"
            selectedDate={year}
            onChange={(date) => setYear(date)}
            classNameLabel=""
            classNameInput="w-full"
          />
        </div>

        <div className="w-full sm:w-auto">
          <Buttons
            btnType="primary"
            variant="outline"
            className="w-full sm:w-32"
          >
            ค้นหา
          </Buttons>
        </div>
      </div>



      <div className=" bg-white shadow-md rounded-lg pb-5">
        <div className="p-2 bg-sky-100 rounded-t-lg">
          <p className="font-semibold">เอาไว้ทำหัวรายงานในอนาคต</p>
        </div>

        <div className="p-7 pb-5 w-full max-w-full overflow-x-auto  ">
          {/* content */}

          <div>
            <p className="text-2xl font-semibold mb-1">รายงานยอดขายประจำปี</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
            <p className="text-xs text-gray-500 mb-6">เปรียบเทียบยอดขาย ปี 2023 และ ปี 2024</p>
          </div>
          <div className="flex flex-row mt-5 mb-6 space-x-5">
            <div className="flex flex-col">
              <p className="font-semibold">ยอดขายรวมปี 2023</p>
              <p className="font-semibold">THB 9,859,774</p>
              <p>เฉลี่ยต่อคำสั่งซื้อ THB 826.20</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">ยอดขายรวมปี 2024 (ํYTD)</p>
              <p className="font-semibold">THB 10,403,495</p>
              <p>เฉลี่ยต่อคำสั่งซื้อ THB 880.08</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">เป้าหมายการขายปี 2024</p>
              <p className="font-semibold">THB 10,875,181</p>

            </div>
          </div>

          <Table.Root variant="surface" size="2" className="whitespace-nowrap">
            <Table.Header>
              <Table.Row >
                <Table.ColumnHeaderCell>ค่าเงิน THB</Table.ColumnHeaderCell>
                {months.map((month) => (

                  <Table.ColumnHeaderCell key={month} className="text-end">{month}</Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {salesDataTable.map((row) => {
                const isGrowthRow = row.label.includes('%');
                return (
                  <Table.Row key={row.label} className={isGrowthRow ? 'bg-blue-50' : ''}>
                    <Table.RowHeaderCell className={isGrowthRow ? 'text-blue-700 font-semibold' : ''}>{row.label}</Table.RowHeaderCell>
                    {row.values.map((value, index) => (
                      <Table.Cell
                        key={index}
                        className={`text-end ${isGrowthRow ? 'font-semibold' : ''}`}
                      >
                        {value.toLocaleString()}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                )
              }
              )}
            </Table.Body>
          </Table.Root>


          <p className="font-semibold mt-5">กราฟเปรียบเทียบสถิติยอดขายภายใน ปี 2023 และ ปี 2024</p>
          {/* chart */}
          <div className="pb-5 w-full">

            <div className="pt-5">

              <div ref={chartRef} className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">

                  <ComposedChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      allowDecimals={false}
                      domain={[0, 1000000]}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip formatter={(value: number) => value.toLocaleString()} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="target2024" fill="#003399" name="เป้าหมายยอดขาย 2024 (THB)" />
                    <Line dataKey="sales2023" stroke="#f97316" strokeWidth={2} name="ยอดขาย 2023 (THB)" dot={{ r: 2 }} />
                    <Line dataKey="sales2024" stroke="#0ea5e9" strokeWidth={2} name="ยอดขาย 2024 (THB)" dot={{ r: 2 }} />
                  </ComposedChart>

                </ResponsiveContainer>
              </div>
            </div>
          </div>



        </div>
      </div>
      <div className="flex justify-between space-x-5 mt-5">

        <Buttons
          btnType="primary"
          variant="outline"
          className="w-30"
          onClick={handleOpenPdf}
        >
          <FiPrinter style={{ fontSize: 18 }} />

          พิมพ์
        </Buttons>
      </div>
    </div >
  );
}
