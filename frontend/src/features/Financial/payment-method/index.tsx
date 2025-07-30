import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerRole } from "@/hooks/useCustomerRole";
import { TypePaymentmethodResponse } from "@/types/response/response.payment";
import { usePayment } from "@/hooks/usePayment";
import { deletePayment, postPayment, updatePayment } from "@/services/paymentMethod.service";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypePaymentmethodResponse; //ตรงนี้
}[];

//
export default function PaymentMethod() {
  const [searchText, setSearchText] = useState("");

  const [paymentMethodName, setPaymentMethodName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypePaymentmethodResponse | null>(null);

  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchRole, setSearchRole] = useState("");


  const { data: dataPayment, refetch: refetchPayment } = usePayment({
    page: page,
    pageSize: pageSize,
    searchText: searchRole,
  });

  useEffect(() => {

    if (dataPayment?.responseObject?.data) {
      const formattedData = dataPayment.responseObject?.data.map(
        (item: TypePaymentmethodResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.payment_method_name, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataPayment]);


  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-10" },
    { label: "ชื่อสกุลเงิน", colSpan: 1, className: "min-w-80" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];



  //handle
  const handleSearch = () => {
    setSearchRole(searchText);
    setSearchParams({ page: "1", pageSize });
  };
  useEffect(() => {
    if (searchText === "") {
      setSearchRole(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText]);
  
  //เปิด
  const handleCreateOpen = () => {
    setPaymentMethodName("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypePaymentmethodResponse) => {
    setSelectedItem(item);
    setPaymentMethodName(item.payment_method_name);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypePaymentmethodResponse) => {
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

    if (!paymentMethodName) errorMap.paymentMethodName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await postPayment({
        payment_method_name: paymentMethodName, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        setPaymentMethodName("");
        handleCreateClose();
        showToast("สร้างวิธีการชำระเงินเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });
        refetchPayment();
      } else {
        showToast("วิธีการชำระเงินนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างวิธีการชำระเงินได้", false);
    }
  };

  const handleEditConfirm = async () => {
    const errorMap: Record<string, boolean> = {};

    if (!paymentMethodName) errorMap.editPaymentMethodName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }

    try {
      const response = await updatePayment(selectedItem.payment_method_id, {
        payment_method_name: paymentMethodName, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขวิธีการชำระเงินเรียบร้อยแล้ว", true);
        setPaymentMethodName("");
        setIsEditDialogOpen(false);
        refetchPayment();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขวิธีการชำระเงินได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.payment_method_name) {
      showToast("กรุณาระบุวิธีการชำระเงินที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deletePayment(selectedItem.payment_method_id);

      if (response.statusCode === 200) {
        showToast("ลบช่องทางการชำระเงินเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });
        refetchPayment();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบช่องทางการชำระเงินได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบช่องทางการชำระเงินได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบช่องทางการชำระเงินได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบช่องทางการชำระเงินได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="ช่องทางการชำระเงิน"
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
        totalData={dataPayment?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มช่องทางการชำระเงิน"
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างช่องทางการชำระเงิน"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="payment-name"
            placeholder="ชื่อช่องทางการชำระเงิน"
            onChange={(e) => setPaymentMethodName(e.target.value)}
            value={paymentMethodName}
            label="ชื่อช่องทางการชำระเงิน"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.paymentMethodName}
          />

        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขช่องทางการชำระเงิน"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="payment-name"
            placeholder="ชื่อช่องทางการชำระเงิน"
            onChange={(e) => setPaymentMethodName(e.target.value)}
            value={paymentMethodName}
            label="ชื่อช่องทางการชำระเงิน"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-60 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editPaymentMethodName}
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
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.payment_method_name} </span></p>
      </DialogComponent>
    </div>

  );
}
