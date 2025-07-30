import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUnit } from "@/hooks/useProduct";
import { TypeUnitResponse, TypeProductGroup } from "@/types/response/response.product";
import { deleteUnit, postUnit, updateUnit } from "@/services/product.service";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeUnitResponse; //ตรงนี้
}[];

//
export default function ProductUnit() {
  const [searchText, setSearchText] = useState("");
  const [unit, setUnit] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeUnitResponse | null>(null);

  const { showToast } = useToast();
  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");



  const { data: dataUnit, refetch: refetchUnit } = useUnit({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  useEffect(() => {
    console.log("Data:", dataUnit);
    if (dataUnit?.responseObject?.data) {
      const formattedData = dataUnit.responseObject?.data.map(
        (item: TypeUnitResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.unit_name, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataUnit]);


  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-10" },
    { label: "ชื่อหน่วย", colSpan: 1, className: "min-w-80" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      setSearchParams({ page: "1", pageSize });

      refetchUnit();
    }
  }, [searchText]);

  //handle
  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    setSearchParams({ page: "1", pageSize });
    refetchUnit();

  };


  //เปิด
  const handleCreateOpen = () => {
    setUnit("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeUnitResponse) => {
    setSelectedItem(item);
    setUnit(item.unit_name);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeUnitResponse) => {
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

    if (!unit) errorMap.unit = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await postUnit({
        unit_name: unit, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        setUnit("");
        handleCreateClose();
        showToast("สร้างหน่วยสินค้าเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });
        refetchUnit();
      } else {
        showToast("หน่วยสินค้านี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างหน่วยสินค้าได้", false);
    }
  };

  const handleEditConfirm = async () => {
    const errorMap: Record<string, boolean> = {};

    if (!unit) errorMap.editUnit = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }

    try {
      const response = await updateUnit(selectedItem.unit_id, {
        unit_name: unit, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขหน่วยสินค้าเรียบร้อยแล้ว", true);
        setUnit("");
        setIsEditDialogOpen(false);

        refetchUnit();
      } else {
        showToast("หน่วยสินค้านี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขหน่วยสินค้าได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.unit_name) {
      showToast("กรุณาระบุหน่วยสินค้าที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteUnit(selectedItem.unit_id);

      if (response.statusCode === 200) {
        showToast("ลบหน่วยสินค้าเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });

        refetchUnit();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบหน่วยสินค้าได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบหน่วยสินค้าได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบหน่วยสินค้าได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบหน่วยสินค้าได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="หน่วยสินค้า"
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
        totalData={dataUnit?.responseObject.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มหน่วยใหม่"
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="เพิ่มหน่วยสินค้าใหม่"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="unit-name"
            placeholder=""
            onChange={(e) => setUnit(e.target.value)}
            value={unit}
            label="ชื่อหน่วย"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.unit}
          />

        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขชื่อหน่วยสินค้า"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="unit-name"
            placeholder=""
            onChange={(e) => setUnit(e.target.value)}
            value={unit}
            label="ชื่อหน่วย"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editUnit}
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
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.unit_name}</span></p>
      </DialogComponent>
    </div>
  );
}
