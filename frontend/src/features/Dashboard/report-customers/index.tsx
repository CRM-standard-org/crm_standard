import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useToast } from "@/components/customs/alert/ToastContext";
import { fetchCustomerAnalytics, CustomerAnalyticsResponse } from "@/services/customerAnalytics.service.ts";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { FiPrinter } from "react-icons/fi";
import ReportCustomerPDF from "../pdf/print-report-customer/ReportCustomerPDF";
import { pdf } from "@react-pdf/renderer";
import html2canvas from "html2canvas-pro";
import { useTeam } from '@/hooks/useTeam';
import { useSelectResponsible } from '@/hooks/useEmployee';
import { useAllCustomer } from '@/hooks/useCustomer';
import { Skeleton } from '@/components/ui/skeleton';

// Extracted sub components
interface SummaryStatsProps { readonly summary: { totalValue: string; status: string; averageValue: string; lastOrderDate: string; accumulated: string }; readonly loading: boolean }
function SummaryStats({ summary, loading }: SummaryStatsProps) {
  const rows = [
    { key: 'total', label: 'มูลค่าการซื้อทั้งหมดของลูกค้า', value: summary.totalValue, thb: true },
    { key: 'status', label: 'สถานะ', value: summary.status },
    { key: 'avg', label: 'มูลค่าเฉลี่ยต่อคำสั่งซื้อ', value: summary.averageValue, thb: true },
    { key: 'last', label: 'คำสั่งซื้อล่าสุด', value: summary.lastOrderDate },
    { key: 'acc', label: 'มูลค่าการซื้อสะสมทั้งหมดในระบบ', value: summary.accumulated, span: true, thb: true }
  ];
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-x-6 mb-8 text-sm border-t border-b divide-gray-200">
      {rows.map(row => {
        const display = row.thb && row.value !== '-' ? `THB ${row.value}` : row.value;
        return (
          <div key={row.key} className={`flex flex-col md:flex-row md:justify-between py-2 ${row.span ? 'md:col-span-2' : ''} border-b last:border-b-0`}>
            <p className="text-gray-600">{row.label}</p>
            {loading ? <Skeleton className="h-4 w-24" /> : <p className="font-medium">{display}</p>}
          </div>
        );
      })}
    </div>
  );
}

interface PaymentTermsCardProps { readonly paymentTerms: { payment_term_name: string; orders_count: number }[]; readonly loading: boolean }
function PaymentTermsCard({ paymentTerms, loading }: PaymentTermsCardProps) {
  let content: JSX.Element | JSX.Element[];
  if (loading) {
    const skeletonIds = ['a','b','c','d'];
    content = skeletonIds.map(id => (
      <div key={`pt-skel-${id}`} className="py-2 border-b"><Skeleton className="h-4 w-full" /></div>
    ));
  } else if (paymentTerms.length) {
    content = paymentTerms.map(pt => (
      <div key={pt.payment_term_name} className="flex justify-between py-2 border-b last:border-b-0"><p>{pt.payment_term_name}</p><p className="font-semibold">{pt.orders_count.toLocaleString()} คำสั่งซื้อ</p></div>
    ));
  } else content = <div className="py-2 text-gray-500">- ไม่มีข้อมูล -</div>;
  return (
    <div>
      <div className="flex items-center border-b space-x-2"><p className="text-xl font-bold">เงื่อนไขการชำระเงิน</p></div>
      <div className="p-2 px-3">{content}</div>
    </div>
  );
}

interface ProductsCardProps { readonly title: string; readonly products: { group_product_id: string; group_product_name: string; units: number; share?: number }[]; readonly loading: boolean }
function ProductsCard({ title, products, loading }: ProductsCardProps) {
  let content: JSX.Element | JSX.Element[];
  if (loading) {
    const skeletonIds = ['a','b','c','d','e'];
    content = skeletonIds.map(id => (
      <div key={`prod-skel-${id}`} className="py-2 border-b"><Skeleton className="h-4 w-full" /></div>
    ));
  } else if (products.length) {
    content = products.map(p => (
      <div key={p.group_product_id} className="flex justify-between py-2 border-b last:border-b-0"><p>{p.group_product_name}</p><p className="font-semibold">{p.units.toLocaleString()} หน่วย {p.share != null ? `(${p.share.toFixed(2)}%)` : ''}</p></div>
    ));
  } else content = <div className="py-2 text-gray-500">- ไม่มีข้อมูล -</div>;
  return (
    <div>
      <div className="flex items-center border-b space-x-2"><p className="text-xl font-bold">{title}</p></div>
      <div className="p-2 px-3">{content}</div>
    </div>
  );
}

interface AveragesCardProps { readonly averages: CustomerAnalyticsResponse['averages'] | undefined; readonly loading: boolean }
function AveragesCard({ averages, loading }: AveragesCardProps) {
  return (
    <div>
      <div className="flex items-center border-b space-x-2"><p className="text-xl font-bold">สถิติ (โดยเฉลี่ย)</p></div>
      <div className="p-2 px-3 text-sm">
        {loading ? (()=>{ const ids=['a','b','c','d']; return ids.map(id => (
          <div key={`avg-skel-${id}`} className="flex justify-between py-2 border-b"><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-16" /></div>
        )); })() : (
          <>
            <div className="flex justify-between py-2 border-b"><p>ระยะเวลาจากใบเสนอราคาถึงคำสั่งซื้อ</p><p className="font-semibold">{averages?.avg_days_quotation_to_order != null ? averages.avg_days_quotation_to_order + ' วัน' : '-'}</p></div>
            <div className="flex justify-between py-2 border-b"><p>ระยะเวลาจากคำสั่งซื้อถึงการชำระครั้งแรก</p><p className="font-semibold">{averages?.avg_days_order_to_payment != null ? averages.avg_days_order_to_payment + ' วัน' : '-'}</p></div>
            <div className="flex justify-between py-2 border-b"><p>อัตราแปลง Quotation → Order</p><p className="font-semibold">{averages?.quotation_to_order_conversion_rate != null ? averages.quotation_to_order_conversion_rate.toFixed(2) + ' %' : '-'}</p></div>
            <div className="flex justify-between py-2"><p>จำนวนกิจกรรมติดตาม (เฉลี่ย)</p><p className="font-semibold">{averages?.avg_follow_up_activity_count ?? '-'}</p></div>
          </>
        )}
      </div>
    </div>
  );
}

interface RevenueShareCardProps { readonly share: CustomerAnalyticsResponse['share'] | undefined; readonly totalPurchaseValue: number; readonly loading: boolean; readonly isFocus: boolean }
function RevenueShareCard({ share, totalPurchaseValue, loading, isFocus }: RevenueShareCardProps) {
  let top: JSX.Element;
  if (loading) {
    top = (
      <>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`rev-skel-${['a','b'][i]}`} className="flex justify-between py-2 border-b"><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-16" /></div>
        ))}
      </>
    );
  } else {
    top = (
      <>
        {isFocus ? (
          <div className="flex justify-between py-2 border-b"><p>สัดส่วนยอดขาย (ลูกค้าต่อทั้งหมด)</p><p className="font-semibold">{share ? share.customer_revenue_share_percent.toFixed(2) + '%' : '-'}</p></div>
        ) : (
          <div className="py-2 border-b text-gray-500 text-xs">เลือก "ลูกค้า" เพื่อดูสัดส่วนเทียบรวม</div>
        )}
        <div className="flex justify-between py-2"><p>มูลค่ายอดขายรวมในช่วง</p><p className="font-semibold">THB {totalPurchaseValue.toLocaleString()}</p></div>
      </>
    );
  }
  return (
    <div>
      <div className="flex items-center border-b space-x-2"><p className="text-xl font-bold">สัดส่วนยอดขาย</p></div>
      <div className="p-2 px-3 text-sm">{top}</div>
    </div>
  );
}

export default function ReportCustomers() {
  const [customerTagId, setCustomerTagId] = useState<string | null>(null); // tag filter
  const [customerId, setCustomerId] = useState<string | null>(null); // focus customer
  const [teamId, setTeamId] = useState<string | null>(null);
  const [responsibleId, setResponsibleId] = useState<string | null>(null);
  const [initMonth, setInitMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());
  const { showToast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);
  const [searchTag, setSearchTag] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchResp, setSearchResp] = useState("");
  const [report, setReport] = useState<CustomerAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyMode, setWeeklyMode] = useState(false);

  // Tag select
  const { data: dataTag, refetch: refetchTag } = useSelectTag({ searchText: searchTag });
  const fetchDataTagDropdown = async () => {
    const tagList = dataTag?.responseObject?.data ?? [];
    return { responseObject: tagList.map((item: TypeTagColorResponse) => ({ id: item.tag_id, name: item.tag_name })) };
  };
  const handleTagSearch = (text: string) => { setSearchTag(text); refetchTag(); };

  // Team & Responsible
  const { data: dataTeam, refetch: refetchTeam } = useTeam({ searchText: searchTeam });
  const { data: dataResp, refetch: refetchResp } = useSelectResponsible({ team_id: teamId || '', searchText: searchResp });
  const fetchDataTeamDropdown = async () => {
    const listRaw = (dataTeam?.responseObject?.data || []) as Array<{ team_id: string; name: string }>;
    return { responseObject: listRaw.map(t=> ({ id: t.team_id, name: t.name })) };
  };
  const fetchDataRespDropdown = async () => {
    if(!teamId) return { responseObject: [] };
    const listRaw = (dataResp?.responseObject?.data || []) as Array<{ employee_id: string; full_name?: string; first_name?: string; last_name?: string }>;
    return { responseObject: listRaw.map(m=> ({ id: m.employee_id, name: m.full_name || `${m.first_name||''} ${m.last_name||''}`.trim() })) };
  };
  const handleTeamSearch = (txt:string)=> { setSearchTeam(txt); refetchTeam(); };
  const handleRespSearch = (txt:string)=> { setSearchResp(txt); refetchResp(); };

  // Customer select (focus mode)
  const { data: dataCustomers, refetch: refetchCustomers } = useAllCustomer({ page: '1', pageSize: '20', searchText: searchCustomer, payload: { tag_id: customerTagId, team_id: teamId, responsible_id: responsibleId, start_date: initMonth?.toISOString().slice(0,10) || null, end_date: endMonth?.toISOString().slice(0,10) || null } });
  const fetchDataCustomerDropdown = async () => {
    const listRaw = (dataCustomers?.responseObject?.data || []) as Array<{ customer_id: string; company_name?: string; customer_name?: string }>;
    return { responseObject: listRaw.map(c=> ({ id: c.customer_id, name: c.company_name || c.customer_name || c.customer_id })) };
  };
  const handleCustomerSearch = (txt:string)=> { setSearchCustomer(txt); refetchCustomers(); };

  const handleOpenPdf = async () => {
    if (!chartRef.current || !report) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      const imageData = canvas.toDataURL("image/png");
      const blob = await pdf(
        <ReportCustomerPDF
          chartImage={imageData}
          range={report.range}
          overview={report.overview}
          averages={report.averages}
          paymentTerms={report.payment_terms} // full
          successProducts={report.success_products}
          rejectedProducts={report.rejected_products}
          share={customerId ? report.share : null}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      showToast("ไม่สามารถสร้าง PDF ได้", false);
    }
  };

  const handleFetch = useCallback(async () => {
    if (!initMonth || !endMonth) return;
    setLoading(true); setError(null);
    try {
      const start = initMonth.toISOString().slice(0, 10);
      const end = endMonth.toISOString().slice(0, 10);
      const data = await fetchCustomerAnalytics({ start_date: start, end_date: end, tag_id: customerTagId || undefined, customer_id: customerId || undefined, team_id: teamId || undefined, responsible_id: responsibleId || undefined });
      setReport(data);
      const diffDays = Math.ceil((endMonth.getTime() - initMonth.getTime())/(1000*60*60*24));
      if (diffDays > 60) setWeeklyMode(true); else if (weeklyMode && diffDays <= 60) setWeeklyMode(false);
    } catch (e) {
      const msg = (e as Error).message || 'โหลดข้อมูลไม่สำเร็จ';
      setError(msg);
      showToast(msg, false);
    } finally { setLoading(false); }
  }, [initMonth, endMonth, customerTagId, customerId, teamId, responsibleId, weeklyMode, showToast]);
  useEffect(() => { handleFetch(); }, [handleFetch]);

  // Build summary
  const customerSummary = report ? {
    totalValue: report.overview.total_purchase_value.toLocaleString(),
    status: report.overview.status || '-',
    averageValue: report.overview.average_order_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    lastOrderDate: report.overview.last_order_date ? new Date(report.overview.last_order_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
    accumulated: report.overview.accumulated_purchase_value.toLocaleString(),
  } : { totalValue: '-', status: '-', averageValue: '-', lastOrderDate: '-', accumulated: '-' };

  // Daily to weekly aggregation if needed
  const orderDaily = useMemo(()=> report?.order_daily_chart || [], [report]);
  const orderWeekly = useMemo(()=>{
    if(!report) return [] as { label: string; orders: number }[];
    const startFull = new Date(report.range.start_date);
    const map = new Map<string, number>();
    orderDaily.forEach((pt, idx) => {
      const d = new Date(startFull.getTime() + idx*86400000);
      const year = d.getFullYear();
      const oneJan = new Date(year,0,1);
      const week = Math.ceil((((d.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay()+1)/7);
      const key = `${year}-W${week}`;
      map.set(key, (map.get(key)||0) + pt.orders);
    });
    return Array.from(map.entries()).map(([label, orders])=>({ label, orders }));
  }, [orderDaily, report]);

  const chartData = weeklyMode ? orderWeekly : orderDaily.map(d=>({ label: d.day, orders: d.orders }));
  const totalOrders = chartData.reduce((s,d)=> s + d.orders, 0);
  const showWeeklyToggle = useMemo(()=>{
    if(!initMonth || !endMonth) return false; 
    const diffDays = Math.ceil((endMonth.getTime()-initMonth.getTime())/86400000); 
    return diffDays > 60; 
  }, [initMonth, endMonth]);

  const averages = report?.averages;
  const paymentTerms = report?.payment_terms || [];
  const successProductsRaw = report?.success_products || [];
  const rejectedProductsRaw = report?.rejected_products || [];
  const totalSuccessUnits = successProductsRaw.reduce((s,p)=> s+p.units,0) || 0;
  const totalRejectedUnits = rejectedProductsRaw.reduce((s,p)=> s+p.units,0) || 0;
  const successProducts = successProductsRaw.map(p=> ({ ...p, share: totalSuccessUnits? (p.units/totalSuccessUnits*100): 0 }));
  const rejectedProducts = rejectedProductsRaw.map(p=> ({ ...p, share: totalRejectedUnits? (p.units/totalRejectedUnits*100): 0 }));
  const share = report?.share;

  return (
    <div>
      <p className="text-2xl font-bold">รายงานวิเคราะห์ลูกค้า</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Customer focus */}
          <div className="flex flex-col w-full">
            <p className="text-md mb-1">ลูกค้า (Focus)</p>
            <MasterSelectComponent
              id="customer"
              onChange={(option) => setCustomerId(option ? String(option.value) : null)}
              fetchDataFromGetAPI={fetchDataCustomerDropdown}
              onInputChange={handleCustomerSearch}
              valueKey="id"
              labelKey="name"
              placeholder="ทั้งหมด"
              isClearable
              label=""
              classNameSelect="w-full"
            />
          </div>
          {/* แท็กลูกค้า (filter) */}
          <div className="flex flex-col w-full">
            <p className="text-md mb-1">แท็กลูกค้า</p>
            <MasterSelectComponent
              id="tag"
              onChange={(option) => setCustomerTagId(option ? String(option.value) : null)}
              fetchDataFromGetAPI={fetchDataTagDropdown}
              onInputChange={handleTagSearch}
              valueKey="id"
              labelKey="name"
              placeholder="ทั้งหมด"
              isClearable
              label=""
              classNameSelect="w-full"
            />
          </div>
          {/* Team */}
          <div className="flex flex-col w-full">
            <p className="text-md mb-1">ทีมขาย</p>
            <MasterSelectComponent
              id="team"
              onChange={(option) => { setTeamId(option ? String(option.value) : null); setResponsibleId(null); }}
              fetchDataFromGetAPI={fetchDataTeamDropdown}
              onInputChange={handleTeamSearch}
              valueKey="id"
              labelKey="name"
              placeholder="ทั้งหมด"
              isClearable
              label=""
              classNameSelect="w-full"
            />
          </div>
          {/* Responsible */}
            <div className="flex flex-col w-full">
            <p className="text-md mb-1">พนักงานรับผิดชอบ</p>
            <MasterSelectComponent
              id="responsible"
              onChange={(option) => setResponsibleId(option ? String(option.value) : null)}
              fetchDataFromGetAPI={fetchDataRespDropdown}
              onInputChange={handleRespSearch}
              valueKey="id"
              labelKey="name"
              placeholder={teamId ? 'ทั้งหมด' : 'เลือกทีมก่อน'}
              isDisabled={!teamId}
              isClearable
              label=""
              classNameSelect="w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-md mb-1" htmlFor="start-date">วันที่เริ่ม</label>
            <DatePickerComponent id="start-date" selectedDate={initMonth} onChange={(d) => setInitMonth(d)} classNameLabel="" classNameInput="w-full" />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-md mb-1" htmlFor="end-date">วันที่สิ้นสุด</label>
            <DatePickerComponent id="end-date" selectedDate={endMonth} onChange={(d) => setEndMonth(d)} classNameLabel="" classNameInput="w-full" />
          </div>
          {/* Data type removed (unused) */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-3 justify-end">
            <Buttons btnType="primary" variant="outline" className="w-full sm:w-auto sm:min-w-[100px]" onClick={handleFetch} disabled={loading}>{loading? 'กำลังโหลด...': 'ค้นหา'}</Buttons>
            <Buttons btnType="primary" variant="outline" className="w-full sm:w-auto sm:min-w-[100px]" onClick={handleOpenPdf} disabled={!report || loading}><FiPrinter style={{ fontSize: 18 }} /> พิมพ์</Buttons>
          </div>
        </div>
      </div>

      <div className=" bg-white shadow-md rounded-lg pb-5">
        <div className="p-2 bg-sky-100 rounded-t-lg"><p className="font-semibold">หัวรายงาน</p></div>
        <div className="p-7 pb-5 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-2xl font-semibold mb-1">รายงานวิเคราะห์ลูกค้า</p>
              {report && <p className="text-xs text-gray-500 mb-2">{report.range.start_date} - {report.range.end_date}</p>}
            </div>
            {showWeeklyToggle && (
              <div className="flex items-center gap-2 mb-4 md:mb-0 text-sm">
                <span className={!weeklyMode? 'font-semibold':''}>รายวัน</span>
                <input aria-label="toggle weekly" type="checkbox" checked={weeklyMode} onChange={()=> setWeeklyMode(v=> !v)} />
                <span className={weeklyMode? 'font-semibold':''}>รายสัปดาห์</span>
              </div>
            )}
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {/* Summary */}
          <SummaryStats summary={customerSummary} loading={loading} />

          {/* Chart */}
          <p className="text-center font-semibold mb-4">จำนวนคำสั่งซื้อ ({weeklyMode? 'รายสัปดาห์':'รายวัน'})</p>
          <div ref={chartRef} className="w-full h-[300px] sm:h-[400px] md:h-[500px] max-w-6xl mx-auto">
            {loading && <Skeleton className="w-full h-full" />}
            {!loading && chartData.length === 0 && <div className="flex items-center justify-center h-full text-gray-400">ไม่มีคำสั่งซื้อในช่วงนี้</div>}
            {!loading && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} width={20} />
                  <Tooltip formatter={(value: number | string) => [`${Number(value).toLocaleString()} รายการ`, 'คำสั่งซื้อ']} labelFormatter={(label) => `${weeklyMode? 'สัปดาห์':'วันที่'} ${label}`} />
                  <Bar dataKey="orders" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {totalOrders > 0 && <p className="text-center text-xs text-gray-500 mt-1">รวม {totalOrders.toLocaleString()} คำสั่งซื้อ</p>}

          {/* Grids */}
          <div className="grid grid-cols-1 xl:grid-cols-3 text-sm gap-4 mt-6">
            <AveragesCard averages={averages} loading={loading} />
            <PaymentTermsCard paymentTerms={paymentTerms} loading={loading} />
            <RevenueShareCard share={share} totalPurchaseValue={report? report.overview.total_purchase_value:0} loading={loading} isFocus={!!customerId} />
            <ProductsCard title="สินค้าปิดการขายสำเร็จ" products={successProducts} loading={loading} />
            <ProductsCard title="สินค้าที่ไม่ซื้อ" products={rejectedProducts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
