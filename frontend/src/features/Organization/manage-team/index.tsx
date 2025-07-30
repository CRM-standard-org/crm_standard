import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";

//fetch tag
import { useTag } from "@/hooks/useCustomerTag";
import { TypeTeamResponse } from "@/types/response/response.team";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import { useTeam } from "@/hooks/useTeam";
import { deleteTeam } from "@/services/team.service";
type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeTeamResponse; //ตรงนี้
}[];

//
export default function ManageTeam() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeTeamResponse | null>(null);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTeam, setSearchTeam] = useState("");

  const [allQuotation, setAllQuotation] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);
  
  const [filterGroup, setFilterGroup] = useState<string | null>(null);

  const { data: dataTeam, refetch: refetchTeam } = useTeam({
    page: page,
    pageSize: pageSize,
    searchText: searchTeam,
  });


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

  useEffect(() => {
    console.log("Data:", dataTeam);
    if (dataTeam?.responseObject?.data) {
      const formattedData = dataTeam.responseObject?.data.map(
        (item: TypeTeamResponse) => ({
          className: "",
          cells: [
            { value: item.name, className: "text-center" },
            { value: item.head_name, className: "text-left" },
            { value: item._count.employee_team, className: "text-center" },
            // { value: item.description, className: "text-left" },
            { value: "THB 999,999", className: "text-right" },
            { value: "THB 999,999", className: "text-right" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataTeam]);

  //item จาก dropdown


  //
  const headers = [
    { label: "ชื่อทีม", colSpan: 1, className: "w-auto" },
    { label: "หัวหน้าทีม", colSpan: 1, className: "mw-auto" },
    { label: "จำนวนสมาชิก", colSpan: 1, className: "w-auto" },
    // { label: "รายละเอียดทีม", colSpan: 1, className: "min-w-80" },
    { label: "มูลค่างานที่รับผิดชอบ", colSpan: 1, className: "w-auto" },
    { label: "มูลค่างานที่ปิดการขาย", colSpan: 1, className: "w-auto" },
    { label: "ดูรายละเอียด", colSpan: 1, className: "w-auto" },
    { label: "ลบ", colSpan: 1, className: "w-auto" },
  ];

  

  //tabs บน headertable

  const groupTabs = [
    {
      id: "all",
      name: "ทีม",
      onChange: () => {
        setFilterGroup("ทีม");
        setSearchParams({ page: "1", pageSize });

      }
    },
    
  
  ];
 

  const handleNavCreate = () => {
    navigate('/create-team');
  }
  //handle
  const handleSearch = () => {
    setSearchTeam(searchText);
    setSearchParams({ page: "1", pageSize });

  };
  useEffect(() => {
    if (searchText === "") {
      setSearchTeam(searchText);
      setSearchParams({ page: "1", pageSize });

    }
  }, [searchText]);

  const handleView = (item: TypeTeamResponse) => {
    navigate(`/team-details/${item.team_id}`);
  }
  
  //เปิด
  const handleDeleteOpen = (item: TypeTeamResponse) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);

  };

  //ปิด
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };



  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.name || !selectedItem.head_name || !selectedItem.team_id) {
      showToast("กรุณาระบุรายการสีที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteTeam(selectedItem.team_id);

      if (response.statusCode === 200) {
        showToast("ลบทีมเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });
        refetchTeam();
      }
      else if (response.statusCode === 400) {
        if (response.message === "There are still members in the team.") {
          showToast("ไม่สามารถลบทีมนี้ได้ เนื่องจากยังมีสมาชิกในทีมอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบทีมนี้ได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบทีมนี้ได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบทีมนี้ได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="จัดการทีม"
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
        totalData={dataTeam?.responseObject?.totalCount}
        onView={handleView}
        onDelete={handleDeleteOpen}
        onCreateBtn={true} // ให้มีปุ่ม create เพิ่มมารป่าว
        onCreateBtnClick={handleNavCreate}
        nameCreateBtn="+ เพิ่มทีมใหม่"
        headerTab={true}
        groupTabs={groupTabs}
      />


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
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.name}</span></p>
      </DialogComponent>

      
    </div>
  );
}
