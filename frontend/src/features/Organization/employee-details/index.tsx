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
import { setPriority } from "os";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { LuPencil } from "react-icons/lu";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function EmployeeDetails() {
    const [searchText, setSearchText] = useState("");

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
    const [data, setData] = useState<dateTableType>([]);
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

    const { data: dataCustomerRole } = useCustomerRole({
        page: "1",
        pageSize: "100",
        searchText: "",
    });

    const fetchDataRoleDropdown = async () => {
        const roleList = dataCustomerRole?.responseObject?.data ?? [];
        return {
            responseObject: roleList.map((item: TypeRoleResponse) => ({
                id: item.customer_role_id,
                name: item.name,
                description: item.description,
            })),
        };
    };
    const { data: dataCharacter } = useCustomerCharacter({
        page: "1",
        pageSize: "100",
        searchText: "",
    })
    const fetchDataCharacterDropdown = async () => {
        const characterList = dataCharacter?.responseObject?.data ?? [];
        return {
            responseObject: characterList.map((item: TypeCharacterResponse) => ({
                id: item.character_id,
                name: item.character_name,
                description: item.character_description,
            })),
        }
    }

    const dataCompany = async () => {
        return {
            responseObject: [
                { id: 1, name: "บริษัท 1 จำกัด" },
                { id: 2, name: "บริษัท 2 จำกัด" },
                { id: 3, name: "บริษัท 3 จำกัด" },
                { id: 4, name: "บริษัท 4 จำกัด" },
            ],
        };
    };

    const roleCustomer = async () => {
        return {
            responseObject: [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
                { id: 4, name: "D" },
            ],
        };
    };
    const dataCountry = async () => {
        return {
            responseObject: [
                { id: 1, name: "ไทย" },
                { id: 2, name: "อังกฤษ" },
                { id: 3, name: "ฟิลิปปินส์" },
                { id: 4, name: "ลาว" },
            ],
        };
    };
    const dataProvince = async () => {
        return {
            responseObject: [
                { id: 1, name: "กรุงเทพ" },
                { id: 2, name: "นนทบุรี" },
                { id: 3, name: "ปทุมธานี" },
                { id: 4, name: "ชุมพร" },
            ],
        };
    };

    const dataDistrict = async () => {
        return {
            responseObject: [
                { id: 1, name: "ปากเกร็ด" },
                { id: 2, name: "บางใหญ่" },
                { id: 3, name: "พระนคร" },
                { id: 4, name: "เมือง" },
            ],
        };
    };

    const contactLabels: Record<string, string> = {
        Line: "LINE",
        Instragram: "Instragram",
        Facebook: "Facebook",
        Tiktok: "Tiktok",
    };

    const listContact = async () => {
        return {
            responseObject: [
                { id: 1, name: "Line" },
                { id: 2, name: "Instragram" },
                { id: 3, name: "Facebook" },
                { id: 4, name: "Tiktok" },
            ],
        };
    };



    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce(searchText);

        }
    }, [searchText]);


    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        if (!colorsName) {
            showToast("กรุณาระบุสี", false);
            return;
        }
        try {
            const response = await postColor({
                color_name: colorsName, // ใช้ชื่อ field ที่ตรงกับ type
            });

            if (response.statusCode === 200) {
                setColorsName("");
                showToast("สร้างรายการสีเรียบร้อยแล้ว", true);

            } else {
                showToast("รายการสีนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างรายการสีได้", false);
        }
    };
   
    //tabs บน headertable
    const groupTabs = [
        {
            name: "งานที่รับผิดชอบ",
            onChange: () => setFilterGroup(null)
        },
        
    ];
    const mockData = [
        {
            className: "",
            cells: [
                { value: "1", className: "text-center" },
                {
                    value: (
                        <div className="flex flex-col">
                            บริษัทจอมมี่ จำกัด
                            <div className="flex flex-row space-x-1">
                                <TagCustomer nameTag="B2B" color="#CC0033" />

                            </div>
                        </div>
                    ), className: "text-left"
                },
                { value: (<RatingShow value={3} className="w-5 h-5" />), className: "text-left" },
                {
                    value: (
                        <div className="flex flex-col">
                            Q#00000000000
                            <div className="">
                                p#11223344455

                            </div>
                        </div>
                    ), className: "text-left"
                },
                { value: "12/2/2024", className: "text-center" },
                {
                    value: (
                        <div className="flex flex-col">
                            รับสินค้าแล้ว
                            <div className="">
                                16/2/2024
                            </div>
                        </div>
                    ), className: "text-left"
                },
                { value: "", className: "text-left" },
            ],
            data: {
                color_name: "Red",
                color_id: 1,
            },
        }
    ];
    const headers = [
        { label: "หมายเลขการขาย", colSpan: 1, className: "min-w-20" },
        { label: "ลูกค้า", colSpan: 1, className: "min-w-40" },
        { label: "ความสำคัญ", colSpan: 1, className: "min-w-20" },
        { label: "หมายเลขเอกสารสำคัญ", colSpan: 1, className: "min-w-20 " },
        { label: "วันเริ่ม", colSpan: 1, className: "min-w-20" },
        { label: "สถานะ", colSpan: 1, className: "min-w-40" },
        { label: "มูลค่า", colSpan: 1, className: "min-w-40" },
    ];


    return (
        <>
            <h1 className="text-2xl font-bold mb-3">รายละเอียดพนักงาน</h1>


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* ข้อมูลพนักงาน */}
                    <div className="flex justify-between mb-1">
                        <h1 className="text-xl font-semibold">ข้อมูลพนักงาน</h1>


                        <Link to="/edit-employee-details">
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
                 
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">
                            <InputAction
                                id="contact-person"
                                placeholder=""
                                onChange={(e) => setFirstContact(e.target.value)}
                                value={firstContact}
                                label="รหัสพนักงาน"
                                labelOrientation="horizontal" // vertical mobile screen
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                require="require"
                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                onChange={(option) => setContactOption(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={listContact}
                                valueKey="name"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="วันเริ่มทำงาน"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="position"
                                placeholder=""
                                onChange={(e) => setPosition(e.target.value)}
                                value={position}
                                label="ชื่อ-นามสกุล"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                onChange={(option) => setContactOption(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={listContact}
                                valueKey="name"
                                labelKey="name"
                                placeholder="พนักงานประจำ"
                                isClearable
                                label="สถานะ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="position"
                                placeholder=""
                                onChange={(e) => setPosition(e.target.value)}
                                value={position}
                                label="ตำแหน่ง"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                            />
                        </div>
                        <div className="">
                            <InputAction
                                id="position"
                                placeholder=""
                                onChange={(e) => setPosition(e.target.value)}
                                value={position}
                                label="เงินเดือน/ค่าแรง"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex"
                                classNameInput="w-full"
                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                onChange={(option) => setCharacter(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataCharacterDropdown}
                                valueKey="name"
                                labelKey="name"
                                placeholder="รายชื่อทีม"
                                isClearable
                                label="ทีม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                            />
                        </div>


                    </div>



                    {/* รายละเอียดพนักงาน */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดพนักงาน</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">


                        <div className="">
                            <MasterSelectComponent
                                onChange={(option) => setRole(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={roleCustomer}
                                valueKey="name"
                                labelKey="name"
                                placeholder="ไทย"
                                isClearable
                                label="ประเทศ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="email"
                                placeholder=""
                                onChange={(e) => setEmailCompany(e.target.value)}
                                value={emailCompany}
                                label="เบอร์โทรศัพท์"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                onChange={(option) => setRole(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={roleCustomer}
                                valueKey="name"
                                labelKey="name"
                                placeholder="กรุงเทพ"
                                isClearable
                                label="จังหวัด"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="identify-no"
                                placeholder=""
                                onChange={(e) => setIdentifyNo(e.target.value)}
                                value={identifyNo}
                                label="อีเมล"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                            />
                        </div>

                        <div className="">
                            <MasterSelectComponent
                                onChange={(option) => setRole(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={roleCustomer}
                                valueKey="name"
                                labelKey="name"
                                placeholder="พระนคร"
                                isClearable
                                label="อำเภอ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                            />
                        </div>
                        <div className="">

                            <TextArea
                                id="note"
                                placeholder=""
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                                label="ที่อยู่"
                                labelOrientation="horizontal"
                                onAction={handleConfirm}
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                onChange={(option) => setContactOption(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={listContact}
                                valueKey="name"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ช่องทางการติดต่อ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                            />
                        </div>

                        {contactOption && contactLabels[contactOption] && (

                            <div className="">
                                <InputAction
                                    id={contact.toLowerCase()}
                                    placeholder=""
                                    onChange={(e) => setContact(e.target.value)}
                                    value={contact}
                                    label={contactLabels[contactOption]}
                                    labelOrientation="horizontal"
                                    onAction={handleConfirm}
                                    classNameLabel="w-1/2 flex "
                                    classNameInput="w-full"
                                />
                            </div>

                        )}

                    </div>
                   
                </div>
            </div>
            <MasterTableFeature
                title=""
                hideTitleBtn={true}
                headers={headers}
                rowData={mockData}
                totalData={mockData?.length}
                onCreateBtn={false} // ให้มีปุ่ม create เพิ่มมารป่าว
                onDropdown={true}
                hidePagination={true}
                headerTab={true}
                groupTabs={groupTabs}
            />
            <div className="flex justify-center md:justify-end space-x-5 mt-5">

                <Link to="/employee">
                    <Buttons
                        btnType="cancel"
                        variant="soft"
                        className="w-30 "
                    >
                        ยกเลิก
                    </Buttons>
                </Link>

            </div>
        </>

    );
}
