import { useCallback, useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {

  postColor,
  updateColor,
  deleteColor,
} from "@/services/color.service";
import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useColor } from "@/hooks/useColor";

//fetch tag
import { useTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { useAllQuotations } from "@/hooks/useQuotation";
import { TypeAllQuotationResponse } from "@/types/response/response.quotation";
import { useTeam } from "@/hooks/useTeam";
import { TypeTeamResponse } from "@/types/response/response.team";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { useSelectEmployee, useSelectResponsible } from "@/hooks/useEmployee";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { OptionType } from "@/components/customs/select/select.main.component";
import { TypeEmployeeResponse } from "@/types/response/response.employee";
import { cancelQuotation } from "@/services/quotation.service";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import { TypeAllSaleOrderResponse } from "@/types/response/response.saleorder";
import { useAllSaleOrders } from "@/hooks/useSaleOrder";
type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllSaleOrderResponse; //ตรงนี้
}[];

//
export default function SaleOrder() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeAllSaleOrderResponse | null>(null);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  const [responseId, setResponseId] = useState<string | null>(null);
  const [dayQuotation, setDayQuotation] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusSaleOrder, setStatusSaleOrder] = useState<string | null>(null);

  const [cancelRemark, setCancelRemark] = useState("");


  //searchText control
  const [searchQuotation, setSearchQuotation] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");


  //fetch Employee

  const { data: dataEmployee, refetch: refetchEmployee } = useSelectEmployee({
    searchText: searchEmployee,
  });

  const fetchDataMemberInteam = async () => {
    const employeeList = dataEmployee?.responseObject?.data ?? [];
    return {
      responseObject: employeeList.map((item: TypeEmployeeResponse) => ({
        id: item.employee_id,
        name: `${item.first_name} ${item.last_name || ""}`,
      })),
    };
  };

  const handleEmployeeSearch = (searchText: string) => {
    setSearchEmployee(searchText);
    refetchEmployee();
  };

  //fetch quotation
  const { data: dataSaleOrders, refetch: refetchSaleOrders } = useAllSaleOrders({
    page: page,
    pageSize: pageSize,
    searchText: searchQuotation,
    payload: {
      responsible_id: responseId,
      status:statusSaleOrder ?? null,
      issue_date: dayQuotation === "วันออกเอกสาร" ? "issue_date" : null,
      price_date: dayQuotation === "วันยื่นราคา" ? "price_date" : null,
      start_date: startDate ? startDate.toISOString().slice(0, 10) : null,
      end_date: endDate ? endDate.toISOString().slice(0, 10) : null,
    }
  });


  useEffect(() => {

    if (dataSaleOrders?.responseObject?.data) {

      const formattedData = dataSaleOrders.responseObject?.data.map(
        (item: TypeAllSaleOrderResponse) => ({
          className: "",
          cells: [
            { value: item.sale_order_number, className: "text-left" },
            { value: item.customer.company_name, className: "text-left" },
            { value: item.sale_order_status ?? "-", className: "text-center" },
            { value: item.responsible.first_name + " " + item.responsible.last_name, className: "text-left" },
            { value: new Date(item.issue_date).toLocaleDateString("th-TH"), className: "text-center" },
            { value: new Date(item.price_date).toLocaleDateString("th-TH"), className: "text-center" },
            { value: item.grand_total, className: "text-right" },
            { value: item.payment_status, className: "text-center" },
            { value: item.totalAmountPaid, className: "text-right" },
          ],
          data: item,
        })

      );
      setData(formattedData);
    }
    
  }, [dataSaleOrders]);

  // const dataCountry = async () => {
  //   return {
  //     responseObject: [
  //       { id: 1, name: "ไทย" },
  //       { id: 2, name: "อังกฤษ" },
  //       { id: 3, name: "ฟิลิปปินส์" },
  //       { id: 4, name: "ลาว" },
  //     ],
  //   };
  // };


  const dropdown = [
    {
      placeholder: "ผู้รับผิดชอบ",
      fetchData: fetchDataMemberInteam,
      onChange: (value: string | null) => {
        setResponseId(value);
        setSearchParams({ page: "1", pageSize });
      },
      handleChange: handleEmployeeSearch
    },
    {
      placeholder: "วันที่",
      fetchData: async () => {
        return {
          responseObject: [
            { id: "วันออกเอกสาร", name: "วันออกเอกสาร" },
            { id: "วันยื่นราคา", name: "วันยื่นราคา" },
          ],
        };
      },
      onChange: (value: string | null) => {
        setDayQuotation(value);
        setSearchParams({ page: "1", pageSize });
      },
    },
  ]
  const datePicker = [
    {
      placeholder: "dd/mm/yy",
      selectedDate: startDate,
      onChange: (date: Date | null) => {
        setStartDate(date);
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      placeholder: "dd/mm/yy",
      selectedDate: endDate,
      onChange: (date: Date | null) => {
        setEndDate(date);
        setSearchParams({ page: "1", pageSize });
      },
    }
  ];


  //
  const headers = [
    { label: "หมายเลขใบสั่งขาย", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้า", colSpan: 1, className: "w-auto" },
    { label: "สถานะ", colSpan: 1, className: "w-auto" },
    { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
    { label: "วันออกเอกสาร", colSpan: 1, className: "w-auto" },
    { label: "วันจัดส่ง", colSpan: 1, className: "w-auto" },
    { label: "มูลค่า", colSpan: 1, className: "w-auto" },
    { label: "สถานะการชำระเงิน", colSpan: 1, className: "w-auto" },
    { label: "ชำระไปแล้ว", colSpan: 1, className: "w-auto" },
    { label: "ดูรายละเอียด", colSpan: 1, className: "w-auto" },

  ];

  // const mockData = [
  //   {
  //     className: "",
  //     cells: [
  //       { value: "P#2144563156", className: "text-left" },
  //       { value: "บริษัทจอมมี่ จำกัด", className: "text-left" },
  //       { value: (<RatingShow value={3} className="w-5 h-5" />), className: "text-left" },
  //       { value: "รอการอนุมัติ", className: "text-center" },
  //       { value: "จอมปราชญ์ รักโลก", className: "text-left" },
  //       { value: "11 ก.พ. 68", className: "text-center" },
  //       { value: "11 ก.พ. 68", className: "text-center" },
  //       { value: "THB 35,000", className: "text-right" },
  //     ],
  //     data: {
  //       color_name: "Red",
  //       color_id: 1,
  //     },
  //   },
  //   {
  //     className: "",
  //     cells: [
  //       { value: "P#2144563156", className: "text-left" },
  //       { value: "บริษัทจอมมี่ จำกัด", className: "text-left" },
  //       { value: (<RatingShow value={2} className="w-5 h-5" />), className: "text-left" },
  //       { value: "ระหว่างการติดตามผล", className: "text-center" },
  //       { value: "จอมปราชญ์ รักโลก", className: "text-left" },
  //       { value: "11 ก.พ. 68", className: "text-center" },
  //       { value: "11 ก.พ. 68", className: "text-center" },
  //       { value: "THB 45,000", className: "text-right" },
  //     ],
  //     data: {
  //       color_name: "Blue",
  //       color_id: 2,
  //     },
  //   }
  // ];
  //tabs บน headertable
  const groupTabs = [
    {
      name: "ใบสั่งขายทั้งหมด",
      onChange: () => {
        setStatusSaleOrder(null)
        setSearchParams({ page: "1", pageSize });
        
      }

    },
    {
      name: "ระหว่างดำเนินการ",
      onChange: () => {
        setStatusSaleOrder("ระหว่างดำเนินการ")
        setSearchParams({ page: "1", pageSize });
      }
    },
    {
      name: "สำเร็จ",
      onChange: () => {
        setStatusSaleOrder("สำเร็จ")
        setSearchParams({ page: "1", pageSize });
      }
        
    },
    {
      name: "ไม่สำเร็จ",
      onChange: () => {
        setStatusSaleOrder("ไม่สำเร็จ")
        setSearchParams({ page: "1", pageSize });
      }
    },
   
  
  ];
  
  
  useEffect(() => {
    if (searchText === "") {
      setSearchQuotation(searchText);
      setSearchParams({ page: "1", pageSize });
      refetchSaleOrders();
    }
  }, [searchText]);

  const handleNavCreate = () => {
    navigate('/create-quotation');
  }
  //handle
  const handleSearch = () => {
    setSearchQuotation(searchText);
    setSearchParams({ page: "1", pageSize });
    refetchSaleOrders();
  };


  const handleView = (item: TypeAllSaleOrderResponse) => {
    navigate(`/sale-order-details/${item.sale_order_id}`);
  }
  //เปิด
 
  const handleDeleteOpen = (item: TypeAllSaleOrderResponse) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);

  };

  //ปิด
 
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.sale_order_id) {
      showToast("กรุณาระบุใบเสนอราคาที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await cancelQuotation(selectedItem.sale_order_id, {
        quotation_status: "ยกเลิก",
        quotation_status_remark: cancelRemark,
      });

      if (response.statusCode === 200) {
        showToast("ยกเลิกใบเสนอราคาเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        refetchSaleOrders();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถยกเลิกใบเสนอราคาได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถยกเลิกใบเสนอราคาได้", false);
        }
      }
      else {
        showToast("ไม่สามารถยกเลิกใบเสนอราคาได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถยกเลิกใบเสนอราคาได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="ใบสั่งขาย"
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
        totalData={dataSaleOrders?.responseObject?.totalCount}
        onView={handleView}
        onDropdown={true}
        dropdownItem={dropdown}
        onDatePicker={true}
        datePickerItem={dayQuotation ? datePicker : []}
        headerTab={true}
        groupTabs={groupTabs}
      />


      {/* ยกเลิก */}
      <DialogComponent
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        title="ยืนยันการยกเลิก"
        onConfirm={handleDeleteConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col space-y-5">
          <p>ใบเสนอราคา : <span className="text-red-500">{selectedItem?.sale_order_id}</span></p>

          <TextArea
            id="note"
            placeholder=""
            onChange={(e) => setCancelRemark(e.target.value)}
            value={cancelRemark}
            label="หมายเหตุ"
            labelOrientation="horizontal"
            onAction={handleDeleteConfirm}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
          />

        </div>
      </DialogComponent>
    </div>
  );
}
