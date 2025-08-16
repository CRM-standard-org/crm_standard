import { useState, useMemo, useEffect } from "react";
import { useSalesForecastPipeline } from "@/hooks/useSalesForecastPipeline";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import { useCreateScenario } from "@/hooks/useSalesForecastScenario";
import { useTeam, useTeamMember } from "@/hooks/useTeam";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { useSelectProduct } from "@/hooks/useProduct";
import { useSalesForecastFunnel } from "@/hooks/useSalesForecastFunnel";
import { formatValue } from "@/utils/formatCurrency";
import { useNavigate, useLocation } from "react-router-dom";
import { useForecastFilters } from "../ForecastFilterContext";
import { Table } from "@radix-ui/themes";
import { useLocalProfileData } from '@/zustand/useProfile';

interface SimRow {
  quotation_id: string;
  quotation_number: string;
  customer_name: string;
  priority: number;
  amount: number;
  weight_percent: number;
  weighted_amount: number;
  expected_closing_date: string | null;
  issue_date: string;
  adjust_priority?: number;
  adjust_weight?: number;
  adjust_expected_closing_date?: string | null;
  quotation_status?: string;
  aging_days?: number;
  risk_flags?: string[];
  days_since_last_activity?: number | null;
}

interface PipelineAPIItem {
  quotation_id: string;
  quotation_number: string;
  customer_id: string;
  customer_name: string;
  priority: number;
  amount: number;
  weight_percent: number;
  weighted_amount: number;
  expected_closing_date: string | null;
  issue_date: string;
  products?: { product_id: string; product_name: string; quantity: number; unit_price: number }[]; // NEW
}

interface TeamOption {
  value: string;
  label: string;
}
interface MemberOption {
  value: string;
  label: string;
}
interface TagOption {
  value: string;
  label: string;
}
interface FunnelStage {
  stage: string;
  count: number;
  conversion_from_previous: number;
  conversion_from_total: number;
}

// Lightweight badge component for consistent styling
const Badge = ({
  label,
  color = "gray",
}: {
  label: string;
  color?: "red" | "amber" | "gray" | "green";
}) => {
  const map: Record<string, string> = {
    red: "bg-red-100 text-red-700 border-red-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    green: "bg-green-100 text-green-700 border-green-200",
  };
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-medium ${map[color]}`}
    >
      {label}
    </span>
  );
};

// Reusable product multi-select dropdown with checkbox list & chips
interface ProductMultiSelectProps {
  search: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (vals: string[]) => void;
}
const ProductMultiSelect = ({
  search,
  onSearchChange,
  onSearchSubmit,
  options,
  values,
  onChange,
}: ProductMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);
  const selectedLabels = values
    .map(v => options.find(o => o.value === v)?.label || v)
    .slice(0, 2)
    .join(", ");
  const extra = values.length > 2 ? ` +${values.length - 2}` : "";
  const handleToggleValue = (val: string) => {
    if (values.includes(val)) onChange(values.filter(v => v !== val));
    else onChange([...values, val]);
  };
  const clearAll = () => onChange([]);
  return (
    <div className="relative">
      <div
        className="border rounded px-2 py-1 text-xs flex items-center justify-between cursor-pointer bg-white"
        onClick={toggle}
      >
        <span className="truncate mr-2">
          {values.length ? `${selectedLabels}${extra}` : "เลือกสินค้า"}
        </span>
        <span className="text-gray-400 text-[10px]">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="absolute z-30 mt-1 w-64 bg-white border rounded shadow-lg p-2 space-y-2">
          <div className="flex gap-1">
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onSearchSubmit(); }}
              placeholder="ค้นหา..."
              className="flex-1 border rounded px-2 py-1 text-[11px] focus:outline-none focus:ring focus:border-blue-400"
            />
            <Buttons btnType="default" variant="outline" className="px-2 py-1 text-[11px]" onClick={onSearchSubmit}>ค้นหา</Buttons>
          </div>
          <div className="max-h-48 overflow-auto border rounded divide-y">
            {options.length ? options.map(o => {
              const checked = values.includes(o.value);
              return (
                <label key={o.value} className="flex items-center gap-2 px-2 py-1 text-[11px] hover:bg-blue-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3 w-3"
                    checked={checked}
                    onChange={() => handleToggleValue(o.value)}
                  />
                  <span className="truncate">{o.label}</span>
                </label>
              );
            }) : (
              <div className="px-2 py-4 text-center text-[11px] text-gray-400">ไม่พบสินค้า</div>
            )}
          </div>
          <div className="flex justify-between items-center gap-2 text-[10px]">
            <button type="button" className="text-blue-600 hover:underline" onClick={clearAll} disabled={!values.length}>ล้างทั้งหมด</button>
            <div className="flex gap-2">
              <Buttons btnType="default" variant="outline" className="px-2 py-1" onClick={() => setOpen(false)}>ปิด</Buttons>
            </div>
          </div>
          {values.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1 border-t">
              {values.map(v => {
                const label = options.find(o => o.value === v)?.label || v;
                return (
                  <span key={v} className="bg-blue-100 text-blue-700 border border-blue-200 rounded px-1 py-0.5 text-[10px] flex items-center gap-1">
                    {label}
                    <button type="button" onClick={() => handleToggleValue(v)} className="hover:text-blue-900">×</button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function PredictSell() {
  const { filters, update } = useForecastFilters();
  const {
    year,
    startDate,
    endDate,
    teamId: team,
    responsibleId: responsible,
    tagId,
  } = filters;
  const today = new Date();
  const { profile } = useLocalProfileData();
  const actor_id = profile.employee_id || undefined;
  const createScenario = useCreateScenario();
  const [valueMode, setValueMode] = useState<"THB" | "PCT">("THB");
  const spanCrossYear =
    startDate && endDate ? startDate.getFullYear() !== endDate.getFullYear() : false;
  const filterPayload = {
    ...(spanCrossYear ? {} : { year }),
    start_date: startDate ? startDate.toISOString().slice(0, 10) : undefined,
    end_date: endDate ? endDate.toISOString().slice(0, 10) : undefined,
    team_id: team || undefined,
    responsible_id: responsible || undefined,
    tag_id: tagId || undefined,
  } as const;

  // --- Product Multi-select State ---
  const [productSearch, setProductSearch] = useState("");
  const { data: productSelectData, refetch: refetchProducts } = useSelectProduct({ searchText: productSearch });
  const productOptions = (productSelectData?.responseObject?.data || []).map(
    (p: { product_id: string; product_name: string }) => ({ value: p.product_id, label: p.product_name })
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const effectiveFilterPayload = {
    ...filterPayload,
    product_ids: selectedProducts.length ? selectedProducts : undefined,
  };
  const { data, isLoading, refetch } = useSalesForecastPipeline(effectiveFilterPayload, true);
  const { data: dataTeam, refetch: refetchTeam } = useTeam({
    page: "1",
    pageSize: "100",
    searchText: "",
  });
  const { data: dataTeamMember, refetch: refetchTeamMember } = useTeamMember({
    team_id: team || "",
    page: "1",
    pageSize: "100",
    searchText: "",
  });
  const { data: tagSelectData } = useSelectTag({ searchText: "" });
  const funnel = useSalesForecastFunnel(effectiveFilterPayload, true);
  const navigate = useNavigate();
  const location = useLocation();

  const teamOptions: TeamOption[] = (dataTeam?.responseObject?.data || []).map(
    (t: { team_id: string; name: string }) => ({
      value: t.team_id,
      label: t.name,
    })
  );
  const memberOptions: MemberOption[] = (
    dataTeamMember?.responseObject?.data?.member || []
  ).map(
    (m: { employee_id: string; first_name: string; last_name?: string }) => ({
      value: m.employee_id,
      label: `${m.first_name} ${m.last_name || ""}`.trim(),
    })
  );
  const tagOptions: TagOption[] = (
    tagSelectData?.responseObject?.data || []
  ).map((t: { tag_id: string; tag_name: string }) => ({
    value: t.tag_id,
    label: t.tag_name,
  }));

  const original: SimRow[] = (
    (data?.responseObject as PipelineAPIItem[]) || []
  ).map((q) => ({
    ...q,
    adjust_priority: q.priority,
    adjust_weight: q.weight_percent,
    adjust_expected_closing_date: q.expected_closing_date,
    aging_days: Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(q.issue_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    ),
    risk_flags: [],
  }));

  // Editable state (what user changes) previously table used original -> no visual update
  const [rows, setRows] = useState<SimRow[]>(original);

  // When backend data refetched, reset editable rows (but keep user edits only within same fetch cycle)
  useEffect(() => {
    // Reset editable rows when new pipeline data arrives.
    setRows(original);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (
    id: string,
    field: keyof SimRow,
    value: string | number | null
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.quotation_id === id ? { ...r, [field]: value } : r))
    );
  };

  // simple risk: aging > 60 days and weight < 30% (recomputed from current rows)
  const RISK_AGING_THRESHOLD = 60;
  const rowsWithRisk = useMemo(() =>
    rows.map((r) => ({
      ...r,
      risk_flags: [
        ...(r.aging_days && r.aging_days > RISK_AGING_THRESHOLD ? ["AGING"] : []),
        ...(r.adjust_weight !== undefined && r.adjust_weight < 30
          ? ["LOW_WEIGHT"]
          : []),
      ],
    })),
    [rows]
  );

  const recomputed = useMemo(() => {
    return rows.map((r) => {
      const w = (r.adjust_weight ?? r.weight_percent) / 100;
      const weighted_amount = r.amount * w;
      return { ...r, weighted_amount };
    });
  }, [rows]);

  const totalOriginal = original.reduce((s, r) => s + r.weighted_amount, 0);
  const totalAdjusted = recomputed.reduce((s, r) => s + r.weighted_amount, 0);
  const diffWeighted = totalAdjusted - totalOriginal;
  const diffWeightedPct = totalOriginal
    ? (diffWeighted / totalOriginal) * 100
    : 0;
  const totalAmountOriginal = original.reduce((s, r) => s + r.amount, 0);
  const showMoney = valueMode === "THB";
  const fmtMoney = (v: number) => formatValue(v / 100, "THB");
  const originalDisplay = showMoney ? fmtMoney(totalOriginal) : "100%";
  const adjustedDisplay = showMoney
    ? fmtMoney(totalAdjusted)
    : totalOriginal
    ? ((totalAdjusted / totalOriginal) * 100).toFixed(1) + "%"
    : "0%";
  const diffDisplay = showMoney
    ? fmtMoney(diffWeighted)
    : totalOriginal
    ? diffWeightedPct.toFixed(1) + "%"
    : "0%";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const y = params.get("year");
    const month = params.get("month");
    const start = params.get("start_date");
    const end = params.get("end_date");
    const t = params.get("team_id");
    const r = params.get("responsible_id");
    const tag = params.get("tag_id");
    if (y) {
      const yi = Number(y);
      if (!isNaN(yi)) {
        update({ year: yi });
      }
    }
    if (month && y && !start && !end) {
      // single month focus
      const m = Number(month);
      const yi = Number(y);
      if (!isNaN(m) && m >= 1 && m <= 12 && !isNaN(yi)) {
        update({
          startDate: new Date(yi, m - 1, 1),
          endDate: new Date(yi, m, 0),
        });
      }
    } else {
      if (start) {
        update({ startDate: new Date(start) });
      }
      if (end) {
        update({ endDate: new Date(end) });
      }
    }
    if (t) update({ teamId: t });
    if (r) update({ responsibleId: r });
    if (tag) update({ tagId: tag });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveScenario = () => {
    if (!actor_id) return; // optionally show a notification if needed
    const adjustments = recomputed
      .filter(
        (r) =>
          r.adjust_priority !== r.priority ||
          r.adjust_weight !== r.weight_percent ||
          r.adjust_expected_closing_date !== r.expected_closing_date
      )
      .map((r) => ({
        quotation_id: r.quotation_id,
        priority: r.adjust_priority,
        weight_percent: r.adjust_weight,
        expected_closing_date: r.adjust_expected_closing_date,
      }));
    interface CreateScenarioResp {
      responseObject?: { scenario?: { sales_forecast_scenario_id?: string } };
    }
    createScenario.mutate(
      {
        name: `Scenario ${new Date().toLocaleString()}`,
  filter: { ...effectiveFilterPayload, year },
        adjustments,
        actor_id,
      },
      {
        onSuccess: (resp: CreateScenarioResp) => {
          const id = resp?.responseObject?.scenario?.sales_forecast_scenario_id;
          if (id) navigate(`/forcast-sale?scenario_id=${id}`);
        },
      }
    );
  };

  // const handleApplyScenario = (id: string) => {
  //   applyScenario.mutate(id, {
  //     onSuccess: () => {
  //       refetch();
  //       navigate(`/forcast-sale?scenario_id=${id}`);
  //     },
  //   });
  // };

  const goToForecastWithFilters = () => {
    const params = new URLSearchParams();
    if (!spanCrossYear) params.set("year", String(year));
    if (startDate)
      params.set("start_date", startDate.toISOString().slice(0, 10));
    if (endDate) params.set("end_date", endDate.toISOString().slice(0, 10));
    if (team) params.set("team_id", team);
    if (responsible) params.set("responsible_id", responsible);
  if (tagId) params.set("tag_id", tagId);
  if (selectedProducts.length) params.set("product_ids", selectedProducts.join(","));
    navigate(`/forcast-sale?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            คาดการณ์ยอดขาย (Predict Sell)
          </h1>
          <p className="text-sm text-gray-500">
            ปรับน้ำหนัก / ความน่าจะเป็น ของใบเสนอราคาเพื่อสร้าง Scenario
            และประเมินผลกระทบต่อ Forecast
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Buttons
            btnType="primary"
            variant="outline"
            onClick={handleSaveScenario}
            disabled={!actor_id || createScenario.isPending}
          >
            บันทึก Scenario
          </Buttons>
          <Buttons
            btnType="default"
            variant="outline"
            onClick={goToForecastWithFilters}
          >
            ดูสรุป (Forecast)
          </Buttons>
          {/* {(
            scenariosData?.responseObject as ExistingScenario[] | undefined
          )?.map((s) => (
            <Buttons
              key={s.sales_forecast_scenario_id}
              btnType="default"
              variant="outline"
              onClick={() => handleApplyScenario(s.sales_forecast_scenario_id)}
              disabled={applyScenario.isPending}
            >
              ใช้ {s.name}
            </Buttons>
          ))} */}
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white/80 backdrop-blur border rounded-lg shadow-sm p-3 md:p-4 space-y-4">
        {/* Filter Grid (only filters) */}
  <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-7">
          {/* Year */}
          <div className="flex flex-col">
            <label
              htmlFor="year-select"
              className="text-xs font-medium text-gray-600 mb-1"
            >
              ปี
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => {
                const y = Number(e.target.value);
                update({
                  year: y,
                  startDate: new Date(y, 0, 1),
                  endDate: new Date(y, 11, 31),
                });
              }}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
            >
              {Array.from(
                { length: 5 },
                (_, i) => today.getFullYear() - 2 + i
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {/* Start Date */}
          <div className="flex flex-col">
            <label
              htmlFor="sim-start"
              className="text-xs font-medium text-gray-600 mb-1"
            >
              วันที่เริ่ม
            </label>
            <DatePickerComponent
              id="sim-start"
              selectedDate={startDate}
              onChange={(d) => update({ startDate: d })}
              classNameLabel=""
              classNameInput="w-full text-sm"
            />
          </div>
          {/* End Date */}
          <div className="flex flex-col">
            <label
              htmlFor="sim-end"
              className="text-xs font-medium text-gray-600 mb-1"
            >
              วันที่สิ้นสุด
            </label>
            <DatePickerComponent
              id="sim-end"
              selectedDate={endDate}
              onChange={(d) => update({ endDate: d })}
              classNameLabel=""
              classNameInput="w-full text-sm"
            />
          </div>
          {/* Team */}
          <div className="flex flex-col">
            <label
              htmlFor="team-select"
              className="text-xs font-medium text-gray-600 mb-1"
            >
              ทีม
            </label>
            <select
              id="team-select"
              value={team || ""}
              onChange={(e) => {
                update({ teamId: e.target.value || null });
                refetchTeam();
                setTimeout(() => refetchTeamMember(), 0);
              }}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">ทั้งหมด</option>
              {teamOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* Responsible */}
          <div className="flex flex-col">
            <label
              htmlFor="responsible-select"
              className="text-xs font-medium text-gray-600 mb-1"
            >
              พนักงานขาย
            </label>
            <select
              id="responsible-select"
              value={responsible || ""}
              onChange={(e) =>
                update({ responsibleId: e.target.value || null })
              }
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">ทั้งหมด</option>
              {memberOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* Tag */}
          <div className="flex flex-col">
            <label
              htmlFor="tag-select"
              className="text-xs font-medium text-gray-600 mb-1"
            >
              Tag
            </label>
            <select
              id="tag-select"
              value={tagId || ""}
              onChange={(e) => update({ tagId: e.target.value || null })}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">ทั้งหมด</option>
              {tagOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* Products (custom multi-select) */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">สินค้า</label>
            <ProductMultiSelect
              search={productSearch}
              onSearchChange={setProductSearch}
              onSearchSubmit={refetchProducts}
              options={productOptions}
              values={selectedProducts}
              onChange={setSelectedProducts}
            />
          </div>
        </div>
        {/* Actions + Summary Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap items-end gap-2 flex-1">
            <Buttons
              btnType="primary"
              variant="outline"
              onClick={() => refetch()}
              className="px-4"
            >
              โหลด
            </Buttons>
            <Buttons
              btnType="default"
              variant="outline"
              onClick={() => setRows(original)}
              className="px-4"
            >
              รีเซ็ต
            </Buttons>
            <div className="flex items-center gap-1 border rounded px-2 py-1 text-[11px] bg-gray-50">
              <label htmlFor="value-mode" className="text-gray-500">
                โหมด
              </label>
              <select
                id="value-mode"
                value={valueMode}
                onChange={(e) => setValueMode(e.target.value as "THB" | "PCT")}
                className="bg-transparent focus:outline-none"
              >
                <option value="THB">THB</option>
                <option value="PCT">%</option>
              </select>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border rounded-md p-3 text-xs shadow-sm min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">
                Weighted Summary
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">เดิม</span>
                  <span className="font-medium">{originalDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ใหม่</span>
                  <span className="font-medium">{adjustedDisplay}</span>
                </div>
                <div
                  className={`flex justify-between ${
                    diffWeighted >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-gray-500">ผลต่าง</span>
                  <span className="font-semibold">{diffDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Risk Legend */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-gray-600">
          <span className="font-medium text-gray-700">Legend:</span>
          <Badge label="AGING>60d" color="red" />
          <Badge label="LOW_WEIGHT<30%" color="amber" />
          <span className="text-gray-400">แถวไฮไลท์ = มีความเสี่ยง</span>
        </div>
      </div>

      {/* Pipeline Table */}
      {isLoading ? (
        <div className="bg-white border rounded-md p-6 text-center text-sm text-gray-500 shadow-sm">
          Loading...
        </div>
      ) : (
        <div className="border rounded-lg p-5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-2 gap-2">
              <div>
                <p className="text-xl font-semibold mb-1">ใบเสนอราคาใน Pipeline (มูลค่าถ่วงน้ำหนัก)</p>
                <p className="text-[11px] text-gray-500 leading-snug">
                  ปรับ Priority / Weight% / วันที่ปิดคาดการณ์ เพื่อจำลองผลกระทบต่อ Forecast
                </p>
              </div>
            </div>
            <Table.Root className="w-full table-fixed bg-white rounded-md text-[11px]">
              <Table.Header>
                <Table.Row className="text-center bg-main text-white whitespace-nowrap text-xs">
                  <Table.ColumnHeaderCell className="p-2 border rounded-tl-md w-24">
                    เลขที่
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border min-w-[140px]">
                    ลูกค้า
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-24">
                    สถานะ
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-20">
                    Priority
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-24">
                    ปรับ Priority
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-16">
                    Weight%
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-24">
                    ปรับ Weight%
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-28">
                    Amount ({showMoney ? "THB" : "%"})
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-32">
                    Weighted ({showMoney ? "THB" : "%"})
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-20">
                    Aging(d)
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-24">
                    Last Act (d)
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-32">
                    Risk
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-28">
                    Exp Close
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-2 border w-32 rounded-tr-md">
                    ปรับ Exp Close
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rowsWithRisk.map((r) => {
                  const agingRisk =
                    r.aging_days && r.aging_days > RISK_AGING_THRESHOLD;
                  const lowWeightRisk =
                    r.adjust_weight !== undefined && r.adjust_weight < 30;
                  const rowRisk = agingRisk || lowWeightRisk;
                  const amountDisplay = showMoney
                    ? formatValue(r.amount, "THB")
                    : totalAmountOriginal
                    ? ((r.amount / totalAmountOriginal) * 100).toFixed(1) + "%"
                    : "0%";
                  const weightedDisplay = showMoney
                    ? formatValue(r.weighted_amount, "THB")
                    : totalAdjusted
                    ? ((r.weighted_amount / totalAdjusted) * 100).toFixed(1) +
                      "%"
                    : "0%";
                  return (
                    <Table.Row
                      key={r.quotation_id}
                      className={`${
                        rowRisk ? "bg-amber-50" : "odd:bg-white even:bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <Table.Cell className="p-2 border whitespace-nowrap font-medium text-gray-700">
                        {r.quotation_number}
                      </Table.Cell>
                      <Table.Cell className="p-2 border whitespace-nowrap">
                        {r.customer_name}
                      </Table.Cell>
                      <Table.Cell className="p-2 border whitespace-nowrap">
                        {r.quotation_status || "-"}
                      </Table.Cell>
                      <Table.Cell className="p-2 border text-center">
                        ★{r.priority}
                      </Table.Cell>
                      <Table.Cell className="p-2 border">
                        <select
                          value={r.adjust_priority}
                          onChange={(e) =>
                            handleChange(
                              r.quotation_id,
                              "adjust_priority",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded px-1 py-1 text-xs focus:outline-none focus:ring"
                        >
                          {[5, 4, 3, 2, 1].map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </Table.Cell>
                      <Table.Cell className="p-2 border text-center tabular-nums">
                        {r.weight_percent}
                      </Table.Cell>
                      <Table.Cell className="p-2 border">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.adjust_weight}
                          onChange={(e) =>
                            handleChange(
                              r.quotation_id,
                              "adjust_weight",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded px-1 py-1 w-16 text-end text-xs focus:outline-none focus:ring"
                        />
                      </Table.Cell>
                      <Table.Cell className="p-2 border text-right tabular-nums">
                        {amountDisplay}
                      </Table.Cell>
                      <Table.Cell className="p-2 border text-right tabular-nums">
                        {weightedDisplay}
                      </Table.Cell>
                      <Table.Cell
                        className={`p-2 border text-center tabular-nums ${
                          agingRisk ? "text-red-600 font-semibold" : ""
                        }`}
                      >
                        {r.aging_days}
                      </Table.Cell>
                      <Table.Cell className="p-2 border text-center tabular-nums">
                        {r.days_since_last_activity ?? "-"}
                      </Table.Cell>
                      <Table.Cell className="p-2 border text-center space-x-1">
                        {r.risk_flags?.length ? (
                          r.risk_flags.map((f) => (
                            <Badge
                              key={f}
                              label={f}
                              color={
                                f === "AGING"
                                  ? "red"
                                  : f === "LOW_WEIGHT"
                                  ? "amber"
                                  : "gray"
                              }
                            />
                          ))
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className="p-2 border whitespace-nowrap">
                        {r.expected_closing_date || "-"}
                      </Table.Cell>
                      <Table.Cell className="p-2 border">
                        <input
                          type="date"
                          value={r.adjust_expected_closing_date || ""}
                          onChange={(e) =>
                            handleChange(
                              r.quotation_id,
                              "adjust_expected_closing_date",
                              e.target.value || null
                            )
                          }
                          className="border rounded px-1 py-1 text-xs focus:outline-none focus:ring"
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </div>
        </div>
      )}

      {/* Lower Panels */}
      <div className="grid md:grid-cols-1 gap-4">
        {/* Funnel */}
        <div className="border rounded-lg p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xl font-semibold mb-1">สรุปขั้นตอนการขาย (Funnel)</p>
            <div className="text-xs text-gray-500">
              รวม: {funnel.data?.responseObject?.total || 0}
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table.Root className="w-full table-fixed bg-white rounded-md text-[11px] md:text-xs">
              <Table.Header>
                <Table.Row className="text-center bg-main text-white whitespace-nowrap">
                  <Table.ColumnHeaderCell className="h-10 px-2 py-2 text-[11px] rounded-tl-md">
                    Stage
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="h-10 px-2 py-2 text-[11px]">
                    Count
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="h-10 px-2 py-2 text-[11px]">
                    Conv % Prev
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="h-10 px-2 py-2 text-[11px] rounded-tr-md">
                    Conv % Total
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {funnel.data?.responseObject?.stages?.length ? (
                  funnel.data.responseObject.stages.map((s: FunnelStage) => (
                    <Table.Row key={s.stage} className="hover:bg-blue-50">
                      <Table.Cell className="border border-gray-200 px-2 py-1 text-left">
                        {s.stage}
                      </Table.Cell>
                      <Table.Cell className="border border-gray-200 px-2 py-1 text-right tabular-nums">
                        {s.count}
                      </Table.Cell>
                      <Table.Cell className="border border-gray-200 px-2 py-1 text-right tabular-nums">
                        {s.conversion_from_previous.toFixed(1)}%
                      </Table.Cell>
                      <Table.Cell className="border border-gray-200 px-2 py-1 text-right tabular-nums">
                        {s.conversion_from_total.toFixed(1)}%
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell
                      colSpan={4}
                      className="h-32 text-center text-gray-500 border border-gray-200"
                    >
                      ไม่พบข้อมูล
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
