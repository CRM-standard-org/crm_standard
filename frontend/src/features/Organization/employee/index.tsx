import { useEffect, useState } from "react";
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
import { TypeEmployeeResponse } from "@/types/response/response.employee";
import { useAllEmployee } from "@/hooks/useEmployee";
type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeEmployeeResponse; //ตรงนี้
}[];

//
export default function Employee() {
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
  const [searchEmployee, setSearchEmployee] = useState("");

  const [allQuotation, setAllQuotation] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [isActive, setIsActive] = useState<boolean>(true);




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

  //fetch quotation
  const { data: dataEmployee, refetch: refetchEmployee } = useAllEmployee({
    page: page,
    pageSize: pageSize,
    searchText: searchEmployee,
    payload: {
      is_active: isActive,
      status: filterStatus
    }
  });


  useEffect(() => {

    if (dataEmployee?.responseObject?.data) {

      const formattedData = dataEmployee.responseObject?.data.map(
        (item: TypeEmployeeResponse) => ({
          className: "",
          cells: [
            { value: item.employee_code, className: "text-center" },
            { value: item.first_name + " " + item.last_name, className: "text-left" },
            { value: item.position ?? "-", className: "text-center" },
            { value: item.team_employee?.name ?? "-", className: "text-center" },
            { value: new Date(item.start_date).toLocaleDateString("th-TH") ?? "-", className: "text-center" },
            { value: item.employee_status?.name ?? "-", className: "text-center" },
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
  ];

  const mockData = [
    {
      className: "",
      cells: [
        { value: "1122334455", className: "text-left" },
        { value: "จอมปราชญ์ รักโลก", className: "text-left" },
        { value: "หัวหน้าทีมฝ่ายขาย", className: "text-center" },
        { value: "A", className: "text-center" },
        { value: "15/2/2025", className: "text-center" },
        { value: "พนักงานประจำ", className: "text-center" },
        { value: "THB 25,000", className: "text-right" },
      ],
      data: {
        color_name: "Red",
        color_id: 1,
      },
    },
    {
      className: "",
      cells: [
        { value: "2233445566", className: "text-left" },
        { value: "พะยูน มีพิรุธ", className: "text-left" },
        { value: "พนักงานขาย", className: "text-center" },
        { value: "B", className: "text-center" },
        { value: "16/2/2025", className: "text-center" },
        { value: "ทดลองงาน", className: "text-center" },
        { value: "THB 15,000", className: "text-right" },
      ],
      data: {
        color_name: "Blue",
        color_id: 2,
      },
    }
  ];
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
      }

    },
  ];

  //tabs บน headertable


  const groupTabs = [
    {
      id: "all",
      name: "ทั้งหมด",
      onChange: () => {
        setFilterStatus(null)
        setSearchParams({ page: "1", pageSize });

      }
    },
    {
      id: "regular",
      name: "พนักงานประจำ",
      onChange: () => {
        setFilterStatus("พนักงานประจำ")
        setSearchParams({ page: "1", pageSize });

      }
    },
    {
      id: "test",
      name: "ทดลองงาน",
      onChange: () => {
        setFilterStatus("ทดลองงาน")
        setSearchParams({ page: "1", pageSize });

      }
    },
    {
      id: "dismiss",
      name: "เลิกจ้าง",
      onChange: () => {
        setFilterStatus("เลิกจ้าง")
        setSearchParams({ page: "1", pageSize });

      }
    },
    {
      id: "intern",
      name: "ฝึกงาน",
      onChange: () => {
        setFilterStatus("ฝึกงาน")
        setSearchParams({ page: "1", pageSize });

      }
    },
    {
      id: "take-leave",
      name: "ลาหยุด",
      onChange: () => {
        setFilterStatus("ลาหยุด")
        setSearchParams({ page: "1", pageSize });

      }
    },
    {
      id: "out",
      name: "ถูกเลิกจ้าง",
      onChange: () => {
        setFilterStatus("ถูกเลิกจ้าง")
        setSearchParams({ page: "1", pageSize });

      }
    },

  ];

  const handleNavCreate = () => {
    navigate('/create-employee');
  }
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
  }, [searchText]);

  const handleView = (item: TypeEmployeeResponse) => {
    navigate(`/employee-details/${item.employee_id}`);
  }
  //เปิด
  const handleCreateOpen = () => {
    setColorsName("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeColorAllResponse) => {
    setSelectedItem(item);
    setColorsName(item.color_name);
    setIsEditDialogOpen(true);
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
  const handleConfirm = async () => {
    if (!colorsName) {
      showToast("กรุณาระบุสี", false);
      return;
    }
    try {
      const response = await postColor({
        color_name: colorsName, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        setColorsName("");
        handleCreateClose();
        showToast("สร้างรายการสีเรียบร้อยแล้ว", true);
      } else {
        showToast("รายการสีนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการสีได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!colorsName) {
      showToast("กรุณาระบุชื่อสี", false);
      return;
    }
    if (!selectedItem) {
      showToast("กรุณาระบุชื่อสี", false);
      return;
    }

    try {
      const response = await updateColor(selectedItem.color_id, {
        color_name: colorsName,
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขรายการสีเรียบร้อยแล้ว", true);
        setColorsName("");
        setIsEditDialogOpen(false);

      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขรายการสีได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.color_name) {
      showToast("กรุณาระบุรายการสีที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteColor(selectedItem.color_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการสีเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบรายการสีได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบรายการสีได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบรายการสีได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการสีได้", false);
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
        onPopCreate={handleCreateOpen}
        onCreateBtn={true} // ให้มีปุ่ม create เพิ่มมารป่าว
        onCreateBtnClick={handleNavCreate}
        nameCreateBtn="+ เพิ่มพนักงานใหม่"
        onDropdown={true}
        dropdownItem={dropdown}
        headerTab={true}
        groupTabs={groupTabs}
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างสี"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-create"
            placeholder="ระบุสี"
            onChange={(e) => setColorsName(e.target.value)}
            value={colorsName}
            label="สี"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
          />
        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขสี"
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-edit"
            placeholder={colorsName ? colorsName : "ระบุสี"}
            defaultValue={colorsName}
            onChange={(e) => setColorsName(e.target.value)}
            value={colorsName}
            label="สี"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
          />
        </div>
      </DialogComponent>

      {/* ลบ */}
      <DialogComponent
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        title="ยืนยันการลบ"
        onConfirm={handleDeleteConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>
          คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
          สี : <span className="text-red-500">{selectedItem?.color_name} </span>
        </p>
      </DialogComponent>
    </div>
  );
}
