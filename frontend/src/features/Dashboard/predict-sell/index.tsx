import { useEffect, useState } from "react";

import { useToast } from "@/components/customs/alert/ToastContext";

//
import { useNavigate, useSearchParams } from "react-router-dom";

import SalesForecastTable from "@/components/customs/display/forcast.main.component";

import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { FiLayers } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlinePerson } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { Button } from "@radix-ui/themes";
import Buttons from "@/components/customs/button/button.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";

export type RowType = {
  label: string;
  values: (string | number)[];
};

export type HeaderConfig = {
  key: string;
  year: string;
  title: any;
  quartile: string[];
  months: string[];
};

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllCustomerResponse; //ตรงนี้
}[];

//
export default function PredictSell() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);
  const [year, setYear] = useState<string | null>(null);
  const [searchYear, setSearchYear] = useState("");

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  //fetch year
  const fetchDataYearDropdown = async () => {
    return {
      responseObject: [
        { id: 1, name: "2566" },
        { id: 2, name: "2567" },
        { id: 3, name: "2568" },
        { id: 4, name: "2569" },
      ],
    }
  }
  const handleYearSearch = (searchText: string) => {
    setSearchYear(searchText);
  }
  const [active, setActive] = useState<string[]>(
    ["personal", "team", "business"]
  );
  const levels = [
    { key: "business", label: "ระดับกิจการ" },
    { key: "team", label: "ระดับทีม" },
    { key: "personal", label: "ระดับบุคคล" },
  ];

  const toggleLevel = (key: string) => {
    setActive((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };
  //mockdata
  const businessHeader: HeaderConfig = {
    key: "sale2024",
    year: "2024",
    title: (
      <div className="flex flex-row gap-2">
        <FiLayers style={{ fontSize: "22px" }} />
        ระดับกิจการ
      </div>
    ),
    quartile: ["Q1/2024", "Q2/2024", "Q3/2024", "Q4/2024"],
    months: [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ]
  };

  const businessRows: RowType[] = [
    {
      label: "เป้าหมาย",
      values: [
        10875181, 916859, 844316, 855697, 872106, 916769,
        904125, 856576, 980155, 836722, 955851, 950295, 985710
      ]
    },
    {
      label: "ยอดขายจริง",
      values: [
        10403495, 859837, 827474, 805669, 782765, 879842,
        941068, 781089, 999466, 744191, 980393, 863313, 938388
      ]
    },
    {
      label: "% เทียบเป้าหมาย",
      values: [
        95.66, 93.78, 98.01, 94.15, 89.76, 95.97,
        104.09, 91.19, 101.97, 88.94, 102.57, 90.85, 95.29
      ]
    },
    {
      label: "ยอดต่างจากเป้าหมาย",
      values: [
        471686, 57022, 16842, 50028, 89341, 36927,
        0, 75487, 0, 92531, 0, 86982, 47327
      ]
    }
  ];
  const teamHeader: HeaderConfig = {
    key: "sale2024",
    year: "2024",
    title: (
      <div className="flex flex-row gap-2">
        <HiOutlineUserGroup style={{ fontSize: "22px" }} />
        ระดับทีม
      </div>
    ),
    quartile: ["Q1/2024", "Q2/2024", "Q3/2024", "Q4/2024"],
    months: [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ]
  };

  const teamRows: RowType[] = [
    {
      label: "ทีม A",
      values: [
        5291399, 468169, 439749, 387895, 432342, 504223,
        478456, 385459, 441070, 376525, 432517, 427633, 517361
      ]
    },
    {
      label: "ยอดขายจริง",
      values: [
        5065992, 439053, 430977, 365217, 388052, 483913,
        498006, 351490, 449768, 334886, 443623, 388491, 492882
      ]
    },
    {
      label: "% เทียบเป้าหมาย",
      values: [
        95.74, 93.78, 98.01, 94.15, 89.76, 95.97,
        104.09, 91.19, 101.97, 88.94, 102.57, 90.85, 95.29
      ]
    },
    {
      label: "ยอดต่างจากเป้าหมาย",
      values: [
        225407, 29116, 8772, 22678, 44299, 20310,
        0, 33969, 0, 41639, 0, 39142, 24479
      ]
    }
  ];

  const personalHeader: HeaderConfig = {
    key: "sale2024",
    year: "2024",
    title: (
      <div className="flex flex-row gap-2">
        <MdOutlinePerson style={{ fontSize: "22px" }} />
        ระดับบุคคล
      </div>
    ),
    quartile: ["Q1/2024", "Q2/2024", "Q3/2024", "Q4/2024"],
    months: [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ]
  };

  const personalRows: RowType[] = [
    // === ทีม A ===
    { label: "ทีม A", values: [5291399, 468169, 439749, 387895, 432342, 504223, 478456, 385459, 441070, 376525, 385459, 441070, 376525] },

    { label: "นายจอมปราชญ์ รักโลก", values: [2642616, 274284, 271456, 219389, 405268, 6351, 247876, 344240, 341476, 29324, 344240, 341476, 29324] },
    { label: "ยอดขายจริง", values: [2546797, 257151, 266041, 206562, 363751, 6095, 258005, 313983, 348293, 26081, 313983, 348293, 26081] },
    { label: "% เทียบเป้าหมาย", values: [96.37, 93.78, 98.01, 94.15, 89.76, 95.97, 104.09, 91.19, 101.97, 88.94, 91.19, 101.97, 88.94] },
    { label: "ยอดต่างจากคาดการณ์", values: [95819, 17053, 5415, 12827, 41517, 256, 0, 30337, 0, 3243, 30337, 0, 3243] },

    { label: "นางนาคี มีปัญญา", values: [2648783, 193965, 168293, 168506, 27074, 497872, 230580, 41219, 99594, 347201, 41219, 99594, 347201] },
    { label: "ยอดขายจริง", values: [2519195, 181982, 164936, 158655, 24301, 477818, 240001, 37587, 101557, 308805, 37587, 101557, 308805] },
    { label: "% เทียบเป้าหมาย", values: [95.11, 93.78, 98.01, 94.15, 89.76, 95.97, 104.09, 91.19, 101.97, 88.94, 91.19, 101.97, 88.94] },
    { label: "ยอดต่างจากคาดการณ์", values: [129588, 12063, 3357, 9851, 2773, 20054, 0, 3632, 0, 38396, 0, 3632, 0] },

    // === ทีม B ===
    { label: "ทีม B", values: [5583782, 448690, 404567, 467802, 439764, 412546, 425669, 471117, 539085, 460197, 471117, 539085, 460197] },

    { label: "นายเมฆ อับปาลี", values: [2072093, 372254, 89754, 69318, 8506, 864, 324706, 324968, 219757, 47761, 324968, 219757, 47761] },
    { label: "ยอดขายจริง", values: [2000977, 349102, 87964, 65265, 7634, 829, 337974, 296323, 224087, 42479, 296323, 224087, 42479] },
    { label: "% เทียบเป้าหมาย", values: [96.57, 93.78, 98.01, 94.15, 89.76, 95.97, 104.09, 91.19, 101.97, 88.94, 104.09, 91.19, 101.97] },
    { label: "ยอดต่างจากคาดการณ์", values: [71116, 23152, 1790, 4053, 872, 35, 0, 28637, 0, 5282, 28637, 0, 5282] },

    { label: "นายนา อับบานา", values: [3511689, 76436, 314813, 398484, 431258, 411682, 100963, 146157, 319328, 412436, 146157, 319328, 412436] },
    { label: "ยอดขายจริง", values: [3336526, 71682, 308533, 375187, 387079, 395100, 105088, 133276, 325619, 366826, 133276, 325619, 366826] },
    { label: "% เทียบเป้าหมาย", values: [95.01, 93.78, 98.01, 94.15, 89.76, 95.97, 104.09, 91.19, 101.97, 88.94, 91.19, 101.97, 91.19] },
    { label: "ยอดต่างจากคาดการณ์", values: [175163, 4754, 6280, 23297, 44179, 16582, 0, 12881, 0, 45610, 0, 12881, 0] }
  ];
  //
  const headers = [
    { label: "สถานะ", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้า", colSpan: 1, className: "w-auto" },
    { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "w-auto" },
    { label: "ความสำคัญ", colSpan: 1, className: "w-auto " },
    { label: "บทบาทของลูกค้า", colSpan: 1, className: "w-auto" },
    { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
    { label: "ทีม", colSpan: 1, className: "w-auto" },
    { label: "กิจกรรมล่าสุด", colSpan: 1, className: "w-auto" },
    { label: "ดูรายละเอียด", colSpan: 1, className: "w-auto" },
    { label: "ลบ", colSpan: 1, className: "w-auto" },
  ];

  //tabs บน headertable
  const groupTabs = [
    "ลูกค้าทั้งหมด",
    "ลูกค้าเป้าหมาย",
    "ลูกค้าประจำ",
    "ลูกค้าใหม่",
    "ลูกค้าห่างหาย",
  ];


  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <p className="text-2xl font-bold whitespace-nowrap">คาดการณ์ยอดขาย</p>

        <div className="min-w-[150px]">
          <MasterSelectComponent
            id="character"
            onChange={(option) => setYear(option ? String(option.value) : null)}
            fetchDataFromGetAPI={fetchDataYearDropdown}
            onInputChange={handleYearSearch}
            valueKey="id"
            labelKey="name"
            placeholder="กรุณาเลือกปี"
            isClearable
            label=""
            labelOrientation="horizontal"
            classNameLabel="w-1/2"
            classNameSelect="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <Buttons
              key={level.key}
              btnType="primary"
              variant="outline"
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm border 
          ${active.includes(level.key)
                  ? "bg-main text-white border-blue-700"
                  : "bg-gray-200 text-gray-700 border-gray-400"}`}
              onClick={() => toggleLevel(level.key)}
            >
              {active.includes(level.key) && <FaCheck className="text-white text-xs" />}
              {level.label}
            </Buttons>
          ))}
        </div>
      </div>

      <div className="lg:p-5">
        {active.includes("business") && <SalesForecastTable header={businessHeader} rows={businessRows} />}
        {active.includes("team") && <SalesForecastTable header={teamHeader} rows={teamRows} />}
        {active.includes("personal") && <SalesForecastTable header={personalHeader} rows={personalRows} />}
      </div>
    </div>
  );
}
