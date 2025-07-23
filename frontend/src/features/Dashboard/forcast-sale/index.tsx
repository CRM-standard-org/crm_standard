import { useEffect, useRef, useState } from "react";
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
import { OptionType } from "@/components/customs/select/select.main.component";

import { Table } from "@radix-ui/themes";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { useTeam, useTeamMember } from "@/hooks/useTeam";
import { useResponseToOptions } from "@/hooks/useOptionType";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { SummaryTable } from "@/components/customs/display/sumTable.component";
import { FiPrinter } from "react-icons/fi";
import { pdf } from "@react-pdf/renderer";
import ForcastSalePDF from "../pdf/print-forcast-sale/ForcastSalePDF";
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
export default function ForcastSale() {
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
    if (chartRef1.current && chartRef2.current && chartRef3.current) {
      const canvas1 = await html2canvas(chartRef1.current);
      const canvas2 = await html2canvas(chartRef2.current);
      const canvas3 = await html2canvas(chartRef3.current);

      const image1 = canvas1.toDataURL("image/png");
      const image2 = canvas2.toDataURL("image/png");
      const image3 = canvas3.toDataURL("image/png");

      const blob = await pdf(<ForcastSalePDF chartImage1={image1} chartImage2={image2} chartImage3={image3} />).toBlob();
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


  //mockup data
  const saleData = [
    { month: 'ม.ค.', pointSale: 859837, predictSale: 880082 },
    { month: 'ก.พ.', pointSale: 1687311, predictSale: 1557257 },
    { month: 'มี.ค.', pointSale: 2492980, predictSale: 2232590 },
    { month: 'เม.ย.', pointSale: 3275745, predictSale: 3051389 },
    { month: 'พ.ค.', pointSale: 4155587, predictSale: 3841894 },
    { month: 'มิ.ย.', pointSale: 5096655, predictSale: 4674694 },
    { month: 'ก.ค.', pointSale: 5877744, predictSale: 5581884 },
    { month: 'ส.ค.', pointSale: 6877210, predictSale: 6545694 },
    { month: 'ก.ย.', pointSale: 7621401, predictSale: 7272449 },
    { month: 'ต.ค.', pointSale: 8601794, predictSale: 8142359 },
    { month: 'พ.ย.', pointSale: 9465107, predictSale: 8869669 },
    { month: 'ธ.ค.', pointSale: 10403495, predictSale: 9875439 },
  ];

  //mockup table
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];


  const salesDataTable = [
    {
      label: 'เป้าหมายยอดขายสะสม',
      values: [
        916859, 1761175, 2616872, 3488978,
        4405747, 5309872, 6166448, 7146603,
        7983325, 8939176, 9889471, 10875181
      ],
    },
    {
      label: 'ยอดขายสะสมคาดการณ์',
      values: [
        900000, 1500000, 2500000, 3500000,
        4500000, 5000000, 6000000, 7000000,
        8000000, 9000000, 10000000, 11000000
      ],
    },
    {
      label: 'เป้าหมายยอดขายรายเดือน',
      values: [
        916859, 844316, 855697, 872106,
        916769, 904125, 856576, 980155,
        836722, 955851, 950295, 985710
      ],
    },
    {
      label: 'ยอดขายรายเดือนคาดการณ์',
      values: [
        900000, 1000000, 1000000, 515000,
        1000000, 500000, 1000000, 1000000,
        1000000, 1000000, 1000000, 1000000
      ],
    },
    {
      label: 'ยอดขายจริงรายเดือน',
      values: [
        859837, 827474, 805669, 782765,
        879842, 941068, 781089, 999466,
        744191, 980393, 863313, 938388
      ],
    },
  ];


  //mockup 2 chart
  const colorData = ['#3b82f6', '#f97316', '#dc2626'];

  const summaryTotal = [
    { name: 'เป้าหมายยอดขายสะสม\nรวม', value: 10875181 },
    { name: 'ยอดขายสะสมคาดการณ์\nรวม', value: 11000000 },
  ];

  const summaryMonthlyAverage = [
    { name: 'เป้าหมายยอดขายรายเดือน\nโดยเฉลี่ย', value: 911897 },
    { name: 'ยอดขายรายเดือนคาดการณ์\nโดยเฉลี่ย', value: 168583 },
    { name: 'ยอดขายจริงรายเดือน\nโดยเฉลี่ย', value: 866958 },
  ];


  //mockup table
  const HeaderPredict = [
    { header: 'ระดับความสำคัญ', key: 'priority' },
    { header: 'จำนวน', key: 'amount' },
    { header: '%', key: 'percent', },
    { header: 'มูลค่ารวม', key: 'value', align: 'right' },
  ];

  const predictValues = [
    { priority: "★5", amount: 30, percent: 33.44, value: 1166715 },
    { priority: "★4", amount: 15, percent: 26.68, value: 930859 },
    { priority: "★3", amount: 20, percent: 20.00, value: 697796 },
    { priority: "★2", amount: 15, percent: 13.26, value: 462638 },
    { priority: "★1", amount: 20, percent: 6.62, value: 230970 },
    { priority: "★0", amount: 0, percent: 0, value: 0 },
  ];

  const HeaderCustomer = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'ลูกค้า', key: 'customer' },
    { header: 'โอกาส%', key: 'percent', },

  ];

  const customers = [
    { rank: 1, customer: "บริษัท A", percent: 80 },
    { rank: 2, customer: "บริษัท B", percent: 77 },
    { rank: 3, customer: "บริษัท C", percent: 75 },
    { rank: 4, customer: "บริษัท D", percent: 72 },
    { rank: 5, customer: "บริษัท E", percent: 70 },
    { rank: 6, customer: "บริษัท F", percent: 50 },
    { rank: 7, customer: "บริษัท G", percent: 45 },
    { rank: 8, customer: "บริษัท H", percent: 20 },
    { rank: 9, customer: "บริษัท I", percent: 15 },
    { rank: 10, customer: "บริษัท J", percent: 10 },
  ];

  return (
    <div>

      <p className="text-2xl font-bold">รายงานพยากรณ์ยอดขาย</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">

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

          {/* วันที่เริ่ม */}

          <div className="flex flex-col w-full">
            <label className="text-md  mb-1">วันที่เริ่ม</label>
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

      <div className=" bg-white shadow-md rounded-lg">
        <div className="p-2 bg-sky-100 rounded-t-lg">
          <p className="font-semibold">เอาไว้ทำหัวรายงานในอนาคต</p>
        </div>
        <div className="p-7 pb-5 w-full max-w-full">

          {/* content */}
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานพยากรณ์ยอดขาย</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
            <p className="text-xs text-gray-500 mb-6">ปี 2024</p>
          </div>
          {/* chart */}
          <p className="text-lg font-semibold mb-2 text-gray-700">
            เป้าหมายยอดขายสะสม เทียบ ยอดขายสะสมคาดการณ์
          </p>
          <div ref={chartRef1} className="w-full h-[500px] border-b-2 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={saleData}
                margin={{ top: 10, right: 30, left: 40, bottom: 50 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  allowDecimals={false}
                  domain={[0, 12000000]}
                  tickCount={7}     // จำนวนเส้นแบ่งแนวนอน (เช่น ทุก 2,000,000)
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="pointSale" name="เป้าหมายยอดขายสะสม (THB)" fill="#3b82f6" />
                <Bar dataKey="predictSale" name="ยอดขายสะสมคาดการณ์ (THB)" fill="#FF6633" />

              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* table  */}
          <Table.Root variant="surface" size="2" className="whitespace-nowrap mb-10">
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

          {/* 2 chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-5">
            {/* กราฟรวมยอดสะสม */}
            <div ref={chartRef2} className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summaryTotal}
                  margin={{ bottom: 20, left: 50 }}
                  barSize={40}

                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip
                    formatter={(v) => `${Number(v).toLocaleString()} บาท`}
                    wrapperStyle={{ maxWidth: 150, whiteSpace: 'normal' }}
                  />

                  <Bar dataKey="value" label={{ position: 'top', formatter: (value: number) => value.toLocaleString() }}>
                    {summaryTotal.map((data, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorData[index % colorData.length]}
                      />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* กราฟเฉลี่ยรายเดือน */}
            <div ref={chartRef3} className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summaryMonthlyAverage}
                  margin={{ bottom: 20, left: 50 }}
                  barSize={40}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip
                    formatter={(v) => `${Number(v).toLocaleString()} บาท`}
                    wrapperStyle={{ maxWidth: 150, whiteSpace: 'normal' }}
                  />

                  <Bar dataKey="value" label={{ position: 'top', formatter: (value: number) => value.toLocaleString() }}>
                    {summaryMonthlyAverage.map((data, index) => (
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
          {/* table  */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-3 mt-6">
            <SummaryTable
              title="สัดส่วนใบเสนอราคาคาดการณ์ แบ่งตามความสำคัญ"
              columns={HeaderPredict}
              data={predictValues}
            />
            <SummaryTable
              title="10 อันดับลูกค้าที่มีโอกาสซื้อสูงสุด"
              columns={HeaderCustomer}
              data={customers}
            />
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
