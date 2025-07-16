import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {

  postColor,
  updateColor,
  deleteColor,
} from "@/services/color.service";
import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useColor } from "@/hooks/useColor";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import { TypeAllActivityResponse } from "@/types/response/response.activity";
import { useAllActivities } from "@/hooks/useCustomerActivity";
import { deleteActivity } from "@/services/activity.service";


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
  const [colorsName, setColorsName] = useState("");
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
  const [responseId, setResponseId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [searchActivity, setSearchActivity] = useState("");


  //fetch quotation
  const { data: dataActitvities, refetch: refetchActivity } = useAllActivities({
    page: page,
    pageSize: pageSize,
    searchText: searchActivity,
    payload: {
      customer_id: customer,
      responsible_id: responseId,
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


  const dropdown = [
    {
      placeholder: "ทีม",
      fetchData: async () => {
        return {
          responseObject: [
            { id: 1, name: "ทีม A" },
            { id: 2, name: "ทีม B" },
          ],
        };
      },
    },
    {
      placeholder: "ผู้รับผิดชอบ",
      fetchData: async () => {
        return {
          responseObject: [
            { id: 1, name: "นาย A" },
            { id: 2, name: "นาย B" },
          ],
        };
      },
    },
    {
      placeholder: "ลูกค้า",
      fetchData: async () => {
        return {
          responseObject: [
            { id: 1, name: "บริษัท A" },
            { id: 2, name: "บริษัท B" },
          ],
        };
      },
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
  const handleCreateOpen = () => {
    setColorsName("");
    setIsCreateDialogOpen(true);
  };
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
        onPopCreate={handleCreateOpen}
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
