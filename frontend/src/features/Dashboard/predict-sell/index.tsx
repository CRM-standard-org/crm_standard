import { useState } from "react";
import SalesForecastTable from "@/components/customs/display/forcast.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { FiLayers } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlinePerson } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import Buttons from "@/components/customs/button/button.main.component";
import {
  useSalesAnalyticsYears,
  useBusinessLevelAnalytics,
  useTeamLevelAnalytics,
  usePersonalLevelAnalytics,
} from "@/hooks/useSalesAnalytics";
import { Box, Flex, Text} from "@radix-ui/themes";
import PaginationComponent from "@/components/customs/paginations/PaginationComponent";

export type RowType = {
  label: string;
  values: (string | number)[];
};

export type HeaderConfig = {
  key: string;
  year: string;
  title: React.ReactNode;
  quartile: string[];
  months: string[];
};

//
export default function PredictSell() {
  const currentBuddhistYear = new Date().getFullYear() + 543;
  const [selectedYear, setSelectedYear] = useState<number | null>(
    currentBuddhistYear
  );

  // Pagination states
  const [pageTeam, setPageTeam] = useState(1);
  const [pageSizeTeam, setPageSizeTeam] = useState(10);
  const [pagePersonal, setPagePersonal] = useState(1);
  const [pageSizePersonal, setPageSizePersonal] = useState(10);

  // Pagination handlers
  const handlePageTeamChange = (newPage: number) => {
    setPageTeam(newPage);
  };

  const handlePageSizeTeamChange = (newPageSize: number) => {
    setPageTeam(1); // Reset to first page
    setPageSizeTeam(newPageSize);
  };

  // Pagination handlers
  const handlePagePersonalChange = (newPage: number) => {
    setPagePersonal(newPage);
  };

  const handlePageSizePersonalChange = (newPageSize: number) => {
    setPagePersonal(1); // Reset to first page
    setPageSizePersonal(newPageSize);
  };

  // Get available years
  const { data: yearsData } = useSalesAnalyticsYears();

  // Get analytics data based on selected year with pagination
  const { data: businessData } = useBusinessLevelAnalytics({
    year: selectedYear || currentBuddhistYear,
  });
  const { data: teamData } = useTeamLevelAnalytics({
    year: selectedYear || currentBuddhistYear,
    page: pageTeam.toString(),
    pageSize: pageSizeTeam.toString(),
  });
  const { data: personalData } = usePersonalLevelAnalytics({
    year: selectedYear || currentBuddhistYear,
    page: pagePersonal.toString(),
    pageSize: pageSizePersonal.toString(),
  });

  //fetch year dropdown data from API
  const fetchDataYearDropdown = async () => {
    if (yearsData?.responseObject) {
      return {
        responseObject: yearsData.responseObject,
      };
    }
    return {
      responseObject: [],
    };
  };

  const handleYearSearch = () => {
    // Handle year search if needed
  };

  const [active, setActive] = useState<string[]>([
    "personal",
    "team",
    "business",
  ]);

  const levels = [
    { key: "business", label: "ระดับกิจการ" },
    { key: "team", label: "ระดับทีม" },
    { key: "personal", label: "ระดับบุคคล" },
  ];

  const toggleLevel = (key: string) => {
    setActive((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Transform business data to table format
  const businessHeader: HeaderConfig = {
    key: "salesForecast2024",
    year: selectedYear?.toString() || "2024",
    title: (
      <div className="flex flex-row gap-2">
        <FiLayers style={{ fontSize: "22px" }} />
        ระดับกิจการ
      </div>
    ),
    quartile: ["Q1", "Q2", "Q3", "Q4"].map(
      (q) => `${q}/${selectedYear || 2024}`
    ),
    months: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
  };

  const businessRows: RowType[] = businessData?.responseObject
    ? [
        {
          label: "เป้าหมายยอดขาย",
          values: [
            Math.round(businessData.responseObject.totalSales * 1.15), // เป้าหมาย +15%
            ...businessData.responseObject.monthlyData.map((m) =>
              Math.round(m.totalSales * 1.15)
            ),
          ],
        },
        {
          label: "ยอดขายจริง",
          values: [
            businessData.responseObject.totalSales,
            ...businessData.responseObject.monthlyData.map((m) => m.totalSales),
          ],
        },
        {
          label: "ยอดขายสำเร็จ",
          values: [
            businessData.responseObject.monthlyData.reduce(
              (sum, m) => sum + m.completedSales,
              0
            ),
            ...businessData.responseObject.monthlyData.map(
              (m) => m.completedSales
            ),
          ],
        },
        {
          label: "% ความสำเร็จเทียบเป้า",
          values: [
            businessData.responseObject.totalSales > 0
              ? Math.round(
                  (businessData.responseObject.totalSales /
                    (businessData.responseObject.totalSales * 1.15)) *
                    100
                )
              : 0,
            ...businessData.responseObject.monthlyData.map((m) =>
              m.totalSales > 0
                ? Math.round((m.totalSales / (m.totalSales * 1.15)) * 100)
                : 0
            ),
          ],
        },
        {
          label: "ยอดต่างจากเป้าหมาย",
          values: [
            Math.round(
              businessData.responseObject.totalSales * 1.15 -
                businessData.responseObject.totalSales
            ),
            ...businessData.responseObject.monthlyData.map((m) =>
              Math.round(m.totalSales * 1.15 - m.totalSales)
            ),
          ],
        },
      ]
    : [];

  // Transform team data to table format
  const teamHeader: HeaderConfig = {
    key: "salesForecast2024",
    year: selectedYear?.toString() || "2024",
    title: (
      <div className="flex flex-row gap-2">
        <HiOutlineUserGroup style={{ fontSize: "22px" }} />
        ระดับทีม
      </div>
    ),
    quartile: ["Q1", "Q2", "Q3", "Q4"].map(
      (q) => `${q}/${selectedYear || 2024}`
    ),
    months: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
  };

  const teamRows: RowType[] = teamData?.responseObject?.data
    ? teamData.responseObject.data.flatMap((team) => [
        {
          label: `${team.team_name} - ยอดขายรวม`,
          values: [
            team.totalSales,
            ...team.monthlyData.map((m) => m.totalSales),
          ],
        },
        {
          label: `${team.team_name} - ยอดขายสำเร็จ`,
          values: [
            team.monthlyData.reduce((sum, m) => sum + m.completedSales, 0),
            ...team.monthlyData.map((m) => m.completedSales),
          ],
        },
        {
          label: `${team.team_name} - ยอดขายรอดำเนินการ`,
          values: [
            team.monthlyData.reduce((sum, m) => sum + m.pendingSales, 0),
            ...team.monthlyData.map((m) => m.pendingSales),
          ],
        },
        {
          label: `${team.team_name} - จำนวนออเดอร์`,
          values: [
            team.monthlyData.reduce((sum, m) => sum + m.totalOrdersCount, 0),
            ...team.monthlyData.map((m) => m.totalOrdersCount),
          ],
        },
      ])
    : [];

  // Transform personal data to table format
  const personalHeader: HeaderConfig = {
    key: "salesForecast2024",
    year: selectedYear?.toString() || "2024",
    title: (
      <div className="flex flex-row gap-2">
        <MdOutlinePerson style={{ fontSize: "22px" }} />
        ระดับบุคคล
      </div>
    ),
    quartile: ["Q1", "Q2", "Q3", "Q4"].map(
      (q) => `${q}/${selectedYear || 2024}`
    ),
    months: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
  };

  const personalRows: RowType[] = personalData?.responseObject?.data
    ? personalData.responseObject.data.flatMap((person) => [
        {
          label: `${person.employee_name} - ยอดขายรวม`,
          values: [
            person.totalSales,
            ...person.monthlyData.map((m) => m.totalSales),
          ],
        },
        {
          label: `${person.employee_name} - ยอดขายสำเร็จ`,
          values: [
            person.monthlyData.reduce((sum, m) => sum + m.completedSales, 0),
            ...person.monthlyData.map((m) => m.completedSales),
          ],
        },
        {
          label: `${person.employee_name} - ยอดขายรอดำเนินการ`,
          values: [
            person.monthlyData.reduce((sum, m) => sum + m.pendingSales, 0),
            ...person.monthlyData.map((m) => m.pendingSales),
          ],
        },
        {
          label: `${person.employee_name} - จำนวนออเดอร์`,
          values: [
            person.monthlyData.reduce((sum, m) => sum + m.totalOrdersCount, 0),
            ...person.monthlyData.map((m) => m.totalOrdersCount),
          ],
        },
      ])
    : [];

  const handleEditPrediction = () => {};

  console.log("teamData", teamData);
  return (
    <div className="lg:w-full m-auto">
      {/* Header */}
      <Flex justify={"between"}>
        <Text size="6" weight="bold" className="text-center whitespace-nowrap">
          คาดการณ์ยอดขาย
        </Text>
      </Flex>

      <Box className="w-full mt-4 bg-white border-0 rounded-md relative p-6 shadow-md">
        {/* Controls */}
        <Flex className="w-full mb-5" justify={"start"} gap="2" wrap="wrap">
          {/* Year Selection */}
          <MasterSelectComponent
            id="year"
            onChange={(option) =>
              setSelectedYear(option ? Number(option.value) : null)
            }
            fetchDataFromGetAPI={fetchDataYearDropdown}
            onInputChange={handleYearSearch}
            valueKey="id"
            labelKey="name"
            placeholder="เลือกปี พ.ศ."
            defaultValue={{
              id: currentBuddhistYear,
              name: currentBuddhistYear.toString(),
              value: currentBuddhistYear,
              label: currentBuddhistYear.toString(),
            }}
            isClearable
            label=""
            labelOrientation="horizontal"
            classNameLabel="w-1/2"
            classNameSelect="w-full min-w-40"
          />
        </Flex>

        {/* Level toggles */}
        <Flex className="w-full mb-5" justify={"start"} gap="2" wrap="wrap">
          {levels.map((level) => (
            <Buttons
              key={level.key}
              btnType="primary"
              onClick={() => toggleLevel(level.key)}
              className={`px-4 py-2 rounded-md transition-colors ${
                active.includes(level.key)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {active.includes(level.key) && <FaCheck size={14} />}
                {level.label}
              </div>
            </Buttons>
          ))}
        </Flex>

        {/* Analytics Tables */}
        <div className="space-y-6">
          {active.includes("business") && (
            <div>
              <h2 className="text-lg font-semibold mb-4">ระดับกิจการ</h2>
              {businessData?.responseObject ? (
                <SalesForecastTable
                  header={businessHeader}
                  rows={businessRows}
                  handleEditPrediction={handleEditPrediction}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  กรุณาเลือกปีเพื่อดูข้อมูล
                </div>
              )}
            </div>
          )}

          {active.includes("team") && (
            <div>
              <h2 className="text-lg font-semibold mb-4">ระดับทีม</h2>
              {teamData?.responseObject?.data &&
              teamData.responseObject.data.length > 0 ? (
                <>
                  <SalesForecastTable header={teamHeader} rows={teamRows} />
                  {/* Pagination */}
                  <PaginationComponent
                    currentPage={teamData.responseObject.currentPage}
                    totalPages={teamData.responseObject.totalPages}
                    totalCount={teamData.responseObject.totalCount}
                    itemsPerPage={pageSizeTeam}
                    onPageChange={handlePageTeamChange}
                    onPageSizeChange={handlePageSizeTeamChange}
                  />
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  ไม่มีข้อมูลทีมสำหรับปีนี้
                </div>
              )}
            </div>
          )}

          {active.includes("personal") && (
            <div>
              <h2 className="text-lg font-semibold mb-4">ระดับบุคคล</h2>
              {personalData?.responseObject?.data &&
              personalData.responseObject.data.length > 0 ? (
                <>
                  <SalesForecastTable
                    header={personalHeader}
                    rows={personalRows}
                  />
                  {/* Pagination */}
                  <PaginationComponent
                    currentPage={personalData.responseObject.currentPage}
                    totalPages={personalData.responseObject.totalPages}
                    totalCount={personalData.responseObject.totalCount}
                    itemsPerPage={pageSizePersonal}
                    onPageChange={handlePagePersonalChange}
                    onPageSizeChange={handlePageSizePersonalChange}
                  />
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  ไม่มีข้อมูลพนักงานสำหรับปีนี้
                </div>
              )}
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}
