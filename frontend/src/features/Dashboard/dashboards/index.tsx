import { useState } from "react";

import MasterSelectComponent from "@/components/customs/select/select.main.component";

import { Table } from "@radix-ui/themes";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAllCustomer } from "@/hooks/useCustomer";
import { TypeAllCustomerResponse } from "@/types/response/response.customer";

// Lifecycle configuration constants (can move to config later)
const FIRST_WINDOW_DAYS = 30; // วันสำหรับลูกค้าใหม่หลังออเดอร์สำเร็จแรก
const INACTIVE_DAYS = 60; // วันไม่มีออเดอร์เพื่อจัดเป็นห่างหาย

const diffInDays = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

const classifyCustomer = (customer: TypeAllCustomerResponse) => {
  const successfulOrders = (customer.sale_order || [])
    .filter(o => o.sale_order_status === 'สำเร็จ')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const count = successfulOrders.length;
  if (count === 0) return 'target';
  const firstSuccess = new Date(successfulOrders[0].created_at);
  const lastSuccess = new Date(successfulOrders[successfulOrders.length - 1].created_at);
  const daysSinceFirst = diffInDays(new Date(), firstSuccess);
  const daysSinceLast = diffInDays(new Date(), lastSuccess);
  if (daysSinceLast > INACTIVE_DAYS) return 'lost';
  if (count >= 2) return 'regular';
  if (count === 1 && daysSinceFirst <= FIRST_WINDOW_DAYS) return 'new';
  return 'new';
};

const COLORS = ["#00C851", "#ffbb33", "#FF4444", "#66CCFF", "#3399FF"]; // เขียว, เหลือง, แดง สำหรับสถานะการขาย

// Helper functions for calculating KPIs
const calculateCustomerStatusChanges = (
  customers: TypeAllCustomerResponse[]
) => {
  let targetCustomers = 0;
  let newCustomers = 0;
  let regularCustomers = 0;
  let lostCustomers = 0;

  customers.forEach(customer => {
    const status = classifyCustomer(customer);
    if (status === 'target') targetCustomers++;
    else if (status === 'new') newCustomers++;
    else if (status === 'regular') regularCustomers++;
    else if (status === 'lost') lostCustomers++;
  });

  return { newCustomers, regularCustomers, lostCustomers, targetCustomers };
};

const calculateQuarterlySales = (customers: TypeAllCustomerResponse[]) => {
  // คำนวณยอดขายจริงจาก sale orders ที่มีสถานะสำเร็จ
  const currentYear = new Date().getFullYear();
  const quarterlySales = [
    { name: "Q1", value: 0 },
    { name: "Q2", value: 0 },
    { name: "Q3", value: 0 },
    { name: "Q4", value: 0 },
  ];

  customers.forEach((customer) => {
    customer.sale_order?.forEach((saleOrder) => {
      const orderDate = new Date(saleOrder.created_at);
      const orderYear = orderDate.getFullYear();

      // เฉพาะออเดอร์ในปีปัจจุบันและมีสถานะสำเร็จ (ใช้สถานะภาษาไทย)
      if (
        orderYear === currentYear &&
        saleOrder.sale_order_status === "สำเร็จ"
      ) {
        const month = orderDate.getMonth() + 1; // 1-12
        const quarterIndex = Math.ceil(month / 3) - 1; // 0-3

        quarterlySales[quarterIndex].value +=
          parseFloat(saleOrder.grand_total) || 0;
      }
    });
  });

  return quarterlySales;
};

const calculateClosingRate = (customers: TypeAllCustomerResponse[]) => {
  // คำนวณอัตราการปิดการขายจาก quotations และ sale orders
  let totalQuotations = 0;
  let successfulSales = 0;
  let pendingSales = 0;
  let failedQuotations = 0;

  customers.forEach((customer) => {
    console.log("Calculating for customer:", customer);
    totalQuotations += customer.sale_order?.length || 0;
    customer.sale_order?.forEach((saleOrder) => {
      // เช็คว่า quotation นี้มี sale order ที่สำเร็จไหม
      const hasSaleOrder = saleOrder.sale_order_status === "สำเร็จ";

      // เช็คว่า quotation นี้มี sale order ที่รออยู่ไหม
      const hasPendingSaleOrder =
        saleOrder.sale_order_status === "ระหว่างดำเนินการ";

      if (hasSaleOrder) {
        successfulSales += 1;
      } else if (hasPendingSaleOrder) {
        pendingSales += 1;
      } else {
        failedQuotations += 1;
      }
    });
  });

  const successRate =
    totalQuotations > 0 ? (successfulSales / totalQuotations) * 100 : 0;
  const pendingRate =
    totalQuotations > 0 ? (pendingSales / totalQuotations) * 100 : 0;
  const failedRate =
    totalQuotations > 0 ? (failedQuotations / totalQuotations) * 100 : 0;

  return [
    { name: "ปิดการขายสำเร็จ", value: Math.round(successRate * 10) / 10 },
    { name: "รอการปิดการขาย", value: Math.round(pendingRate * 10) / 10 },
    { name: "ปิดการขายไม่สำเร็จ", value: Math.round(failedRate * 10) / 10 },
  ];
};

const calculateProductShareBySales = (customers: TypeAllCustomerResponse[]) => {
  // คำนวณสัดส่วนกลุ่มสินค้าตามปิดการขาย (จาก sale orders ที่สำเร็จ)
  const productSalesMap = new Map<string, number>();

  customers.forEach((customer) => {
    customer.sale_order?.forEach((saleOrder) => {
      // เฉพาะออเดอร์ที่สำเร็จ (ใช้สถานะภาษาไทย)
      if (saleOrder.sale_order_status === "สำเร็จ") {
        saleOrder.sale_order_product?.forEach((item) => {
          const groupName = item.group_product.group_product_name;
          const currentValue = productSalesMap.get(groupName) || 0;
          productSalesMap.set(
            groupName,
            currentValue + (parseFloat(item.sale_order_item_price) || 0)
          );
        });
      }
    });
  });

  // คำนวณเปอร์เซ็นต์
  const totalSales = Array.from(productSalesMap.values()).reduce(
    (sum, value) => sum + value,
    0
  );

  if (totalSales === 0) {
    return [{ name: "ไม่มีข้อมูลการขาย", value: 100 }];
  }

  const shareData = Array.from(productSalesMap.entries())
    .map(([name, value]) => ({
      name,
      value: Math.round((value / totalSales) * 1000) / 10,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5

  return shareData;
};

const calculateProductShareByQuotations = (
  customers: TypeAllCustomerResponse[]
) => {
  // คำนวณสัดส่วนกลุ่มสินค้าตามข้อเสนอ (จาก quotations ทั้งหมด)
  const productQuotationsMap = new Map<string, number>();

  customers.forEach((customer) => {
    customer.quotation?.forEach((quotation) => {
      quotation.quotation_products?.forEach((item) => {
        const groupName = item.group_product.group_product_name;
        const currentValue = productQuotationsMap.get(groupName) || 0;
        productQuotationsMap.set(
          groupName,
          currentValue + (parseFloat(item.quotation_item_price) || 0)
        );
      });
    });
  });

  // คำนวณเปอร์เซ็นต์
  const totalQuotations = Array.from(productQuotationsMap.values()).reduce(
    (sum, value) => sum + value,
    0
  );

  if (totalQuotations === 0) {
    return [{ name: "ไม่มีข้อมูลข้อเสนอ", value: 100 }];
  }

  const shareData = Array.from(productQuotationsMap.entries())
    .map(([name, value]) => ({
      name,
      value: Math.round((value / totalQuotations) * 1000) / 10,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5

  return shareData;
};

//
export default function Dashboards() {
  const currentBuddhistYear = new Date().getFullYear() + 543; // ปีปัจจุบันในปี พ.ศ.
  const [year, setYear] = useState<string | null>(
    currentBuddhistYear.toString()
  );

  const { data: dataAllCustomer, isLoading: isLoadingCustomers } =
    useAllCustomer({
      payload: {
        start_date: year ? `${parseInt(year) - 543}-01-01` : null, // Convert Buddhist year to Gregorian
        end_date: year ? `${parseInt(year) - 543}-12-31` : null,
        responsible_id: null,
        tag_id: null,
        team_id: null,
      },
    });

  // Calculate KPIs from real data
  const customers = dataAllCustomer?.responseObject?.data || [];
  const customerStatusChanges = calculateCustomerStatusChanges(customers);
  const quarterlySalesData = calculateQuarterlySales(customers);
  const closingRateData = calculateClosingRate(customers);
  const productShareData = calculateProductShareBySales(customers); // ใช้ข้อมูลจาก sale orders
  const proposalShareData = calculateProductShareByQuotations(customers); // ใช้ข้อมูลจาก quotations

  //fetch year
  const fetchDataYearDropdown = async () => {
    const currentYear = new Date().getFullYear() + 543; // แปลงเป็นปี พ.ศ.
    const startYear = 2568; // เริ่มจากปี 2568

    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push({ id: year, name: year.toString() });
    }

    return {
      responseObject: years,
    };
  };

  const handleYearSearch = (searchText: string) => {
    // Can be used for filtering year options if needed
    console.log("Year search:", searchText);
  };

  // Generate monthly data from customer status changes
  const generateMonthlyData = () => {
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const monthStart = new Date(currentYear, index, 1);
      const monthEnd = new Date(currentYear, index + 1, 1);

      let monthlyNew = 0;
      let monthlyRegular = 0;
      let monthlyLost = 0;
      let monthlyTarget = 0;

      customers.forEach(customer => {
        const successfulOrders = (customer.sale_order || [])
          .filter(o => o.sale_order_status === 'สำเร็จ')
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const count = successfulOrders.length;

        const firstSuccess = count ? new Date(successfulOrders[0].created_at) : null;
        const lastSuccess = count ? new Date(successfulOrders[count - 1].created_at) : null;

        // Target: no successful orders and created in this month
        if (count === 0) {
          const created = new Date(customer.created_at);
            if (created >= monthStart && created < monthEnd) monthlyTarget++;
        }

        // New: first success this month within FIRST_WINDOW_DAYS
        if (firstSuccess && firstSuccess >= monthStart && firstSuccess < monthEnd) {
          const daysSinceFirstAtEnd = diffInDays(monthEnd, firstSuccess);
          if (count === 1 && daysSinceFirstAtEnd <= FIRST_WINDOW_DAYS) monthlyNew++;
        }

        // Regular: has >=2 successes and last success in this month (active)
        if (count >= 2 && lastSuccess && lastSuccess >= monthStart && lastSuccess < monthEnd) {
          monthlyRegular++;
        }

        // Lost: had successes before but inactive by end of month
        if (count > 0 && lastSuccess && lastSuccess < monthStart) {
          const daysSinceLastAtEnd = diffInDays(monthEnd, lastSuccess);
          if (daysSinceLastAtEnd > INACTIVE_DAYS) monthlyLost++;
        }
      });

      return {
        className: '',
        cells: [
          { value: month, className: 'text-center' },
          { value: `+${monthlyNew}`, className: 'text-center' },
          { value: `+${monthlyRegular}`, className: 'text-center' },
          { value: `+${monthlyLost}`, className: 'text-center' },
          { value: `+${monthlyTarget}`, className: 'text-center' },
        ],
        data: {}
      };
    });
  };

  const monthlyData = generateMonthlyData();

  // Show loading state
  if (isLoadingCustomers) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }
  const headers = [
    { label: "รายเดือน", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้าใหม่", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้าประจำ", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้าห่างหาย", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้าเป้าหมาย", colSpan: 1, className: "w-auto" },
  ];

  return (
    <>
      <div className="flex mb-3 flex-row items-center justify-between">
        <p className="me-2  text-2xl font-bold">ติดตามตัวชี้วัดสำคัญ</p>
        <div className="">
          <MasterSelectComponent
            id="character"
            onChange={(option) => setYear(option ? String(option.value) : null)}
            fetchDataFromGetAPI={fetchDataYearDropdown}
            onInputChange={handleYearSearch}
            valueKey="id"
            labelKey="name"
            placeholder="เลือกปี พ.ศ."
            defaultValue={{
              value: currentBuddhistYear,
              label: currentBuddhistYear.toString(),
            }}
            isClearable
            label=""
            classNameLabel="w-1/2"
            classNameSelect="w-full "
          />
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {customers.length}
            </div>
            <div className="text-sm text-gray-600">ลูกค้าทั้งหมด</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {customerStatusChanges.newCustomers}
            </div>
            <div className="text-sm text-gray-600">ลูกค้าใหม่</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {customerStatusChanges.regularCustomers}
            </div>
            <div className="text-sm text-gray-600">ลูกค้าประจำ</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {customerStatusChanges.targetCustomers}
            </div>
            <div className="text-sm text-gray-600">ลูกค้าเป้าหมาย</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 lg:row-span-4 bg-white rounded-xl shadow-md">
          <p className="text-xl font-semibold mb-2">
            การเปลี่ยนแปลงของสถานะลูกค้า
          </p>

          <div className="overflow-x-auto">
            <Table.Root className="w-full table-fixed bg-white rounded-md text-sm ">
              <Table.Header>
                <Table.Row className="text-center bg-main text-white whitespace-nowrap">
                  {headers.map((header, index) => (
                    <Table.ColumnHeaderCell
                      key={`header-${header.label}-${index}`}
                      colSpan={header.colSpan}
                      className={`
                                                ${
                                                  index === 0
                                                    ? "rounded-tl-md"
                                                    : ""
                                                }
                                                ${
                                                  index === headers.length - 1
                                                    ? "rounded-tr-md"
                                                    : ""
                                                }
                                                h-12 px-2 py-2 text-xs
                                            `}
                      style={{ width: `${100 / headers.length}%` }}
                    >
                      {header.label}
                    </Table.ColumnHeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {monthlyData.length > 0 ? (
                  monthlyData.map((row) => (
                    <Table.Row key={`month-row-${row.cells[0].value}`}>
                      {row.cells.map((cell, colIndex) => (
                        <Table.Cell
                          key={`month-cell-${row.cells[0].value}-${colIndex}`}
                          className="border border-gray-300 px-2 py-1 text-center text-xs truncate"
                        >
                          {cell.value}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell
                      colSpan={headers.length}
                      className="text-center h-64 align-middle border border-gray-300"
                    >
                      {isLoadingCustomers
                        ? "กำลังโหลดข้อมูล..."
                        : "ไม่พบข้อมูล"}
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </div>

        <div className="p-5 bg-white lg:row-span-2 lg:col-start-2 rounded-xl shadow-md">
          <p className="text-xl font-semibold text-center mb-2">
            ค่าเฉลี่ยยอดขายจริงแต่ละไตรมาส
          </p>
          <div className="border-b-2 border-main mb-6"></div>
          <div className="flex items-center justify-center">
            <BarChart
              width={500}
              height={200}
              data={quarterlySalesData}
              margin={{ right: 100, left: 40 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  Number(value).toLocaleString(),
                  "ยอดขาย (บาท)",
                ]}
              />
              <Bar dataKey="value" fill="#007bff" />
            </BarChart>
          </div>
        </div>
        <div className="p-5 bg-white lg:row-span-2 lg:col-start-2 lg:row-start-3 rounded-xl shadow-md">
          <p className="text-xl font-semibold text-center mb-2">
            อัตราการปิดการขาย
          </p>
          <div className="border-b-2 border-main mb-6"></div>

          {/* PieChart*/}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <PieChart width={250} height={250}>
              <Pie
                data={closingRateData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {closingRateData.map((entry, index) => (
                  <Cell
                    key={`closing-cell-${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            {/* Custom Legend */}
            <div className="flex flex-col text-lg space-y-2">
              {closingRateData.map((entry, index) => (
                <div
                  key={`closing-legend-${entry.name}-${index}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="p-5 bg-white rounded-xl shadow-md">
          <p className="text-xl font-semibold text-center mb-2">
            สัดส่วนกลุ่มสินค้าตามปิดการขาย
          </p>
          <div className="border-b-2 border-main mb-6"></div>

          {/* PieChart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <PieChart width={250} height={250}>
              <Pie
                data={productShareData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {productShareData.map((entry, index) => (
                  <Cell
                    key={`product-cell-${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            {/* Custom Legend */}
            <div className="flex flex-col text-base space-y-2">
              {productShareData.map((entry, index) => (
                <div
                  key={`product-legend-${entry.name}-${index}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-md">
          <p className="text-xl font-semibold text-center mb-2">
            สัดส่วนกลุ่มสินค้าตามข้อเสนอ
          </p>
          <div className="border-b-2 border-main mb-6"></div>
          {/* PieChart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <PieChart width={250} height={250}>
              <Pie
                data={proposalShareData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {proposalShareData.map((entry, index) => (
                  <Cell
                    key={`proposal-cell-${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            {/* Custom Legend */}
            <div className="flex flex-col text-base space-y-2">
              {proposalShareData.map((entry, index) => (
                <div
                  key={`proposal-legend-${entry.name}-${index}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
