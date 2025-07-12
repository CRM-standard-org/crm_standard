import { useEffect, useState } from "react";
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
  Legend,
} from 'recharts';
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

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllCustomerResponse; //ตรงนี้
}[];

//
export default function ReportTagsCustomer() {
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
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  //searchText control
  const [searchTag, setSearchTag] = useState("");

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
  //

  // mockup 1 chart
  const colorCustomerData = ['#3b82f6', '#ef4444', '#FFCC33', '#22c55e'];
  const customerData = [
    { label: 'ลูกค้าทั้งหมด', value: 977 },
    { label: 'ว่าที่ลูกค้า', value: 984 },
    { label: 'ลูกค้าใหม่', value: 240 },
    { label: 'ลูกค้าเดิม', value: 737 },

  ];

  // mockup 3 charts
  const colorData = ['#3b82f6', '#ef4444', '#22c55e'];
  const tagActivityData = [
    { date: '1-6', value: 300, storage: 230, createAmount: 280 },
    { date: '7-12', value: 200, storage: 280, createAmount: 220 },
    { date: '13-18', value: 150, storage: 180, createAmount: 210 },
    { date: '19-24', value: 240, storage: 160, createAmount: 130 },
    { date: '25-31', value: 120, storage: 140, createAmount: 250 },
  ];
  const countActivityData = [
    { label: 'สำนักงานใหญ่', value: 195 },
    { label: 'คลัง', value: 293 },
    { label: 'การผลิต', value: 489 },

  ];
  const saleTagData = [
    { label: 'สำนักงานใหญ่', value: 626900 },
    { label: 'คลัง', value: 116478 },
    { label: 'การผลิต', value: 116459 },

  ];



  return (
    <div>

      <p className="text-2xl font-bold">รายงานวิเคราะห์ยอดขายตามแท็กลูกค้า</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* พนักงานขาย */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1">พนักงานขาย</label>
            <MasterSelectComponent
              id="month"
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
              classNameSelect="w-full "

            />

          </div>

          {/* วันที่เริ่ม */}

          <div className="flex flex-col w-full">
            <label className="text-md mb-1">วันที่เริ่ม</label>
            <DatePickerComponent
              id="doc-date"
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
              id="doc-date"
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
              classNameSelect="w-full "
            />
          </div>
          <div className="sm:col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
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

      <div className="bg-white shadow-md rounded-lg pb-5">
        <div className="p-2 bg-sky-100 rounded-t-lg">
          <p className="font-semibold">เอาไว้ทำหัวรายงานในอนาคต</p>
        </div>
        <div className="p-7 pb-5 w-full max-w-full overflow-x-auto lg:overflow-x-visible">
          {/* content */}
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานวิเคราะห์ยอดขายตามแท็กลูกค้า</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
          </div>
          {/* chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <div className="w-full h-[300px]">
              {/* ลูกค้า */}
              <div className="flex flex-col lg:flex-row lg:justify-between items-start sm:items-center mb-2">
                <p className="text-lg font-semibold text-gray-700">จอมปราชญ์ รักโลก</p>
                <p className="text-sm text-gray-700">1 มกราคม 2024 - 31 มกราคม 2024</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout={isSmallScreen ? "horizontal" : "vertical"} //เช็คหน้าจอ
                  data={customerData}
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
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="value">
                    <LabelList dataKey="value" position={isSmallScreen ? "top" : "right"} formatter={(value: number) => value.toLocaleString()} />
                    {customerData.map((data, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorCustomerData[index % colorCustomerData.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>


            {/* กิจกรรมการขายแยกตามแท็กลูกค้า  */}
            <div className="w-full h-[300px]">
              <p className="text-lg font-semibold mb-2 text-gray-700">
                กิจกรรมการขายแบ่งตามแท็กลูกค้า เดือนมกราคม
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tagActivityData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, 300]}
                    ticks={[0, 100, 200, 300]}
                    tickFormatter={(value) => value.toLocaleString()}
                    width={20}
                  />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Bar dataKey="value" name="สำนักงานใหญ่" fill="#3b82f6" />
                  <Bar dataKey="storage" name="คลัง" fill="#ef4444" />
                  <Bar dataKey="createAmount" name="การผลิต" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>


            {/* จำนวนกิจกรรมการขายแบ่งตามแท็กลูกค้า */}
            <div className="w-full h-[260px] mt-5">
              <p className="text-lg font-semibold mb-2 text-gray-700">จำนวนกิจกรรมการขายแบ่งตามแท็กลูกค้า</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout={isSmallScreen ? "horizontal" : "vertical"} //เช็คหน้าจอ
                  data={countActivityData}
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
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="value">
                    <LabelList dataKey="value" position={isSmallScreen ? "top" : "right"} formatter={(value: number) => value.toLocaleString()} />
                    {countActivityData.map((data, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorData[index % colorData.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ยอดขายแบ่งตามแท็กลูกค้า */}
            <div className="w-full h-[260px] mt-5">
              <p className="text-lg font-semibold mb-2 text-gray-700">ยอดขายแบ่งตามแท็กลูกค้า (THB)</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout={isSmallScreen ? "horizontal" : "vertical"} //เช็คหน้าจอ
                  data={saleTagData}
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
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="value">
                    <LabelList dataKey="value" position={isSmallScreen ? "top" : "right"} formatter={(value: number) => value.toLocaleString()} />
                    {saleTagData.map((data, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorData[index % colorData.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
