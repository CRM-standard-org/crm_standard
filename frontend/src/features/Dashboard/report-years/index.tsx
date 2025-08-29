import { useEffect, useState, useRef, useCallback } from "react";
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
} from "recharts";
import { Table } from "@radix-ui/themes";
import {
  fetchReportYears as fetchReportYearsAPI,
  ReportYearResponse,
  ChartPoint,
} from "@/services/dashboard.service";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { FiPrinter } from "react-icons/fi";
import { pdf } from "@react-pdf/renderer";
import html2canvas from "html2canvas-pro";
import ReportYearPDF from "../pdf/print-report-year/ReportYearPDF";
import api from "@/apis/main.api";
import { SALES_FORECAST } from "@/apis/endpoint.api";
import { useToast } from "@/components/customs/alert/ToastContext";
import { useLocalProfileData } from "@/zustand/useProfile";

const MONTH_LABELS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export default function ReportYears() {
  const [year, setYear] = useState<Date | null>(new Date());
  const [reportData, setReportData] = useState<ReportYearResponse | null>(null);
  const [loading, setLoading] = useState(false);
  // goals
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [annualGoalInput, setAnnualGoalInput] = useState<number | "">("");
  const [monthlyGoalInputs, setMonthlyGoalInputs] = useState<
    Record<number, number | "">
  >({});
  const [annualGoal, setAnnualGoal] = useState<number>(0);
  const [monthlyGoalMap, setMonthlyGoalMap] = useState<Record<number, number>>(
    {}
  );
  const employeeId = useLocalProfileData((s) => s.profile.employee_id);
  const actor_id = employeeId || undefined;
  const { showToast } = useToast();

  //
  const chartRef = useRef<HTMLDivElement>(null);

  // Helper to update monthly goal inputs consistently
  const updateMonthlyGoal = (m: number, value: string) => {
    setMonthlyGoalInputs((prev) => ({
      ...prev,
      [m]: value === "" ? "" : Math.max(0, Number(value)),
    }));
  };

  const handleOpenPdf = async () => {
    if (chartRef.current && reportData && year) {
      const canvas = await html2canvas(chartRef.current);
      const imageData = canvas.toDataURL("image/png");
      const currentYear = year.getFullYear();
      const previousYear = currentYear - 1;
      const comparison = {
        ...reportData.comparison,
        target: comparisonTarget,
      } as ReportYearResponse["comparison"];
      const blob = await pdf(
        <ReportYearPDF
          chartImage={imageData}
          comparison={comparison}
          table={tableWithTarget}
          years={{ previousYear, currentYear }}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  // Fetch sales goals from shared Sales Forecast model (sync with ForcastSale)
  const fetchGoals = useCallback(async (gregorianYear: number) => {
    setLoadingGoals(true);
    try {
      const { data } = await api.get(SALES_FORECAST.GOALS, {
        params: {
          year: gregorianYear.toString(),
        },
      });
      const rows: Array<{ month: number | null; goal_amount: number }> =
        data?.responseObject || [];
      const annual = rows.find((r) => r.month === null);
      const monthly: Record<number, number> = {};
      rows
        .filter((r) => r.month != null)
        .forEach((r) => {
          if (typeof r.month === "number")
            monthly[r.month] = Number(r.goal_amount || 0);
        });
      setAnnualGoal(annual ? Number(annual.goal_amount || 0) : 0);
      setMonthlyGoalMap(monthly);
      // preset inputs for modal
      setAnnualGoalInput(annual ? Number(annual.goal_amount || 0) : "");
      const inputMonthly: Record<number, number | ""> = {};
      for (let m = 1; m <= 12; m++)
        if (monthly[m] != null) inputMonthly[m] = monthly[m];
      setMonthlyGoalInputs(inputMonthly);
    } finally {
      setLoadingGoals(false);
    }
  }, []);

  const handleFetch = useCallback(async () => {
    if (!year) return;
    try {
      setLoading(true);
      const gregorianYear = year.getFullYear();
      const buddhistYear = gregorianYear + 543;
      const data = await fetchReportYearsAPI(buddhistYear);
      setReportData(data);
      // also fetch shared goals to merge/display targets
      await fetchGoals(gregorianYear);
    } catch (e) {
      console.error("fetch report years failed", e);
    } finally {
      setLoading(false);
    }
  }, [year, fetchGoals]);

  const saveAnnualGoal = useCallback(async () => {
    if (
      !year ||
      annualGoalInput === "" ||
      Number(annualGoalInput) < 0 ||
      !actor_id
    )
      return;
    await api.post(SALES_FORECAST.GOALS, {
      year: year.getFullYear(),
      month: null,
      goal_amount: Number(annualGoalInput),
      actor_id,
    });
  }, [year, annualGoalInput, actor_id]);

  const saveMonthlyGoal = useCallback(
    async (m: number) => {
      if (!year || !actor_id) return;
      const v = monthlyGoalInputs[m];
      if (v === undefined || v === "" || Number(v) < 0) return;
      await api.post(SALES_FORECAST.GOALS, {
        year: year.getFullYear(),
        month: m,
        goal_amount: Number(v),
        actor_id,
      });
    },
    [year, monthlyGoalInputs, actor_id]
  );

  const saveAllGoals = useCallback(async () => {
    console.log("save goals");
    if (!year) return;
    if (!actor_id) {
      showToast("กรุณาเข้าสู่ระบบก่อนบันทึกเป้าหมาย", false);
      return;
    }
    setSavingGoals(true);
    try {
      console.log("save goals");
      await saveAnnualGoal();
      for (let m = 1; m <= 12; m++) {
        if (monthlyGoalInputs[m] !== undefined) {
          await saveMonthlyGoal(m);
        }
      }
      await fetchGoals(year.getFullYear());
      setShowGoalModal(false);
      await handleFetch();
      showToast("บันทึกเป้าหมายเรียบร้อยแล้ว", true);
    } catch (e) {
      console.error("save goals failed", e);
      showToast("ไม่สามารถบันทึกเป้าหมายได้", false);
    } finally {
      setSavingGoals(false);
    }
  }, [
    year,
    actor_id,
    saveAnnualGoal,
    saveMonthlyGoal,
    monthlyGoalInputs,
    fetchGoals,
    handleFetch,
    showToast,
  ]);

  // When opening goal modal, ensure goals are loaded for current year
  useEffect(() => {
    if (showGoalModal && year) {
      fetchGoals(year.getFullYear());
    }
  }, [showGoalModal, year, fetchGoals]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const salesDataTable = reportData?.table || [];
  const salesData: ChartPoint[] = reportData?.chart || [];

  // Merge targets from Sales Forecast goals into comparison, table and chart
  const monthlyDefault = annualGoal > 0 ? annualGoal / 12 : 0;
  const targetByMonth: number[] = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return monthlyGoalMap[m] ?? monthlyDefault;
  });
  const chartWithTarget: ChartPoint[] = salesData.map((pt, idx) => ({
    ...pt,
    target: targetByMonth[idx] ?? 0,
  }));
  const tableWithTarget = [
    ...salesDataTable,
    {
      label: "เป้าหมายรายเดือน",
      values: targetByMonth.map((v) => Math.round(v)),
    },
  ];
  const comparisonTarget = annualGoal || reportData?.comparison?.target || 0;

  return (
    <div>
      <p className=" mb-4 text-2xl font-bold">รายงานยอดขายประจำปี</p>

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
        <div className="flex flex-1 justify-end gap-3 w-full sm:w-auto">
          <Buttons
            btnType="default"
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[120px]"
            onClick={() => setShowGoalModal(true)}
            disabled={!year}
          >
            แก้ไขเป้าหมาย
          </Buttons>
          <Buttons
            btnType="primary"
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[100px]"
            onClick={handleFetch}
            disabled={loading || !year}
          >
            {loading ? "กำลังโหลด..." : "ค้นหา"}
          </Buttons>
          <Buttons
            btnType="primary"
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[100px]"
            onClick={handleOpenPdf}
            disabled={!reportData || loading}
          >
            <FiPrinter style={{ fontSize: 18 }} /> พิมพ์
          </Buttons>
        </div>
      </div>

      <div className=" bg-white shadow-md rounded-lg pb-5">
        <div className="p-2 bg-sky-100 rounded-t-lg">
          <p className="font-semibold">เอาไว้ทำหัวรายงานในอนาคต</p>
        </div>

        <div className="p-7 pb-5 w-full max-w-full overflow-x-auto">
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานยอดขายประจำปี</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
            <p className="text-xs text-gray-500 mb-6">
              เปรียบเทียบยอดขาย ปี {(year?.getFullYear() || 0) - 1} และ ปี{" "}
              {year?.getFullYear()}
            </p>
          </div>

          <div className="flex flex-row mt-5 mb-6 space-x-5">
            <div className="flex flex-col">
              <p className="font-semibold">
                ยอดขายรวมปี {(year?.getFullYear() || 0) - 1}
              </p>
              <p className="font-semibold">
                THB{" "}
                {(
                  reportData?.comparison?.previous?.total_sales || 0
                ).toLocaleString()}
              </p>
              <p>
                เฉลี่ยต่อคำสั่งซื้อ THB{" "}
                {(
                  reportData?.comparison?.previous?.avg_per_order || 0
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">
                ยอดขายรวมปี {year?.getFullYear()} (YTD)
              </p>
              <p className="font-semibold">
                THB{" "}
                {(
                  reportData?.comparison?.current?.total_sales || 0
                ).toLocaleString()}
              </p>
              <p>
                เฉลี่ยต่อคำสั่งซื้อ THB{" "}
                {(
                  reportData?.comparison?.current?.avg_per_order || 0
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">
                เป้าหมายการขายปี {year?.getFullYear()}
              </p>
              <p className="font-semibold">
                THB {(comparisonTarget || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <Table.Root variant="surface" size="2" className="whitespace-nowrap">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ค่าเงิน THB</Table.ColumnHeaderCell>
                {MONTH_LABELS.map((month) => (
                  <Table.ColumnHeaderCell key={month} className="text-end">
                    {month}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tableWithTarget.map((row) => {
                const isGrowthRow = row.label.includes("%");
                return (
                  <Table.Row
                    key={row.label}
                    className={isGrowthRow ? "bg-blue-50" : ""}
                  >
                    <Table.RowHeaderCell
                      className={
                        isGrowthRow ? "text-blue-700 font-semibold" : ""
                      }
                    >
                      {row.label}
                    </Table.RowHeaderCell>
                    {row.values.map((value, index) => (
                      <Table.Cell
                        key={`${row.label}-${MONTH_LABELS[index]}`}
                        className={`text-end ${
                          isGrowthRow ? "font-semibold" : ""
                        }`}
                      >
                        {value.toLocaleString()}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>

          <p className="font-semibold mt-5">
            กราฟเปรียบเทียบสถิติยอดขายภายใน ปี {(year?.getFullYear() || 0) - 1}{" "}
            และ ปี {year?.getFullYear()}
          </p>
          <div className="pb-5 w-full">
            <div className="pt-5">
              <div
                className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
                ref={chartRef}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartWithTarget}
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
                    <Tooltip
                      formatter={(value: number) => value.toLocaleString()}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar
                      dataKey="target"
                      fill="#003399"
                      name="เป้าหมายยอดขาย (THB)"
                    />
                    <Line
                      dataKey="sales_previous"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="ยอดขายปีก่อน (THB)"
                      dot={{ r: 2 }}
                    />
                    <Line
                      dataKey="sales_current"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      name="ยอดขายปีนี้ (THB)"
                      dot={{ r: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Modal (match ForcastSale UI) */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              แก้ไขเป้าหมายยอดขาย {year?.getFullYear()}
            </h2>
            {loadingGoals ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="annual-goal-input"
                    className="block text-sm font-medium mb-1"
                  >
                    เป้าหมายรวม (Annual)
                  </label>
                  <input
                    id="annual-goal-input"
                    type="number"
                    min={0}
                    value={annualGoalInput}
                    onChange={(e) =>
                      setAnnualGoalInput(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">
                    เป้าหมายรายเดือน (ปล่อยว่างใช้ค่าเฉลี่ย)
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <div key={m} className="flex flex-col">
                        <label
                          htmlFor={`month-goal-${m}`}
                          className="text-xs mb-1"
                        >
                          เดือน {m}
                        </label>
                        <input
                          id={`month-goal-${m}`}
                          type="number"
                          min={0}
                          value={monthlyGoalInputs[m] ?? ""}
                          onChange={(e) => updateMonthlyGoal(m, e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <Buttons
                btnType="cancel"
                variant="outline"
                onClick={() => setShowGoalModal(false)}
              >
                ยกเลิก
              </Buttons>
              <Buttons
                btnType="primary"
                variant="outline"
                onClick={saveAllGoals}
                disabled={savingGoals || !actor_id}
              >
                {savingGoals ? "กำลังบันทึก..." : "บันทึก"}
              </Buttons>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
