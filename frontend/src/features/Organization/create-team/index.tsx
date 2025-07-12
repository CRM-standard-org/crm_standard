import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";


import MasterSelectComponent from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import TextAreaForm from "@/components/customs/textAreas/textAreaForm";
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

import { Link } from "react-router-dom";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

import TextArea from "@/components/customs/textAreas/textarea.main.component";
import TagSelectComponent from "@/components/customs/tagCustomer/tagselect.main.component";
import { OptionColorType } from "@/components/customs/tagCustomer/tagselect.main.component";

//Customer Role
import { useCustomerRole } from "@/hooks/useCustomerRole";
import { TypeRoleResponse } from "@/types/response/response.customerRole";

//Character 
import { useCustomerCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";
import Rating from "@/components/customs/rating/rating.main.component";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { LuPencil } from "react-icons/lu";
import { deleteRole } from "@/services/customerRole.service";
import { useTeamMember } from "@/hooks/useTeam";
import { postTeam } from "@/services/team.service";


//employee
import { useEmployee } from "@/hooks/useEmployee";
import { TypeEmployeeResponse } from "@/types/response/response.employee";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeEmployeeResponse; //ตรงนี้
}[];

//
export default function CreateTeam() {
    const [searchText, setSearchText] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeRoleResponse | null>(null);

    // variable form create customer 
    const [teamName, setTeamName] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [headId, setHeadId] = useState<string | null>(null);
    const [headName, setHeadName] = useState("");
    const [checkHead, setCheckHead] = useState<string | null>(null);

    const [employees, setEmployees] = useState<string[]>([]);

    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const [allQuotation, setAllQuotation] = useState<any[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);

    //searchText control
    const [searchHead, setSearchHead] = useState("");

    // const {data:dataTeamMember, refetch refetchMember} = useTeamMember()
    const { data: dataEmployee, refetch: refetchEmployee } = useEmployee({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce || searchHead,
    });


    const fetchDataEmployees = async () => {
        const roleList = dataEmployee?.responseObject?.data ?? [];
        return {
            responseObject: roleList.map((item: TypeEmployeeResponse) => ({
                id: item.employee_id,
                employee_code: item.employee_code,
                name: item.first_name + " " + item.last_name,
            })),
        };
    };
    const handleEmployeeSearch = (searchText: string) => {
        setSearchHead(searchText);
        refetchEmployee();
    };


    // useEffect(() => {
    //     // console.log("Data:", dataTag);
    //     if (dataEmployee?.responseObject?.data) {
    //         const formattedData = dataEmployee.responseObject?.data.map(
    //             (item: TypeEmployeeResponse) => ({
    //                 className: "",
    //                 cells: [
    //                     { value: item.employee_code, className: "text-center" },
    //                     { value: item.first_name + " " + item.last_name, className: "text-left" },
    //                     { value: item.position, className: "text-center" },
    //                     { value: item.start_date, className: "text-center" },
    //                     { value: item.status_id, className: "text-center" }, {
    //                         value: (
    //                             employees.includes(item.employee_id) ? (
    //                                 <Buttons
    //                                     btnType="cancel"
    //                                     variant="soft"
    //                                     className="w-30"
    //                                     onClick={() => handleRemoveEmployee(item.employee_id)}
    //                                 >
    //                                     ลบออกจากทีม
    //                                 </Buttons>
    //                             ) : (
    //                                 <Buttons
    //                                     btnType="submit"
    //                                     variant="solid"
    //                                     className="w-30"
    //                                     onClick={() => handleAddEmployee(item.employee_id)}
    //                                 >
    //                                     เพิ่มลงในทีม
    //                                 </Buttons>
    //                             )
    //                         ),
    //                         className: "text-center",
    //                     },

    //                 ],
    //                 data: item,
    //             })
    //         );
    //         setDataEmployees(formattedData);
    //     }
    // }, [dataEmployee]);

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


    const handleSearch = () => {
        setSearchTextDebouce(searchText);
        refetchEmployee();
    };

    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce(searchText);

        }
    }, [searchText]);
    //เปิด
    const handleCreateOpen = () => {

        setIsCreateDialogOpen(true);
    };

    const handleDeleteOpen = (item: TypeEmployeeResponse) => {

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
        if (!teamName || !teamDescription || !headId) {
            showToast("กรุณาระบุข้อมูลให้ครบทุกช่อง", false);
            return;
        }
        try {
            const response = await postTeam({
                name: teamName,
                description: teamDescription,
                head_id: headId,
                head_name: headName,
                employees_id: employees,
            });

            if (response.statusCode === 200) {
                showToast("สร้างทีมเรียบร้อยแล้ว", true);
                setTeamName("");
                setTeamDescription("");
                setHeadId(null);
                setHeadName("");
                setEmployees([]);
                refetchEmployee();
                navigate("/manage-team")

            } else {
                showToast("ทีมนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างทีมได้", false);
        }
    };
    //tabs บน headertable
    const groupTabs = [
        "สมาชิกทีม",
    ];

    const mockTeamData = [
        {
            className: "",
            cells: [
                { value: "112233445", className: "text-center" },
                { value: "จอมปราชญ์ รักโลก", className: "text-left" },
                { value: "หัวหน้าทีมฝ่ายขาย", className: "text-center" },
                { value: "12/2/2024", className: "text-center" },
                { value: "พนักงานประจำ", className: "text-center" },
            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        }
    ];

    const headerTeams = [
        { label: "รหัสพนักงาน", colSpan: 1, className: "min-w-20" },
        { label: "ชื่อ-นามสกุล", colSpan: 1, className: "min-w-40" },
        { label: "ตำแหน่ง", colSpan: 1, className: "min-w-20" },
        { label: "วันเริ่มทำงาน", colSpan: 1, className: "min-w-20 " },
        { label: "สถานะ", colSpan: 1, className: "min-w-20" },
        { label: "จัดการ", colSpan: 1, className: "min-w-20" },
    ];


    const handleDeleteConfirm = async () => {
        if (!selectedItem || !selectedItem.name || !selectedItem.description) {
            showToast("กรุณาระบุรายการบทบาทที่ต้องการลบ", false);
            return;
        }


        try {
            const response = await deleteRole(selectedItem.customer_role_id);

            if (response.statusCode === 200) {
                showToast("ลบรายการสีเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);
                // refetchRole();
            }
            else if (response.statusCode === 400) {
                if (response.message === "Color in quotation") {
                    showToast("ไม่สามารถลบรายการสีได้ เนื่องจากมีใบเสนอราคาอยู่", false);
                }
                else {
                    showToast("ไม่สามารถลบรายการสีได้", false);
                }
            }
            else {
                showToast("ไม่สามารถลบรายการสีได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการสีได้", false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-3">เพิ่มทีมใหม่</h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mb-8">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">

                    {/* ข้อมูลทีม */}
                    <h1 className="text-xl font-semibold">ข้อมูลทีม</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">


                        <div className="space-x-4">
                            <InputAction
                                id="contact-person"
                                placeholder=""
                                onChange={(e) => setTeamName(e.target.value)}
                                value={teamName}
                                label="ชื่อทีม"
                                labelOrientation="horizontal" // vertical mobile screen
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                require="require"
                            />
                        </div>
                        <div className="space-x-4 lg:block">
                            <MasterSelectComponent
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
                                onInputChange={handleEmployeeSearch}
                                fetchDataFromGetAPI={fetchDataEmployees}
                                valueKey="id"
                                labelKey="name"
                                placeholder="รายชื่อบุคลากร"
                                isClearable
                                label="หัวหน้าทีม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full"
                            />


                        </div>
                        <div className="space-x-4">
                            <InputAction
                                id="contact-person"
                                placeholder=""
                                onChange={(e) => setTeamDescription(e.target.value)}
                                value={teamDescription}
                                label="รายละเอียดทีม"
                                labelOrientation="horizontal" // vertical mobile screen
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                require="require"
                            />
                        </div>

                    </div>

                </div>
            </div>
            <div className="space-y-4">

                {/* <MasterTableFeature
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
                    rowData={mockTeamData}
                    totalData={mockTeamData?.length}
                    onDelete={handleDeleteOpen}
                    hidePagination={true}
                    headerTab={true}
                    groupTabs={groupTabs}
                /> */}
                <MasterTableFeature
                    title="พนักงานที่ยังไม่มีทีม"
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
                    headers={headerTeams}
                    rowData={
                        (dataEmployee?.responseObject?.data ?? []).map((item: TypeEmployeeResponse) => ({
                            className: "",
                            cells: [
                                { value: item.employee_code, className: "text-center" },
                                { value: item.first_name + " " + item.last_name, className: "text-left" },
                                { value: item.position, className: "text-center" },
                                { value: item.start_date, className: "text-center" },
                                { value: item.status_id, className: "text-center" },
                                {
                                    value: (
                                        item.employee_id === checkHead ? (
                                            // หัวหน้าไม่ต้องมีปุ่ม
                                            <div className="text-center text-gray-400">หัวหน้าทีม</div>
                                        ) : employees.includes(item.employee_id) ? (
                                            <Buttons
                                                btnType="delete"
                                                variant="soft"
                                                className="w-30"
                                                onClick={() => handleRemoveEmployee(item.employee_id)}
                                            >
                                                <FaMinus />
                                            </Buttons>
                                        ) : (
                                            <Buttons
                                                btnType="submit"
                                                variant="solid"
                                                className="w-30"
                                                onClick={() => handleAddEmployee(item.employee_id)}
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
                    onClick={handleConfirm}
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
                confirmBtnType="primary"
            >
                <p>
                    คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
                    สี : <span className="text-red-500">{selectedItem?.name} </span>
                </p>
            </DialogComponent>
        </>

    );
}
