import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {

  postCustomerRole,
  updateCustomerRole,
  deleteCustomerRole,
} from "@/services/customerRole.service";
import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerRole } from "@/hooks/useCustomerRole";
import { TypeCustomerRoleResponse } from "@/types/response/response.customerRole";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeCustomerRoleResponse; //ตรงนี้
}[];

//
export default function CustomerRole() {
  const [searchText, setSearchText] = useState("");
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeCustomerRoleResponse | null>(null);

  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchRole, setSearchRole] = useState("");


  const { data: dataRole, refetch: refetchRole } = useCustomerRole({
    page: page,
    pageSize: pageSize,
    searchText: searchRole,
  });

  useEffect(() => {
    console.log("Data:", dataRole);
    if (dataRole?.responseObject?.data) {
      const formattedData = dataRole.responseObject?.data.map(
        (item: TypeCustomerRoleResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.name, className: "text-left" },
            { value: item.description ?? "-", className: "text-center" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataRole]);


  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-10" },
    { label: "ชื่อบทบาท", colSpan: 1, className: "min-w-20" },
    { label: "รายละเอียดบทบาท", colSpan: 1, className: "min-w-80" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];



  //handle
  const handleSearch = () => {
    setSearchRole(searchText);
    setSearchParams({ page: "1", pageSize });
    refetchRole();

  };
  useEffect(() => {
    if (searchText === "") {
      setSearchRole(searchText);
      setSearchParams({ page: "1", pageSize });
      refetchRole();
    }
  }, [searchText]);

  //เปิด
  const handleCreateOpen = () => {
    setRoleName("");
    setRoleDescription("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeCustomerRoleResponse) => {
    setSelectedItem(item);
    setRoleName(item.name);
    setRoleDescription(item.description);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeCustomerRoleResponse) => {
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

    const errorMap: Record<string, boolean> = {};

    if (!roleName) errorMap.roleName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await postCustomerRole({
        name: roleName, // ใช้ชื่อ field ที่ตรงกับ type
        description: roleDescription
      });

      if (response.statusCode === 200) {
        setRoleName("");
        setRoleDescription("");
        handleCreateClose();
        showToast("สร้างรายการสีเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });
        refetchRole();
      } else {
        showToast("รายการสีนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการสีได้", false);
    }
  };

  const handleEditConfirm = async () => {
    
    const errorMap: Record<string, boolean> = {};

    if (!roleName) errorMap.editRoleName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await updateCustomerRole(selectedItem.customer_role_id, {
        name: roleName, // ใช้ชื่อ field ที่ตรงกับ type
        description: roleDescription
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขรายการสีเรียบร้อยแล้ว", true);
        setRoleName("");
        setRoleDescription("");
        setIsEditDialogOpen(false);
        refetchRole();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขรายการสีได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.name || !selectedItem.description) {
      showToast("กรุณาระบุรายการบทบาทที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteCustomerRole(selectedItem.customer_role_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการสีเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });
        refetchRole();
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
        title="บทบาทลูกค้า"
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
        totalData={dataRole?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มบทบาทใหม่"
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างบทบาท"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="role-name"
            placeholder="ชื่อบทบาท"
            onChange={(e) => setRoleName(e.target.value)}
            value={roleName}
            label="ชื่อบทบาท"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "role-detail", down: "role-detail" }}

            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"

            isError={errorFields.roleName}
          />
          <InputAction
            id="role-detail"
            placeholder="รายละเอียดบทบาท"
            onChange={(e) => setRoleDescription(e.target.value)}
            value={roleDescription}
            label="รายละเอียดบทบาท"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "role-name", down: "role-name" }}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
          />
        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขบทบาท"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="role-name"
            placeholder="ชื่อบทบาท"
            onChange={(e) => setRoleName(e.target.value)}
            value={roleName}
            label="ชื่อบทบาท"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            nextFields={{ up: "role-detail", down: "role-detail" }}
            require="require"
            isError={errorFields.editRoleName}

          />
          <InputAction
            id="role-detail"
            placeholder="รายละเอียดบทบาท"
            onChange={(e) => setRoleDescription(e.target.value)}
            value={roleDescription}
            label="รายละเอียดบทบาท"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            nextFields={{ up: "role-detail", down: "role-detail" }}

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
        <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.name} </span></p>
      </DialogComponent>
    </div>

  );
}
