import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function CustomerInfo() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeColorAllResponse | null>(null);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");

  const [allQuotation, setAllQuotation] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);



  const mockData = [
    {
      className: "",
      cells: [
        { value: "1", className: "text-center" },
        { value: "ลูกค้าใหม่", className: "text-left" },
        { value: "ซื้ออย่างน้อย: 1 ครั้ง", className: "text-left" },
        { value: "หลังจากซื้อครั้งแรก: 10 ครั้ง", className: "text-left" },
        { value: "ลูกค้าที่เพิ่มเคยใช้บริการ", className: "text-left" },
      ],
      data: {
        color_name: "Red",
        color_id: 1,
      },
    },
    {
      className: "",
      cells: [
        { value: "2", className: "text-center" },
        { value: "ลูกค้าประจำ", className: "text-left" },
        { value: "ซื้ออย่างน้อย: 3 ครั้ง ภายใน 1 เดือน", className: "text-left" },
        { value: "หลังจากขาดการซื้อ 1 เดือน", className: "text-left" },
        { value: "ลูกค้าทีเพิ่งมีการซื้อขายประจำ", className: "text-left" },
      ],
      data: {
        color_name: "Blue",
        color_id: 2,
      },
    }
  ];
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

  const dropdown = [
    {
      placeholder: "สถานะ",
      fetchData: async () => {
        return {
          responseObject: [
            { id: 1, name: "ลูกค้าใหม่" },
            { id: 2, name: "ลูกค้าประจำ" },
          ],
        };
      },
    },
  ]
  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-20" },
    { label: "สถานะของลูกค้า", colSpan: 1, className: "min-w-40" },
    { label: "เงื่อนไขการเริ่มต้นสถานะ", colSpan: 1, className: "min-w-20" },
    { label: "เงื่อนไขการสิ้นสุดสถานะ", colSpan: 1, className: "min-w-14" },
    { label: "รายละเอียดเพิ่มเติม", colSpan: 1, className: "min-w-14" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
  ];
  const idPath = "Customer1"
  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText]);

  //handle
  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    setSearchParams({ page: "1", pageSize });

  };



  //เปิด
  const handleCreateOpen = () => {
    setColorsName("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = () => {
    navigate(`/edit-info-customer/${idPath}`);
  };
  const handleDeleteOpen = (item: TypeColorAllResponse) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
    
  };

  //ปิด
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  //ยืนยันไดอะล็อค
  

  return (
    <div>
      <MasterTableFeature
        title="กำหนดข้อมูลพื้นฐานลูกค้า"
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
        rowData={mockData}
        totalData={mockData.length}
        onEdit={handleEditOpen}
        onPopCreate={handleCreateOpen}
        onDropdown={true}
        dropdownItem={dropdown}
      />

      

      
    </div>
  );
}
