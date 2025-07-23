import { useEffect, useRef, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell,
} from 'recharts';
import { useToast } from "@/components/customs/alert/ToastContext";
import { SummaryTable } from "@/components/customs/display/sumTable.component";
//
import { useNavigate, useSearchParams } from "react-router-dom";

import SalesForecastTable from "@/components/customs/display/forcast.main.component";

import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { FiPrinter } from "react-icons/fi";
import SummarySalePDF from "../pdf/print-summary-sale/SummarySalePDF";
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
export default function SummarySale() {
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

  const chartRef1 = useRef<HTMLDivElement>(null); // สำหรับกราฟกิจกรรม/ลูกค้า
  const chartRef2 = useRef<HTMLDivElement>(null); // สำหรับกราฟมูลค่าการขาย


  const handleOpenPdf = async () => {
    if (chartRef1.current && chartRef2.current) {
      const canvas1 = await html2canvas(chartRef1.current);
      const canvas2 = await html2canvas(chartRef2.current);

      const image1 = canvas1.toDataURL("image/png");
      const image2 = canvas2.toDataURL("image/png");


      const blob = await pdf(
        <SummarySalePDF chartImage1={image1} chartImage2={image2} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  //fetch ข้อมูล tag ลูกค้า

  const { data: dataTag, refetch: refetchTag } = useSelectTag({
    searchText: searchTag,
  });

  //เช็คขนาดหน้าจอ มือถือ
  const isMobile = () => window.innerWidth < 768
  const [isSmallScreen, setIsSmallScreen] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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


  // mockup summary 
  const colorActivityCustomer = ['#7dd3fc', '#facc15', '#0c4a6e', '#22c55e'];
  const activityCustomer = [
    { label: 'จำนวนกิจกรรม', value: 1487 },
    { label: 'จำนวนการปิดการขาย', value: 977 },
    { label: 'จำนวนลูกค้าใหม่', value: 240 },
    { label: 'จำนวนลูกค้าเดิม', value: 737 },

  ];
  const colorSaleValue = ['#2563eb', '#ef4444'];
  const saleValue = [
    { label: 'มูลค่าคำสั่งซื้อที่ปิดการขายสำเร็จ', value: 859837 },
    { label: 'มูลค่าคำสั่งซื้อที่ปิดการขายไม่สำเร็จ', value: 122750 },

  ];

  //mockup table
  const customerColumns = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'ลูกค้า', key: 'name' },
    { header: 'สัดส่วนรายได้(%)', key: 'percent', align: 'right' },
  ];
  const customers = [
    { rank: 1, name: 'บริษัท A', percent: '15.00%' },
    { rank: 2, name: 'บริษัท B', percent: '12.00%' },
    { rank: 3, name: 'บริษัท C', percent: '11.00%' },
    { rank: 4, name: 'บริษัท D', percent: '9.00%' },
    { rank: 5, name: 'บริษัท E', percent: '6.00%' },
    { rank: 6, name: 'บริษัท F', percent: '4.00%' },
    { rank: 7, name: 'บริษัท G', percent: '3.15%' },
    { rank: 8, name: 'บริษัท H', percent: '3.02%' },
    { rank: 9, name: 'บริษัท I', percent: '3.00%' },
    { rank: 10, name: 'บริษัท J', percent: '2.47%' },
  ];

  const categoryColumns = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'หมวดหมู่', key: 'name' },
    { header: 'รายได้', key: 'amount', align: 'right' },
  ];
  const categories = [
    { rank: 1, name: 'เฟอร์นิเจอร์สำนักงาน', amount: 'THB 343,935' },
    { rank: 2, name: 'เครื่องใช้ไฟฟ้า', amount: 'THB 229,576' },
    { rank: 3, name: 'คอมพิวเตอร์', amount: 'THB 114,358' },
    { rank: 4, name: 'ของตกแต่งสำนักงาน', amount: 'THB 114,358' },
    { rank: 5, name: 'อุปกรณ์สำนักงาน', amount: 'THB 57,609' },
  ];

  const employeeColumns = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'พนักงาน', key: 'name' },
    { header: 'สัดส่วนรายได้(%)', key: 'percent', align: 'right' },
  ];
  const employees = [
    { rank: 1, name: 'นายแมน ฮับสาร', percent: '37.11%' },
    { rank: 2, name: 'นายจอมปราชญ์ รักโลก', percent: '29.91%' },
    { rank: 3, name: 'นางสาวดี มีปัญญา', percent: '21.16%' },
    { rank: 4, name: 'นายภา อับซาเมฆ', percent: '8.34%' },
  ];
  return (
    <div>

      <p className="text-2xl font-bold">รายงานสรุปยอดขาย</p>

      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">

          {/* วันที่เริ่ม */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1">วันที่เริ่ม</label>
            <DatePickerComponent
              id="start-date"
              label=""
              selectedDate={initMonth}
              onChange={(date) => setInitMonth(date)}
              classNameLabel=""
              classNameInput="w-full"
            />
          </div>

          {/* วันที่สิ้นสุด */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1">วันที่สิ้นสุด</label>
            <DatePickerComponent
              id="end-date"
              label=""
              selectedDate={endMonth}
              onChange={(date) => setEndMonth(date)}
              classNameLabel=""
              classNameInput="w-full"
            />
          </div>

          {/* แท็กลูกค้า */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1">แท็กลูกค้า</label>
            <MasterSelectComponent
              id="tag"
              onChange={(option) => setTagId(option ? String(option.value) : null)}
              fetchDataFromGetAPI={fetchDataTagDropdown}
              onInputChange={handleTagSearch}
              valueKey="id"
              labelKey="name"
              placeholder="ทั้งหมด"
              isClearable
              label=""
              labelOrientation="horizontal"
              classNameLabel=""
              classNameSelect="w-full"
            />
          </div>

          <div className="sm:col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
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
        <div className="p-7 pb-5 w-full ">
          {/* content */}
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานสรุปยอดขาย</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
            <p className="text-xs text-gray-500 mb-6">1 มกราคม 2024 - 31 มกราคม 2024</p>
          </div>

          {/* กราฟกิจกรรมและลูกค้า */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="text-lg font-semibold mb-2 text-gray-700">กิจกรรมและลูกค้า</p>

              {/* กราฟกิจกรรม */}
              <div ref={chartRef1} className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout={isSmallScreen ? "horizontal" : "vertical"} //เช็คหน้าจอ
                    data={activityCustomer}
                    margin={isSmallScreen
                      ? { top: 10, right: 30, left: 30, bottom: 40 }
                      : { top: 10, right: 100, left: 50, bottom: 10 }
                    }
                    barSize={isSmallScreen ? 40 : 20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isSmallScreen ? (
                      <>
                        <XAxis dataKey="label" />
                        <YAxis tickFormatter={(v) => v.toLocaleString()} width={20} />
                      </>
                    ) : (
                      <>
                        <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
                        <YAxis type="category" dataKey="label" width={120} />
                      </>
                    )}
                    <Tooltip formatter={(v) => v.toLocaleString()} />
                    <Bar dataKey="value">
                      <LabelList dataKey="value" position={isSmallScreen ? "top" : "right"} formatter={(v: number) => v.toLocaleString()} />
                      {activityCustomer.map((data, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colorActivityCustomer[index % colorActivityCustomer.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* กราฟมูลค่า */}
            <div>
              <p className="text-lg font-semibold mb-2 text-gray-700">มูลค่าการขาย</p>
              <div ref={chartRef2} className="w-full h-[300px]">

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout={isSmallScreen ? "horizontal" : "vertical"} //เช็คหน้าจอ
                    data={saleValue}
                    margin={isSmallScreen
                      ? { top: 10, right: 30, left: 30, bottom: 40 }
                      : { top: 10, right: 100, left: 110, bottom: 10 }
                    }
                    barSize={isSmallScreen ? 40 : 20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isSmallScreen ? (
                      <>
                        <XAxis dataKey="label" />
                        <YAxis tickFormatter={(v) => v.toLocaleString()} />
                      </>
                    ) : (
                      <>
                        <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
                        <YAxis type="category" dataKey="label" width={120} />
                      </>
                    )}
                    <Tooltip formatter={(v) => v.toLocaleString()} />
                    <Bar dataKey="value">
                      <LabelList dataKey="value" position={isSmallScreen ? "top" : "right"} formatter={(v: number) => v.toLocaleString()} />
                      {saleValue.map((data, index) => (
                        <Cell
                          key={`cell-sale-${index}`}
                          fill={colorSaleValue[index % colorSaleValue.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 px-10 grid grid-cols-1 xl:grid-cols-3 gap-4 mt-5">

          <SummaryTable
            title="10 อันดับลูกค้า"
            columns={customerColumns}
            data={customers}
          />
          <SummaryTable
            title="10 หมวดหมู่สินค้า"
            columns={categoryColumns}
            data={categories}
          />
          <SummaryTable
            title="10 พนักงานขาย"
            columns={employeeColumns}
            data={employees}
          />
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
