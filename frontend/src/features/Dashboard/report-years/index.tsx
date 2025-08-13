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
import { fetchReportYears as fetchReportYearsAPI, ReportYearResponse, ChartPoint } from "@/services/dashboard.service";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { FiPrinter } from "react-icons/fi";
import { pdf } from "@react-pdf/renderer";
import html2canvas from "html2canvas-pro";
import ReportYearPDF from "../pdf/print-report-year/ReportYearPDF";

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

  //
  const chartRef = useRef<HTMLDivElement>(null);

  const handleOpenPdf = async () => {
    if (chartRef.current && reportData && year) {
      const canvas = await html2canvas(chartRef.current);
      const imageData = canvas.toDataURL("image/png");
      const currentYear = year.getFullYear();
      const previousYear = currentYear - 1;
      const blob = await pdf(
        <ReportYearPDF
          chartImage={imageData}
          comparison={reportData.comparison}
          table={reportData.table}
          years={{ previousYear, currentYear }}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const handleFetch = useCallback(async () => {
    if (!year) return;
    try {
      setLoading(true);
      const buddhistYear = year.getFullYear() + 543;
      const data = await fetchReportYearsAPI(buddhistYear);
      setReportData(data);
    } catch (e) {
      console.error("fetch report years failed", e);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const salesDataTable = reportData?.table || [];
  const salesData: ChartPoint[] = reportData?.chart || [];

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
        <div className="flex flex-1 justify-end gap-3 w-full sm:w-auto">
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
                THB {(reportData?.comparison?.target || 0).toLocaleString()}
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
              {salesDataTable.map((row) => {
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
              <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]" ref={chartRef}>
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
    </div>
  );
}
