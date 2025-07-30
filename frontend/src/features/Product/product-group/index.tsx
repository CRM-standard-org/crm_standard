import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useSearchParams } from "react-router-dom";
import { TypeGroupProductResponse } from "@/types/response/response.product";
import { deleteGroupProduct, postGroupProduct, updateGroupProduct } from "@/services/product.service";
import { useProductGroup } from "@/hooks/useProduct";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeGroupProductResponse; //ตรงนี้
}[];

//
export default function ProductGroup() {
  const [searchText, setSearchText] = useState("");
  const [groupProduct, setGroupProduct] = useState("");

  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeGroupProductResponse | null>(null);

  const { showToast } = useToast();
  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");


  const { data: dataGroupProduct, refetch: refetchGroupProduct} = useProductGroup({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  useEffect(() => {
    console.log("Data:", dataGroupProduct);
    if (dataGroupProduct?.responseObject?.data) {
      const formattedData = dataGroupProduct.responseObject?.data.map(
        (item: TypeGroupProductResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.group_product_name, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataGroupProduct]);


  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-10" },
    { label: "ชื่อกลุ่ม", colSpan: 1, className: "min-w-80" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];

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
    setGroupProduct("");

    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeGroupProductResponse) => {
    setSelectedItem(item);
    setGroupProduct(item.group_product_name);

    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeGroupProductResponse) => {
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

    if (!groupProduct) errorMap.groupProduct = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await postGroupProduct({
        group_product_name: groupProduct, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        setGroupProduct("");
        handleCreateClose();
        showToast("สร้างกลุ่มสินค้าเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });
        refetchGroupProduct();
      } else {
        showToast("กลุ่มสินค้านี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างกลุ่มสินค้าได้", false);
    }
  };

  const handleEditConfirm = async () => {
    const errorMap: Record<string, boolean> = {};

    if (!groupProduct) errorMap.editGroupProduct = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }

    try {
      const response = await updateGroupProduct(selectedItem.group_product_id, {
        group_product_name: groupProduct, // ใช้ชื่อ field ที่ตรงกับ type

      });

      if (response.statusCode === 200) {
        showToast("แก้ไขกลุ่มสินค้าเรียบร้อยแล้ว", true);
        setGroupProduct("");
        setIsEditDialogOpen(false);
        refetchGroupProduct();
      } else {
        showToast("กลุ่มสินค้านี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขรายการสีได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.group_product_name) {
      showToast("กรุณาระบุรายการบทบาทที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteGroupProduct(selectedItem.group_product_id);

      if (response.statusCode === 200) {
        showToast("ลบกลุ่มสินค้าเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });

        refetchGroupProduct();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบกลุ่มสินค้าได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบกลุ่มสินค้าได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบกลุ่มสินค้าได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบกลุ่มสินค้าได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="กลุ่มสินค้า"
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
        totalData={dataGroupProduct?.responseObject.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มกลุ่มสินค้าใหม่"
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="เพิ่มกลุ่มใหม่"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="group-product"
            placeholder=""
            onChange={(e) => setGroupProduct(e.target.value)}
            value={groupProduct}
            label="ชื่อกลุ่ม"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.groupProduct}
          />
          
        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขชื่อกลุ่มสินค้า"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="group-product"
            placeholder=""
            onChange={(e) => setGroupProduct(e.target.value)}
            value={groupProduct}
            label="ชื่อกลุ่ม"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editGroupProduct}
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
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.group_product_name}</span></p>
      </DialogComponent>
    </div>
  );
}
