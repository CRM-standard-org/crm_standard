import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { FiPrinter } from "react-icons/fi";
import { useSalesForecastSummary } from "@/hooks/useDashboard";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import { OptionType } from "@/components/customs/select/select.main.component";
import { Table } from "@radix-ui/themes";
import { useTeam, useTeamMember } from "@/hooks/useTeam";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { SummaryTable } from "@/components/customs/display/sumTable.component";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/apis/main.api";
import { SALES_FORECAST } from "@/apis/endpoint.api";
import { useNavigate, useLocation } from "react-router-dom";
import { useListScenarios } from "@/hooks/useSalesForecastScenario";
import { useSalesForecastRiskAggregate } from "@/hooks/useSalesForecastRiskAggregate";
import type { TooltipProps } from "recharts";
import { useForecastFilters } from "../ForecastFilterContext";
import { useSelectTag } from "@/hooks/useCustomerTag";
import { useLocalProfileData } from "@/zustand/useProfile";
import { useToast } from "@/components/customs/alert/ToastContext";

// -------- Helper components & utilities (reduce complexity in main component) --------

// (number formatting helper removed; use inline toLocaleString where needed)

function getKpiClass(key: string, gapToGoal?: number | null) {
  if (key === "gap_to_goal" && gapToGoal !== null && gapToGoal !== undefined && gapToGoal <= 0) {
    return "bg-green-100 text-green-700";
  }
  if (key === "forecast_year_end") return "bg-amber-100 text-amber-800";
  return "bg-blue-50 text-slate-800";
}

type KPIBoxProps = {
  item: {
    key: string;
    label: string;
    value: number;
    format: boolean;
    suffix?: string;
    scenarioValue?: number;
    diff?: number;
    beneficialPositive?: number;
  };
  hasScenario: boolean;
  gapToGoal?: number | null;
};

function KPIBox({ item: k, hasScenario, gapToGoal }: KPIBoxProps) {
  const mainVal = k.format ? Math.round(k.value).toLocaleString() : k.value;

  let scenarioValDisplay: string | null = null;
  if (hasScenario && k.scenarioValue !== undefined) {
    if (k.suffix === "%") scenarioValDisplay = `${k.scenarioValue.toFixed(1)}%`;
    else scenarioValDisplay = k.format ? Math.round(k.scenarioValue).toLocaleString() : String(k.scenarioValue);
  }

  let diffFormatted = "";
  if (k.diff !== undefined) {
    const sign = k.diff > 0 ? "+" : "";
    if (k.suffix === "%") diffFormatted = `${sign}${k.diff.toFixed(1)}%`;
    else diffFormatted = `${sign}${k.format ? Math.round(k.diff).toLocaleString() : k.diff.toLocaleString()}`;
  }

  let diffClass = "";
  if (k.beneficialPositive) {
    if (k.beneficialPositive > 0) diffClass = "text-green-600";
    else if (k.beneficialPositive < 0) diffClass = "text-red-600";
  }

  return (
    <div className={`p-4 rounded shadow text-sm ${getKpiClass(k.key, gapToGoal)}`}>
      <p className="font-semibold mb-1">{k.label}</p>
      <p className="text-lg font-bold">{mainVal}{k.suffix || ""}</p>
      {hasScenario && scenarioValDisplay && (
        <div className="text-[11px] mt-1">
          <span className="font-semibold">Scenario:</span> {scenarioValDisplay}
          {k.diff !== 0 && k.diff !== undefined && (
            <span className={`ml-1 font-semibold ${diffClass}`}>{diffFormatted}</span>
          )}
        </div>
      )}
    </div>
  );
}

function ForecastTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { month: string; target: number; actual: number; forecast: number };
  const gap = d.target - d.actual;
  const achieve = d.target ? (d.actual / d.target) * 100 : 0;
  return (
    <div className="bg-white border rounded p-2 text-xs shadow">
      <div>{d.month}</div>
      <div>Target: {d.target.toLocaleString()}</div>
      <div>Actual: {d.actual.toLocaleString()}</div>
      <div>Forecast: {d.forecast.toLocaleString()}</div>
      <div>Gap (Actual vs Target): {gap.toLocaleString()}</div>
      <div>Achievement %: {achieve.toFixed(1)}%</div>
    </div>
  );
}

interface WeightRow {
  forecast_weight_config_id?: string;
  priority: number;
  weight_percent: number;
}
interface GoalRow {
  sales_goal_id?: string;
  year: number;
  month: number | null;
  goal_amount: number;
  team_id?: string | null;
  employee_id?: string | null;
}
interface MonthlyValue {
  month: number;
  sales?: number;
  forecast?: number;
}
interface GoalValue {
  month: number;
  goal: number;
}
interface PriorityBreak {
  priority: number;
  count: number;
  amount: number;
  weight_percent: number;
}
interface TopCustomer {
  customer_id: string;
  company_name: string;
  probability: number;
}
interface ForecastMonthly {
  month: number;
  forecast: number;
}
interface StatusBreak {
  status: string;
  count: number;
  amount: number;
  weighted_amount: number;
}

export default function ForcastSale() {
  // Filters via context
  const { filters, update } = useForecastFilters();
  const initMonth = filters.startDate;
  const endMonth = filters.endDate;
  const team = filters.teamId;
  const responsible = filters.responsibleId;
  const year = filters.year;
  const tagId = filters.tagId;
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );
  const { data: tagSelectData } = useSelectTag({ searchText: "" });
  const tagOptions: { value: string; label: string }[] = (
    tagSelectData?.responseObject?.data || []
  ).map((t: { tag_id: string; tag_name: string }) => ({
    value: t.tag_id,
    label: t.tag_name,
  }));

  // Local select options state (still needed for async dropdowns)
  const [teamOptions, setTeamOptions] = useState<OptionType[]>([]);
  const [responsibleOptions, setResponsibleOptions] = useState<OptionType[]>(
    []
  );
  // Scenario state must be declared before hooks that reference it
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null
  );

  // Modals / forms
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [weights, setWeights] = useState<WeightRow[]>([]);
  const [loadingWeights, setLoadingWeights] = useState(false);
  const [annualGoalInput, setAnnualGoalInput] = useState<number | "">("");
  const [monthlyGoalInputs, setMonthlyGoalInputs] = useState<
    Record<number, number | "">
  >({});
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);

  // Small helpers to reduce nested updates inside JSX handlers
  const updateWeightPercent = (priority: number, value: number) => {
    setWeights((ws) => ws.map((r) => (r.priority === priority ? { ...r, weight_percent: value } : r)));
  };
  const updateMonthlyGoal = (m: number, value: string) => {
    setMonthlyGoalInputs((prev) => ({ ...prev, [m]: value === "" ? "" : Number(value) }));
  };

  // Query client & actor
  const qc = useQueryClient();
  const actor_id = useLocalProfileData((s) => s.profile.employee_id) || undefined;
  const { showToast } = useToast();

  // Refs for PDF capture
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);

  // Data hooks
  const { data: dataTeam, refetch: refetchTeam } = useTeam({
    page: "1",
    pageSize: "100",
    searchText: "",
  });
  const { data: dataTeamMember, refetch: refetchTeamMember } = useTeamMember({
    team_id: team ?? "",
    page: "1",
    pageSize: "100",
    searchText: "",
  });
  useEffect(() => {
    refetchTeamMember();
  }, [team, refetchTeamMember]);

  const fetchDataTeamDropdown = async () => {
    const teamList: { team_id: string; name: string }[] =
      dataTeam?.responseObject?.data ?? [];
    const responseObject = teamList.map((t) => ({
      id: t.team_id,
      name: t.name,
    }));
    setTeamOptions(responseObject.map((r) => ({ value: r.id, label: r.name })));
    return { responseObject };
  };
  const handleTeamSearch = () => {
    refetchTeam();
  };
  const fetchDataMemberInteam = async () => {
    const member: {
      employee_id: string;
      first_name: string;
      last_name?: string;
    }[] = dataTeamMember?.responseObject?.data?.member ?? [];
    const responseObject = member.map((m) => ({
      id: m.employee_id,
      name: `${m.first_name} ${m.last_name || ""}`.trim(),
    }));
    setResponsibleOptions(
      responseObject.map((r) => ({ value: r.id, label: r.name }))
    );
    return { responseObject };
  };

  // Cross-year logic: omit year if range spans multiple calendar years
  const crossYear = !!(
    initMonth &&
    endMonth &&
    initMonth.getFullYear() !== endMonth.getFullYear()
  );
  const [urlProductIds, setUrlProductIds] = useState<string[] | undefined>(undefined);
  const forecastPayload = {
    ...(crossYear ? {} : { year }),
    start_date: initMonth ? initMonth.toISOString().slice(0, 10) : undefined,
    end_date: endMonth ? endMonth.toISOString().slice(0, 10) : undefined,
    team_id: team || undefined,
    responsible_id: responsible || undefined,
    tag_id: tagId || undefined,
    product_ids: urlProductIds,
  };
  const {
    data: forecastData,
    isLoading: loadingForecast,
    refetch: refetchForecast,
  } = useSalesForecastSummary(forecastPayload, true);
  const { data: scenarioSummaryData, isLoading: loadingScenarioSummary } =
    useSalesForecastSummary(
      selectedScenarioId ? { scenario_id: selectedScenarioId } : {},
      !!selectedScenarioId
    );
  const scenarioSummary = scenarioSummaryData?.responseObject?.summary;
  const { data: scenariosData } = useListScenarios();
  const scenarios: { sales_forecast_scenario_id: string; name: string }[] =
    scenariosData?.responseObject || [];

  const riskAggregateQuery = useSalesForecastRiskAggregate(
    forecastPayload,
    true
  );
  const riskAgg = riskAggregateQuery.data?.responseObject;
  const riskTotal = riskAgg?.total || 0;

  const summary = forecastData?.responseObject;
  const derivedMonths = [
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

  // KPI helper values (baseline)
  interface KPIItem {
    key: string;
    label: string;
    value: number;
    format: boolean;
    suffix?: string;
    scenarioValue?: number;
    diff?: number;
    beneficialPositive?: number;
  }
  const baselineKpis: KPIItem[] = summary
    ? [
        {
          key: "annual_goal",
          label: "เป้าหมายทั้งปี",
          value: summary.goals.annual_goal || 0,
          format: true,
        },
        {
          key: "actual_to_date",
          label: "ยอดขายสะสมถึงปัจจุบัน",
          value: summary.actual_to_date || 0,
          format: true,
        },
        {
          key: "forecast_year_end",
          label: "คาดการณ์เมื่อสิ้นปี",
          value: summary.forecast_year_end || 0,
          format: true,
        },
        {
          key: "forecast_achievement_percent",
          label: "อัตราบรรลุเป้าหมายคาดการณ์ (%)",
          value: summary.forecast_achievement_percent
            ? Number(summary.forecast_achievement_percent.toFixed(1))
            : 0,
          format: false,
          suffix: "%",
        },
        {
          key: "gap_to_goal",
          label: "ช่องว่างถึงเป้าหมาย",
          value: summary.gap_to_goal ?? 0,
          format: true,
        },
      ]
    : [];

  // Merge scenario values & compute deltas
  const kpis: KPIItem[] = baselineKpis.map((k) => {
    if (!scenarioSummary) return k;
    let scenarioValue: number | undefined;
    switch (k.key) {
      case "annual_goal":
        scenarioValue = scenarioSummary.goals?.annual_goal || 0;
        break;
      case "actual_to_date":
        scenarioValue = scenarioSummary.actual_to_date || 0;
        break;
      case "forecast_year_end":
        scenarioValue = scenarioSummary.forecast_year_end || 0;
        break;
      case "forecast_achievement_percent":
        scenarioValue = scenarioSummary.forecast_achievement_percent
          ? Number(scenarioSummary.forecast_achievement_percent.toFixed(1))
          : 0;
        break;
      case "gap_to_goal":
        scenarioValue = scenarioSummary.gap_to_goal ?? 0;
        break;
    }
    if (scenarioValue === undefined) return k;
    const diff = scenarioValue - k.value;
    const beneficialPositive = k.key === "gap_to_goal" ? -diff : diff;
    return { ...k, scenarioValue, diff, beneficialPositive };
  });

  // chart navigation handler
  const handleChartClick = (state: { activeLabel?: string }) => {
    const label = state?.activeLabel;
    if (label) {
      const m = derivedMonths.indexOf(label) + 1;
      if (m > 0) navigate(`/dashboard/predict-sell?month=${m}&year=${year}`);
    }
  };

  // Replace chartData mapping with typed interfaces
  interface CumPoint {
    month: number;
    forecast: number;
  }
  interface CumActual {
    month: number;
    sales: number;
  }
  interface MonthlyGoal {
    month: number;
    goal: number;
  }
  type ChartRow = {
    month: string;
    forecast: number;
    actual: number;
    target: number;
  };
  const chartData: ChartRow[] = summary
    ? summary.forecast.cumulative.map((c: CumPoint) => {
        const actualRow = summary.actual.cumulative.find(
          (a: CumActual) => a.month === c.month
        );
        return {
          month: derivedMonths[c.month - 1],
          forecast: c.forecast,
          actual: actualRow?.sales || 0,
          target: 0,
        };
      })
    : [];
  if (summary && chartData.length) {
    let cumTarget = 0;
    for (let i = 0; i < 12; i++) {
      const monthIdx = i + 1;
      const mg =
        summary.goals.monthly_goals.find(
          (g: MonthlyGoal) => g.month === monthIdx
        )?.goal ?? (summary.goals.annual_goal || 0) / 12;
      cumTarget += mg;
      if (chartData[i]) chartData[i].target = cumTarget;
    }
  }

  // Sales table data
  const monthlyGoalDefaults = (summary?.goals.annual_goal || 0) / 12;
  const monthlyGoalMap: Record<number, number> = {};
  summary?.goals.monthly_goals.forEach((g: GoalValue) => {
    monthlyGoalMap[g.month] = g.goal;
  });
  const cumulativeGoalValues: number[] = [];
  let goalCum = 0;
  for (let m = 1; m <= 12; m++) {
    const g = monthlyGoalMap[m] ?? monthlyGoalDefaults;
    goalCum += g;
    cumulativeGoalValues.push(Math.round(goalCum));
  }
  const salesDataTable = summary
    ? [
        { label: "เป้าหมายสะสม", values: cumulativeGoalValues },
        {
          label: "ยอดคาดการณ์สะสม",
          values: summary.forecast.cumulative.map((r: MonthlyValue) =>
            Math.round(r.forecast || 0)
          ),
        },
        {
          label: "เป้าหมายรายเดือน",
          values: Array.from({ length: 12 }, (_, i) =>
            Math.round(monthlyGoalMap[i + 1] ?? monthlyGoalDefaults)
          ),
        },
        {
          label: "คาดการณ์รายเดือน",
          values: summary.forecast.monthly.map((r: MonthlyValue) =>
            Math.round(r.forecast || 0)
          ),
        },
        {
          label: "ช่องว่างรายเดือน",
          values: summary.forecast.monthly.map(
            (r: ForecastMonthly, idx: number) => {
              const target = monthlyGoalMap[idx + 1] ?? monthlyGoalDefaults;
              const prevCum =
                idx > 0 ? summary.forecast.cumulative[idx - 1].forecast : 0;
              const monthForecast = r.forecast - prevCum;
              return Math.round(target - monthForecast);
            }
          ),
        },
        {
          label: "ยอดจริงรายเดือน",
          values: summary.actual.monthly.map((r: MonthlyValue) =>
            Math.round(r.sales || 0)
          ),
        },
      ]
    : [];
  const summaryTotal = summary
    ? [
        {
          id: "goal-total",
          name: "เป้าหมายยอดขายสะสม\nรวม",
          value: summary.goals.annual_goal || 0,
        },
        {
          id: "forecast-total",
          name: "ยอดขายสะสมคาดการณ์\nรวม",
          value: summary.forecast.total,
        },
      ]
    : [];
  const summaryMonthlyAverage = summary
    ? [
        {
          id: "goal-avg",
          name: "เป้าหมายยอดขายรายเดือน\nโดยเฉลี่ย",
          value: summary.goals.annual_goal
            ? Math.round(summary.goals.annual_goal / 12)
            : 0,
        },
        {
          id: "forecast-avg",
          name: "ยอดขายรายเดือนคาดการณ์\nโดยเฉลี่ย",
          value:
            summary.forecast.monthly.reduce(
              (s: number, r: MonthlyValue) => s + (r.forecast || 0),
              0
            ) / 12,
        },
        {
          id: "actual-avg",
          name: "ยอดขายจริงรายเดือน\nโดยเฉลี่ย",
          value:
            summary.actual.monthly.reduce(
              (s: number, r: MonthlyValue) => s + (r.sales || 0),
              0
            ) / 12,
        },
      ]
    : [];

  // Derived helpers for total vs forecast chart (chartRef2)
  const totalGoal = summary?.goals.annual_goal || 0;
  const totalForecast = summary?.forecast.total || 0;
  const hasTotalData = totalGoal > 0 || totalForecast > 0;
  const achievementPct = totalGoal > 0 ? (totalForecast / totalGoal) * 100 : 0;
  const gapToGoal = totalGoal - totalForecast;

  // Derived helpers for average chart (chartRef3)
  const avgGoal = summaryMonthlyAverage.find(r => r.id === 'goal-avg')?.value || 0;
  const avgForecast = summaryMonthlyAverage.find(r => r.id === 'forecast-avg')?.value || 0;
  const avgActual = summaryMonthlyAverage.find(r => r.id === 'actual-avg')?.value || 0;
  const allAvgZero = avgGoal === 0 && avgForecast === 0 && avgActual === 0;

  const HeaderPredict = [
    { header: "ระดับความสำคัญ", key: "priority" },
    { header: "จำนวน", key: "amount" },
    { header: "%", key: "percent" },
    { header: "มูลค่ารวม", key: "value", align: "right" },
  ];
  const predictValues = summary
    ? summary.priority_breakdown.map((p: PriorityBreak) => ({
        id: `p-${p.priority}`,
        priority: `★${p.priority}`,
        amount: p.count,
        percent: p.weight_percent,
        value: p.amount,
      }))
    : [];
  const HeaderCustomer = [
    { header: "อันดับที่", key: "rank" },
    { header: "ลูกค้า", key: "customer" },
    { header: "โอกาส%", key: "percent" },
  ];
  const customers = summary
    ? summary.top_customers.map((c: TopCustomer, i: number) => ({
        id: c.customer_id,
        rank: i + 1,
        customer: c.company_name,
        percent: c.probability,
      }))
    : [];
  // Status breakdown -> adapt to SummaryTable format
  const HeaderStatus = [
    { header: "สถานะ", key: "status" },
    { header: "จำนวน", key: "count", align: "right" },
    { header: "มูลค่า", key: "amount", align: "right" },
  { header: "มูลค่าถ่วงน้ำหนัก", key: "weighted_amount", align: "right" },
  ];
  const statusValues = useMemo(() => {
    if (!summary) return [] as Array<{ id: string; status: string; count: number; amount: number; weighted_amount: number }>;
    const rows = summary.status_breakdown.map((s: StatusBreak) => ({
      id: s.status,
      status: s.status,
      count: s.count,
      amount: Math.round(s.amount),
      weighted_amount: Math.round(s.weighted_amount),
    }));
    if (rows.length) {
      const total = rows.reduce(
        (acc, r) => {
          acc.count += r.count;
          acc.amount += r.amount;
          acc.weighted_amount += r.weighted_amount;
          return acc;
        },
        { status: "รวม", count: 0, amount: 0, weighted_amount: 0 }
      );
      rows.push({ id: "TOTAL", ...total });
    }
    return rows;
  }, [summary]);

  const handleSearch = () => {
    refetchForecast();
  };

  // Weight modal handlers
  const openWeightModal = async () => {
    setShowWeightModal(true);
    setLoadingWeights(true);
    try {
      const { data } = await api.get(SALES_FORECAST.WEIGHTS);
      type ApiWeight = {
        forecast_weight_config_id: string;
        priority: number;
        weight_percent: string | number;
      };
      const rows: WeightRow[] =
        (data.responseObject as ApiWeight[] | undefined)?.map((r) => ({
          forecast_weight_config_id: r.forecast_weight_config_id,
          priority: r.priority,
          weight_percent: Number(r.weight_percent),
        })) || [];
      for (let p = 1; p <= 5; p++) {
        if (!rows.find((r) => r.priority === p))
          rows.push({ priority: p, weight_percent: 0 });
      }
      rows.sort((a, b) => b.priority - a.priority);
      setWeights(rows);
    } finally {
      setLoadingWeights(false);
    }
  };
  const saveWeightRow = async (row: WeightRow) => {
    if (!actor_id) return;
    await api.post(SALES_FORECAST.WEIGHTS, {
      priority: row.priority,
      weight_percent: row.weight_percent,
      actor_id,
    });
  };
  const saveAllWeights = async () => {
    if (!actor_id) {
      showToast("กรุณาเข้าสู่ระบบก่อนบันทึกน้ำหนัก", false);
      return;
    }
    setSavingWeights(true);
    try {
      for (const r of weights) {
        await saveWeightRow(r);
      }
      qc.invalidateQueries({ queryKey: ["sales-forecast-summary"] });
      setShowWeightModal(false);
      showToast("บันทึกน้ำหนักสำเร็จ", true);
  } catch {
      showToast("บันทึกน้ำหนักไม่สำเร็จ", false);
    } finally {
      setSavingWeights(false);
    }
  };

  // Goal modal handlers
  const openGoalModal = async () => {
    setShowGoalModal(true);
    setLoadingGoals(true);
    try {
      const { data } = await api.get(SALES_FORECAST.GOALS, {
        params: {
          year: year.toString(),
          team_id: team || undefined,
          employee_id: responsible || undefined,
        },
      });
      const rows: GoalRow[] = data.responseObject || [];
      const annual = rows.find((r) => r.month === null);
      setAnnualGoalInput(
        annual ? Number(annual.goal_amount) : summary?.goals.annual_goal || ""
      );
      const monthly: Record<number, number | ""> = {};
      rows
        .filter((r) => r.month !== null)
        .forEach((r) => {
          if (r.month != null) monthly[r.month] = Number(r.goal_amount);
        });
      setMonthlyGoalInputs(monthly);
    } finally {
      setLoadingGoals(false);
    }
  };
  const saveAnnualGoal = async () => {
    if (annualGoalInput === "" || annualGoalInput < 0 || !actor_id) return;
    await api.post(SALES_FORECAST.GOALS, {
      year,
      month: null,
      team_id: team,
      employee_id: responsible,
      goal_amount: annualGoalInput,
      actor_id,
    });
  };
  const saveMonthlyGoal = async (m: number) => {
    const v = monthlyGoalInputs[m];
    if (v === "" || v < 0 || !actor_id) return;
    await api.post(SALES_FORECAST.GOALS, {
      year,
      month: m,
      team_id: team,
      employee_id: responsible,
      goal_amount: v,
      actor_id,
    });
  };
  const saveAllGoals = async () => {
    if (!actor_id) {
      showToast("กรุณาเข้าสู่ระบบก่อนบันทึกเป้าหมาย", false);
      return;
    }
    setSavingGoals(true);
    try {
      await saveAnnualGoal();
      for (let m = 1; m <= 12; m++) {
        if (monthlyGoalInputs[m] !== undefined) await saveMonthlyGoal(m);
      }
      qc.invalidateQueries({ queryKey: ["sales-forecast-summary"] });
      setShowGoalModal(false);
      refetchForecast();
      showToast("บันทึกเป้าหมายสำเร็จ", true);
  } catch {
      showToast("บันทึกเป้าหมายไม่สำเร็จ", false);
    } finally {
      setSavingGoals(false);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  // Pull query params (so navigation from Predict Sell with ?year=... etc works)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const y = params.get("year");
    const month = params.get("month");
    const start = params.get("start_date");
    const end = params.get("end_date");
    const t = params.get("team_id");
    const r = params.get("responsible_id");
    const tag = params.get("tag_id");
    const scenarioId = params.get("scenario_id");
  const productIds = params.get("product_ids");
    if (y) {
      const yi = Number(y);
      if (!isNaN(yi)) update({ year: yi });
    }
    if (month && y && !start && !end) {
      const m = Number(month);
      const yi = Number(y);
      if (!isNaN(m) && m >= 1 && m <= 12 && !isNaN(yi)) {
        update({
          startDate: new Date(yi, m - 1, 1),
          endDate: new Date(yi, m, 0),
        });
      }
    } else {
      if (start) update({ startDate: new Date(start) });
      if (end) update({ endDate: new Date(end) });
    }
    if (t) update({ teamId: t });
    if (r) update({ responsibleId: r });
    if (tag) update({ tagId: tag });
    if (scenarioId) setSelectedScenarioId(scenarioId);
    if (productIds) {
      const arr = productIds.split(",").filter(Boolean);
      if (arr.length) setUrlProductIds(arr);
    } else if (urlProductIds) {
      setUrlProductIds(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);
  // Tooltip moved to ForecastTooltip component for readability

  return (
    <div>
      <p className="mb-4 text-2xl font-bold">รายงานพยากรณ์ยอดขาย</p>
      <div className="p-4 bg-white shadow-md mb-3 rounded-md w-full">
        {riskAgg && (
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            <span className="px-2 py-1 rounded bg-red-100 text-red-700">
              อายุ&gt;60วัน: {riskAgg.aging}
              {riskTotal
                ? ` (${((riskAgg.aging / riskTotal) * 100).toFixed(0)}%)`
                : ""}
            </span>
            <span className="px-2 py-1 rounded bg-amber-100 text-amber-700">
              น้ำหนัก&lt;30%: {riskAgg.lowWeight}
              {riskTotal
                ? ` (${((riskAgg.lowWeight / riskTotal) * 100).toFixed(0)}%)`
                : ""}
            </span>
            <span className="px-2 py-1 rounded bg-pink-100 text-pink-700">
              ไม่มีการเคลื่อนไหว: {riskAgg.noActivity}
              {riskTotal
                ? ` (${((riskAgg.noActivity / riskTotal) * 100).toFixed(0)}%)`
                : ""}
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">
              รวม: {riskAgg.total}
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <div className="sm:col-span-6 flex flex-col md:flex-row md:items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
              <div className="flex flex-col w-full">
                <label htmlFor="team" className="text-md mb-1">
                  ทีม
                </label>
                <DependentSelectComponent
                  id="team"
                  value={teamOptions.find((opt) => opt.value === team) || null}
                  onChange={(option) =>
                    update({ teamId: option ? String(option.value) : null })
                  }
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
                  nextFields={{
                    left: "responsible-telno",
                    right: "responsible-telno",
                    up: "address",
                    down: "responsible",
                  }}
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="responsible" className="text-md mb-1">
                  พนักงานขาย
                </label>
                <DependentSelectComponent
                  id="responsible"
                  value={
                    responsibleOptions.find(
                      (opt) => opt.value === responsible
                    ) || null
                  }
                  onChange={(option) =>
                    update({
                      responsibleId: option ? String(option.value) : null,
                    })
                  }
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
                  nextFields={{
                    left: "responsible-email",
                    right: "responsible-email",
                    up: "team",
                    down: "contact-person",
                  }}
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="start-date" className="text-md  mb-1">
                  วันที่เริ่ม
                </label>
                <DatePickerComponent
                  id="start-date"
                  selectedDate={initMonth}
                  onChange={(date) => update({ startDate: date })}
                  classNameLabel=""
                  classNameInput="w-full"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="end-date" className="text-md  mb-1">
                  ระยะเวลา
                </label>
                <DatePickerComponent
                  id="end-date"
                  selectedDate={endMonth}
                  onChange={(date) => update({ endDate: date })}
                  classNameLabel=""
                  classNameInput="w-full"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="year-select" className="text-md mb-1">
                  ปี
                </label>
                <select
                  id="year-select"
                  value={year}
                  onChange={(e) => update({ year: Number(e.target.value) })}
                  className="border rounded px-2 py-2"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="tag-filter" className="text-md mb-1">
                  Tag
                </label>
                <select
                  id="tag-filter"
                  value={tagId || ""}
                  onChange={(e) => update({ tagId: e.target.value || null })}
                  className="border rounded px-2 py-2"
                >
                  <option value="">ทั้งหมด</option>
                  {tagOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="min-w-[220px]">
              <label htmlFor="scenario-select" className="text-md mb-1">
                ฉากจำลอง
              </label>
              <select
                id="scenario-select"
                value={selectedScenarioId || ""}
                onChange={(e) => {
                  const val = e.target.value || null;
                  setSelectedScenarioId(val);
                  const params = new URLSearchParams(location.search);
                  if (val) params.set("scenario_id", val);
                  else params.delete("scenario_id");
                  window.history.replaceState(
                    {},
                    "",
                    `${location.pathname}?${params.toString()}`
                  );
                }}
                className="border rounded px-2 py-2 w-full"
              >
                <option value="">(ฐานข้อมูลเดิม)</option>
                {scenarios.map((s) => (
                  <option
                    key={s.sales_forecast_scenario_id}
                    value={s.sales_forecast_scenario_id}
                  >
                    {s.name}
                  </option>
                ))}
              </select>
              {loadingScenarioSummary && selectedScenarioId ? (
                <div className="text-xs text-gray-500 mt-1">
                  Loading scenario...
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* <div className="sm:col-span-5 flex justify-end mt-4">
          <Buttons btnType="primary" variant="outline" className="w-full sm:w-auto sm:min-w-[100px]" onClick={handleSearch}>ค้นหา</Buttons>
        </div> */}
        <div className="sm:col-span-1 md:col-span-2 lg:col-span-3 flex flex-wrap gap-2 justify-end items-end">
          <Buttons btnType="default" variant="outline" onClick={openGoalModal} className="sm:min-w-[110px]">แก้ไขเป้าหมาย</Buttons>
          <Buttons btnType="default" variant="outline" onClick={openWeightModal} className="sm:min-w-[110px]">แก้ไขน้ำหนัก</Buttons>
          <Buttons btnType="primary" variant="outline" className="w-full sm:w-auto sm:min-w-[100px]" onClick={handleSearch}>ค้นหา</Buttons>
          <Buttons btnType="primary" variant="outline" className="w-full sm:w-auto sm:min-w-[100px]" /* onClick={handleOpenPdf}*/>
            <FiPrinter style={{ fontSize: 18 }} /> พิมพ์
          </Buttons>
        </div>
      </div>

      {loadingForecast ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {["s1", "s2", "s3", "s4", "s5"].map((key) => (
            <div key={key} className="h-20 animate-pulse bg-gray-200 rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {kpis.map((k) => (
            <KPIBox
              key={k.label}
              item={k}
              hasScenario={k.scenarioValue !== undefined && !!selectedScenarioId}
              gapToGoal={summary?.gap_to_goal}
            />
          ))}
        </div>
      )}

      <div className=" bg-white shadow-md rounded-lg">
        <div className="p-2 bg-sky-100 rounded-t-lg">
          <p className="font-semibold">เอาไว้ทำหัวรายงานในอนาคต</p>
        </div>
        <div className="p-7 pb-5 w-full max-w-full">
          <div>
            <p className="text-2xl font-semibold mb-1">รายงานพยากรณ์ยอดขาย</p>
            <p className="text-sm text-gray-600">บริษัท CRM Manager (DEMO)</p>
            <p className="text-xs text-gray-500 mb-6">ปี {year}</p>
          </div>
          <p className="text-lg font-semibold mb-2 text-gray-700">
            เป้าหมายยอดขายสะสม เทียบ ยอดขายสะสมคาดการณ์
          </p>
          <div ref={chartRef1} className="w-full h-[500px] border-b-2 mb-3">
            {loadingForecast ? (
              <div className="flex items-center justify-center h-full">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 40, bottom: 50 }}
                  onClick={handleChartClick}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    allowDecimals={false}
                    domain={[
                      0,
                      Math.max(
                        ...chartData.map((d) =>
                          Math.max(d.actual, d.forecast, d.target, 1)
                        )
                      ) * 1.2,
                    ]}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip content={ForecastTooltip} />
                  <Legend />
                  <Bar dataKey="target" name="เป้าหมาย (บาท)" fill="#3b82f6" barSize={20} />
                  <Bar dataKey="forecast" name="คาดการณ์ (บาท)" fill="#f97316" barSize={20} />
                  <Line type="monotone" dataKey="actual" name="ยอดจริง (บาท)" stroke="#16a34a" strokeWidth={3} dot />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
          <Table.Root
            variant="surface"
            size="2"
            className="whitespace-nowrap mb-10"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  <span className="sr-only">Metric</span>
                </Table.ColumnHeaderCell>
                {derivedMonths.map((month) => (
                  <Table.ColumnHeaderCell key={month} className="text-end">
                    {month}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {salesDataTable.map((row) => {
                const isGrowthRow = row.label.includes("%");
                const isActualMonthly = row.label === "Actual Monthly";
                const paceThreshold =
                  summary?.pace?.required_avg_per_remaining_month || 0;
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
                    {row.values.map((value, idx) => {
                      const highlight =
                        isActualMonthly &&
                        paceThreshold > 0 &&
                        value < paceThreshold;
                      return (
                        <Table.Cell
                          key={`${row.label}-${idx}`}
                          className={`text-end ${
                            isGrowthRow ? "font-semibold" : ""
                          } ${
                            highlight
                              ? "bg-red-50 text-red-700 font-semibold"
                              : ""
                          }`}
                        >
                          {value.toLocaleString()}
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-5">
            <div
              ref={chartRef2}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
            >
              <div className="mb-2 flex flex-col gap-1">
        <p className="text-sm font-semibold">เป้าหมายรวม vs คาดการณ์รวม</p>
                <p className="text-xs text-gray-500">
                  {hasTotalData
                    ? (() => {
                        const gapLabel = gapToGoal > 0
                          ? `${gapToGoal.toLocaleString()} บาท`
                          : gapToGoal === 0
                          ? "0"
                          : `เกินเป้า ${Math.abs(gapToGoal).toLocaleString()} บาท`;
                        return `อัตราบรรลุ: ${achievementPct.toFixed(1)}% | ช่องว่าง: ${gapLabel}`;
                      })()
                    : "ยังไม่มีข้อมูล (เป้าหมายหรือคาดการณ์เป็น 0)"}
                </p>
              </div>
              {hasTotalData ? (
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart
                    data={summaryTotal}
                    margin={{ bottom: 10, left: 40, right: 20 }}
                    barSize={50}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                    <YAxis tickFormatter={(v) => v.toLocaleString()} />
                    <Tooltip
                      formatter={(v) => `${Number(v).toLocaleString()} บาท`}
                      wrapperStyle={{ maxWidth: 150, whiteSpace: 'normal' }}
                    />
                    <Bar dataKey="value">
                      {summaryTotal.map(d => (
                        <Cell key={d.id} fill={d.id === 'forecast-total' ? '#f97316' : '#3b82f6'} />
                      ))}
                      {/* Custom labels including % for forecast bar */}
                      {summaryTotal.map(d => (
                        <text
                          key={d.id + '-lbl'}
                          className="fill-gray-700 text-[11px]"
                          x={0}
                          y={0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400 border rounded-md bg-white">
                  ไม่มีข้อมูลสำหรับแสดงกราฟ
                </div>
              )}
            </div>
            <div
              ref={chartRef3}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
            >
              <div className="mb-2 flex flex-col gap-1">
                <p className="text-sm font-semibold">ค่าเฉลี่ยรายเดือน (เป้าหมาย / คาดการณ์ / จริง)</p>
                <p className="text-xs text-gray-500">
                  {allAvgZero ? 'ยังไม่มีข้อมูลเพียงพอสำหรับค่าเฉลี่ยรายเดือน' : 'เปรียบเทียบค่าเฉลี่ยต่อเดือนเพื่อดูความเร็ว (pacing)'}
                </p>
              </div>
              {allAvgZero ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-400 border rounded-md bg-white">
                  ไม่มีข้อมูลสำหรับแสดงกราฟ
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={summaryMonthlyAverage} margin={{ bottom: 10, left: 40, right: 20 }} barSize={50}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis tickFormatter={v => v.toLocaleString()} />
                    <Tooltip formatter={(v) => `${Number(v).toLocaleString()} บาท`} />
                    <Bar dataKey="value" label={{ position: 'top', formatter: (value: number) => value.toLocaleString() }}>
                      {summaryMonthlyAverage.map(d => (
                        <Cell key={d.id} fill={d.id === 'forecast-avg' ? '#f97316' : d.id === 'actual-avg' ? '#16a34a' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-3 mt-6">
            <div className="lg:col-span-1">
              <SummaryTable
                title="สัดส่วนใบเสนอราคาคาดการณ์ แบ่งตามความสำคัญ"
                columns={HeaderPredict}
                data={predictValues}
              />
            </div>
            <div className="lg:col-span-1">
              <SummaryTable
                title="10 อันดับลูกค้าที่มีโอกาสซื้อสูงสุด"
                columns={HeaderCustomer}
                data={customers}
              />
            </div>
            <div className="lg:col-span-1">
              <SummaryTable
                title="สรุปใบเสนอราคาแยกตามสถานะ"
                columns={HeaderStatus}
                data={statusValues}
              />
            </div>
          </div>
        </div>
      </div>

  {/* Action buttons moved to top near filters for better UX */}

      {showWeightModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">แก้ไขน้ำหนักโอกาสขาย</h2>
            {loadingWeights ? (
              <div>Loading...</div>
            ) : (
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr>
                    <th className="text-left p-2">Priority</th>
                    <th className="text-left p-2">Weight %</th>
                  </tr>
                </thead>
                <tbody>
      {weights.map((w) => (
                    <tr key={w.priority} className="border-t">
                      <td className="p-2">★{w.priority}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
        value={w.weight_percent}
        onChange={(e) => updateWeightPercent(w.priority, Number(e.target.value))}
                          className="border rounded px-2 py-1 w-24 text-right"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end gap-2">
              <Buttons
                btnType="cancel"
                variant="outline"
                onClick={() => setShowWeightModal(false)}
              >
                ยกเลิก
              </Buttons>
              <Buttons
                btnType="primary"
                variant="outline"
                onClick={saveAllWeights}
                disabled={savingWeights || !actor_id}
              >
                {savingWeights ? "กำลังบันทึก..." : "บันทึก"}
              </Buttons>
            </div>
          </div>
        </div>
      )}

      {showGoalModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              แก้ไขเป้าหมายยอดขาย {year}
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
