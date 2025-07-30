import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import MasterSelectComponent from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import TextAreaForm from "@/components/customs/textAreas/textAreaForm";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams, useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import TagSelectComponent from "@/components/customs/tagCustomer/tagselect.main.component";
import { OptionColorType } from "@/components/customs/tagCustomer/tagselect.main.component";



//Character 
import { useCustomerCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";

import Rating from "@/components/customs/rating/rating.main.component";
//employee
import { TypeEmployeeResponse } from "@/types/response/response.employee";

import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { LuPencil } from "react-icons/lu";
import { useTeamMember } from "@/hooks/useTeam";
import { TypeMemberInTeamResponse, TypeTeamMember, TypeTeamMemberResponse } from "@/types/response/response.team";
import { deleteMemberTeam } from "@/services/team.service";
import { leaderResponse } from '../../../types/response/response.team';
import { LabelWithValue } from "@/components/ui/label";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeMemberInTeamResponse; //ตรงนี้
}[];

//
export default function TeamDetails() {
    const [searchText, setSearchText] = useState("");
    const { teamId } = useParams<{ teamId: string }>();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeMemberInTeamResponse | null>(null);

    // variable form create customer 
    const [firstContact, setFirstContact] = useState("");
    const [position, setPosition] = useState("");
    const [character, setCharacter] = useState<string | null>(null);
    const [telNo, setTelNo] = useState("");
    const [email, setEmail] = useState("");
    const [contactOption, setContactOption] = useState<string | null>(null);
    const [contact, setContact] = useState("");
    const [priority, setPriority] = useState<number>(0);

    const [company, setCompany] = useState("");
    const [typeCompany, setTypeCompany] = useState("");
    const [addressCompany, setAddressCompany] = useState("");
    const [telNoCompany, setTelNoCompany] = useState("");
    const [customerTag, setCustomerTag] = useState("");
    const [role, setRole] = useState<string | null>(null);
    const [emailCompany, setEmailCompany] = useState("");
    const [identifyNo, setIdentifyNo] = useState("");
    const [note, setNote] = useState("");

    const [placeName, setPlaceName] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState<string | null>(null);
    const [province, setProvince] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);

    const [team, setTeam] = useState<string | null>(null);
    const [responsible, setResponsible] = useState<string | null>(null);
    const [telNoResponsible, setTelNoResponsible] = useState("");
    const [emailResponsible, setEmailResponsible] = useState("");



    const [colorsName, setColorsName] = useState("");
    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [dataMemberInTeam, setDataMemberInTeam] = useState<dateTableType>([]);
    const [dataLeader, setDataLeader] = useState<leaderResponse>();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<OptionColorType[]>([]);

    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const [allQuotation, setAllQuotation] = useState<any[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);

    const [filterGroup, setFilterGroup] = useState<string | null>(null);

    //fetch team details
    if (!teamId) {
        throw Error;
    }

    const { data: dataTeamMember, refetch: refetchTeamMember } = useTeamMember({
        team_id: teamId,
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });

    useEffect(() => {
        // console.log("Data:", dataTeamMember);
        if (dataTeamMember?.responseObject?.data) {
            const formattedData = dataTeamMember.responseObject?.data.member.map(
                (item: TypeMemberInTeamResponse) => ({
                    className: "",
                    cells: [
                        { value: item.employee_code, className: "text-center" },
                        { value: item.first_name + " " + item.last_name, className: "text-left" },
                        { value: item.position ?? "-", className: "text-center" },
                        { value: new Date(item.start_date).toLocaleDateString("th-TH") ?? "-", className: "text-center" },
                        { value: item.employee_status?.name ?? "-", className: "text-center" }
                    ],
                    data: item,
                })
            );
            setDataMemberInTeam(formattedData);
        }
        fetchDataLeader();
    }, [dataTeamMember, dataLeader]);

    console.log(dataMemberInTeam)
    const fetchDataLeader = async () => {

        if (dataTeamMember?.responseObject?.data.leader) {
            setDataLeader(dataTeamMember.responseObject.data.leader);
        }
        return;
    };



    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce(searchText);

        }
    }, [searchText]);



 

    //tabs บน headertable
    const groupTabs = [
        {
            id: "all",
            name: "งานที่รับผิดชอบ",
            onChange: () => setFilterGroup(null)
        },



    ];
    const headers = [
        { label: "รหัสพนักงาน", colSpan: 1, className: "w-auto" },
        { label: "ชื่อ-นามสกุล", colSpan: 1, className: "w-auto" },
        { label: "ตำแหน่ง", colSpan: 1, className: "w-auto" },
        { label: "วันเริ่มทำงาน", colSpan: 1, className: "w-auto" },
        { label: "สถานะ", colSpan: 1, className: "w-auto" },
        { label: "เอาออก", colSpan: 1, className: "w-auto" },
    ];
    //handle
    const handleSearch = () => {
        setSearchTextDebouce(searchText);
        refetchTeamMember();
       
    };
    const handleNavCreate = () => {
        navigate('/create-employee');
    }
    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce(searchText);

        }
    }, [searchText]);

    //เปิด
    const handleEditOpen = (item: TypeMemberInTeamResponse) => {
        setSelectedItem(item);
        setIsEditDialogOpen(true);
    };
    const handleDeleteOpen = (item: TypeMemberInTeamResponse) => {
        setSelectedItem(item);
        setIsDeleteDialogOpen(true);

    };
    //ปิด
    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
    };
    const handleEditClose = () => {
        setIsEditDialogOpen(false);
    };

    //ลบสมาชิกในทีมๆนั้น
    const handleDeleteConfirm = async () => {
        if (!selectedItem) {
            showToast("กรุณาระบุรายการบทบาทที่ต้องการลบ", false);
            return;
        }


        try {
            const response = await deleteMemberTeam(teamId, {
                employee_id: selectedItem.employee_id
            });

            if (response.statusCode === 200) {
                showToast("ลบสมาชิกในทีมเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);
                refetchTeamMember();
            }
            else if (response.statusCode === 400) {
                if (response.message === "Color in quotation") {
                    showToast("ไม่สามารถลบสมาชิกในทีมได้ เนื่องจากมีใบเสนอราคาอยู่", false);
                }
                else {
                    showToast("ไม่สามารถลบสมาชิกในทีมได้", false);
                }
            }
            else {
                showToast("ไม่สามารถลบสมาชิกในทีมได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบสมาชิกในทีมได้", false);
        }
    };



    return (
        <>
            <h1 className="text-2xl font-bold mb-3">รายละเอียดทีม : <span className="text-blue-700">{dataTeamMember?.responseObject?.data?.team?.team}</span></h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mb-7">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลพนักงาน */}
                    <div className="flex justify-between mb-1">
                        <h1 className="text-xl font-semibold">ข้อมูลหัวหน้าทีม</h1>


                        <Link to={`/edit-team-details/${teamId}`}>
                            <Buttons
                                btnType="primary"
                                variant="outline"
                                className="w-30 "
                            >
                                <LuPencil style={{ fontSize: "18px" }} />
                                แก้ไข
                            </Buttons>
                        </Link>

                    </div>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* ฝั่งซ้าย */}
                        <div className="space-y-4">

                            <div className="">

                                <LabelWithValue label="รหัสพนักงาน" value={`${dataLeader?.employee_code}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="ชื่อ-นามสกุล" value={`${dataLeader?.first_name} ${dataLeader?.last_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="ตำแหน่ง" value={`${dataLeader?.position}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">



                            <div className="">

                                <LabelWithValue label="วันเริ่มทำงาน" value={`${dataLeader?.start_date}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="สถานะ" value={`${dataLeader?.employee_status}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>

                        </div>
                    </div>

                    {/* รายละเอียดพนักงาน */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดพนักงาน</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* ฝั่งซ้าย */}
                        <div className="space-y-4">

                            <div className="">

                                <LabelWithValue label="ประเทศ" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="จังหวัด" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">

                                <LabelWithValue label="อำเภอ" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                            <div className="">


                                <LabelWithValue label="ที่อยู่" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />

                            </div>
                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">

                            <div className="">
                                <LabelWithValue label="เบอร์โทรศัพท์" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="อีเมล" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="LINE" value={`สมมติ`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            <MasterTableFeature
                title="สมาชิกในทีม"
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
                rowData={dataMemberInTeam}
                totalData={dataTeamMember?.responseObject?.data.member.length}
                onDelete={handleDeleteOpen}
                hidePagination={true}
                headerTab={true}
                groupTabs={groupTabs}
            />

            <div className="flex justify-center md:justify-end space-x-5 mt-5">

                <Link to="/manage-team">
                    <Buttons
                        btnType="cancel"
                        variant="soft"
                        className="w-30 "
                    >
                        ยกเลิก
                    </Buttons>
                </Link>

            </div>
            {/* ลบ */}

            <DialogComponent
                isOpen={isDeleteDialogOpen}
                onClose={handleDeleteClose}
                title="ยืนยันการลบ"
                onConfirm={handleDeleteConfirm}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าต้องการเอาออกจากทีม?</p>
                <p>ชื่อ : <span className="text-red-500">{selectedItem?.first_name} {selectedItem?.last_name}</span></p>
            </DialogComponent>
        </>

    );
}
