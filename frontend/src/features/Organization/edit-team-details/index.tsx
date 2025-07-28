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

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
//
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";


import { useTeamMember } from "@/hooks/useTeam";
import { deleteMemberTeam, editMemberTeam, editTeam, postTeam } from "@/services/team.service";


//employee
import { useEmployeeNoneTeam } from "@/hooks/useEmployee";
import { TypeAllEmployeeResponse, TypeEmployeeResponse } from "@/types/response/response.employee";
import { TypeMemberInTeamResponse } from "@/types/response/response.team";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeMemberInTeamResponse; //ตรงนี้
}[];

//
export default function EditTeamDetails() {
    const [searchTextEmployee, setSearchTextEmployee] = useState("");
    const [searchTextTeamMember, setSearchTextTeamMember] = useState("");
    const { teamId } = useParams<{ teamId: string }>();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeMemberInTeamResponse | null>(null);

    // variable form create team
    const [teamName, setTeamName] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [headId, setHeadId] = useState<string | null>(null);
    const [headName, setHeadName] = useState("");
    const [checkHead, setCheckHead] = useState<string | null>(null);

    const [employees, setEmployees] = useState<string[]>([]);

    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [dataMemberInTeam, setDataMemberInTeam] = useState<dateTableType>([]);


    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextTeamMemberDebouce, setSearchTextTeamMemberDebouce] = useState("");
    const [searchTextEmployeeDebouce, setSearchTextEmployeeDebouce] = useState("");

    const [allQuotation, setAllQuotation] = useState<any[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);

    const [filterGroup, setFilterGroup] = useState<string | null>(null);

    //tabs บน headertable
    const groupTabs = [
        {
            id:"team-member",
            name: "สมาชิกทีม",
            onChange: () => setFilterGroup(null)
        },


    ];
    //header ของสมาชิกในทีม
    const headerTeams = [
        { label: "รหัสพนักงาน", colSpan: 1, className: "w-auto" },
        { label: "ชื่อ-นามสกุล", colSpan: 1, className: "w-auto" },
        { label: "ตำแหน่ง", colSpan: 1, className: "w-auto" },
        { label: "วันเริ่มทำงาน", colSpan: 1, className: "w-auto " },
        { label: "สถานะ", colSpan: 1, className: "w-auto" },
        { label: "เอาออก", colSpan: 1, className: "w-auto" },
    ];
    //header ของพนักงานที่ไม่มีทีม
    const headers = [
        { label: "รหัสพนักงาน", colSpan: 1, className: "w-auto" },
        { label: "ชื่อ-นามสกุล", colSpan: 1, className: "w-auto" },
        { label: "ตำแหน่ง", colSpan: 1, className: "w-auto" },
        { label: "วันเริ่มทำงาน", colSpan: 1, className: "w-auto " },
        { label: "สถานะ", colSpan: 1, className: "w-auto" },
        { label: "จัดการ", colSpan: 1, className: "w-auto" },
    ];



    //fetch team details
    if (!teamId) {
        throw Error;
    }
    const { data: dataTeamMember, refetch: refetchTeamMember } = useTeamMember({
        team_id: teamId,
        page: page,
        pageSize: pageSize,
        searchText: searchTextTeamMemberDebouce,
    });

    useEffect(() => {
        fetchdataTeamMembeream();
    }, [dataTeamMember])

    const fetchDataMemberInTeam = async () => {
        const member = dataTeamMember?.responseObject?.data.member ?? [];
        return {
            responseObject: member.map((item: TypeMemberInTeamResponse) => ({
                id: item.employee_id,
                employee_code: item.employee_code,
                name: item.first_name + " " + item.last_name,
            })),
        };
    };
    const fetchdataTeamMembeream = async () => {
        if (dataTeamMember?.responseObject) {
            setTeamName(dataTeamMember.responseObject.data.team.team);
            setTeamDescription(dataTeamMember.responseObject.data.team.description);

            const leader = dataTeamMember.responseObject.data.leader;
            if (leader) {
                setHeadId(leader.employee_id); // เก็บ id หัวหน้า
                setHeadName(`${leader.first_name} ${leader.last_name ?? ""}`); // เก็บชื่อหัวหน้า
                setCheckHead(leader.employee_id); // (ถ้าใช้ตรงปุ่ม ลบ/เพิ่มในตาราง)
            }
        }
    };

    //fetch data member in team


    useEffect(() => {
        // console.log("Data:", dataTeamMembereamMember);
        if (dataTeamMember?.responseObject?.data.member) {
            const formattedData = dataTeamMember.responseObject?.data.member.map(
                (item: TypeMemberInTeamResponse) => ({
                    className: "",
                    cells: [
                        { value: item.employee_code, className: "text-center" },
                        { value: item.first_name + " " + item.last_name, className: "text-left" },
                        { value: item.position, className: "text-center" },
                        { value: new Date(item.start_date).toLocaleDateString("th-TH") ?? "-", className: "text-center" },
                        { value: item.employee_status?.name ?? "-", className: "text-center" }
                    ],
                    data: item,
                })
            );
            setDataMemberInTeam(formattedData);
        }
    }, [dataTeamMember]);

    //fetch ตัวของ employee ที่ยังไม่มีทีม
    const { data: dataEmployee, refetch: refetchEmployee } = useEmployeeNoneTeam({
        page: page,
        pageSize: pageSize,
        searchText: searchTextEmployeeDebouce,
    });

    //handle
    const handleAddEmployee = (employeeId: string) => {
        if (!employees.includes(employeeId)) {
            setEmployees((prev) => [...prev, employeeId]);
            showToast("เพิ่มลงในทีมเรียบร้อย", true);
        } else {
            showToast("คนๆนี้อยู่ในทีมแล้ว", false);
        }
    };
    const handleRemoveEmployee = (employeeId: string) => {
        setEmployees((prev) => prev.filter(id => id !== employeeId));
        showToast("นำออกจากทีมเรียบร้อย", true);
    };


    const handleSearchTeamMember = () => {
        setSearchTextTeamMemberDebouce(searchTextTeamMember);
        refetchTeamMember();
        // console.log("Search:", { searchTextTeamMember });
    };

    const handleSearchEmployee = () => {
        setSearchTextEmployeeDebouce(searchTextEmployee);
        refetchEmployee();
        console.log("Search:", { searchTextEmployee });
    };
    useEffect(() => {
        if (searchTextTeamMember === "") {
            setSearchTextTeamMemberDebouce(searchTextTeamMember);

        }
        if (searchTextEmployee === "") {
            setSearchTextEmployeeDebouce(searchTextEmployee);

        }
    }, [searchTextTeamMember, searchTextEmployee]);
   
    const handleDeleteOpen = (item: TypeMemberInTeamResponse) => {
        setSelectedItem(item);
        setIsDeleteDialogOpen(true);

    };

    //ปิด
   
    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
    };
    //ยืนยันไดอะล็อค
    const handleConfirmTeamDetails = async () => {
        
        const errorMap: Record<string, boolean> = {};

        if (!teamName) errorMap.teamName = true;
        if (!headId) errorMap.headId = true;
 
        setErrorFields(errorMap);

        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }
        try {
            const response = await editTeam(teamId, {
                name: teamName,
                description: teamDescription,
                head_id: headId,
                head_name: headName,
            });

            if (response.statusCode === 200) {
                setTeamName(teamName);
                setTeamDescription(teamDescription);
                setHeadId(headId);
                setHeadName(headName);
                showToast("แก้ไขทีมเรียบร้อยแล้ว", true);
                refetchTeamMember();
                refetchEmployee();

            } else {
                showToast("ชื่อทีมนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถแก้ไขทีมได้", false);
        }
    };
    const handleConfirmAddMember = async () => {
        try {
            if (employees.length == 0) {
                showToast("กรุณาเลือกอย่างน้อย 1 สมาชิกเข้าทีม", false);
                return;
            }
            const response = await editMemberTeam(teamId, {
                employee_code: employees,
            });

            if (response.statusCode === 200) {

                setEmployees([]);
                showToast("เอาสมาชิกใหม่เข้าทีมเรียบร้อยแล้ว", true);
                refetchTeamMember();
                refetchEmployee();

            } else {
                showToast("สมาชิกคนนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถเอาสมาชิกใหม่เข้าทีมได้", false);
        }
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
                refetchEmployee();
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
            <h1 className="text-2xl font-bold mb-3">แก้ไขข้อมูลทีม <span className="text-blue-700">{dataTeamMember?.responseObject.data.team.team}</span></h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mb-8">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">

                    {/* ข้อมูลทีม */}
                    <h1 className="text-xl font-semibold">ข้อมูลทีม</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">



                        <div className="">
                            <InputAction
                                id="team-name"
                                placeholder=""
                                onChange={(e) => setTeamName(e.target.value)}
                                value={teamName}
                                label="ชื่อทีม"
                                labelOrientation="horizontal"
                                onAction={handleConfirmTeamDetails}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                 nextFields={{ up: "team-detail", down: "head-team" }}
                                require="require"
                                isError={errorFields.teamName}

                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                id="head-team"
                                onChange={(option) => {
                                    if (option) {
                                        const newHeadId = String(option.value);
                                        setHeadId(newHeadId);
                                        setHeadName(option.label);
                                        setCheckHead(newHeadId);
                                    } else {
                                        setHeadId(null);
                                        setHeadName("");
                                        setCheckHead(null);
                                    }
                                }}

                                fetchDataFromGetAPI={fetchDataMemberInTeam}
                                valueKey="id"
                                labelKey="name"
                                placeholder="รายชื่อบุคลากร"
                                isClearable
                                label="หัวหน้าทีม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full"
                                defaultValue={
                                    headId && headName ? {
                                        value: headId,
                                        label: headName,
                                    } : null
                                }
                                nextFields={{ up: "team-name", down: "team-detail" }}
                                require="require"
                                isError={errorFields.headId}

                            />


                        </div>
                        <div className="">
                            <InputAction
                                id="team-detail"
                                placeholder=""
                                onChange={(e) => setTeamDescription(e.target.value)}
                                value={teamDescription}
                                label="รายละเอียดทีม"
                                labelOrientation="horizontal" // vertical mobile screen
                                onAction={handleConfirmTeamDetails}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "head-team", down: "team-name" }}
                            />
                        </div>



                    </div>

                </div>
                <div className="flex justify-center md:justify-end space-x-5 mt-5">
                    <Buttons
                        btnType="primary"
                        variant="outline"
                        className="w-30"
                        onClick={handleConfirmTeamDetails}
                    >
                        ยืนยันการแก้ไขทีม
                    </Buttons>

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
            </div>

            <div className="space-y-4">
                {/* แสดงคนในทีม */}
                <MasterTableFeature
                    title="สมาชิกในทีม"
                    hideTitleBtn={true}
                    inputs={[
                        {
                            id: "search_input",
                            value: searchTextTeamMember,
                            size: "3",
                            placeholder: "ค้นหา....",
                            onChange: setSearchTextTeamMember,
                            onAction: handleSearchTeamMember,
                        },
                    ]}
                    onSearch={handleSearchTeamMember}
                    headers={headerTeams}
                    rowData={dataMemberInTeam}
                    totalData={dataTeamMember?.responseObject?.data.member.length}
                    onDelete={handleDeleteOpen}
                    hidePagination={true}
                    headerTab={true}
                    groupTabs={groupTabs}
                />

                {/* แสดงพนง ที่ยังไม่มีทีม */}
                <MasterTableFeature
                    title="พนักงานที่ยังไม่มีทีม"
                    hideTitleBtn={true}
                    inputs={[
                        {
                            id: "search_input",
                            value: searchTextEmployee,
                            size: "3",
                            placeholder: "ค้นหา....",
                            onChange: setSearchTextEmployee,
                            onAction: handleSearchEmployee,
                        },
                    ]}
                    onSearch={handleSearchEmployee}
                    headers={headers}
                    rowData={
                        (dataEmployee?.responseObject?.data ?? []).map((item: TypeAllEmployeeResponse) => ({
                            className: "",
                            cells: [
                                { value: item.employee_code, className: "text-center" },
                                { value: item.first_name + " " + item.last_name, className: "text-left" },
                                { value: item.position, className: "text-center" },
                                { value: item.start_date, className: "text-center" },
                                { value: item.employee_status?.status_id, className: "text-center" },
                                {
                                    value: (
                                        item.employee_id === checkHead ? (
                                            // หัวหน้าไม่ต้องมีปุ่ม
                                            <div className="text-center text-gray-400">หัวหน้าทีม</div>
                                        ) : employees.includes(item.employee_code) ? (
                                            <Buttons
                                                btnType="delete"
                                                variant="soft"
                                                className="w-30"
                                                onClick={() => handleRemoveEmployee(item.employee_code)}
                                            >
                                                <FaMinus />
                                            </Buttons>
                                        ) : (
                                            <Buttons
                                                btnType="submit"
                                                variant="solid"
                                                className="w-30"
                                                onClick={() => handleAddEmployee(item.employee_code)}
                                            >
                                                <FaPlus />
                                            </Buttons>
                                        )
                                    ),
                                    className: "text-center",
                                },
                            ],
                            data: item,
                        }))

                    }
                    totalData={dataEmployee?.responseObject.totalCount}
                    hidePagination={true}

                />
            </div>
            <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                    onClick={handleConfirmAddMember}
                >
                    ยืนยัน
                </Buttons>

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
                <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าจะลบสมาชิกนี้ออกจากทีม?</p>
                <p>ชื่อ : <span className="text-red-500">{selectedItem?.first_name} {selectedItem?.last_name}</span></p>
            </DialogComponent>

        </>

    );
}
