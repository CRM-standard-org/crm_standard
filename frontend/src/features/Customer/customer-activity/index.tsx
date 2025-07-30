import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import { useToast } from "@/components/customs/alert/ToastContext";

//
import { useNavigate, useSearchParams } from "react-router-dom";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import { TypeAllActivityResponse } from "@/types/response/response.activity";
import { useAllActivities } from "@/hooks/useCustomerActivity";
import { deleteActivity } from "@/services/activity.service";
import { useTeam } from "@/hooks/useTeam";
import { TypeTeamResponse } from "@/types/response/response.team";
import { useSelectEmployee, useSelectResponsible } from "@/hooks/useEmployee";
import { useAllCustomer } from "@/hooks/useCustomer";
import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import { TypeAllEmployeeResponse } from "@/types/response/response.employee";


type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeAllActivityResponse;
}[];

//
export default function CustomerActivity() {
  const [searchText, setSearchText] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [selectedItem, setSelectedItem] = useState<TypeAllActivityResponse | null>(null);


  const [customer, setCustomer] = useState<string | null>(null);
  const [responsibleId, setResponsibleId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  const [filterGroup, setFilterGroup] = useState<string | null>(null);

  //searchText control
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchActivity, setSearchActivity] = useState("");

 


  //fetch all activity
  const { data: dataActitvities, refetch: refetchActivity } = useAllActivities({
    page: page,
    pageSize: pageSize,
    searchText: searchActivity,
    payload: {
      customer_id: customer,
      responsible_id: responsibleId,
      team_id: teamId,
    }
  });


  useEffect(() => {

    if (dataActitvities?.responseObject?.data) {

      const formattedData = dataActitvities.responseObject?.data.map(
        (item: TypeAllActivityResponse) => ({
          className: "",
          cells: [
            {
              value: (
                <div className="flex flex-col">
                  {new Date(item.issue_date).toLocaleDateString("th-TH")}
                  <div className="">

                    เวลา {item.activity_time} น.
                  </div>
                </div>
              )


              , className: "text-left"
            },
            {
              value: <div className="flex flex-col">
                {item.customer.company_name}
                <div className="flex flex-row space-x-1">
                  {item.customer.customer_tags && item.customer.customer_tags.map((tag) => (

                    <TagCustomer nameTag={`${tag.group_tag.tag_name}`} color={`${tag.group_tag.color}`} />
                  ))}

                </div>
              </div>, className: "text-left"
            },
            { value: item.activity_description, className: "text-left" },
            {
              value: (
                <div className="flex flex-col">
                  {item.customer.customer_contact &&
                    item.customer.customer_contact.map((contact, index) => (
                      <div key={contact.customer_contact_id ?? index}>
                        {contact.name}
                        <div className="flex flex-row space-x-1">
                          โทร: {contact.phone}
                        </div>
                      </div>
                    ))}
                </div>
              ),
              className: "text-left"
            },
            { value: item.responsible.first_name + "" + item.responsible.last_name, className: "text-center" },
            { value: item.team.name, className: "text-center" },

          ],
          data: item,
        })

      );
      setData(formattedData);
    }
  }, [dataActitvities]);


  // const dropdown = [
  //   {
  //     placeholder: "ทีม",
  //     fetchData: async () => {
  //       return {
  //         responseObject: [
  //           { id: 1, name: "ทีม A" },
  //           { id: 2, name: "ทีม B" },
  //         ],
  //       };
  //     },
  //   },
  //   {
  //     placeholder: "ผู้รับผิดชอบ",
  //     fetchData: async () => {
  //       return {
  //         responseObject: [
  //           { id: 1, name: "นาย A" },
  //           { id: 2, name: "นาย B" },
  //         ],
  //       };
  //     },
  //   },
  //   {
  //     placeholder: "ลูกค้า",
  //     fetchData: async () => {
  //       return {
  //         responseObject: [
  //           { id: 1, name: "บริษัท A" },
  //           { id: 2, name: "บริษัท B" },
  //         ],
  //       };
  //     },
  //   },
  // ];
  //item จาก dropdown
  //fetch customer
  const { data: dataCustomer, refetch: refetchCustomer } = useAllCustomer({
    page: "1",
    pageSize: "100",
    searchText: "",
    payload: {
        tag_id: null,
        team_id: null,
        responsible_id: null,
    }
});

//auto fill by id customer
const fetchDataCustomerDropdown = async () => {
    const customerList = dataCustomer?.responseObject?.data ?? [];
    return {
        responseObject: customerList.map((item: TypeAllCustomerResponse) => ({
            id: item.customer_id,
            name: item.company_name,

        })),
    }
}
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

  const dropdown = [
    {
      placeholder: "ลูกค้า",
      fetchData: fetchDataCustomerDropdown,
      onChange: (value: string | null) => {
        setCustomer(value)
        setSearchParams({ page: "1", pageSize });
      },
      // handleChange: handleTagSearch

    },
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
   
  ];

  //
  const headers = [
    { label: "วันเวลาของกิจกรรม", colSpan: 1, className: "min-w-20" },
    { label: "ลูกค้า", colSpan: 1, className: "min-w-60" },
    { label: "รายละเอียดกิจกรรม", colSpan: 1, className: "min-w-60" },
    { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "min-w-60 " },
    { label: "ผู้รับผิดชอบ", colSpan: 1, className: "min-w-20" },
    { label: "ทีม", colSpan: 1, className: "min-w-20" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];
  const idPath = 'Customer1'
  const mockData = [
    {
      className: "",
      cells: [
        {
          value: (
            <div className="flex flex-col">
              19 ก.พ. 2568
              <div className="flex flex-row space-x-1">
                เวลา 14:55 น.
              </div>
            </div>
          ), className: "text-left"
        },
        {
          value: (
            <div className="flex flex-col">
              บริษัท จอมมี่จำกัด
              <div className="flex flex-row space-x-1">
                <TagCustomer nameTag="B2B" color="#CC0033" />
              </div>
            </div>
          ), className: "text-left"
        },
        { value: "ยื่นใบเสนอราคา", className: "text-left" },
        {
          value: (
            <div className="flex flex-col">
              คุณโชคชัย
              <div className="flex flex-row space-x-1">
                โทร : 09*-***-****
              </div>
            </div>
          ), className: "text-left"
        },
        { value: "จอมปราชญ์ รักโลก", className: "text-left" },
        { value: "A", className: "text-center" },
      ],
      data: {
        color_name: "Red",
        color_id: 1,
      },
    },
    {
      className: "",
      cells: [
        {
          value: (
            <div className="flex flex-col">
              19 ก.พ. 2568
              <div className="flex flex-row space-x-1">
                เวลา 13:55 น.
              </div>
            </div>
          ), className: "text-left"
        },
        {
          value: (
            <div className="flex flex-col">
              บริษัท นาเดียจำกัด
              <div className="flex flex-row space-x-1">
                <TagCustomer nameTag="VIP" color="#FFCC33" />
                <TagCustomer nameTag="B2B" color="#CC0033" />

              </div>
            </div>
          ), className: "text-left"
        },
        { value: "ยื่นใบเสนอราคา", className: "text-left" },
        {
          value: (
            <div className="flex flex-col">
              คุณจรรยา
              <div className="flex flex-row space-x-1">
                โทร : 09*-***-****
              </div>
            </div>
          ), className: "text-left"
        },
        { value: "เมฆา อัปชาสร", className: "text-left" },
        { value: "B", className: "text-center" },
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
      id: "customer-activity",
      name: "บันทึกกิจกรรมลูกค้า",
      onChange: () => setFilterGroup(null)
    }


  ];
  useEffect(() => {
    if (searchText === "") {
      setSearchActivity(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText]);

  const handleNavCreate = () => {
    navigate('/create-activity');
  }
  //handle
  const handleSearch = () => {
    setSearchActivity(searchText);
    setSearchParams({ page: "1", pageSize });
  };




  //เปิด
 
  const handleEditOpen = (item: TypeAllActivityResponse) => {
    navigate(`/edit-customer-activity/${item.activity_id}`);
  };

  const handleDeleteOpen = (item: TypeAllActivityResponse) => {
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


  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.activity_id) {
      showToast("กรุณาระบุกิจกรรมที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteActivity(selectedItem.activity_id);

      if (response.statusCode === 200) {
        showToast("ลบกิจกรรมเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        refetchActivity();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบกิจกรรมได้", false);
        }
        else {
          showToast("ไม่สามารถลบกิจกรรมได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบกิจกรรมได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบกิจกรรมได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="บันทึกกิจกรรมของลูกค้า"
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
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        headers={headers}
        rowData={data}
        totalData={dataActitvities?.responseObject?.totalCount}
        onCreateBtn={true} // ให้มีปุ่ม create เพิ่มมารป่าว
        onCreateBtnClick={handleNavCreate}
        nameCreateBtn="+ สร้างบันทึกกิจกรรม"
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
        <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าต้องการกิจกรรมนี้?</p>
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.activity_description} </span></p>
      </DialogComponent>
    </div>
  );
}
