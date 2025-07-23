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
  Legend,
  Pie,
  PieChart
} from 'recharts';
import { Table, Box, Text } from "@radix-ui/themes";
import { useToast } from "@/components/customs/alert/ToastContext";

//
import { useNavigate, useSearchParams } from "react-router-dom";

import SalesForecastTable from "@/components/customs/display/forcast.main.component";

import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";

import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { useTeam, useTeamMember } from "@/hooks/useTeam";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { SummaryTable } from "@/components/customs/display/sumTable.component";
import { pdf } from "@react-pdf/renderer";
import ReportCategoryPDF from "../pdf/print-report-category-sale/ReportCategoryPDF";
import { FiPrinter } from "react-icons/fi";
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
export default function ReportCategorySale() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);


  const [tagId, setTagId] = useState<string | null>(null);

  const [initMonth, setInitMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());

  const [team, setTeam] = useState<string | null>(null);
  const [teamOptions, setTeamOptions] = useState<OptionType[]>([]);
  const [responsible, setResponsible] = useState<string | null>(null);
  const [responsibleOptions, setResponsibleOptions] = useState<OptionType[]>([]);
  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  //searchText control
  const [searchTag, setSearchTag] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchYear, setSearchYear] = useState("");



  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);


  const handleOpenPdf = async () => {

    if (chartRef2.current) {
      const canvas1 = await html2canvas(chartRef1.current);
      const canvas2 = await html2canvas(chartRef2.current);
      const canvas3 = await html2canvas(chartRef3.current);
      const image1 = canvas1.toDataURL("image/png");
      const image2 = canvas2.toDataURL("image/png");
      const image3 = canvas3.toDataURL("image/png");

      const blob = await pdf(<ReportCategoryPDF chartImage1={image1} chartImage2={image2} chartImage3={image3} />).toBlob();
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
  //fetch team 
  useEffect(() => {
    setResponsible(null);
    setResponsibleOptions([]);
    refetchTeamMember();
  }, [team]);

  const { data: dataTeam, refetch: refetchTeam } = useTeam({
    page: "1",
    pageSize: "100",
    searchText: searchTeam,
  });
  const fetchDataTeamDropdown = async () => {
    const teamList = dataTeam?.responseObject.data ?? [];
    const { options, responseObject } = useResponseToOptions(teamList, "team_id", "name");
    setTeamOptions(options);
    return { responseObject };
  };


  const handleTeamSearch = (searchText: string) => {
    setSearchTeam(searchText);
    refetchTeam();
  };
  //fetch Member in team 
  const { data: dataTeamMember, refetch: refetchTeamMember } = useTeamMember({
    team_id: team ?? "",
    page: page,
    pageSize: pageSize,
    searchText: "",
  });

  const fetchDataMemberInteam = async () => {
    const member = dataTeamMember?.responseObject.data.member ?? [];
    const { options, responseObject } = useResponseToOptions(
      member,
      "employee_id",
      (item) => `${item.first_name} ${item.last_name}`
    );
    setResponsibleOptions(options);
    return { responseObject };
  };


  //mockup chart
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.'];
  const salesDataTable = [
    {
      label: 'มูลค่าใบเสนอราคาจริง',
      values: [859837, 827474, 805669, 782765],
    },
    {
      label: 'มูลค่าใบเสนอราคาคาดการณ์',
      values: [859837, 827474, 805669, 782765],
    },

  ];

  const quotationData = [
    { month: "ม.ค.", realValue: 860000, predictValue: 915000 },
    { month: "ก.พ.", realValue: 825000, predictValue: 840000 },
    { month: "มี.ค.", realValue: 810000, predictValue: 855000 },
    { month: "เม.ย.", realValue: 775000, predictValue: 870000 },

  ];
  //mockup 2 pies
  const PIE_COLORS = ["#a855f7", "#0ea5e9", "#15803d", "#f97316", "#0f4c75"];
  const pieDataActual = [
    { priority: "★5", value: 30 },
    { priority: "★4", value: 15 },
    { priority: "★3", value: 20 },
    { priority: "★2", value: 15 },
    { priority: "★1", value: 5 },
    { priority: "★0", value: 0 },
  ];

  const pieDataForecast = [
    { priority: "★5", value: 30 },
    { priority: "★4", value: 15 },
    { priority: "★3", value: 20 },
    { priority: "★2", value: 15 },
    { priority: "★1", value: 5 },
    { priority: "★0", value: 0 },
  ];

  //mockup 2 table
  const HeaderColumns = [
    { header: 'ระดับความสำคัญ', key: 'priority' },
    { header: 'จำนวน', key: 'amount' },
    { header: '%', key: 'percent', },
    { header: 'มูลค่ารวม', key: 'value', align: 'right' },
  ];

  const realValues = [
    { priority: "★5", amount: 30, percent: 33.33, value: 1091806 },
    { priority: "★4", amount: 15, percent: 26.67, value: 873641 },
    { priority: "★3", amount: 20, percent: 20.00, value: 655149 },
    { priority: "★2", amount: 15, percent: 13.33, value: 436657 },
    { priority: "★1", amount: 20, percent: 6.67, value: 218492 },
    { priority: "★0", amount: 0, percent: 0, value: 0 },
  ];


  const predictValues = [
    { priority: "★5", amount: 30, percent: 33.44, value: 1166715 },
    { priority: "★4", amount: 15, percent: 26.68, value: 930859 },
    { priority: "★3", amount: 20, percent: 20.00, value: 697796 },
    { priority: "★2", amount: 15, percent: 13.26, value: 462638 },
    { priority: "★1", amount: 20, percent: 6.62, value: 230970 },
    { priority: "★0", amount: 0, percent: 0, value: 0 },
  ];

  return (
    <div>

      <p className="text-2xl font-bold">รายงานพยากรณ์ยอดขายตามหมวดหมู่</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          {/* ทีม */}

          <div className="flex flex-col w-full">
            <label className="text-md mb-1">ทีม</label>
            <DependentSelectComponent
              id="team"
              value={teamOptions.find((opt) => opt.value === team) || null}
              onChange={(option) => setTeam(option ? String(option.value) : null)}
              onInputChange={handleTeamSearch}
              fetchDataFromGetAPI={fetchDataTeamDropdown}
              valueKey="id"
              labelKey="name"
              placeholder="รายชื่อทีม"
              isClearable
              label=""
              labelOrientation="horizontal"
              classNameLabel=""
              classNameSelect="w-full "
              nextFields={{ left: "responsible-telno", right: "responsible-telno", up: "address", down: "responsible" }}

            />
          </div>


          {/* พนักงานขาย */}

          <div className="flex flex-col w-full">
            <label className="text-md mb-1">พนักงานขาย</label>
            <DependentSelectComponent
              id="responsible"
              value={responsibleOptions.find((opt) => opt.value === responsible) || null}
              onChange={(option) => setResponsible(option ? String(option.value) : null)}
              onInputChange={handleTeamSearch}
              fetchDataFromGetAPI={fetchDataMemberInteam}
              valueKey="id"
              labelKey="name"
              placeholder="รายชื่อบุคลากร"
              isClearable
              label=""
              labelOrientation="horizontal"
              classNameLabel=""
              classNameSelect="w-full "
              nextFields={{ left: "responsible-email", right: "responsible-email", up: "team", down: "contact-person" }}
            />
          </div>

          {/* หมวดหมู่สินค้า */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1">หมวดหมู่สินค้า</label>
            <MasterSelectComponent
              id="category"
              onChange={(option) => setTagId(option ? String(option.value) : null)}
              fetchDataFromGetAPI={fetchDataTagDropdown}
              onInputChange={handleTagSearch}
              valueKey="id"
              labelKey="name"
              placeholder="รายชื่อหมวดหมู่สินค้า"
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

          <div className="sm:col-span-1 md:col-span-3 lg:col-span-5 flex justify-end">
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
        <div className="p-7 pb-5 w-full max-w-full overflow-x-auto lg:overflow-x-visible space-y-4">

          {/* content */}
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานพยากรณ์ยอดขายตามหมวดหมู่</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
            <p className="text-xs text-gray-500 mb-6">1 มกราคม 2024 - 31 เมษายน 2024</p>
          </div>

          <div className="flex flex-row space-x-3">
            <p>หมวดหมู่สินค้า : ทั้งหมด</p>
            <p>ทีม : ทั้งหมด</p>
          </div>

          <div>มูลค่าใบเสนอราคาจริง เทียบ มูลค่าใบเสนอราคาคาดการณ์ (Q01)</div>
          <Table.Root variant="surface" size="2" className="whitespace-nowrap ">
            <Table.Header>
              <Table.Row >
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-5">

            <div ref={chartRef1} className="w-full h-[500px]">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quotationData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    allowDecimals={false}
                    domain={[700000, 950000]}
                    ticks={[700000, 750000, 800000, 850000, 900000, 950000]}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Bar dataKey="realValue" name="มูลค่าใบเสนอราคาจริง" fill="#3b82f6" />
                  <Bar dataKey="predictValue" name="มูลค่าใบเสนอราคาคาดการณ์" fill="#FF6633" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-5 gap-4">
            {/* Actual Pie */}
            <div>
              <p className="font-semibold text-center mb-2">สัดส่วนในเสนอราคาจริง แบ่งตามความสำคัญ</p>
              <div ref={chartRef2} className="flex flex-col items-center space-y-4">
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieDataActual}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label

                  >
                    {pieDataActual.map((entry, index) => (
                      <Cell key={`cell-a-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>

              </div>
              <div className="flex flex-col items-center">

                <SummaryTable
                  title=""
                  columns={HeaderColumns}
                  data={realValues}
                />
              </div>
            </div>
            {/* Forecast Pie */}
            <div>
              <p className="font-semibold text-center mb-2">สัดส่วนในเสนอราคาคาดการณ์ แบ่งตามความสำคัญ</p>
              <div ref={chartRef3} className="flex flex-col items-center space-y-4">
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieDataForecast}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {pieDataForecast.map((entry, index) => (
                      <Cell key={`cell-f-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>

              </div>
              <div className="flex flex-col items-center">

                <SummaryTable
                  title=""
                  columns={HeaderColumns}
                  data={predictValues}
                />
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
