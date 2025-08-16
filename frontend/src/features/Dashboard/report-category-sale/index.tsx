import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
// import { useToast } from "@/components/customs/alert/ToastContext"; // not used currently

//
import { useSearchParams } from "react-router-dom";

import SalesForecastTable from "@/components/customs/display/forcast.main.component";

import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";

import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { useTeam, useTeamMember } from "@/hooks/useTeam";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { SummaryTable } from "@/components/customs/display/sumTable.component";
import { pdf } from "@react-pdf/renderer";
import ReportCategoryPDF from "../pdf/print-report-category-sale/ReportCategoryPDF";
import { FiPrinter } from "react-icons/fi";
import html2canvas from "html2canvas-pro";
import { useSalesForecastSummary } from "@/hooks/useDashboard";


// (Removed unused dateTableType definition)

//
export default function ReportCategorySale() {
  // Removed unused local states (searchText, colorsName, data)


  const [tagId, setTagId] = useState<string | null>(null);

  const [initMonth, setInitMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());

  const [team, setTeam] = useState<string | null>(null);
  const [teamOptions, setTeamOptions] = useState<OptionType[]>([]);
  const [responsible, setResponsible] = useState<string | null>(null);
  const [responsibleOptions, setResponsibleOptions] = useState<OptionType[]>([]);
  // const { showToast } = useToast(); // reserved for future error toasts
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  //searchText control
  const [searchTag, setSearchTag] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  // const [searchYear, setSearchYear] = useState(""); // (reserved) not yet used explicitly



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
  // Fetch member data hook MUST come before effect that uses refetchTeamMember
  const { data: dataTeamMember, refetch: refetchTeamMember } = useTeamMember({
    team_id: team ?? "",
    page: page,
    pageSize: pageSize,
    searchText: "",
  });

  //fetch team
  useEffect(() => {
    setResponsible(null);
    setResponsibleOptions([]);
    refetchTeamMember();
  }, [team, refetchTeamMember]);

  const { data: dataTeam, refetch: refetchTeam } = useTeam({
    page: "1",
    pageSize: "100",
    searchText: searchTeam,
  });
  const fetchDataTeamDropdown = async () => {
  const teamList: { team_id: string; name: string }[] = dataTeam?.responseObject.data ?? [];
    const responseObject = teamList.map(t => ({ id: t.team_id, name: t.name }));
    setTeamOptions(responseObject.map(r=> ({ value: r.id, label: r.name })));
    return { responseObject };
  };


  const handleTeamSearch = (searchText: string) => {
    setSearchTeam(searchText);
    refetchTeam();
  };
  //fetch Member in team
  const fetchDataMemberInteam = async () => {
  const member: { employee_id: string; first_name: string; last_name?: string }[] = dataTeamMember?.responseObject.data.member ?? [];
    const responseObject = member.map(m => ({ id: m.employee_id, name: `${m.first_name} ${m.last_name || ''}`.trim() }));
    setResponsibleOptions(responseObject.map(r=> ({ value: r.id, label: r.name })));
    return { responseObject };
  };


  // ===== Sales Forecast Summary Integration =====
  // Build payload only when user searches to avoid spamming queries while typing/filtering.
  interface SummaryPayload {
    year?: number;
    start_date?: string;
    end_date?: string;
    team_id?: string;
    responsible_id?: string;
    tag_id?: string;
  }
  const [payload, setPayload] = useState<SummaryPayload | null>(null);
  const monthNames = useMemo(()=> ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'], []);

  const buildPayload = useCallback((): SummaryPayload => {
    const crossYear = !!(initMonth && endMonth && initMonth.getFullYear() !== endMonth.getFullYear());
    const year = initMonth?.getFullYear();
    return {
      ...(crossYear ? {} : { year }),
      start_date: initMonth ? initMonth.toISOString().slice(0,10) : undefined,
      end_date: endMonth ? endMonth.toISOString().slice(0,10) : undefined,
      team_id: team || undefined,
      responsible_id: responsible || undefined,
      tag_id: tagId || undefined,
    };
  }, [initMonth, endMonth, team, responsible, tagId]);

  // initial load
  useEffect(()=> { setPayload(buildPayload()); }, [buildPayload]);

  const { data: summaryResp, isLoading: loadingSummary, refetch: refetchSummary } = useSalesForecastSummary(payload || {}, !!payload);
  const summary = summaryResp?.responseObject;

  // Derived month range for display (limit to selected start/end if provided)
  const monthRange = useMemo(()=> {
    if (!summary) return [] as number[];
    const startM = initMonth ? initMonth.getMonth() + 1 : 1;
    const endM = endMonth ? endMonth.getMonth() + 1 : 12;
    return Array.from({length: 12}, (_,i)=> i+1).filter(m=> m >= startM && m <= endM);
  }, [summary, initMonth, endMonth]);

  const months = monthRange.map(m=> monthNames[m-1]);

  // Table data (monthly actual vs forecast)
  interface MonthlyActual { month: number; sales: number; }
  interface MonthlyForecast { month: number; forecast: number; }
  const salesDataTable = useMemo(()=> {
    if (!summary) return [] as { label: string; values: number[] }[];
    const actualMap: Record<number, number> = {};
    (summary.actual.monthly as MonthlyActual[]).forEach(r=> { actualMap[r.month] = r.sales || 0; });
    const forecastMap: Record<number, number> = {};
    (summary.forecast.monthly as MonthlyForecast[]).forEach(r=> { forecastMap[r.month] = r.forecast || 0; });
    return [
      { label: 'มูลค่าใบเสนอราคาจริง', values: monthRange.map(m=> Math.round(actualMap[m]||0)) },
      { label: 'มูลค่าใบเสนอราคาคาดการณ์', values: monthRange.map(m=> Math.round(forecastMap[m]||0)) },
    ];
  }, [summary, monthRange]);

  // Bar chart dataset
  const quotationData = useMemo(()=> {
    if (!summary) return [] as { month: string; realValue: number; predictValue: number }[];
    const actualMap: Record<number, number> = {};
    (summary.actual.monthly as MonthlyActual[]).forEach(r=> { actualMap[r.month] = r.sales || 0; });
    const forecastMap: Record<number, number> = {};
    (summary.forecast.monthly as MonthlyForecast[]).forEach(r=> { forecastMap[r.month] = r.forecast || 0; });
    return monthRange.map(m=> ({ month: monthNames[m-1], realValue: Math.round(actualMap[m]||0), predictValue: Math.round(forecastMap[m]||0) }));
  }, [summary, monthRange, monthNames]);

  // Priority breakdown -> reuse for both actual/forecast pies (back-end presently supplies single set)
  const PIE_COLORS = ["#a855f7", "#0ea5e9", "#15803d", "#f97316", "#0f4c75"];
  interface PriorityBreak { priority: number; count: number; amount: number; weight_percent: number; }
  const priorityBreakdown: PriorityBreak[] = summary?.priority_breakdown || [];
  const totalPriorityAmount = priorityBreakdown.reduce((s, p)=> s + (p.amount||0), 0) || 1;
  const pieDataActual = priorityBreakdown.map(p=> ({ priority: `★${p.priority}`, value: p.amount }));
  const pieDataForecast = priorityBreakdown.map(p=> ({ priority: `★${p.priority}`, value: p.amount }));

  const HeaderColumns = [
    { header: 'ระดับความสำคัญ', key: 'priority' },
    { header: 'จำนวน', key: 'amount' },
    { header: '%', key: 'percent' },
    { header: 'มูลค่ารวม', key: 'value', align: 'right' },
  ];
  const realValues = priorityBreakdown.map(p=> ({
    priority: `★${p.priority}`,
    amount: p.count,
    percent: ((p.amount||0)/ totalPriorityAmount * 100) || 0,
    value: Math.round(p.amount||0),
  }));
  const predictValues = priorityBreakdown.map(p=> ({
    priority: `★${p.priority}`,
    amount: p.count,
    percent: p.weight_percent, // using weight percent to reflect forecast weighting
    value: Math.round(p.amount||0),
  }));

  const handleSearch = () => {
    const next = buildPayload();
    setPayload(next);
    // slight defer to ensure state update before refetch (react-query will auto based on key)
    setTimeout(()=> refetchSummary(), 0);
  };

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
              onClick={handleSearch}
              disabled={loadingSummary}
            >
              {loadingSummary ? 'กำลังค้นหา...' : 'ค้นหา'}
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
                  <YAxis allowDecimals={false} tickFormatter={(value) => value.toLocaleString()} />
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
                    {pieDataActual.map((entry) => (
                      <Cell key={`cell-a-${entry.priority}`} fill={PIE_COLORS[Number(entry.priority.replace('★','')) % PIE_COLORS.length]} />
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
                    {pieDataForecast.map((entry) => (
                      <Cell key={`cell-f-${entry.priority}`} fill={PIE_COLORS[Number(entry.priority.replace('★','')) % PIE_COLORS.length]} />
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
