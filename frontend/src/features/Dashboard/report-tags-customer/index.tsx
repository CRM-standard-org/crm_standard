import { useEffect, useRef, useState, useCallback, forwardRef } from "react";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
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
} from "recharts";
import { useToast } from "@/components/customs/alert/ToastContext";

//
import { pdf } from "@react-pdf/renderer";
import ReportTagCustomerPDF from "../pdf/print-report-tag-customer/ReportTagCustomerPDF";
import { FiPrinter } from "react-icons/fi";
import html2canvas from "html2canvas-pro";
import {
  fetchCustomerTagAnalytics,
  CustomerTagAnalyticsResponse,
} from "@/services/customerTagAnalytics.service";
import { useTeam } from "@/hooks/useTeam";
import { useSelectResponsible } from "@/hooks/useEmployee";

//
const ChartWrapper = forwardRef<
  HTMLDivElement,
  {
    loading: boolean;
    dataLen: number;
    height: number;
    children: React.ReactNode;
  }
>(({ loading, dataLen, height, children }, ref) => (
  <div ref={ref} style={{ width: "100%", height }}>
    {loading ? (
      <div className="animate-pulse w-full h-full bg-gray-100 rounded" />
    ) : dataLen === 0 ? (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        ไม่มีข้อมูล
      </div>
    ) : (
      children
    )}
  </div>
));

// Helper for margins
function barMargins(isSmall: boolean) {
  return isSmall
    ? { top: 10, right: 30, left: 30, bottom: 40 }
    : { top: 10, right: 100, left: 50, bottom: 10 };
}

export default function ReportTagsCustomer() {
  const [tagId, setTagId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [responsibleId, setResponsibleId] = useState<string | null>(null);

  const [initMonth, setInitMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());

  const [searchTag, setSearchTag] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchResp, setSearchResp] = useState("");

  const { showToast } = useToast();
  //
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const chartRef4 = useRef<HTMLDivElement>(null);

  const [analytics, setAnalytics] =
    useState<CustomerTagAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMobile = () => window.innerWidth < 768;
  const [isSmallScreen, setIsSmallScreen] = useState(isMobile());
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenPdf = async () => {
    if (
      chartRef1.current &&
      chartRef2.current &&
      chartRef3.current &&
      chartRef4.current &&
      analytics
    ) {
      const [canvas1, canvas2, canvas3, canvas4] = await Promise.all([
        html2canvas(chartRef1.current),
        html2canvas(chartRef2.current),
        html2canvas(chartRef3.current),
        html2canvas(chartRef4.current),
      ]);
      const blob = await pdf(
        <ReportTagCustomerPDF
          chartImage1={canvas1.toDataURL("image/png")}
          chartImage2={canvas2.toDataURL("image/png")}
          chartImage3={canvas3.toDataURL("image/png")}
          chartImage4={canvas4.toDataURL("image/png")}
          range={analytics.range}
          customerCounts={analytics.customer_counts}
          activitiesByTag={analytics.activities_by_tag}
          salesByTag={analytics.sales_by_tag}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };
  //searchText control

  //fetch ข้อมูล tag ลูกค้า
  const { data: dataTag, refetch: refetchTag } = useSelectTag({
    searchText: searchTag,
  });
  const { data: dataTeam, refetch: refetchTeam } = useTeam({
    searchText: searchTeam,
  });
  const { data: dataResp, refetch: refetchResp } = useSelectResponsible({
    team_id: teamId || "",
    searchText: searchResp,
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
  const fetchDataTeamDropdown = async () => {
    const listRaw = (dataTeam?.responseObject?.data || []) as Array<{
      team_id: string;
      name: string;
    }>;

    return {
      responseObject: listRaw.map((t) => ({ id: t.team_id, name: t.name })),
    };
  };
  const fetchDataRespDropdown = async () => {
    if (!teamId) return { responseObject: [] };
    const listRaw = (dataResp?.responseObject?.data || []) as Array<{
      employee_id: string;
      first_name?: string;
      last_name?: string;
      full_name?: string;
    }>;

    return {
      responseObject: listRaw.map((m) => ({
        id: m.employee_id,
        name:
          m.full_name || `${m.first_name || ""} ${m.last_name || ""}`.trim(),
      })),
    };
  };
  const handleTagSearch = (searchText: string) => {
    setSearchTag(searchText);
    refetchTag();
  };
  const handleTeamSearch = (txt: string) => {
    setSearchTeam(txt);
    refetchTeam();
  };
  const handleRespSearch = (txt: string) => {
    setSearchResp(txt);
    refetchResp();
  };
  //

  // mockup 1 chart
  const colorCustomerData = ["#3b82f6", "#ef4444", "#FFCC33", "#22c55e"];
  const customerData = analytics ? analytics.customer_counts_chart : [];

  // mockup 3 charts
  const colorData = ["#3b82f6", "#ef4444", "#22c55e"];
  const segmentChart = analytics ? analytics.activities_segment_chart : [];
  const tagIdToName: Record<string, string> = (analytics?.tags || []).reduce(
    (acc, t) => {
      acc[t.tag_id] = t.tag_name;
      return acc;
    },
    {} as Record<string, string>
  );
  const tagIds = analytics ? analytics.tags.map((t) => t.tag_id) : [];
  const countActivityData = analytics
    ? analytics.activities_by_tag.map((t) => ({
        label: t.tag_name,
        value: t.activity_count,
      }))
    : [];
  const saleTagData = analytics
    ? analytics.sales_by_tag.map((t) => ({
        label: t.tag_name,
        value: t.total_sales,
        percent: t.sales_share_percent,
      }))
    : [];
  const [valueMode, setValueMode] = useState<"amount" | "percent">("amount");
  const saleTagDataDisplay = saleTagData.map((d) => ({
    ...d,
    display: valueMode === "amount" ? d.value : d.percent,
  }));

  // Extracted renderers
  const renderCustomerChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout={isSmallScreen ? "horizontal" : "vertical"}
        data={customerData}
        margin={barMargins(isSmallScreen)}
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
        <Tooltip formatter={(value) => (value as number).toLocaleString()} />
        <Bar dataKey="value">
          <LabelList
            dataKey="value"
            position={isSmallScreen ? "top" : "right"}
            formatter={(value: number) => value.toLocaleString()}
          />
          {customerData.map((d) => (
            <Cell
              key={d.label}
              fill={
                colorCustomerData[
                  customerData.indexOf(d) % colorCustomerData.length
                ]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
  const renderSegmentChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={segmentChart}
        margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="segment" />
        <YAxis
          allowDecimals={false}
          tickFormatter={(v) => v.toLocaleString()}
          width={20}
        />
        <Tooltip
          formatter={(value: number | string, name: string) => [
            value,
            tagIdToName[name] || name,
          ]}
        />
        <Legend formatter={(value) => tagIdToName[value] || value} />
        {tagIds.map((tid, idx) => (
          <Bar
            key={tid}
            dataKey={tid}
            name={tagIdToName[tid]}
            fill={colorData[idx % colorData.length]}
            stackId="a"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
  const renderActivityByTagChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout={isSmallScreen ? "horizontal" : "vertical"}
        data={countActivityData}
        margin={barMargins(isSmallScreen)}
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
        <Tooltip formatter={(value) => (value as number).toLocaleString()} />
        <Bar dataKey="value">
          <LabelList
            dataKey="value"
            position={isSmallScreen ? "top" : "right"}
            formatter={(value: number) => value.toLocaleString()}
          />
          {countActivityData.map((d) => (
            <Cell
              key={d.label}
              fill={colorData[countActivityData.indexOf(d) % colorData.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
  const renderSalesChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout={isSmallScreen ? "horizontal" : "vertical"}
        data={saleTagDataDisplay}
        margin={barMargins(isSmallScreen)}
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
        <Tooltip
          formatter={(value, _n, props) =>
            valueMode === "amount"
              ? `${Number(value).toLocaleString()} (${
                  props?.payload?.percent ?? 0
                }%)`
              : `${Number(value).toFixed(2)}%`
          }
        />
        <Bar dataKey="display">
          <LabelList
            dataKey="display"
            position={isSmallScreen ? "top" : "right"}
            formatter={(value: number, entry: { percent?: number }) => {
              const pct = entry?.percent ?? 0;
              return valueMode === "amount"
                ? `${value?.toLocaleString?.() || 0} (${pct}%)`
                : `${Number(value).toFixed(2)}% (${pct}%)`;
            }}
          />
          {saleTagDataDisplay.map((d) => (
            <Cell
              key={d.label}
              fill={colorData[saleTagDataDisplay.indexOf(d) % colorData.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const handleFetch = useCallback(async () => {
    if (!initMonth || !endMonth) return;
    setLoading(true);
    setError(null);
    try {
      const start = initMonth.toISOString().slice(0, 10);
      const end = endMonth.toISOString().slice(0, 10);
      const data = await fetchCustomerTagAnalytics({
        start_date: start,
        end_date: end,
        tag_id: tagId || undefined,
        team_id: teamId || undefined,
        responsible_id: responsibleId || undefined,
      });
      setAnalytics(data);
    } catch (e) {
      const msg = (e as Error).message || "โหลดข้อมูลไม่สำเร็จ";
      setError(msg);
      showToast(msg, false);
    } finally {
      setLoading(false);
    }
  }, [initMonth, endMonth, tagId, teamId, responsibleId, showToast]);
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return (
    <div>
      <p className=" mb-4 text-2xl font-bold">รายงานวิเคราะห์ยอดขายตามแท็กลูกค้า</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* พนักงานขาย */}
          <div className="flex flex-col w-full">
            <label className="text-md mb-1" htmlFor="team">
              ทีมขาย
            </label>
            <MasterSelectComponent
              id="team"
              onChange={(option) => {
                setTeamId(option ? String(option.value) : null);
                setResponsibleId(null);
              }}
              fetchDataFromGetAPI={fetchDataTeamDropdown}
              onInputChange={handleTeamSearch}
              valueKey="id"
              labelKey="name"
              placeholder="ทั้งหมด"
              isClearable
              label=""
              classNameLabel=""
              classNameSelect="w-full "
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-md mb-1" htmlFor="responsible">
              พนักงานรับผิดชอบ
            </label>
            <MasterSelectComponent
              id="responsible"
              onChange={(option) =>
                setResponsibleId(option ? String(option.value) : null)
              }
              fetchDataFromGetAPI={fetchDataRespDropdown}
              onInputChange={handleRespSearch}
              valueKey="id"
              labelKey="name"
              placeholder={teamId ? "ทั้งหมด" : "เลือกทีมก่อน"}
              isDisabled={!teamId}
              isClearable
              label=""
              classNameLabel=""
              classNameSelect="w-full "
            />
          </div>

          {/* วันที่เริ่ม */}

          <div className="flex flex-col w-full">
            <label className="text-md mb-1" htmlFor="start-date">
              วันที่เริ่ม
            </label>
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
            <label className="text-md mb-1" htmlFor="end-date">
              วันที่สิ้นสุด
            </label>
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
            <label className="text-md mb-1" htmlFor="tag">
              แท็กลูกค้า
            </label>
            <MasterSelectComponent
              id="tag"
              onChange={(option) =>
                setTagId(option ? String(option.value) : null)
              }
              fetchDataFromGetAPI={fetchDataTagDropdown}
              onInputChange={handleTagSearch}
              valueKey="id"
              labelKey="name"
              placeholder="ทั้งหมด"
              isClearable
              label=""
              classNameLabel=""
              classNameSelect="w-full "
            />
          </div>
     
          <div className="sm:col-span-1 md:col-span-2 lg:col-span-3 flex flex-wrap gap-3 justify-end items-end">
             <Buttons
              btnType="primary"
              variant="outline"
              className="w-full sm:w-auto sm:min-w-[100px]"
              onClick={handleFetch}
              disabled={loading}
            >
              {loading ? "กำลังโหลด..." : "ค้นหา"}
            </Buttons>
            <Buttons
              btnType="primary"
              variant="outline"
              className="w-full sm:w-auto sm:min-w-[100px]"
              onClick={handleOpenPdf}
              disabled={loading}
            >
              <FiPrinter style={{ fontSize: 18 }} /> พิมพ์
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
            <p className="text-2xl font-semibold mb-1">
              รายงานวิเคราะห์ยอดขายตามแท็กลูกค้า
            </p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
          </div>
          {/* chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            {/* Chart 1 */}
            <div>
              <div className="flex flex-col lg:flex-row lg:justify-between items-start sm:items-center mb-2">
                <p className="text-lg font-semibold text-gray-700">
                  สรุปลูกค้า
                </p>
                <p className="text-sm text-gray-700">
                  {initMonth?.toLocaleDateString()} -{" "}
                  {endMonth?.toLocaleDateString()}
                </p>
              </div>
              <ChartWrapper
                ref={chartRef1}
                loading={loading}
                dataLen={customerData.length}
                height={300}
              >
                {renderCustomerChart()}
              </ChartWrapper>
            </div>
            {/* Chart 2 */}
            <div>
              <p className="text-lg font-semibold mb-2 text-gray-700">
                กิจกรรมการขายแบ่งตามแท็กลูกค้า (
                {initMonth?.toLocaleDateString()} -{" "}
                {endMonth?.toLocaleDateString()})
              </p>
              <ChartWrapper
                ref={chartRef2}
                loading={loading}
                dataLen={segmentChart.length}
                height={300}
              >
                {renderSegmentChart()}
              </ChartWrapper>
            </div>
            {/* Chart 3 */}
            <div>
              <p className="text-lg font-semibold mb-2 text-gray-700">
                จำนวนกิจกรรมการขายแบ่งตามแท็กลูกค้า
              </p>
              <ChartWrapper
                ref={chartRef3}
                loading={loading}
                dataLen={countActivityData.length}
                height={260}
              >
                {renderActivityByTagChart()}
              </ChartWrapper>
            </div>
            {/* Chart 4 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold text-gray-700">
                  ยอดขายแบ่งตามแท็กลูกค้า (
                  {valueMode === "amount" ? "THB" : "%"})
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={valueMode === "amount" ? "font-semibold" : ""}
                  >
                    THB
                  </span>
                  <input
                    aria-label="toggle percent"
                    type="checkbox"
                    checked={valueMode === "percent"}
                    onChange={() =>
                      setValueMode((v) =>
                        v === "amount" ? "percent" : "amount"
                      )
                    }
                  />
                  <span
                    className={valueMode === "percent" ? "font-semibold" : ""}
                  >
                    %
                  </span>
                </div>
              </div>
              <ChartWrapper
                ref={chartRef4}
                loading={loading}
                dataLen={saleTagDataDisplay.length}
                height={260}
              >
                {renderSalesChart()}
              </ChartWrapper>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
    </div>
  );
}
