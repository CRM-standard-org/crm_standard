import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerRole } from "@/hooks/useCustomerRole";
import { useProduct, useSelectGroupProduct, useSelectUnit } from "@/hooks/useProduct";
import { TypeGroupProductResponse, TypeProductResponse, TypeUnitResponse } from "@/types/response/response.product";
import { deleteProduct, postProduct, updateProduct } from "@/services/product.service";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeProductResponse; //ตรงนี้
}[];

//
export default function Products() {
  const [searchText, setSearchText] = useState("");

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [unitName, setUnitName] = useState("");
  const [unit, setUnit] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeProductResponse | null>(null);

  const { showToast } = useToast();
  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [allQuotation, setAllQuotation] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);

  //searchText control
  const [searchGroup, setSearchGroup] = useState("");
  const [searchUnit, setSearchUnit] = useState("");

  const { data: dataProduct, refetch: refetchProduct } = useProduct({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  useEffect(() => {
    console.log("Data:", dataProduct);
    if (dataProduct?.responseObject?.data) {
      const formattedData = dataProduct.responseObject?.data.map(
        (item: TypeProductResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.product_name, className: "text-left" },
            { value: item.product_description ?? "-", className: "text-center" },
            { value: item.group_product.group_product_name, className: "text-center" },
            { value: item.unit.unit_name, className: "text-center" },
            { value: item.unit_price, className: "text-center" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataProduct]);
  //fetch group
  const { data: dataGroupProduct, refetch: refetchGroupProduct } = useSelectGroupProduct({
    searchText: searchGroup
  })
  const fetchDataGroupDropdown = async () => {
    const groupList = dataGroupProduct?.responseObject.data ?? [];
    return {
      responseObject: groupList.map((Item: TypeGroupProductResponse) => ({
        id: Item.group_product_id,
        name: Item.group_product_name,
      }))
    }
  }
  const handleGroupProductSearch = (searchText: string) => {
    setSearchGroup(searchText);
    refetchGroupProduct;
  }
  //fetch Unit
  const { data: dataUnit, refetch: refetchUnit } = useSelectUnit({
    searchText: searchUnit
  })
  const fetchDataUnitDropdown = async () => {
    const unitList = dataUnit?.responseObject.data ?? [];
    return {
      responseObject: unitList.map((Item: TypeUnitResponse) => ({
        id: Item.unit_id,
        name: Item.unit_name,
      }))
    }
  }
  const handleUnitSearch = (searchText: string) => {
    setSearchUnit(searchText);
    refetchUnit;
  }

  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-20" },
    { label: "ชื่อสินค้า", colSpan: 1, className: "min-w-40" },
    { label: "รายละเอียดสินค้า", colSpan: 1, className: "min-w-60" },
    { label: "กลุ่ม", colSpan: 1, className: "min-w-20" },
    { label: "หน่วย", colSpan: 1, className: "min-w-20 " },
    { label: "ราคา/หน่วย", colSpan: 1, className: "min-w-20" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-20" },
    { label: "ลบ", colSpan: 1, className: "min-w-20" },
  ];

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchProduct();
    }
  }, [searchText]);

  //handle
  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    setSearchParams({ page: "1", pageSize });

    refetchProduct();

  };


  //เปิด
  const handleCreateOpen = () => {
    setProductName("");
    setProductDescription("");
    setPrice(0);
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeProductResponse) => {
    setSelectedItem(item);
    setProductName(item.product_name);
    setProductDescription(item.product_description);
    setPrice(item.unit_price);
    setGroup(item.group_product.group_product_id);
    setGroupName(item.group_product.group_product_name)
    setUnit(item.unit.unit_id);
    setUnitName(item.unit.unit_name);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeProductResponse) => {
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

    if (!productName) errorMap.productName = true;
    if (!price) errorMap.price = true;
    if (!group) errorMap.group = true;
    if (!unit) errorMap.unit = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await postProduct({
        product_name: productName, // ใช้ชื่อ field ที่ตรงกับ type
        product_description: productDescription,
        unit_price: price,
        group_product_id: group,
        unit_id: unit,
      });


      if (response.statusCode === 200) {
        setProductName("");
        setProductDescription("");
        handleCreateClose();
        showToast("สร้างสินค้าเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });

        refetchProduct();
      } else {
        showToast("รายการสินค้านี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างสินค้าได้", false);
    }
  };

  const handleEditConfirm = async () => {
    const errorMap: Record<string, boolean> = {};

    if (!productName) errorMap.editProductName = true;
    if (!price) errorMap.editPrice = true;
    if (!group) errorMap.editGroup = true;
    if (!unit) errorMap.editUnit = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await updateProduct(selectedItem.product_id, {
        product_name: productName, // ใช้ชื่อ field ที่ตรงกับ type
        product_description: productDescription,
        unit_price: Number(price),
        unit_id: unit,
        group_product_id: group,
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขรายการสินค้าเรียบร้อยแล้ว", true);
        setProductName("");
        setProductDescription("");
        setPrice(0);
        setGroup(null);
        setUnit(null);
        setIsEditDialogOpen(false);
        refetchProduct();
      } else {
        showToast("สินค้านี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขรายการสินค้าได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.product_name || !selectedItem.product_description) {
      showToast("กรุณาระบุรายการสินค้าที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteProduct(selectedItem.product_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการสินค้าเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });

        refetchProduct();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบรายการสินค้าได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบรายการสินค้าได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบรายการสินค้าได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการสินค้าได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="สินค้า"
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
        totalData={dataProduct?.responseObject.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มสินค้าใหม่"
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="เพิ่มสินค้าใหม่"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="product-name"
            placeholder=""
            onChange={(e) => setProductName(e.target.value)}
            value={productName}
            label="ชื่อสินค้า"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "price", down: "product-detail" }}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.productName}
          />
          <InputAction
            id="product-detail"
            placeholder=""
            onChange={(e) => setProductDescription(e.target.value)}
            value={productDescription}
            label="รายละเอียดสินค้า"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "product-name", down: "group" }}
            classNameLabel="w-60 flex "
            classNameInput="w-full"

          />
          <MasterSelectComponent
            id="group"
            onChange={(option) => setGroup(option ? String(option.value) : null)}
            fetchDataFromGetAPI={fetchDataGroupDropdown}
            onInputChange={handleGroupProductSearch}
            valueKey="id"
            labelKey="name"
            placeholder="กรุณาเลือก..."
            label="กลุ่มสินค้า"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "product-detail", down: "unit" }}
            classNameLabel="w-60"
            classNameSelect="w-full"
            require="require"
            isError={errorFields.group}

          />
          <MasterSelectComponent
            id="unit"
            onChange={(option) => setUnit(option ? String(option.value) : null)}
            fetchDataFromGetAPI={fetchDataUnitDropdown}
            onInputChange={handleUnitSearch}
            valueKey="id"
            labelKey="name"
            placeholder="กรุณาเลือก..."
            label="หน่วยสินค้า"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "group", down: "price" }}
            classNameLabel="w-60"
            classNameSelect="w-full"
            require="require"
            isError={errorFields.unit}
          />
          <InputAction
            id="price"
            type="number"
            placeholder=""
            onChange={(e) => setPrice(Number(e.target.value))}
            value={price.toString()}
            label="ราคาหน่วย"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "unit", down: "product-name" }}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.price}
          />
        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขสินค้า"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
                        id="product-name"

            placeholder=""
            onChange={(e) => setProductName(e.target.value)}
            value={productName}
            label="ชื่อสินค้า"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "price", down: "product-detail" }}

            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editProductName}
          />
          <InputAction
                        id="product-detail"

            placeholder=""
            onChange={(e) => setProductDescription(e.target.value)}
            value={productDescription}
            label="รายละเอียดสินค้า"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "product-name", down: "group" }}

            classNameLabel="w-60 flex "
            classNameInput="w-full"
          />
          <MasterSelectComponent
            id="group"

            onChange={(option) => setGroup(option ? String(option.value) : null)}
            fetchDataFromGetAPI={fetchDataGroupDropdown}
            onInputChange={handleGroupProductSearch}
            valueKey="id"
            labelKey="name"
            placeholder="กรุณาเลือก..."
            label="กลุ่มสินค้า"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "product-detail", down: "unit" }}
            classNameLabel="w-60"
            classNameSelect="w-full"
            defaultValue={{ label: groupName, value: group }}
            require="require"
            isError={errorFields.editGroup}
          />
          <MasterSelectComponent
            id="unit"
            onChange={(option) => setUnit(option ? String(option.value) : null)}
            fetchDataFromGetAPI={fetchDataUnitDropdown}
            onInputChange={handleUnitSearch}
            valueKey="id"
            labelKey="name"
            placeholder="กรุณาเลือก..."
            label="หน่วยสินค้า"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "group", down: "price" }}
            classNameLabel="w-60"
            classNameSelect="w-full"
            defaultValue={{ label: unitName, value: unit }}
            require="require"
            isError={errorFields.editUnit}
          />
          <InputAction
                        id="price"

            placeholder=""
            onChange={(e) => setPrice(Number(e.target.value))}
            value={price.toString()}
            label="ราคาหน่วย"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "unit", down: "product-name" }}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editPrice}
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
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.product_name}</span></p>
      </DialogComponent>
    </div>
  );
}
