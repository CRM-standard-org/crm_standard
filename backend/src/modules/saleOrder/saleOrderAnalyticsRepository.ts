import prisma from "../../db";

export interface SalesAnalyticsFilter {
  year?: number;
  start_date?: string;
  end_date?: string;
  team_id?: string;
  responsible_id?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface MonthlySalesData {
  month: number;
  monthName: string;
  totalSales: number;
  completedSales: number;
  pendingSales: number;
  successfulOrdersCount: number;
  totalOrdersCount: number;
}

export interface BusinessLevelData {
  year: number;
  totalSales: number;
  monthlyData: MonthlySalesData[];
}

export interface TeamLevelData {
  team_id: string;
  team_name: string;
  year: number;
  totalSales: number;
  monthlyData: MonthlySalesData[];
}

export interface PersonalLevelData {
  employee_id: string;
  employee_name: string;
  team_id: string;
  team_name: string;
  year: number;
  totalSales: number;
  monthlyData: MonthlySalesData[];
}

export interface PaginatedTeamLevelData {
  data: TeamLevelData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedPersonalLevelData {
  data: PersonalLevelData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const monthNames = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export const saleOrderAnalyticsRepository = {
  // Get available years from sale orders
  getAvailableYears: async () => {
    const years = await prisma.saleOrder.findMany({
      select: {
        issue_date: true
      },
      orderBy: {
        issue_date: 'desc'
      }
    });

    const validYears = years
      .map((item: any) => {
        if (!item.issue_date) return null;
        const year = new Date(item.issue_date).getFullYear();
        const buddhistYear = year + 543; // Convert to Buddhist Era
        return buddhistYear >= 2400 && buddhistYear <= 2700 ? buddhistYear : null;
      })
      .filter((year): year is number => year !== null);

    const uniqueYears = [...new Set(validYears)].sort((a, b) => b - a);

    return uniqueYears.map((year, index) => ({
      id: index + 1,
      name: year.toString(),
      value: year
    }));
  },

  // Business level analytics
  getBusinessLevelAnalytics: async (filter: SalesAnalyticsFilter): Promise<BusinessLevelData> => {
    const year = filter.year ? filter.year - 543 : new Date().getFullYear(); // Convert from Buddhist Era
    
    // Validate year to prevent negative years
    if (year < 1900 || year > 2100) {
      throw new Error(`Invalid year: ${year}. Please provide a valid Buddhist Era year.`);
    }
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const salesData = await prisma.saleOrder.findMany({
      where: {
        issue_date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        issue_date: true,
        grand_total: true,
        sale_order_status: true,
        sale_order_payment_log: {
          select: {
            amount_paid: true
          }
        }
      }
    });

    const monthlyData: MonthlySalesData[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthData = salesData.filter((item: any) => 
        new Date(item.issue_date).getMonth() === month
      );

      const totalSales = monthData.reduce((sum: number, item: any) => 
        sum + parseFloat(item.grand_total?.toString() || "0"), 0
      );

      const completedSales = monthData
        .filter((item: any) => item.sale_order_status === "สำเร็จ")
        .reduce((sum: number, item: any) => sum + parseFloat(item.grand_total?.toString() || "0"), 0);

      const pendingSales = monthData
        .filter((item: any) => item.sale_order_status !== "สำเร็จ")
        .reduce((sum: number, item: any) => sum + parseFloat(item.grand_total?.toString() || "0"), 0);

      monthlyData.push({
        month: month + 1,
        monthName: monthNames[month],
        totalSales,
        completedSales,
        pendingSales,
        successfulOrdersCount: monthData.filter((item: any) => item.sale_order_status === "สำเร็จ").length,
        totalOrdersCount: monthData.length
      });
    }

    const totalSales = salesData.reduce((sum: number, item: any) => 
      sum + parseFloat(item.grand_total?.toString() || "0"), 0
    );

    return {
      year: filter.year || new Date().getFullYear() + 543,
      totalSales,
      monthlyData
    };
  },

  // Team level analytics
  getTeamLevelAnalytics: async (filter: SalesAnalyticsFilter): Promise<TeamLevelData[]> => {
    const year = filter.year ? filter.year - 543 : new Date().getFullYear();
    
    // Validate year to prevent negative years
    if (year < 1900 || year > 2100) {
      throw new Error(`Invalid year: ${year}. Please provide a valid Buddhist Era year.`);
    }
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const salesData = await prisma.saleOrder.findMany({
      where: {
        issue_date: {
          gte: startDate,
          lte: endDate
        },
        ...(filter.team_id && { team_id: filter.team_id })
      },
      select: {
        issue_date: true,
        grand_total: true,
        sale_order_status: true,
        sale_order_payment_log: {
          select: {
            amount_paid: true
          }
        },
        team: {
          select: {
            team_id: true,
            name: true
          }
        }
      }
    });

    // Group by team
    const teamGroups = salesData.reduce((acc: any, item: any) => {
      const teamId = item.team?.team_id;
      const teamName = item.team?.name;
      
      if (!teamId) return acc;

      if (!acc[teamId]) {
        acc[teamId] = {
          team_id: teamId,
          team_name: teamName || "Unknown Team",
          data: []
        };
      }
      acc[teamId].data.push(item);
      return acc;
    }, {} as any);

    return Object.values(teamGroups).map((team: any) => {
      const monthlyData: MonthlySalesData[] = [];
      
      for (let month = 0; month < 12; month++) {
        const monthData = team.data.filter((item: any) => 
          new Date(item.issue_date).getMonth() === month
        );

        const totalSales = monthData.reduce((sum: number, item: any) => 
          sum + parseFloat(item.grand_total?.toString() || "0"), 0
        );

        const completedSales = monthData
          .filter((item: any) => item.sale_order_status === "สำเร็จ")
          .reduce((sum: number, item: any) => sum + parseFloat(item.grand_total?.toString() || "0"), 0);

        const pendingSales = monthData
          .filter((item: any) => item.sale_order_status !== "สำเร็จ")
          .reduce((sum: number, item: any) => sum + parseFloat(item.grand_total?.toString() || "0"), 0);

        monthlyData.push({
          month: month + 1,
          monthName: monthNames[month],
          totalSales,
          completedSales,
          pendingSales,
          successfulOrdersCount: monthData.filter((item: any) => item.sale_order_status === "สำเร็จ").length,
          totalOrdersCount: monthData.length
        });
      }

      const totalSales = team.data.reduce((sum: number, item: any) => 
        sum + parseFloat(item.grand_total?.toString() || "0"), 0
      );

      return {
        team_id: team.team_id,
        team_name: team.team_name,
        year: filter.year || new Date().getFullYear() + 543,
        totalSales,
        monthlyData
      };
    });
  },

  // Personal level analytics
  getPersonalLevelAnalytics: async (filter: SalesAnalyticsFilter): Promise<PersonalLevelData[]> => {
    const year = filter.year ? filter.year - 543 : new Date().getFullYear();
    
    // Validate year to prevent negative years
    if (year < 1900 || year > 2100) {
      throw new Error(`Invalid year: ${year}. Please provide a valid Buddhist Era year.`);
    }
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const salesData = await prisma.saleOrder.findMany({
      where: {
        issue_date: {
          gte: startDate,
          lte: endDate
        },
        ...(filter.responsible_id && { responsible_employee: filter.responsible_id }),
        ...(filter.team_id && { team_id: filter.team_id })
      },
      select: {
        issue_date: true,
        grand_total: true,
        sale_order_status: true,
        sale_order_payment_log: {
          select: {
            amount_paid: true
          }
        },
        responsible: {
          select: {
            employee_id: true,
            first_name: true,
            last_name: true,
            team_employee: {
              select: {
                team_id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Group by employee
    const employeeGroups = salesData.reduce((acc: any, item: any) => {
      const employeeId = item.responsible?.employee_id;
      const employeeName = `${item.responsible?.first_name || ""} ${item.responsible?.last_name || ""}`.trim();
      const teamId = item.responsible?.team_employee?.team_id;
      const teamName = item.responsible?.team_employee?.name;
      
      if (!employeeId) return acc;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employee_id: employeeId,
          employee_name: employeeName || "Unknown Employee",
          team_id: teamId || "",
          team_name: teamName || "Unknown Team",
          data: []
        };
      }
      acc[employeeId].data.push(item);
      return acc;
    }, {} as any);

    return Object.values(employeeGroups).map((employee: any) => {
      const monthlyData: MonthlySalesData[] = [];
      
      for (let month = 0; month < 12; month++) {
        const monthData = employee.data.filter((item: any) => 
          new Date(item.issue_date).getMonth() === month
        );

        const totalSales = monthData.reduce((sum: number, item: any) => 
          sum + parseFloat(item.grand_total?.toString() || "0"), 0
        );

        const completedSales = monthData
          .filter((item: any) => item.sale_order_status === "สำเร็จ")
          .reduce((sum: number, item: any) => sum + parseFloat(item.grand_total?.toString() || "0"), 0);

        const pendingSales = monthData
          .filter((item: any) => item.sale_order_status !== "สำเร็จ")
          .reduce((sum: number, item: any) => sum + parseFloat(item.grand_total?.toString() || "0"), 0);

        monthlyData.push({
          month: month + 1,
          monthName: monthNames[month],
          totalSales,
          completedSales,
          pendingSales,
          successfulOrdersCount: monthData.filter((item: any) => item.sale_order_status === "สำเร็จ").length,
          totalOrdersCount: monthData.length
        });
      }

      const totalSales = employee.data.reduce((sum: number, item: any) => 
        sum + parseFloat(item.grand_total?.toString() || "0"), 0
      );

      return {
        employee_id: employee.employee_id,
        employee_name: employee.employee_name,
        team_id: employee.team_id,
        team_name: employee.team_name,
        year: filter.year || new Date().getFullYear() + 543,
        totalSales,
        monthlyData
      };
    });
  },

  // Team level analytics with pagination
  getTeamLevelAnalyticsPaginated: async (filter: SalesAnalyticsFilter): Promise<PaginatedTeamLevelData> => {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const searchTerm = filter.search?.toLowerCase() || "";

    // Get all team data first
    const allTeamData = await saleOrderAnalyticsRepository.getTeamLevelAnalytics(filter);
    
    // Filter by search term if provided
    let filteredData = allTeamData;
    if (searchTerm) {
      filteredData = allTeamData.filter(team => 
        team.team_name.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination
    const totalCount = filteredData.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginatedData = filteredData.slice(skip, skip + limit);

    return {
      data: paginatedData,
      totalCount,
      currentPage: page,
      totalPages
    };
  },

  // Personal level analytics with pagination
  getPersonalLevelAnalyticsPaginated: async (filter: SalesAnalyticsFilter): Promise<PaginatedPersonalLevelData> => {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const searchTerm = filter.search?.toLowerCase() || "";

    // Get all personal data first
    const allPersonalData = await saleOrderAnalyticsRepository.getPersonalLevelAnalytics(filter);
    
    // Filter by search term if provided
    let filteredData = allPersonalData;
    if (searchTerm) {
      filteredData = allPersonalData.filter(person => 
        person.employee_name.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination
    const totalCount = filteredData.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginatedData = filteredData.slice(skip, skip + limit);

    return {
      data: paginatedData,
      totalCount,
      currentPage: page,
      totalPages
    };
  },

  // Summary sale analytics
  getSummarySale: async (filter: { start_date: string; end_date: string; tag_id?: string; team_id?: string; responsible_id?: string; }) => {
    const startDate = new Date(filter.start_date);
    const endDate = new Date(filter.end_date);
    endDate.setHours(23,59,59,999);

    const tagFilter = filter.tag_id ? { customer: { customer_tags: { some: { tag_id: filter.tag_id } } } } : {};
    const baseWhere: any = {
      issue_date: { gte: startDate, lte: endDate },
      ...(filter.team_id && { team_id: filter.team_id }),
      ...(filter.responsible_id && { responsible_employee: filter.responsible_id }),
      ...tagFilter
    };

    // Activities
    const activitiesCount = await prisma.activity.count({
      where: {
        issue_date: { gte: startDate, lte: endDate },
        ...(filter.team_id && { team_id: filter.team_id }),
        ...(filter.responsible_id && { responsible_id: filter.responsible_id }),
        ...(filter.tag_id && { customer: { customer_tags: { some: { tag_id: filter.tag_id } } } })
      }
    });

    // Sale orders in range
    const successfulStatus = "สำเร็จ";
    const salesWhere = baseWhere;

    const [successfulOrders, unsuccessfulOrders] = await Promise.all([
      prisma.saleOrder.findMany({ where: { ...salesWhere, sale_order_status: successfulStatus }, select: { grand_total: true, customer_id: true, responsible_employee: true } }),
      prisma.saleOrder.findMany({ where: { ...salesWhere, sale_order_status: { not: successfulStatus } }, select: { grand_total: true, customer_id: true, responsible_employee: true } })
    ]);

    const sale_value_successful = successfulOrders.reduce((s, o) => s + parseFloat(o.grand_total.toString()), 0);
    const sale_value_unsuccessful = unsuccessfulOrders.reduce((s, o) => s + parseFloat(o.grand_total.toString()), 0);
    const successful_sales_count = successfulOrders.length;

    // Customers new vs existing
    const newCustomersCount = await prisma.customer.count({
      where: {
        created_at: { gte: startDate, lte: endDate },
        ...(filter.tag_id && { customer_tags: { some: { tag_id: filter.tag_id } } }),
        ...(filter.team_id && { team_id: filter.team_id })
      }
    });

    const saleOrderCustomerIds = Array.from(new Set([...successfulOrders, ...unsuccessfulOrders].map(o => o.customer_id)));
    const existingCustomersCount = Math.max(saleOrderCustomerIds.length - newCustomersCount, 0);

    // Top customers (successful only)
    const customerSalesMap = new Map<string, number>();
    successfulOrders.forEach(o => {
      customerSalesMap.set(o.customer_id, (customerSalesMap.get(o.customer_id) || 0) + parseFloat(o.grand_total.toString()));
    });
    const totalSuccessfulRevenue = sale_value_successful || 1; // prevent divide by zero
    const topCustomersTemp = Array.from(customerSalesMap.entries())
      .sort((a,b) => b[1]-a[1])
      .slice(0,10);
    const customerIds = topCustomersTemp.map(c => c[0]);
    const customerRecords = await prisma.customer.findMany({ where: { customer_id: { in: customerIds } }, select: { customer_id: true, company_name: true } });
    const customerNameMap = new Map(customerRecords.map(c => [c.customer_id, c.company_name] as const));
    const top_customers = topCustomersTemp.map(([id, value], idx) => ({
      rank: idx+1,
      customer_id: id,
      company_name: customerNameMap.get(id) || "-",
      total_sales: value,
      percent: +(value / totalSuccessfulRevenue * 100).toFixed(2)
    }));

    // Top categories (successful only) via sale order items
    const itemsSuccessful = await prisma.saleOrderItem.findMany({
      where: {
        sale_order: { ...salesWhere, sale_order_status: successfulStatus }
      },
      select: { group_product_id: true, sale_order_item_price: true, group_product: { select: { group_product_id: true, group_product_name: true } } }
    });
    const categorySalesMap = new Map<string, { name: string; total: number }>();
    itemsSuccessful.forEach(it => {
      const id = it.group_product_id;
      if(!id) return;
      const gp: any = (it as any).group_product;
      const name = gp?.group_product_name || "-";
      const val = parseFloat(it.sale_order_item_price.toString());
      categorySalesMap.set(id, { name, total: (categorySalesMap.get(id)?.total || 0) + val });
    });
    const top_categories = Array.from(categorySalesMap.entries())
      .sort((a,b) => b[1].total - a[1].total)
      .slice(0,10)
      .map(([id, obj], idx) => ({ rank: idx+1, group_product_id: id, name: obj.name, total_sales: obj.total }));

    // Top employees (successful only)
    const employeeSalesMap = new Map<string, number>();
    successfulOrders.forEach(o => {
      employeeSalesMap.set(o.responsible_employee, (employeeSalesMap.get(o.responsible_employee) || 0) + parseFloat(o.grand_total.toString()));
    });
    const topEmployeesTemp = Array.from(employeeSalesMap.entries())
      .sort((a,b)=> b[1]-a[1])
      .slice(0,10);
    const employeeIds = topEmployeesTemp.map(e=>e[0]);
    const employeeRecords = await prisma.employees.findMany({ where: { employee_id: { in: employeeIds } }, select: { employee_id: true, first_name: true, last_name: true } });
    const employeeNameMap = new Map(employeeRecords.map(e => [e.employee_id, `${e.first_name || ''} ${e.last_name || ''}`.trim()] as const));
    const top_employees = topEmployeesTemp.map(([id,val], idx) => ({
      rank: idx+1,
      employee_id: id,
      employee_name: employeeNameMap.get(id) || '- ',
      total_sales: val,
      percent: +(val / totalSuccessfulRevenue * 100).toFixed(2)
    }));

    return {
      range: { start_date: filter.start_date, end_date: filter.end_date },
      metrics: {
        activities: activitiesCount,
        successful_sales: successful_sales_count,
        new_customers: newCustomersCount,
        existing_customers: existingCustomersCount,
        sale_value_successful,
        sale_value_unsuccessful
      },
      top_customers,
      top_categories,
      top_employees
    };
  }
};
