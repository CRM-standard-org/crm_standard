import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useSearchParams } from "react-router-dom";

import { TypeCurrencyResponse } from "@/types/response/response.currency";
import { useCurrency } from "@/hooks/useCurrency";
import { deleteCurrency, postCurrency, updateCurrency } from "@/services/currency.service";


type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeCurrencyResponse; //ตรงนี้
}[];

//
export default function Currency() {
  const [searchText, setSearchText] = useState("");

  //variable
  const [currencyName, setCurrencyName] = useState("");

  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeCurrencyResponse | null>(null);

  const { showToast } = useToast();
  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchPayment, setSearchPayment] = useState("");

  const { data: dataCurrency, refetch: refetchCurrency } = useCurrency({
    page: page,
    pageSize: pageSize,
    searchText: searchPayment,
  });



  useEffect(() => {
    // console.log("Data:", dataTag);
    if (dataCurrency?.responseObject?.data) {
      const formattedData = dataCurrency.responseObject?.data.map(
        (item: TypeCurrencyResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.currency_name, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataCurrency]);


  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-10" },
    { label: "ชื่อสกุลเงิน", colSpan: 1, className: "min-w-80" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];

  
  //handle
  const handleSearch = () => {
    setSearchPayment(searchText);
    setSearchParams({ page: "1", pageSize });


  };
  useEffect(() => {
    if (searchText === "") {
      setSearchPayment(searchText);
      setSearchParams({ page: "1", pageSize });

    }
  }, [searchText]);


  //เปิด
  const handleCreateOpen = () => {
    setCurrencyName("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeCurrencyResponse) => {
    setSelectedItem(item);
    setCurrencyName(item.currency_name);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeCurrencyResponse) => {
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

    if (!currencyName) errorMap.currencyName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await postCurrency({ 
        currency_name: currencyName, // ใช้ชื่อ field ที่ตรงกับ type

      });

      if (response.statusCode === 200) {
        setCurrencyName("");
        handleCreateClose();
        showToast("สร้างสกุลเงินเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });
        refetchCurrency();
      } else {
        showToast("สกุลเงินนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างสกุลเงินได้", false);
    }
  };

  const handleEditConfirm = async () => {
    const errorMap: Record<string, boolean> = {};

    if (!currencyName) errorMap.editCurrencyName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await updateCurrency(selectedItem.currency_id, {
        currency_name: currencyName, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขสกุลเงินเรียบร้อยแล้ว", true);
        setCurrencyName("");
        setIsEditDialogOpen(false);
        refetchCurrency();
      } else {
        showToast("สกุลเงินนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขสกุลเงินได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.currency_id) {
      showToast("กรุณาระบุสกุลเงินที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteCurrency(selectedItem.currency_id);

      if (response.statusCode === 200) {
        showToast("ลบสกุลเงินเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });
        refetchCurrency();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบสกุลเงินได้ เนื่องจากมีการใช้งานอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบสกุลเงินได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบสกุลเงินได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบสกุลเงินได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="สกุลเงิน"
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
        totalData={dataCurrency?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มสกุลเงินใหม่"
      />
      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="เพิ่มสกุลเงินใหม่"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="currency-name"
            placeholder="ชื่อสกุลเงิน"
            onChange={(e) => setCurrencyName(e.target.value)}
            value={currencyName}
            label="ชื่อสกุลเงิน"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.currencyName}
          />
        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขสกุลเงิน"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="currency-name"
            placeholder="ชื่อสกุลเงิน"
            onChange={(e) => setCurrencyName(e.target.value)}
            value={currencyName}
            label="ชื่อสกุลเงิน"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editCurrencyName}
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
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.currency_name} </span></p>
      </DialogComponent>
    </div>
  );
}
