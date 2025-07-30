import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";

import RatingShow from "@/components/customs/rating/rating.show.component";
import { TypeAllQuotationResponse } from "@/types/response/response.quotation";
import { useAllQuotations } from "@/hooks/useQuotation";
import { useSelectEmployee } from "@/hooks/useEmployee";
import { TypeAllEmployeeResponse, TypeEmployeeResponse } from "@/types/response/response.employee";
type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllQuotationResponse;

}[];

//
export default function ApproveQuotation() {
  const [searchText, setSearchText] = useState("");

  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);


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
  const [statusQuotation, setStatusQuotation] = useState<string | null>(null);



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
      responseObject: employeeList.map((item: TypeAllEmployeeResponse) => ({
        id: item.employee_id,
        name: `${item.first_name} ${item.last_name || ""}`,
      })),
    };
  };

  const handleEmployeeSearch = (searchText: string) => {
    setSearchEmployee(searchText);
    refetchEmployee();
  };
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

  // useEffect(() => {
  //   console.log("Data:", dataColor);
  //   if (dataColor?.responseObject?.data) {
  //     const formattedData = dataColor.responseObject?.data.map(
  //       (item: TypeColorAllResponse, index: number) => ({
  //         className: "",
  //         cells: [
  //           { value: index + 1, className: "text-center" },
  //           { value: item.color_name, className: "text-left" },
  //         ],
  //         data: item,
  //       })
  //     );
  //     setData(formattedData);
  //   }
  // }, [dataColor]);

  //item จาก dropdown
  const dropdown = [
    {
      placeholder: "ผู้รับผิดชอบ",
      fetchData: fetchDataMemberInteam,
      onChange: (value: string | null) => {
        setResponseId(value)
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
      onChange: (value: string | null) => setDayQuotation(value),
    },
  ]
  const datePicker = [
    {
      placeholder: "dd/mm/yy",
      selectedDate: startDate,
      onChange: (date: Date | null) => {
        setStartDate(date)
        setSearchParams({ page: "1", pageSize });
      },
    },
    {
      placeholder: "dd/mm/yy",
      selectedDate: endDate,
      onChange: (date: Date | null) => {
        setEndDate(date)
        setSearchParams({ page: "1", pageSize });
      },
    }
  ];

  //
  const headers = [
    { label: "หมายเลขใบเสนอราคา", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้า", colSpan: 1, className: "w-auto" },
    { label: "ความสำคัญ", colSpan: 1, className: "w-auto" },
    { label: "สถานะ", colSpan: 1, className: "w-auto" },
    { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
    { label: "วันออกเอกสาร", colSpan: 1, className: "w-auto" },
    { label: "วันยื่นราคา", colSpan: 1, className: "w-auto" },
    { label: "มูลค่า", colSpan: 1, className: "w-auto" },
    { label: "ดูรายละเอียด", colSpan: 1, className: "w-auto" },
  ];
  //fetch quotation
  const { data: dataQuotations, refetch: refetchQuotation } = useAllQuotations({
    page: page,
    pageSize: pageSize,
    searchText: searchQuotation,
    payload: {
      responsible_id: responseId,
      status: statusQuotation ?? null,
      issue_date: dayQuotation === "วันออกเอกสาร" ? "issue_date" : null,
      price_date: dayQuotation === "วันยื่นราคา" ? "price_date" : null,
      start_date: startDate ? startDate.toISOString().slice(0, 10) : null,
      end_date: endDate ? endDate.toISOString().slice(0, 10) : null,
    }
  });


  useEffect(() => {

    if (dataQuotations?.responseObject?.data) {
      const filtered = dataQuotations.responseObject.data.filter(
        (item: TypeAllQuotationResponse) =>
          ["รออนุมัติ", "อนุมัติ", "ไม่อนุมัติ"].includes(item.quotation_status)
      );

      const formattedData = filtered.map((item) => ({
        className: "",
        cells: [
          { value: item.quotation_number, className: "text-left" },
          { value: item.customer.company_name, className: "text-left" },
          { value: (<RatingShow value={item.priority} className="w-5 h-5" />), className: "text-left" },
          { value: item.quotation_status ?? "-", className: "text-center" },
          { value: item.responsible.first_name + " " + item.responsible.last_name, className: "text-left" },
          { value: new Date(item.issue_date).toLocaleDateString("th-TH"), className: "text-center" },
          { value: new Date(item.price_date).toLocaleDateString("th-TH"), className: "text-center" },
          { value: Number(item.grand_total).toFixed(2).toLocaleString(), className: "text-right" },
        ],
        data: item,
      }));

      setData(formattedData);
    }

  }, [dataQuotations]);
  //tabs บน headertable


  const groupTabs = [
    {
      id: "all",
      name: "ใบเสนอราคาทั้งหมด",
      onChange: () => {
        setStatusQuotation(null)
        setSearchParams({ page: "1", pageSize });
      }
    },
    {
      id: "request-approve",
      name: "ใบเสนอราคาที่ยังไม่อนุมัติ",
      onChange: () => {
        setStatusQuotation("รออนุมัติ")
        setSearchParams({ page: "1", pageSize });
      }
    },
    {
      id: "approve",
      name: "อนุมัติแล้ว",
      onChange: () => {
        setStatusQuotation("อนุมัติ")
        setSearchParams({ page: "1", pageSize });
      }
    },
    {
      id: "not-approve",
      name: "ไม่อนุมัติ",
      onChange: () => {
        setStatusQuotation("ไม่อนุมัติ")
        setSearchParams({ page: "1", pageSize });
      }
    },


  ];



  //handle
  const handleSearch = () => {
    setSearchQuotation(searchText);
    setSearchParams({ page: "1", pageSize });
  };
  useEffect(() => {
    if (searchText === "") {
      setSearchQuotation(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText]);
  
  const handleView = (item: TypeAllQuotationResponse) => {
    navigate(`/approve-details-quotation/${item.quotation_id}`);
  }


  return (
    <div>
      <MasterTableFeature
        title="อนุมัติใบเสนอราคา"
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
        totalData={dataQuotations?.responseObject?.totalCount}
        onView={handleView}
        onDropdown={true}
        dropdownItem={dropdown}
        onDatePicker={true}
        datePickerItem={dayQuotation ? datePicker : []}
        headerTab={true}
        groupTabs={groupTabs}
      />


    </div>
  );
}
