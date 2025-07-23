import { useEffect, useRef, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { useToast } from "@/components/customs/alert/ToastContext";

//
import { useNavigate, useSearchParams } from "react-router-dom";

import SalesForecastTable from "@/components/customs/display/forcast.main.component";

import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";

import { IoMdStats } from "react-icons/io";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { VscExtensions } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { FiPrinter } from "react-icons/fi";
import ReportCustomerPDF from "../pdf/print-report-customer/ReportCustomerPDF";
import { pdf } from "@react-pdf/renderer";
import html2canvas from "html2canvas-pro";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllCustomerResponse; //ตรงนี้
}[];

//
export default function ReportCustomers() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);


  const [tagId, setTagId] = useState<string | null>(null);

  const [initMonth, setInitMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());

  const [searchYear, setSearchYear] = useState("");
  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  //searchText control
  const [searchTag, setSearchTag] = useState("");


  const chartRef = useRef<HTMLDivElement>(null);

  const handleOpenPdf = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imageData = canvas.toDataURL("image/png");

      const blob = await pdf(<ReportCustomerPDF chartImage={imageData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };
  
  //fetch ข้อมูล tag ลูกค้า

  const { data: dataTag, refetch: refetchTag } = useSelectTag({
    searchText: searchTag,
  });

  const fetchDataTagDropdown = async () => {
    const tagList = dataTag?.responseObject?.data ?? [];
    return {
      responseObject: tagList.map((item: TypeTagColorResponse) => ({
        id: item.tag_id,
        name: item.tag_name,
      })),
    };
  };
  const handleTagSearch = (searchText: string) => {
    setSearchTag(searchText);
    refetchTag();
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
  const headers = [
    { label: "สถานะ", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้า", colSpan: 1, className: "w-auto" },
    { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "w-auto" },
    { label: "ความสำคัญ", colSpan: 1, className: "w-auto " },
    { label: "บทบาทของลูกค้า", colSpan: 1, className: "w-auto" },
    { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
    { label: "ทีม", colSpan: 1, className: "w-auto" },
    { label: "กิจกรรมล่าสุด", colSpan: 1, className: "w-auto" },
    { label: "ดูรายละเอียด", colSpan: 1, className: "w-auto" },
    { label: "ลบ", colSpan: 1, className: "w-auto" },
  ];

  //tabs บน headertable
  const groupTabs = [
    "ลูกค้าทั้งหมด",
    "ลูกค้าเป้าหมาย",
    "ลูกค้าประจำ",
    "ลูกค้าใหม่",
    "ลูกค้าห่างหาย",
  ];

  //moclup  chart
  const customerSummary = {
    totalValue: '128,976',
    status: 'ลูกค้าประจำ',
    averageValue: '880.08',
    lastOrderDate: '20 มกราคม 2024',
    accumulated: '591,426',
  };
  const orderRaw = [
    { date: '2024-01-01', orderCount: 1 },
    { date: '2024-01-02', orderCount: 1 },
    { date: '2024-01-03', orderCount: 1 },
    { date: '2024-01-04', orderCount: 1 },
    { date: '2024-01-05', orderCount: 1 },
    { date: '2024-01-07', orderCount: 2 },
    { date: '2024-01-08', orderCount: 1 },
    { date: '2024-01-09', orderCount: 1 },
    { date: '2024-01-10', orderCount: 1 },
    { date: '2024-01-12', orderCount: 1 },
    { date: '2024-01-13', orderCount: 1 },
    { date: '2024-01-14', orderCount: 1 },
    { date: '2024-01-15', orderCount: 1 },
    { date: '2024-01-16', orderCount: 1 },
    { date: '2024-01-17', orderCount: 2 },
    { date: '2024-01-18', orderCount: 1 },
    { date: '2024-01-20', orderCount: 2 },
    { date: '2024-01-21', orderCount: 1 },
    { date: '2024-01-22', orderCount: 1 },
    { date: '2024-01-23', orderCount: 1 },
    { date: '2024-01-24', orderCount: 1 },
    { date: '2024-01-25', orderCount: 1 },
    { date: '2024-01-27', orderCount: 1 },
    { date: '2024-01-28', orderCount: 1 },
    { date: '2024-01-29', orderCount: 1 },
    { date: '2024-01-30', orderCount: 1 },
    { date: '2024-01-31', orderCount: 1 },
  ];

  const orderData = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    const fullDate = `2024-01-${day}`;
    const match = orderRaw.find((o) => o.date === fullDate);
    return {
      day,
      orders: match ? match.orderCount : 0,
    };
  });



  return (
    <div>

      <p className="text-2xl font-bold">รายงานวิเคราะห์ลูกค้า</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* ลูกค้า */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1">ลูกค้า</label>
            <MasterSelectComponent
              id="customer"
              onChange={(option) => setTagId(option ? String(option.value) : null)}
              fetchDataFromGetAPI={fetchDataTagDropdown}
              onInputChange={handleTagSearch}
              valueKey="id"
              labelKey="name"
              placeholder="ทั้งหมด"
              isClearable
              label="" // ไม่ต้องใช้
              labelOrientation="horizontal"
              classNameSelect="w-full"
            />
          </div>

          {/* วันที่เริ่ม */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1">วันที่เริ่ม</label>
            <DatePickerComponent
              id="start-date"
              selectedDate={initMonth}
              onChange={(date) => setInitMonth(date)}
              classNameLabel=""
              classNameInput="w-full"
            />
          </div>

          {/* วันที่สิ้นสุด */}
          <div className="flex flex-col w-full">
            <label className="text-md  mb-1">ระยะเวลา</label>
            <DatePickerComponent
              id="end-date"
              selectedDate={endMonth}
              onChange={(date) => setEndMonth(date)}
              classNameLabel=""
              classNameInput="w-full"
            />
          </div>

          {/* ประเภทข้อมูล */}
          <div className="flex flex-col w-full">
            <label className="text-md  mb-1">ประเภทข้อมูล</label>
            <MasterSelectComponent
              id="data-type"
              onChange={(option) => setTagId(option ? String(option.value) : null)}
              fetchDataFromGetAPI={fetchDataTagDropdown}
              onInputChange={handleTagSearch}
              valueKey="id"
              labelKey="name"
              placeholder="จำนวนคำสั่งซื้อ"
              isClearable
              label=""
              labelOrientation="horizontal"
              classNameSelect="w-full"
            />
          </div>

          {/* ปุ่มค้นหา */}
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <Buttons
              btnType="primary"
              variant="outline"
              className="w-full sm:w-auto sm:min-w-[100px]"
            >
              ค้นหา
            </Buttons>
          </div>

        </div>
      </div>


      <div className=" bg-white shadow-md rounded-lg pb-5">
        <div className="p-2 bg-sky-100 rounded-t-lg">
          <p className="font-semibold">เอาไว้ทำหัวรายงานในอนาคต</p>
        </div>
        <div className="p-7 pb-5 w-full">

          {/* content */}
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานวิเคราะห์ลูกค้า : บริษัท A</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
            <p className="text-xs text-gray-500 mb-6">1 มกราคม 2024 - 31 มกราคม 2024</p>
          </div>

          {/* info */}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-x-6 mb-8 text-sm border-t border-b divide-gray-200">
            {/* รายการ 1 */}
            <div className="flex flex-col md:flex-row md:justify-between py-2 border-b">
              <p className="text-gray-600">มูลค่าการซื้อทั้งหมดของลูกค้า</p>
              <p className="font-medium">{customerSummary.totalValue}</p>
            </div>

            {/* รายการ 2 */}
            <div className="flex flex-col md:flex-row md:justify-between py-2 border-b">
              <p className="text-gray-600">สถานะ</p>
              <p className="font-medium">{customerSummary.status}</p>
            </div>

            {/* รายการ 3 */}
            <div className="flex flex-col md:flex-row md:justify-between py-2 border-b">
              <p className="text-gray-600">มูลค่าเฉลี่ยต่อคำสั่งซื้อ</p>
              <p className="font-medium">{customerSummary.averageValue}</p>
            </div>

            {/* รายการ 4 */}
            <div className="flex flex-col md:flex-row md:justify-between py-2 border-b">
              <p className="text-gray-600">คำสั่งซื้อล่าสุด</p>
              <p className="font-medium">{customerSummary.lastOrderDate}</p>
            </div>

            {/* รายการรวม */}
            <div className="flex flex-col md:flex-row md:justify-between py-2 md:col-span-2">
              <p className="text-gray-600">มูลค่าการซื้อสะสมทั้งหมดในระบบ</p>
              <p className="font-medium">{customerSummary.accumulated}</p>
            </div>
          </div>


          {/* Chart */}
          <p className="text-center font-semibold mb-4">จำนวนการสั่งซื้อของลูกค้าประจำเดือน มกราคม</p>
          <div ref={chartRef} className="w-full h-[300px] sm:h-[400px] md:h-[500px] max-w-6xl mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} domain={[0, 3]} width={20} />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} รายการ`, 'รายการที่สั่ง']}
                  labelFormatter={(label) => `วันที่ ${label}`}
                />
                <Bar dataKey="orders" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 text-sm gap-4 mt-6">

            <div>
              <div className="flex items-center border-b space-x-2">
                <IoMdStats style={{ fontSize: "24px" }} />
                <p className="text-xl font-bold ">สถิติ (โดยเฉลี่ย)</p>
              </div>
              <div className="p-2 px-3">
                <div className="flex justify-between py-2 border-b">
                  <p>ระยะเวลาจากการเสนอราคา (Quotation - QO)</p>
                  <p className="font-semibold">7 วัน</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>ระยะเวลาจากคำสั่งขายไปจนถึงการชำระเงิน</p>
                  <p className="font-semibold">15 วัน</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>อัตราการเปลี่ยนจากใบเสนอราคาป็นคำสั่งซื้อ</p>
                  <p className="font-semibold">80 %</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>จำนวนครั้งที่มีการติดตามลูกค้า</p>
                  <p className="font-semibold">3 ครั้ง</p>
                </div>
              </div>

            </div>
            <div>
              <div className="flex items-center border-b space-x-2">
                <FaMoneyCheckDollar style={{ fontSize: "24px" }} />
                <p className="text-xl font-bold ">เงื่อนไขการชำระเงิน</p>
              </div>
              <div className="p-2 px-3">
                <div className="flex justify-between py-2 border-b">
                  <p>ผ่อนชำระ 3 เดือน ดอกเบี้ย 5%</p>
                  <p className="font-semibold">3 คำสั่งซื้อ</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>เงินสด ภายใน 7 วัน</p>
                  <p className="font-semibold">7 คำสั่งซื้อ</p>
                </div>

              </div>

            </div>
            <div>
              <div className="flex items-center border-b space-x-2">
                <VscExtensions style={{ fontSize: "24px" }} />
                <p className="text-xl font-bold ">สัดส่วนยอดขาย</p>
              </div>
              <div className="p-2 px-3">
                <div className="flex justify-between py-2 border-b">
                  <p>สัดส่วนยอดขายเทียบกับลูกค้าทั้งหมด</p>
                  <p className="font-semibold">15.00%</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>มูลค่ายอดขายรวม</p>
                  <p className="font-semibold">THB 128,976</p>
                </div>

              </div>

            </div>
            <div>
              <div className="flex items-center border-b space-x-2">
                <FaCheck style={{ fontSize: "24px" }} />
                <p className="text-xl font-bold ">สินค้าที่ปิดการขายสำเร็จ</p>
              </div>
              <div className="p-2 px-3">
                <div className="flex justify-between py-2 border-b">
                  <p>เฟอร์นิเจอร์สำนักงาน</p>
                  <p className="font-semibold">150 หน่วย</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>เครื่องใช้ไฟฟ้า</p>
                  <p className="font-semibold">100 หน่วย</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>คอมพิวเตอร์</p>
                  <p className="font-semibold">50 หน่วย</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>ของตกแต่งสำนักงาน</p>
                  <p className="font-semibold">40 หน่วย</p>
                </div>
              </div>

            </div>
            <div>
              <div className="flex items-center border-b space-x-2">
                <IoCloseCircle style={{ fontSize: "24px" }} />
                <p className="text-xl font-bold ">สินค้าที่ลูกค้าตัดสินใจไม่ซื้อ</p>
              </div>
              <div className="p-2 px-3">
                <div className="flex justify-between py-2 border-b">
                  <p>อุปกรณ์สำนักงาน</p>
                  <p className="font-semibold">20 หน่วย</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p>คอมพิวเตอร์</p>
                  <p className="font-semibold">10 หน่วย</p>
                </div>

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
    </div>
  );
}
