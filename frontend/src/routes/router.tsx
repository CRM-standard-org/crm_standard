import HomePage from "@/pages/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "@/components/layouts/layout.error404";

// customer route
import ManageCustomer from "@/pages/Customer/manage-customer";
import CustomerInfo from "@/pages/Customer/customer-info";
import CustomerTag from "@/pages/Customer/customer-tag";
import CustomerRole from "@/pages/Customer/customer-role";
import CustomerCharacter from "@/pages/Customer/customer-character";
import CustomerActivity from "@/pages/Customer/customer-activity";
import CreateCustomer from "@/pages/Customer/create-customer";
import CustomerDetails from "@/pages/Customer/customer-details";
import EditInfoCustomer from "@/pages/Customer/edit-info-customer";
import EditCustomerActivity from "@/pages/Customer/edit-customer-activity";
import CreateActivity from "@/pages/Customer/create-activity";
import EditCustomerDetails from "@/pages/Customer/edit-customer-details";

//financial route
import Quotation from "@/pages/Financial/quotation";
import CreateQuotation from "@/pages/Financial/create-quotation";
import PaymentMethod from "@/pages/Financial/payment-method";
import Currency from "@/pages/Financial/currency";
import QuotationDetails from "@/pages/Financial/quotation-details";
import EditInfoQuotation from "@/pages/Financial/edit-info-quotation";
import ApproveQuotation from "@/pages/Financial/approve-quotation";
import ApproveDetailsQuotation from "@/pages/Financial/approve-details-quotation";
import SaleOrder from "@/pages/Financial/sale-order";
import SaleOrderDetails from "@/pages/Financial/sale-order-details";
import EditSaleOrder from "@/pages/Financial/edit-sale-order";

//product route
import Products from "@/pages/Product/products";
import ProductGroup from "@/pages/Product/product-group";
import ProductUnit from "@/pages/Product/product-unit";

//organize route
import ManageInfoCompany from "@/pages/Organization/manage-info-company";
import EditInfoCompany from "@/pages/Organization/edit-info-company";
import Employee from "@/pages/Organization/employee";
import CreateEmployee from "@/pages/Organization/create-employee";
import EmployeeDetails from "@/pages/Organization/employee-details";
import EditEmployeeDetails from "@/pages/Organization/edit-employee-details";
import ManageTeam from "@/pages/Organization/manage-team";
import CreateTeam from "@/pages/Organization/create-team";
import TeamDetails from "@/pages/Organization/team-details";
import EditTeamDetails from "@/pages/Organization/edit-team-details";

import LoginPage from "@/pages/login";
import MainLayout from "@/components/layouts/layout";

import SellProcess from "@/pages/Dashboard/sell-process";
import Dashboards from "@/pages/Dashboard/dashboards";
import Reports from "@/pages/Dashboard/reports";
import PredictSell from "@/pages/Dashboard/predict-sell";
import ReportYears from "@/pages/Dashboard/report-years";
import SummarySale from "@/pages/Dashboard/summary-sale";
import ReportCustomers from "@/pages/Dashboard/report-customers";
import ReportTagsCustomer from "@/pages/Dashboard/report-tags-customer";
import ReportCategorySale from "@/pages/Dashboard/report-category-sale";
import ForcastSale from "@/pages/Dashboard/forcast-sale";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // element: <MainLayout />,
    children: [
      {
        index: true,
        element: <SellProcess />,
      },
      //การวิเคราะห์ติดตามผล
      {
        path: "/sell-process",
        element: <SellProcess />,
      },
      {
        path: "/dashboards",
        element: <Dashboards />,
      },
      {
        path: "/predict-sell",
        element: <PredictSell />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path:"/report-years",
        element:<ReportYears/>,
      },
      {
        path:"/summary-sale",
        element:<SummarySale/>,
      },
      {
        path:"/report-customers",
        element:<ReportCustomers/>,
      },
      {
        path:"/report-tags-customer",
        element:<ReportTagsCustomer/>,
      },
      {
        path:"/report-category-sale",
        element:<ReportCategorySale/>,
      },
      {
        path:"/forcast-sale",
        element:<ForcastSale/>,
      },
      //ลูกค้า
      {
        path: "/manage-customer",
        element: <ManageCustomer />,
      },
      {
        path: "/customer-info",
        element: <CustomerInfo />,
      },
      {
        path: "/customer-tag",
        element: <CustomerTag />,
      },
      {
        path: "/customer-role",
        element: <CustomerRole />,
      },
      {
        path: "customer-character",
        element: <CustomerCharacter/>,
      },
      {
        path: "/customer-activity",
        element: <CustomerActivity />,
      },
      {
        path: "/create-customer",
        element: <CreateCustomer />,
      },
      {
        path: "/customer-details/:customerId",
        element: <CustomerDetails />,
      },
      {
        path: "/edit-customer-details/:customerId",
        element: <EditCustomerDetails />,
      },
      {
        path: "/edit-info-customer/:customerId",
        element: <EditInfoCustomer />,
      },
      {
        path: "/edit-customer-activity/:activityId",
        element: <EditCustomerActivity />,
      },
      {
        path: "/create-activity",
        element: <CreateActivity />,
      },
      //การขายและธุรกรรม
      {
        path: "/quotation",
        element: <Quotation />,
      },
      {
        path: "/quotation-details/:quotationId",
        element: <QuotationDetails />,
      },
      {
        path: "/edit-info-quotation/:quotationId",
        element: <EditInfoQuotation />,
      },
      {
        path: "/create-quotation",
        element: <CreateQuotation />,
      },
      {
        path: "/currency",
        element: <Currency />,
      },
      {
        path: "/payment-method",
        element: <PaymentMethod />,
      },
      {
        path: "/approve-quotation",
        element: <ApproveQuotation />,
      },
      {
        path: "/approve-details-quotation/:quotationId",
        element: <ApproveDetailsQuotation />,
      },
      {
        path: "/sale-order",
        element: <SaleOrder />,
      },
      {
        path: "/sale-order-details/:saleOrderId",
        element: <SaleOrderDetails />,
      },
      {
        path: "/edit-sale-order/:saleOrderId",
        element: <EditSaleOrder/>,
      },
      //สินค้า
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/product-group",
        element: <ProductGroup />,
      },
      {
        path: "/product-unit",
        element: <ProductUnit />,
      },
      //การตั้งค่าองค์กร
      {
        path: "/manage-info-company",
        element: <ManageInfoCompany />,
      },
      {
        path: "/edit-info-company/:companyId",
        element: <EditInfoCompany />,
      },
      {
        path: "/employee",
        element: <Employee />,
      },
      {
        path: "/create-employee",
        element: <CreateEmployee />,
      },
      {
        path: "/employee-details/:employeeId",
        element: <EmployeeDetails />,
      },
      {
        path: "/edit-employee-details/:employeeId",
        element: <EditEmployeeDetails />,
      },
      {
        path: "/manage-team",
        element: <ManageTeam />,
      },
      {
        path: "/create-team",
        element: <CreateTeam />,
      },
      {
        path: "/team-details/:teamId",
        element: <TeamDetails />,
      },
      {
        path: "/edit-team-details/:teamId",
        element: <EditTeamDetails />,
      }
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
