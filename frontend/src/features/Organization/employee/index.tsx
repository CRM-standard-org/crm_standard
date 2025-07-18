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
type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  // data: TypeColorAllResponse; //ตรงนี้
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

  const [allQuotation, setAllQuotation] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);

  const { data: dataColor, refetch: refetchColor } = useColor({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  //fetch ข้อมูล tag ลูกค้า

  const { data: dataTag } = useTag({
    page: "1",
    pageSize: "100",
    searchText: "",
  });

  const fetchDataTagDropdown = async () => {
    const tagList = dataTag?.responseObject?.data ?? [];
    return {
      responseObject: tagList.map((item: TypeTagColorResponse) => ({
        id: item.tag_id,
        name: item.tag_name,
      })),
    };
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
      placeholder: "สถานะ",
      fetchData: async () => {
        return {
          responseObject: [
            { id: 1, name: "ทีม A" },
            { id: 2, name: "ทีม B" },
          ],
        };
      },
    },

  ];

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
  const idPath = 'Customer1'
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

  //tabs บน headertable


  const groupTabs = [
    {
      id: "regular",
      name: "พนักงานประจำ",
      onChange: () => {
        setFilterGroup("พนักงานประจำ")
        setSearchParams({ page: "1", pageSize });

      }
    },
    {
      id: "part-time",
      name: "พนักงานรายวัน",
      onChange: () => {
        setFilterGroup("พนักงานรายวัน")
        setSearchParams({ page: "1", pageSize });

      }
    },

  ];
  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      setSearchParams({ page: "1", pageSize });

      refetchColor();
    }
  }, [searchText]);

  const handleNavCreate = () => {
    navigate('/create-employee');
  }
  //handle
  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    setSearchParams({ page: "1", pageSize });
    refetchColor();

  };

  const handleView = () => {
    navigate(`/employee-details/${idPath}`);
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
        refetchColor();
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
        refetchColor();
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
        refetchColor();
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
        rowData={mockData}
        totalData={mockData?.length}
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
