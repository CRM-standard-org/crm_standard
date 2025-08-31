import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table } from "@radix-ui/themes";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import { useToast } from "@/components/customs/alert/useToast";

import { useNavigate, useSearchParams } from "react-router-dom";

import {
  TypeAllEmployeeResponse,
  TypeSelectEmployeeStatusResponse,
} from "@/types/response/response.employee";
import { useAllEmployee, useSelectEmployeeStatus } from "@/hooks/useEmployee";
import { useSelectRole } from "@/hooks/useRole";
import { useTeam } from "@/hooks/useTeam";
import { useSocial } from "@/hooks/useSocial";
import { useAddress } from "@/hooks/useAddress";
import { TypeSocialResponse } from "@/types/response/response.social";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { importEmployees, deleteEmployee } from "@/services/employee.service";
import { PayLoadCreateEmployee } from "@/types/requests/request.employee";
// use a public image as icon to avoid missing asset imports

type dateTableType = {
  className: string;
  cells: {
    value: unknown;
    className: string;
  }[];
  data: TypeAllEmployeeResponse; //ตรงนี้
}[];

//
export default function Employee() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<dateTableType>([]);
  // Import Excel modal state
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  type ImportRow = {
    employee_code?: string;
    username?: string;
    password?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    role_id?: string;
    position?: string;
    phone?: string;
    social?: string;
    social_id?: string;
    detail?: string;
    address?: string;
    country?: string;
    country_id?: string;
    province?: string;
    province_id?: string;
    district?: string;
    district_id?: string;
    status?: string;
    status_id?: string;
    team?: string;
    team_id?: string;
    salary?: string | number | null;
    start_date?: string | Date;
    end_date?: string | Date;
    birthdate?: string | Date;
    [key: string]: unknown;
  };
  const [previewRows, setPreviewRows] = useState<ImportRow[]>([]);
  const [transformErrors, setTransformErrors] = useState<
    { index: number; message: string }[]
  >([]);
  const [payloads, setPayloads] = useState<PayLoadCreateEmployee[]>([]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [isActive, setIsActive] = useState<boolean>(true);

  // delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] =
    useState<TypeAllEmployeeResponse | null>(null);

  // Lookups for mapping names -> ids
  const { data: dataEmployeeStatus } = useSelectEmployeeStatus({
    searchText: "",
  });
  const { data: dataRole } = useSelectRole({ searchText: "" });
  const { data: dataTeam } = useTeam({
    page: "1",
    pageSize: "100",
    searchText: "",
  });
  const { data: dataSocial } = useSocial({ searchText: "" });
  const { data: addressData } = useAddress({ searchText: "" });
  const addressTree = useMemo(
    () => addressData?.responseObject || [],
    [addressData]
  );

  //item จาก dropdown

  const { data: dataEmployee, refetch: refetchEmployee } = useAllEmployee({
    page: page,
    pageSize: pageSize,
    searchText: searchEmployee,
    payload: {
      is_active: isActive,
      status: filterStatus,
    },
  });

  useEffect(() => {
    if (dataEmployee?.responseObject?.data) {
      const formattedData = dataEmployee.responseObject?.data.map(
        (item: TypeAllEmployeeResponse) => ({
          className: "",
          cells: [
            { value: item.employee_code, className: "text-center" },
            {
              value: item.first_name + " " + item.last_name,
              className: "text-left",
            },
            { value: item.position ?? "-", className: "text-center" },
            {
              value: item.team_employee?.name ?? "-",
              className: "text-center",
            },
            {
              value:
                new Date(item.start_date).toLocaleDateString("th-TH") ?? "-",
              className: "text-center",
            },
            {
              value: item.employee_status?.name ?? "-",
              className: "text-center",
            },
            { value: item.salary ?? "-", className: "text-center" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataEmployee]);

  //
  const headers = [
    { label: "รหัสพนักงาน", colSpan: 1, className: "w-auto" },
    { label: "ชื่อ-นามสกุล", colSpan: 1, className: "w-auto" },
    { label: "ตำแหน่ง", colSpan: 1, className: "w-auto" },
    { label: "ทีม", colSpan: 1, className: "w-auto" },
    { label: "วันเริ่มทำงาน", colSpan: 1, className: "w-auto" },
    { label: "สถานะ", colSpan: 1, className: "w-auto" },
    { label: "เงินเดือน/ค่าแรง", colSpan: 1, className: "w-auto" },
    { label: "ดูรายละเอียด", colSpan: 1, className: "w-auto" },
    { label: "ลบ", colSpan: 1, className: "w-auto" },
  ];

  // no mock data
  const dropdown = [
    {
      placeholder: "สถานะการทำงาน",
      fetchData: async () => {
        return {
          responseObject: [
            { id: 1, name: "ทำงานอยู่" },
            { id: 2, name: "ไม่ได้ทำงาน" },
          ],
        };
      },
      onChange: (value: string | null) => {
        if (value === "1") {
          setIsActive(true);
        } else if (value === "2") {
          setIsActive(false);
        } else {
          setIsActive(true);
        }
        setSearchParams({ page: "1", pageSize });
      },
    },
  ];

  //tabs บน headertable

  const groupTabs = [
    {
      id: "all",
      name: "ทั้งหมด",
      onChange: () => {
        setFilterStatus(null);
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      id: "regular",
      name: "พนักงานประจำ",
      onChange: () => {
        setFilterStatus("พนักงานประจำ");
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      id: "test",
      name: "ทดลองงาน",
      onChange: () => {
        setFilterStatus("ทดลองงาน");
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      id: "dismiss",
      name: "เลิกจ้าง",
      onChange: () => {
        setFilterStatus("เลิกจ้าง");
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      id: "intern",
      name: "ฝึกงาน",
      onChange: () => {
        setFilterStatus("ฝึกงาน");
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      id: "take-leave",
      name: "ลาหยุด",
      onChange: () => {
        setFilterStatus("ลาหยุด");
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      id: "out",
      name: "ถูกเลิกจ้าง",
      onChange: () => {
        setFilterStatus("ถูกเลิกจ้าง");
        setSearchParams({ page: "1", pageSize });
      },
    },
  ];

  const handleNavCreate = () => {
    navigate("/create-employee");
  };
  const handleOpenImport = () => {
    setIsImportOpen(true);
  };
  //handle
  const handleSearch = () => {
    setSearchEmployee(searchText);
    setSearchParams({ page: "1", pageSize });
  };
  useEffect(() => {
    if (searchText === "") {
      setSearchEmployee(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText, pageSize, setSearchParams]);

  const handleView = (item: TypeAllEmployeeResponse) => {
    navigate(`/employee-details/${item.employee_id}`);
  };
  const openDelete = (item: TypeAllEmployeeResponse) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => setIsDeleteOpen(false);
  const confirmDelete = async () => {
    if (!selectedItem?.employee_id) {
      showToast("ไม่พบข้อมูลพนักงาน", false);
      return;
    }
    try {
      const res = await deleteEmployee(selectedItem.employee_id);
      if (res?.statusCode === 200) {
        showToast("ลบพนักงานเรียบร้อยแล้ว", true);
        setIsDeleteOpen(false);
        setSearchParams({ page: "1", pageSize });
        refetchEmployee();
      } else if (res?.statusCode === 400) {
        showToast("ไม่สามารถลบพนักงานได้", false);
      } else {
        showToast(res?.message || "ไม่สามารถลบพนักงานได้", false);
      }
    } catch {
      showToast("ไม่สามารถลบพนักงานได้", false);
    }
  };
  // no local create/edit/delete handlers

  // Helpers for Excel import
  const normalize = (s?: string) => (s || "").toString().trim().toLowerCase();
  const safeStr = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (v instanceof Date) return dayjs(v).format("YYYY-MM-DD");
    return "";
  };
  const toDisplay = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    if (v instanceof Date) return dayjs(v).format("YYYY-MM-DD");
    if (typeof v === "object") return JSON.stringify(v);
    if (typeof v === "string") return v;
    if (
      typeof v === "number" ||
      typeof v === "boolean" ||
      typeof v === "bigint"
    )
      return String(v);
    return "";
  };
  const parseDate = (v: unknown): string | undefined => {
    if (!v) return undefined;
    if (v instanceof Date) return dayjs(v).format("YYYY-MM-DD");
    let s = "";
    if (typeof v === "string") s = v.trim();
    else if (typeof v === "number" || typeof v === "bigint") s = String(v);
    else return undefined;
    if (!s) return undefined;
    // try DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s)) {
      const [d, m, y] = s.split("/").map((n) => parseInt(n, 10));
      const yy = y < 100 ? 2000 + y : y;
      return dayjs(new Date(yy, (m || 1) - 1, d || 1)).format("YYYY-MM-DD");
    }
    // try YYYY-MM-DD or other ISO-like
    const d1 = dayjs(s);
    return d1.isValid() ? d1.format("YYYY-MM-DD") : undefined;
  };
  // Thai-friendly normalization helpers and fuzzy resolve
  const normalizeStrict = (s?: string) =>
    (s || "").toString().trim().toLowerCase();
  const simplifyThai = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[-_.]/g, "")
      // remove common Thai prefixes
      .replace(/^จังหวัด/, "")
      .replace(/^เขต/, "")
      .replace(/^อำเภอ/, "")
      .replace(/^ตำบล/, "")
      .replace(/^แขวง/, "");
  // alias helpers will be defined inside makePayload to avoid hook deps
  const buildLookups = useCallback(() => {
    const roleMap: Record<string, string> = {};
    (dataRole?.responseObject.data || []).forEach(
      (r: { role_id: string; role_name: string }) => {
        roleMap[normalize(r.role_name)] = r.role_id;
      }
    );
    const statusMap: Record<string, string> = {};
    (dataEmployeeStatus?.responseObject.data || []).forEach(
      (s: TypeSelectEmployeeStatusResponse) => {
        statusMap[normalize(s.name)] = s.status_id;
      }
    );
    const teamMap: Record<string, string> = {};
    (dataTeam?.responseObject.data || []).forEach(
      (t: { team_id: string; name: string }) => {
        teamMap[normalize(t.name)] = t.team_id;
      }
    );
    const socialMap: Record<string, string> = {};
    (dataSocial?.responseObject.data || []).forEach((s: TypeSocialResponse) => {
      socialMap[normalize(s.name)] = s.social_id;
    });
    const countryMap: Record<string, string> = {};
    const provinceMap: Record<string, Record<string, string>> = {};
    const districtMap: Record<
      string,
      Record<string, Record<string, string>>
    > = {};
    for (const c of addressTree || []) {
      const country_id = c.country_id;
      const cn = normalize(c.country_name);
      if (!country_id) continue;
      countryMap[cn] = country_id;
      provinceMap[country_id] = {};
      districtMap[country_id] = {};
      const provinces = c.province || [];
      for (const p of provinces) {
        const province_id = p.province_id;
        const pn = normalize(p.province_name);
        if (!province_id) continue;
        provinceMap[country_id][pn] = province_id;
        districtMap[country_id][province_id] = {};
        const districts = p.district || [];
        for (const d of districts) {
          const dn = normalize(d.district_name);
          const did = d.district_id;
          if (did) districtMap[country_id][province_id][dn] = did;
        }
      }
    }
    return {
      roleMap,
      statusMap,
      teamMap,
      socialMap,
      countryMap,
      provinceMap,
      districtMap,
    };
  }, [addressTree, dataRole, dataEmployeeStatus, dataTeam, dataSocial]);
  const makePayload = useCallback(
    (
      r: ImportRow,
      lookups: ReturnType<typeof buildLookups>
    ): { payload?: PayLoadCreateEmployee; error?: string } => {
      const countryAliases: Record<string, string> = {
        ไทย: "ประเทศไทย",
        thailand: "ประเทศไทย",
        ราชอาณาจักรไทย: "ประเทศไทย",
      };
      const provinceAliases: Record<string, string> = {
        กรุงเทพ: "กรุงเทพมหานคร",
        bangkok: "กรุงเทพมหานคร",
      };
      const aliasName = (name?: string, table?: Record<string, string>) => {
        const n = normalizeStrict(name);
        if (!n) return "";
        return (table && (table[n] || table[name || ""])) || name || "";
      };
      // local fuzzy resolver that tries exact normalized match, then simplified/alias and partial contains
      const tryResolve = (
        map: Record<string, string> | undefined,
        input: unknown,
        aliasTable?: Record<string, string>
      ): string | undefined => {
        if (!map) return undefined;
        const raw = safeStr(input);
        if (!raw) return undefined;
        const aliased = aliasTable ? aliasName(raw, aliasTable) : raw;
        const key = normalizeStrict(aliased);
        // exact key (name) match
        if (map[key]) return map[key];
        // direct id provided
        for (const k in map) {
          if (map[k] === raw) return raw;
        }
        const keySimple = simplifyThai(key);
        for (const k in map) {
          if (simplifyThai(k) === keySimple) return map[k];
        }
        for (const k in map) {
          const ks = simplifyThai(k);
          if (ks.includes(keySimple) || keySimple.includes(ks)) return map[k];
        }
        return undefined;
      };

      // resolve country/province/district with fuzzy matching and aliases
      const countryId =
        r.country_id ||
        tryResolve(lookups.countryMap, r.country, countryAliases);
      const provinceId =
        r.province_id ||
        (countryId
          ? tryResolve(
              lookups.provinceMap[countryId],
              r.province,
              provinceAliases
            )
          : undefined);
      const districtId =
        r.district_id ||
        (countryId && provinceId
          ? tryResolve(lookups.districtMap[countryId]?.[provinceId], r.district)
          : undefined);

      // resolve other references (role/status/team/social)
      const roleId = r.role_id || tryResolve(lookups.roleMap, r.role);
      const statusId = r.status_id || tryResolve(lookups.statusMap, r.status);
      const teamId =
        r.team_id || (r.team ? tryResolve(lookups.teamMap, r.team) : undefined);
      const socialId =
        r.social_id ||
        (r.social ? tryResolve(lookups.socialMap, r.social) : undefined);
      const salaryRaw = r.salary;
      const salaryNum =
        salaryRaw === "" || salaryRaw === undefined || salaryRaw === null
          ? undefined
          : Number(String(salaryRaw).replace(/[,\s]/g, ""));
      const phone = safeStr(r.phone).replace(/\D/g, "");
      const missing: string[] = [];
      if (!r.employee_code) missing.push("employee_code");
      if (!r.username) missing.push("username");
      if (!r.password) missing.push("password");
      if (!r.email) missing.push("email");
      if (!r.first_name) missing.push("first_name");
      if (!r.position) missing.push("position");
      if (!phone) missing.push("phone");
      if (!roleId) missing.push("role");
      if (!statusId) missing.push("status");
      if (!countryId) missing.push("country");
      if (!provinceId) missing.push("province");
      if (!districtId) missing.push("district");
      if (missing.length) {
        return {
          error: `ข้อมูลไม่ครบถ้วนหรือไม่พบการจับคู่: ${missing.join(", ")}`,
        };
      }
      const payload: PayLoadCreateEmployee = {
        employee_code: safeStr(r.employee_code).trim(),
        username: safeStr(r.username).trim(),
        password: safeStr(r.password),
        email: safeStr(r.email).trim(),
        first_name: safeStr(r.first_name).trim(),
        last_name: r.last_name ? safeStr(r.last_name).trim() : "",
        role_id: roleId,
        position: safeStr(r.position).trim(),
        phone,
        social_id: socialId,
        detail: r.detail ? safeStr(r.detail) : undefined,
        address: r.address ? safeStr(r.address) : undefined,
        country_id: countryId,
        province_id: provinceId,
        district_id: districtId,
        status_id: statusId,
        team_id: teamId,
        salary: salaryNum,
        start_date: parseDate(r.start_date),
        end_date: parseDate(r.end_date),
        birthdate: parseDate(r.birthdate),
      };
      return { payload };
    },
    []
  );
  const transformRowsToPayloads = useCallback(
    (rows: ImportRow[]) => {
      const lookups = buildLookups();
      const out: PayLoadCreateEmployee[] = [];
      const errs: { index: number; message: string }[] = [];
      let i = 0;
      for (const r of rows) {
        const { payload, error } = makePayload(r, lookups);
        if (payload) out.push(payload);
        else errs.push({ index: i, message: error || "แปลงข้อมูลล้มเหลว" });
        i++;
      }
      return { out, errs };
    },
    [buildLookups, makePayload]
  );
  const handleExcelPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    void readExcelFile(f);
  };
  const readExcelFile = useCallback(
    async (file: File) => {
      const MAX = 25 * 1024 * 1024; // 25 MB
      if (file.size > MAX) {
        showToast("ไฟล์มีขนาดเกิน 25 MB", false);
        return;
      }
      const name = file.name.toLowerCase();
      const isCSV = name.endsWith(".csv");
      setExcelFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          let wb: XLSX.WorkBook;
          if (isCSV) {
            const res = evt.target?.result;
            const text = typeof res === "string" ? res : "";
            wb = XLSX.read(text, { type: "string" });
          } else {
            const data = new Uint8Array(evt.target?.result as ArrayBuffer);
            wb = XLSX.read(data, { type: "array" });
          }
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<ImportRow>(ws, {
            defval: "",
            raw: true,
          });
          setPreviewRows(json.slice(0, 10));
          const { out, errs } = transformRowsToPayloads(json);
          setPayloads(out);
          console.log("out", out);
          console.log("errs", errs);
          setTransformErrors(errs);
        } catch {
          setTransformErrors([{ index: -1, message: "อ่านไฟล์ไม่สำเร็จ" }]);
        }
      };
      if (isCSV) reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    },
    [showToast, transformRowsToPayloads]
  );
  const onDrop = useMemo(
    () => (accepted: File[]) => {
      const f = accepted?.[0];
      if (!f) return;
      void readExcelFile(f);
    },
    [readExcelFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true, // prevent click bubbling opening dialog; we'll use our own button
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });
  const previewHeaders = useMemo(() => {
    if (!previewRows.length) return [] as string[];
    const keys = Object.keys(previewRows[0]);
    // hide any *_id columns from preview
    return keys.filter((k) => !k.toLowerCase().endsWith("_id"));
  }, [previewRows]);
  // map JSON keys to Thai labels for preview headers
  const headerThMap: Record<string, string> = {
    employee_code: "รหัสพนักงาน",
    username: "ชื่อผู้ใช้งาน",
    password: "รหัสผ่าน",
    email: "อีเมล",
    first_name: "ชื่อ",
    last_name: "นามสกุล",
    role: "สิทธิ์",
    position: "ตำแหน่ง",
    phone: "เบอร์โทรศัพท์",
    social: "ช่องทางติดต่อ",
    contact_detail: "รายละเอียดช่องทาง",
    detail: "รายละเอียด",
    address: "ที่อยู่",
    country: "ประเทศ",
    province: "จังหวัด",
    district: "อำเภอ/เขต",
    status: "สถานะ",
    team: "ทีม",
    salary: "เงินเดือน/ค่าแรง",
    start_date: "วันเริ่มงาน",
    end_date: "วันสิ้นสุดงาน",
    birthdate: "วันเกิด",
  };
  const headerLabel = (k: string) => headerThMap[k] || k;
  const rowKey = (r: ImportRow) => {
    const base = safeStr(r.employee_code || r.username || r.email || r.phone);
    if (base) return base;
    const s = JSON.stringify(r);
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return `r${h}`;
  };
  const downloadTemplate = () => {
    const headers = [
      "employee_code",
      "username",
      "password",
      "email",
      "first_name",
      "last_name",
      "role",
      "role_id",
      "position",
      "phone",
      "social",
      "social_id",
      "detail",
      "address",
      "country",
      "country_id",
      "province",
      "province_id",
      "district",
      "district_id",
      "status",
      "status_id",
      "team",
      "team_id",
      "salary",
      "start_date",
      "end_date",
      "birthdate",
    ];
    const sampleCountry = addressTree?.[0]?.country_name || "";
    const sampleCountryId = addressTree?.[0]?.country_id || "";
    const sampleProvince = addressTree?.[0]?.province?.[0]?.province_name || "";
    const sampleProvinceId = addressTree?.[0]?.province?.[0]?.province_id || "";
    const sampleDistrict =
      addressTree?.[0]?.province?.[0]?.district?.[0]?.district_name || "";
    const sampleDistrictId =
      addressTree?.[0]?.province?.[0]?.district?.[0]?.district_id || "";
    const sampleRole = dataRole?.responseObject.data?.[0]?.role_name || "";
    const sampleRoleId = dataRole?.responseObject.data?.[0]?.role_id || "";
    const sampleStatus =
      dataEmployeeStatus?.responseObject.data?.[0]?.name || "";
    const sampleStatusId =
      dataEmployeeStatus?.responseObject.data?.[0]?.status_id || "";
    const sampleTeam = dataTeam?.responseObject.data?.[0]?.name || "";
    const sampleTeamId = dataTeam?.responseObject.data?.[0]?.team_id || "";
    const sampleSocial = dataSocial?.responseObject.data?.[0]?.name || "";
    const sampleSocialId =
      dataSocial?.responseObject.data?.[0]?.social_id || "";
    const sample = [
      {
        employee_code: "EMP001",
        username: "jdoe",
        password: "Passw0rd!",
        email: "jdoe@example.com",
        first_name: "John",
        last_name: "Doe",
        role: sampleRole,
        role_id: sampleRoleId,
        position: "Sales Rep",
        phone: "0812345678",
        social: sampleSocial,
        social_id: sampleSocialId,
        detail: "@jdoe",
        address: "123 Main Rd",
        country: sampleCountry,
        country_id: sampleCountryId,
        province: sampleProvince,
        province_id: sampleProvinceId,
        district: sampleDistrict,
        district_id: sampleDistrictId,
        status: sampleStatus,
        status_id: sampleStatusId,
        team: sampleTeam,
        team_id: sampleTeamId,
        salary: 25000,
        start_date: "2025-01-01",
        end_date: "",
        birthdate: "1995-05-12",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sample, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "แบบฟอร์ม");
    // add a second sheet with allowed values for reference (with ids)
    const refRows: Array<Record<string, string>> = [];
    (dataRole?.responseObject.data || []).forEach(
      (r: { role_id: string; role_name: string }) =>
        refRows.push({ catalog: "role", id: r.role_id, name: r.role_name })
    );
    (dataEmployeeStatus?.responseObject.data || []).forEach(
      (s: TypeSelectEmployeeStatusResponse) =>
        refRows.push({ catalog: "status", id: s.status_id, name: s.name })
    );
    (dataTeam?.responseObject.data || []).forEach(
      (t: { team_id: string; name: string }) =>
        refRows.push({ catalog: "team", id: t.team_id, name: t.name })
    );
    (dataSocial?.responseObject.data || []).forEach((s: TypeSocialResponse) =>
      refRows.push({ catalog: "social", id: s.social_id, name: s.name })
    );
    (addressTree || []).forEach(
      (c: { country_id: string; country_name: string }) =>
        refRows.push({
          catalog: "country",
          id: c.country_id,
          name: c.country_name,
        })
    );
    const ws2 = XLSX.utils.json_to_sheet(refRows, {
      header: ["catalog", "id", "name"],
    });
    XLSX.utils.book_append_sheet(wb, ws2, "รายการอ้างอิง");
    // add an Instructions sheet
    const instructions = [
      {
        field: "หมายเหตุ",
        description:
          "ช่องที่มี * ต้องกรอก: employee_code, username, password, email, first_name, role/status/country/province/district, position, phone",
      },
      {
        field: "ฟิลด์แบบเลือก",
        description:
          "สำหรับ (role/status/team/social/country/province/district) ใส่เป็นชื่อ (ไทย) หรือ ID ก็ได้; ถ้ามี *_id จะใช้ *_id เป็นหลัก",
      },
      {
        field: "วันที่",
        description: "ใช้รูปแบบ YYYY-MM-DD หรือวันที่ที่ Excel เข้าใจ",
      },
      {
        field: "โทรศัพท์",
        description: "เก็บเฉพาะตัวเลข ระบบจะลบอักขระอื่นให้อัตโนมัติ",
      },
    ];
    const ws3 = XLSX.utils.json_to_sheet(instructions, {
      header: ["field", "description"],
    });
    XLSX.utils.book_append_sheet(wb, ws3, "คำแนะนำ");
    XLSX.writeFile(wb, "employee_import_template.xlsx");
  };
  // reset import modal state
  const resetImportState = useCallback(() => {
    setExcelFile(null);
    setPreviewRows([]);
    setPayloads([]);
    setTransformErrors([]);
    setIsImporting(false);
  }, []);

  // close modal and clear data
  const handleCloseImport = useCallback(() => {
    setIsImportOpen(false);
    resetImportState();
  }, [resetImportState]);

  const handleImportConfirm = async () => {
    if (transformErrors.length > 0) {
      showToast("แก้ไขข้อมูลในไฟล์ให้ถูกต้องก่อนนำเข้า", false);
      return;
    }
    if (payloads.length === 0) {
      showToast("ไม่มีข้อมูลสำหรับนำเข้า", false);
      return;
    }
    // capture items before clearing state, then close and reset UI immediately
    const items = [...payloads];
    handleCloseImport();
    try {
      const res = (await importEmployees(items)) as unknown as {
        success: boolean;
        responseObject?: {
          success?: number;
          failed?: number;
          errors?: Array<{ index: number; message: string }>;
        };
        statusCode?: number;
      };
      const ok = res?.responseObject?.success ?? 0;
      const fail = res?.responseObject?.failed ?? 0;
      // Always show overall summary
      showToast(
        `นำเข้าสำเร็จ ${ok} รายการ, ล้มเหลว ${fail} รายการ`,
        fail === 0
      );
      // Additionally show row-level errors if any
      if (res?.responseObject?.errors?.length) {
        res.responseObject.errors.forEach((err) => {
          showToast(`แถวที่ ${err.index + 1} ล้มเหลว: ${err.message}`, false);
        });
      }
      if (ok > 0) refetchEmployee();
    } catch {
      showToast("เกิดข้อผิดพลาดในการนำเข้า", false);
      return;
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="จัดการพนักงาน"
        hideTitleBtn={true}
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา....",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataEmployee?.responseObject?.totalCount}
        onView={handleView}
        onDelete={openDelete}
        onCreateBtn={true}
        onCreateBtnClick={handleNavCreate}
        nameCreateBtn="+ เพิ่มพนักงานใหม่"
        onImportExcelBtn={true}
        onImportExcelBtnClick={handleOpenImport}
        nameImportExcelBtn="+ นำเข้าข้อมูลจาก Excel"
        onDropdown={true}
        dropdownItem={dropdown}
        headerTab={true}
        groupTabs={groupTabs}
      />

      {/* Import Excel Modal */}
      <DialogComponent
        isOpen={isImportOpen}
        onClose={handleCloseImport}
        title="นำเข้าข้อมูลพนักงานจาก Excel"
        onConfirm={handleImportConfirm}
        confirmText={isImporting ? "กำลังนำเข้า..." : "ยืนยันนำเข้า"}
        cancelText="ยกเลิก"
        confirmBtnType="primary"
        maxWidth={
          previewRows.length > 0
            ? "min(700px, 100vw - 32px)"
            : "min(540px, 100vw - 32px)"
        }
      >
        <div className="space-y-4 w-full max-w-full min-w-0 overflow-x-hidden">
          {/* Dropzone */}
          <div
            {...getRootProps({
              className:
                "flex justify-center items-center w-full h-52  border-2 border-dashed rounded-lg bg-gray-50 p-6 cursor-pointer hover:bg-gray-100 transition-colors",
            })}
          >
            <input {...getInputProps()} />
            <div className="min-h-28 flex flex-col items-center justify-center text-center gap-2">
              <img
                className=" w-[48px] h-[48px]"
                src="/images/microsoft-excel-icon.png"
                alt="ไอคอน Excel"
              />
              <div className="text-gray-700">
                {isDragActive ? (
                  "ปล่อยไฟล์ที่นี่"
                ) : (
                  <>
                    ลากและวางไฟล์ที่นี่ หรือ{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-main underline"
                    >
                      เลือกไฟล์
                    </button>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-500">
                รองรับไฟล์: XLS, XLSX, CSV • ขนาดสูงสุด: 25 MB
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleExcelPick}
          />
          {excelFile && (
            <div className="text-sm">
              ไฟล์ที่เลือก:{" "}
              <span className="font-medium">{excelFile.name}</span>
            </div>
          )}

          {/* Template card */}
          <div className="w-full flex flex-col gap-2 border rounded-lg p-4 bg-white">
            <div className="flex items-start gap-2 flex-col">
              <img
                className=" w-[24px] h-[24px]"
                src="/images/microsoft-excel-icon.png"
                alt="ไอคอน Excel"
              />
              <div>
                <div className="font-semibold">เทมเพลต</div>
                <div className="text-sm text-gray-600">
                  ดาวน์โหลดเทมเพลตเพื่อใช้เป็นจุดเริ่มต้นสำหรับไฟล์ของคุณ
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-[124px] px-3 py-2 text-sm rounded-md bg-white border hover:bg-gray-50"
              onClick={downloadTemplate}
            >
              ดาวน์โหลด
            </button>
          </div>

          {transformErrors.length > 0 && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
              ตรวจพบปัญหา {transformErrors.length} รายการ
              ข้อมูลบางบรรทัดไม่ครบถ้วน
            </div>
          )}
          {previewRows.length > 0 && (
            <div>
              <div className="font-semibold mb-2">
                ตัวอย่างข้อมูล (สูงสุด 10 แถวแรก)
              </div>

              <div className="min-w-0">
                <div className="w-full max-w-full min-w-0 max-h-[60vh] overflow-x-auto overflow-y-auto border rounded">
                  <Table.Root className="w-full bg-white rounded-md text-sm">
                    <Table.Header className="sticky top-0 z-0">
                      <Table.Row className="text-left bg-main text-white sticky top-0 z-10 whitespace-nowrap">
                        {previewHeaders.map((k) => (
                          <Table.ColumnHeaderCell
                            key={k}
                            className="h-6 px-2 py-1 max-w-[240px]"
                          >
                            <div className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {headerLabel(k)}
                            </div>
                          </Table.ColumnHeaderCell>
                        ))}
                        <Table.ColumnHeaderCell className="h-6 px-2 py-1">
                          สถานะ
                        </Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {previewRows.map((row, idx) => {
                        const err = transformErrors.find(
                          (e) => e.index === idx
                        );
                        const rk = rowKey(row);
                        return (
                          <Table.Row
                            key={rk}
                            className={`${
                              err ? "bg-red-50" : ""
                            } hover:bg-gray-50 whitespace-nowrap`}
                          >
                            {previewHeaders.map((k) => (
                              <Table.Cell
                                key={`${rk}-${k}`}
                                className="h-10 p-2 border border-gray-300 align-top max-w-[240px]"
                              >
                                <div
                                  className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap"
                                  title={toDisplay(row[k])}
                                >
                                  {toDisplay(row[k])}
                                </div>
                              </Table.Cell>
                            ))}
                            <Table.Cell className="h-10 p-2 border border-gray-300 align-top">
                              {err ? (
                                <div className="text-red-600">
                                  <div>ผิดพลาด</div>
                                  <div className="text-[11px] leading-snug whitespace-normal break-words max-w-[260px]">
                                    {err.message}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-green-600">
                                  พร้อมนำเข้า
                                </span>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogComponent>

      {/* Delete confirm */}
      <DialogComponent
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        title="ยืนยันการลบ"
        onConfirm={confirmDelete}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p className="font-bold text-lg">
          คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?
        </p>
        <p>
          ชื่อ :{" "}
          <span className="text-red-500">
            {selectedItem?.first_name} {selectedItem?.last_name}
          </span>
        </p>
      </DialogComponent>
    </div>
  );
}
