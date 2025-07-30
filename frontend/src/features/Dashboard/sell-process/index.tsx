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
import { useSelectTag, useTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse } from "@/types/response/response.tagColor";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { useAllCustomer } from "@/hooks/useCustomer";
import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import { deleteCustomer } from "@/services/customer.service";
import { useTeam } from "@/hooks/useTeam";
import { TypeTeamResponse } from "@/types/response/response.team";
import { useSelectEmployee, useSelectResponsible } from "@/hooks/useEmployee";
import { TypeAllEmployeeResponse } from "@/types/response/response.employee";
type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllCustomerResponse; //ตรงนี้
}[];

//
export default function SellProcess() {

  const [searchText, setSearchText] = useState("");

  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeAllCustomerResponse | null>(null);

  const [tagId, setTagId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [responsibleId, setResponsibleId] = useState<string | null>(null);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  const [filterGroup, setFilterGroup] = useState<string | null>(null);


  //searchText control
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchTag, setSearchTag] = useState("");



  //fetch team
  const { data: dataTeam, refetch: refetchTeam } = useTeam({
    page: "1",
    pageSize: "100",
    searchText: searchTeam,
  })
  const fetchDataTeamDropdown = async () => {
    const teamList = dataTeam?.responseObject?.data ?? [];
    return {
      responseObject: teamList.map((item: TypeTeamResponse) => ({
        id: item.team_id,
        name: item.name,
      })),
    };
  }
  const handleTeamSearch = (searchText: string) => {
    setSearchTeam(searchText);
    refetchTeam();
  };

  //fetch Employee

  const { data: dataEmployee, refetch: refetchEmployee } = useSelectEmployee({
    searchText: searchEmployee,
  });

  const fetchDataMemberInteam = async () => {
    const employeeList = dataEmployee?.responseObject?.data ?? [];
    return {
      responseObject: employeeList.map((item: TypeAllEmployeeResponse) => ({
        id: item.employee_id,
        name: `${item.first_name} ${item.last_name || ""}`,
      })),
    };
  };

  const handleEmployeeSearch = (searchText: string) => {
    setSearchEmployee(searchText);
    refetchEmployee();
  };

  //fetch ข้อมูล tag ลูกค้า

  const { data: dataTag, refetch: refetchTag } = useSelectTag({
    searchText: searchTag,
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
  const handleTagSearch = (searchText: string) => {
    setSearchTag(searchText);
    refetchTag();
  };

  //item จาก dropdown
  const dropdown = [
    {
      placeholder: "ทีม",
      fetchData: fetchDataTeamDropdown,
      onChange: (value: string | null) => {
        setTeamId(value)
        setSearchParams({ page: "1", pageSize });
      },
      handleChange: handleTeamSearch
    },
    {
      placeholder: "ผู้รับผิดชอบ",
      fetchData: fetchDataMemberInteam,
      onChange: (value: string | null) => {
        setResponsibleId(value)
        setSearchParams({ page: "1", pageSize });
      },
      handleChange: handleEmployeeSearch
    },
    {
      placeholder: "แท็กของลูกค้า",
      fetchData: fetchDataTagDropdown,
      onChange: (value: string | null) => {
        setTagId(value)
        setSearchParams({ page: "1", pageSize });
      },
      handleChange: handleTagSearch

    },
  ];

  //fetch customer
  const { data: dataCustomer, refetch: refetchCustomer } = useAllCustomer({
    page: page,
    pageSize: pageSize,
    searchText: searchCustomer,
    payload: {
      tag_id: tagId,
      team_id: teamId,
      responsible_id: responsibleId,
    },
  });
  useEffect(() => {
    console.log("Data:", dataCustomer);
    if (dataCustomer?.responseObject?.data) {

      const formattedData = dataCustomer.responseObject?.data.map(
        (item: TypeAllCustomerResponse, index) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            {
              value: (
                <div className="flex flex-col">
                  {item.company_name}
                  <div className="flex flex-row space-x-1">
                    {item.customer_tags && item.customer_tags.map((tag) => (

                      <TagCustomer nameTag={`${tag.group_tag.tag_name}`} color={`${tag.group_tag.color}`} />
                    ))}

                  </div>
                </div>
              ), className: "text-left"
            },
            { value: (<RatingShow value={item.priority} className="w-5 h-5" />), className: "text-left" },
            {
              value: "P010111222", className: "text-left"
            },
            {
              value: "15/2/2024", className: "text-center"
            },
            { value: item.responsible.first_name + " " + item.responsible.last_name, className: "text-left" },
            { value: item.team.name, className: "text-center" },
            { value: "รออนุมัติ", className: "text-left" },
            { value: "", className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataCustomer]);
  //
  const headers = [
    { label: "หมายเลขการขาย", colSpan: 1, className: "w-auto" },
    { label: "ลูกค้า", colSpan: 1, className: "w-auto" },
    { label: "ความสำคัญ", colSpan: 1, className: "w-auto " },
    { label: "หมายเลขใบสั่งขาย", colSpan: 1, className: "w-auto" },
    { label: "วันออกเอกสาร", colSpan: 1, className: "w-auto" },
    { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
    { label: "ทีม", colSpan: 1, className: "w-auto" },
    { label: "สถานะ", colSpan: 1, className: "w-auto" },
    { label: "มูลค่า", colSpan: 1, className: "w-auto" },

  ];

  //tabs บน headertable

  const groupTabs = [
    {
      id: "pending",
      name: "รอปิดการขายใบเสนอราคา",
      onChange: () => {
        setFilterGroup("ระหว่างดำเนินการ")
        setSearchParams({ page: "1", pageSize });
      }
    },
    {
      id: "close-sale",
      name: "ปิดการขายเรียบร้อย",
      onChange: () => {
        setFilterGroup("สำเร็จ")
        setSearchParams({ page: "1", pageSize });
      }
    },
    {
      id: "reject-sale",
      name: "ปิดการขายไม่สำเร็จ",
      onChange: () => {
        setFilterGroup("ไม่สำเร็จ")
        setSearchParams({ page: "1", pageSize });
      }

    }
  ];


  const handleNavCreate = () => {
    navigate('/create-customer');
  }
  //handle
  const handleSearch = () => {
    setSearchCustomer(searchText);
    setSearchParams({ page: "1", pageSize });

  };

  useEffect(() => {
    if (searchText === "") {
      setSearchCustomer(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText]);


  //เปิด
  const handleDeleteOpen = (item: TypeAllCustomerResponse) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);

  };

  //ปิด
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  //ยืนยันไดอะล็อค

  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.customer_id) {
      showToast("กรุณาระบุรายการสีที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteCustomer(selectedItem.customer_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการลูกค้าเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        refetchCustomer();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบรายการลูกค้าได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบรายการลูกค้าได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบรายการลูกค้าได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการลูกค้าได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="ติดตามกระบวนการขาย"
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
        totalData={dataCustomer?.responseObject?.totalCount}

        onDropdown={true}
        dropdownItem={dropdown}
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
        <p>ชื่อลูกค้า : <span className="text-red-500">{selectedItem?.company_name}</span></p>
      </DialogComponent>
    </div>
  );
}
