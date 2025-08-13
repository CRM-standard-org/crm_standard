import { useEffect, useRef, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from 'recharts';
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import { FiPrinter } from "react-icons/fi";
import html2canvas from "html2canvas-pro";
import { pdf } from "@react-pdf/renderer";
import SummarySalePDF from "../pdf/print-summary-sale/SummarySalePDF";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import { SummaryTable } from "@/components/customs/display/sumTable.component";
import { fetchSummarySale, SummarySaleResponse } from "@/services/dashboard.service";

export default function SummarySale() {
  const [tagId, setTagId] = useState<string | null>(null);
  const [initMonth, setInitMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());
  const [summary, setSummary] = useState<SummarySaleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState("");

  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  const handleOpenPdf = async () => {
    if (chartRef1.current && chartRef2.current) {
      const canvas1 = await html2canvas(chartRef1.current);
      const canvas2 = await html2canvas(chartRef2.current);
      const image1 = canvas1.toDataURL("image/png");
      const image2 = canvas2.toDataURL("image/png");
      const blob = await pdf(<SummarySalePDF chartImage1={image1} chartImage2={image2} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const { data: dataTag, refetch: refetchTag } = useSelectTag({ searchText: searchTag });

  const isMobile = () => window.innerWidth < 768;
  const [isSmallScreen, setIsSmallScreen] = useState(isMobile());
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDataTagDropdown = async () => {
    const tagList = dataTag?.responseObject?.data ?? [];
    return { responseObject: tagList.map((item: TypeTagColorResponse) => ({ id: item.tag_id, name: item.tag_name })) };
  };
  const handleTagSearch = (text: string) => { setSearchTag(text); refetchTag(); };

  const colorActivityCustomer = ['#7dd3fc', '#facc15', '#0c4a6e', '#22c55e'];
  const activityCustomer = summary ? [
    { label: 'จำนวนกิจกรรม', value: summary.metrics.activities },
    { label: 'จำนวนการปิดการขาย', value: summary.metrics.successful_sales },
    { label: 'จำนวนลูกค้าใหม่', value: summary.metrics.new_customers },
    { label: 'จำนวนลูกค้าเดิม', value: summary.metrics.existing_customers },
  ] : [];
  const colorSaleValue = ['#2563eb', '#ef4444'];
  const saleValue = summary ? [
    { label: 'มูลค่าคำสั่งซื้อที่ปิดการขายสำเร็จ', value: summary.metrics.sale_value_successful },
    { label: 'มูลค่าคำสั่งซื้อที่ปิดการขายไม่สำเร็จ', value: summary.metrics.sale_value_unsuccessful },
  ] : [];

  const fetchSummary = useCallback(async () => {
    if (!initMonth || !endMonth) return;
    setLoading(true); setError(null);
    try {
      const start = initMonth.toISOString().slice(0, 10);
      const end = endMonth.toISOString().slice(0, 10);
      const data = await fetchSummarySale({ start_date: start, end_date: end, tag_id: tagId });
      setSummary(data);
    } catch (e) {
      setError((e as Error).message || 'โหลดข้อมูลไม่สำเร็จ');
    } finally { setLoading(false); }
  }, [initMonth, endMonth, tagId]);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  return (
    <div>
      <p className="text-2xl font-bold">รายงานสรุปยอดขาย</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          <div className="flex flex-col w-full">
            <label htmlFor="start-date" className="text-md mb-1">วันที่เริ่ม</label>
            <DatePickerComponent id="start-date" label="" selectedDate={initMonth} onChange={(d) => setInitMonth(d)} classNameLabel="" classNameInput="w-full" />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="end-date" className="text-md mb-1">วันที่สิ้นสุด</label>
            <DatePickerComponent id="end-date" label="" selectedDate={endMonth} onChange={(d) => setEndMonth(d)} classNameLabel="" classNameInput="w-full" />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="tag" className="text-md mb-1">แท็กลูกค้า</label>
            <MasterSelectComponent id="tag" onChange={(opt) => setTagId(opt ? String(opt.value) : null)} fetchDataFromGetAPI={fetchDataTagDropdown} onInputChange={handleTagSearch} valueKey="id" labelKey="name" placeholder="ทั้งหมด" isClearable label="" classNameLabel="" classNameSelect="w-full" />
          </div>
          <div className="sm:col-span-1 md:col-span-2 lg:col-span-3 flex flex-wrap gap-3 justify-end">
            <Buttons btnType="primary" variant="outline" className="w-full sm:w-auto sm:min-w-[100px]" onClick={fetchSummary} disabled={loading}>ค้นหา</Buttons>
            <Buttons btnType="primary" variant="outline" className="w-full sm:w-auto sm:min-w-[100px]" onClick={handleOpenPdf} disabled={!summary || loading}><FiPrinter style={{ fontSize: 18 }} /> พิมพ์</Buttons>
          </div>
        </div>
      </div>

      <div className=" bg-white shadow-md rounded-lg pb-5">
        <div className="p-2 bg-sky-100 rounded-t-lg"><p className="font-semibold">เอาไว้ทำหัวรายงานในอนาคต</p></div>
        <div className="p-7 pb-5 w-full ">
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานสรุปยอดขาย</p>
            {summary && <p className="text-xs text-gray-500 mb-6">{summary.range.start_date} - {summary.range.end_date}</p>}
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {loading && <div className="mb-4">กำลังโหลด...</div>}
          {!loading && summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <div>
                <p className="text-lg font-semibold mb-2 text-gray-700">กิจกรรมและลูกค้า</p>
                <div ref={chartRef1} className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout={isSmallScreen ? "horizontal" : "vertical"} data={activityCustomer} margin={isSmallScreen ? { top: 10, right: 30, left: 30, bottom: 40 } : { top: 10, right: 100, left: 50, bottom: 10 }} barSize={isSmallScreen ? 40 : 20}>
                      <CartesianGrid strokeDasharray="3 3" />
                      {isSmallScreen ? (<><XAxis dataKey="label" /><YAxis tickFormatter={(v) => v.toLocaleString()} width={20} /></>) : (<><XAxis type="number" tickFormatter={(v) => v.toLocaleString()} /><YAxis type="category" dataKey="label" width={120} /></>)}
                      <Tooltip formatter={(v: number | string) => Number(v).toLocaleString()} />
                      <Bar dataKey="value">
                        <LabelList dataKey="value" position={isSmallScreen ? "top" : "right"} formatter={(v: number) => v.toLocaleString()} />
                        {activityCustomer.map((d) => (<Cell key={d.label} fill={colorActivityCustomer[activityCustomer.indexOf(d) % colorActivityCustomer.length]} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-2 text-gray-700">มูลค่าการขาย</p>
                <div ref={chartRef2} className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout={isSmallScreen ? "horizontal" : "vertical"} data={saleValue} margin={isSmallScreen ? { top: 10, right: 30, left: 30, bottom: 40 } : { top: 10, right: 100, left: 110, bottom: 10 }} barSize={isSmallScreen ? 40 : 20}>
                      <CartesianGrid strokeDasharray="3 3" />
                      {isSmallScreen ? (<><XAxis dataKey="label" /><YAxis tickFormatter={(v) => v.toLocaleString()} /></>) : (<><XAxis type="number" tickFormatter={(v) => v.toLocaleString()} /><YAxis type="category" dataKey="label" width={120} /></>)}
                      <Tooltip formatter={(v: number | string) => Number(v).toLocaleString()} />
                      <Bar dataKey="value">
                        <LabelList dataKey="value" position={isSmallScreen ? "top" : "right"} formatter={(v: number) => v.toLocaleString()} />
                        {saleValue.map((d) => (<Cell key={d.label} fill={colorSaleValue[saleValue.indexOf(d) % colorSaleValue.length]} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
        {!loading && summary && (
          <div className="p-3 px-10 grid grid-cols-1 xl:grid-cols-3 gap-4 mt-5">
            <SummaryTable title="10 อันดับลูกค้า" columns={[{ header: 'อันดับที่', key: 'rank' }, { header: 'ลูกค้า', key: 'company_name' }, { header: 'สัดส่วนรายได้(%)', key: 'percent', align: 'right' }]} data={summary.top_customers.map(c => ({ ...c, percent: c.percent.toFixed(2) + '%' }))} />
            <SummaryTable title="10 หมวดหมู่สินค้า" columns={[{ header: 'อันดับที่', key: 'rank' }, { header: 'หมวดหมู่', key: 'name' }, { header: 'รายได้', key: 'total_sales', align: 'right' }]} data={summary.top_categories.map(c => ({ ...c, total_sales: 'THB ' + c.total_sales.toLocaleString() }))} />
            <SummaryTable title="10 พนักงานขาย" columns={[{ header: 'อันดับที่', key: 'rank' }, { header: 'พนักงาน', key: 'employee_name' }, { header: 'สัดส่วนรายได้(%)', key: 'percent', align: 'right' }]} data={summary.top_employees.map(e => ({ ...e, percent: e.percent.toFixed(2) + '%' }))} />
          </div>
        )}
      </div>
    </div>
  );
}
