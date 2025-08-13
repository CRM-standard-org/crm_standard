import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { useCustomerStatus } from "@/hooks/useCustomerStatus";
import { deleteCustomerStatus } from "@/services/customerStatus.service";
import { TypeCustomerStatusResponse } from "@/types/response/response.customerStatus";
import { useToast } from "@/components/customs/alert/ToastContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

export default function CustomerInfo() {
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState<TypeCustomerStatusResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  const { data: dataStatus, refetch: refetchStatus } = useCustomerStatus({ page, pageSize, searchText: searchTextDebouce });
  type RowType = { className: string; cells: { value: string | number; className: string }[]; data: TypeCustomerStatusResponse }[];
  const [data, setData] = useState<RowType>([]);

  useEffect(() => {
    if (dataStatus?.responseObject?.data) {
      const formattedData = dataStatus.responseObject.data.map((item: TypeCustomerStatusResponse, index: number) => ({
        className: "",
        cells: [
          { value: index + 1, className: "text-center" },
          { value: item.name, className: "text-left" },
          { value: item.category || '-', className: "text-left" },
          { value: item.is_active ? 'ใช้งาน' : 'ปิด', className: "text-center" },
          { value: item.start_condition, className: "text-left" },
          { value: item.end_condition, className: "text-left" },
          { value: item.description ?? "-", className: "text-left" },
        ],
        data: item,
      }));
      setData(formattedData);
    }
  }, [dataStatus]);

  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-20" },
    { label: "สถานะของลูกค้า", colSpan: 1, className: "min-w-40" },
    { label: "หมวดหมู่", colSpan: 1, className: "min-w-32" },
    { label: "ใช้งาน", colSpan: 1, className: "min-w-20" },
    { label: "เงื่อนไขการเริ่มต้นสถานะ", colSpan: 1, className: "min-w-40" },
    { label: "เงื่อนไขการสิ้นสุดสถานะ", colSpan: 1, className: "min-w-40" },
    { label: "รายละเอียดเพิ่มเติม", colSpan: 1, className: "min-w-40" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText, pageSize, setSearchParams]);

  //handle
  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    setSearchParams({ page: "1", pageSize });
  };

  const handleEditOpen = (item: TypeCustomerStatusResponse) => {
    navigate(`/edit-customer-status/${item.customer_status_id}`);
  };
  const handleDeleteOpen = (item: TypeCustomerStatusResponse) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteClose = () => setIsDeleteDialogOpen(false);
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      const response = await deleteCustomerStatus(selectedItem.customer_status_id);
      if (response.statusCode === 200) {
        showToast('ลบสถานะสำเร็จ', true);
        handleDeleteClose();
        refetchStatus();
      } else showToast(response.message || 'ลบไม่สำเร็จ', false);
    } catch {
      showToast('ลบไม่สำเร็จ', false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="กำหนดข้อมูลพื้นฐานลูกค้า"
        hideTitleBtn={true}
        inputs={[{ id: "search_input", value: searchText, size: "3", placeholder: "ค้นหา....", onChange: setSearchText, onAction: handleSearch }]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataStatus?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={() => navigate('/create-info-customer')}
        nameCreateBtn="+ เพิ่มสถานะใหม่"
      />

      <DialogComponent
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        title="ยืนยันการลบ"
        onConfirm={handleDeleteConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.name}</span></p>
      </DialogComponent>
    </div>
  );
}
