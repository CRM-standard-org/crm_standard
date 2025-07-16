import { useCallback, useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";
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
import { useColor } from "@/hooks/useColor";
import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { useTeam } from "@/hooks/useTeam";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { useSelectResponsible } from "@/hooks/useEmployee";
import { useAllCustomer } from "@/hooks/useCustomer";
import { TypeAllCustomerResponse } from "@/types/response/response.customer";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { postActivity } from "@/services/activity.service";
import dayjs from "dayjs";


type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function CreateActivity() {
    const [searchText, setSearchText] = useState("");
    const [colorsName, setColorsName] = useState("");
    // const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dateTableType>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [customer, setCustomer] = useState<string | null>(null);
    const [dateActivity, setDateActivity] = useState<Date | null>(null);
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [activityDetail, setActivityDetail] = useState("");


    const [team, setTeam] = useState<string | null>(null);
    const [teamOptions, setTeamOptions] = useState<OptionType[]>([]);
    const [responsible, setResponsible] = useState<string | null>(null);
    const [responsibleOptions, setResponsibleOptions] = useState<OptionType[]>([]);

    //searchText control
    const [searchTeam, setSearchTeam] = useState("");
    const [searchEmployee, setSearchEmployee] = useState("");

    const [tagId, setTagId] = useState<string | null>(null);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [responsibleId, setResponsibleId] = useState<string | null>(null);

    const { showToast } = useToast();
    //
    const navigate = useNavigate();

    // const personName = async () => {
    //     return {
    //         responseObject: [
    //             { id: 1, name: "นาย A" },
    //             { id: 2, name: "นาย B" },
    //             { id: 3, name: "นาย C" },
    //             { id: 4, name: "นาย D" },
    //         ],
    //     };
    // };
    //fetch customer
    const { data: dataCustomer, refetch: refetchCustomer } = useAllCustomer({
        page: "1",
        pageSize: "100",
        searchText: "",
        payload: {
            tag_id: tagId,
            team_id: teamId,
            responsible_id: responsibleId,
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
    });

    useEffect(() => {
        if (dataTeam?.responseObject?.data) {
            const teamList = dataTeam.responseObject.data;
            const { options } = useResponseToOptions(teamList, "team_id", "name");
            setTeamOptions(options);
        }
    }, [dataTeam]);

    const fetchDataTeamDropdown = useCallback(async () => {
        const teamList = dataTeam?.responseObject.data ?? [];
        return {
            responseObject: teamList.map(item => ({
                id: item.team_id,
                name: item.name,
            })),
        };
    }, [dataTeam]);

    const handleTeamSearch = (searchText: string) => {
        setSearchTeam(searchText);
        refetchTeam();
    };

    //fetch Member in team 
    const { data: dataTeamMember, refetch: refetchTeamMember } = useSelectResponsible({
        team_id: team ?? "",
        searchText: searchEmployee,
    });

    useEffect(() => {
        // reset ค่าเมื่อ team เปลี่ยน
        setResponsible(null);
        setResponsibleOptions([]);

        if (dataTeamMember?.responseObject?.data) {
            const member = dataTeamMember.responseObject.data;
            const { options } = useResponseToOptions(
                member,
                "employee_id",
                (item) => `${item.first_name} ${item.last_name || ""}`
            );
            setResponsibleOptions(options);

        }
    }, [team, dataTeamMember]);

    const fetchDataMemberInteam = useCallback(async () => {
        const member = dataTeamMember?.responseObject?.data ?? [];
        return {
            responseObject: member.map(item => ({
                id: item.employee_id,
                name: `${item.first_name} ${item.last_name || ""}`,
            })),
        };
    }, [dataTeamMember]);

    const handleEmployeeSearch = (searchText: string) => {
        setSearchEmployee(searchText);
        refetchTeamMember();
    };


    //   useEffect(() => {
    //     console.log("Data:", dataColor);
    //     if (dataColor?.responseObject?.data) {
    //       const formattedData = dataColor.responseObject?.data.map(
    //         (item: TypeColorAllResponse, index: number) => ({
    //           className: "",
    //           cells: [
    //             { value: index + 1, className: "text-center" },
    //             { value: item.color_name, className: "text-left" },
    //           ],
    //           data: item,
    //         })
    //       );
    //       setData(formattedData);
    //     }
    //   }, [dataColor]);


    //
    const headers = [
        { label: "สถานะ", colSpan: 1, className: "w-auto" },
        { label: "ลูกค้า", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดผู้ติดต่อ", colSpan: 1, className: "w-auto" },
        { label: "ความสำคัญ", colSpan: 1, className: "w-auto" },
        { label: "บทบาทของลูกค้า", colSpan: 1, className: "w-auto" },
        { label: "ผู้รับผิดชอบ", colSpan: 1, className: "w-auto" },
        { label: "ทีม", colSpan: 1, className: "w-auto" },
        { label: "กิจกรรมล่าสุด", colSpan: 1, className: "w-auto" },
    ];




    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        const missingFields: string[] = [];

        if (!customer) missingFields.push("ลูกค้า");
        if (!dateActivity) missingFields.push("วันที่กิจกรรม ");
        if (!responsible) missingFields.push("ผู้รับผิดชอบ");
        if (!team) missingFields.push("ทีม");
        if (!hour) missingFields.push("ชั่วโมง");
        if (!minute) missingFields.push("นาที");
        if (!activityDetail) missingFields.push("รายละเอียดกิจกรรม");


        if (missingFields.length > 0) {
            showToast(`กรุณากรอกข้อมูลให้ครบ: ${missingFields.join(" , ")}`, false);
            return;
        }
        const time = hour + ":" + minute
        try {
            const response = await postActivity({
                customer_id: customer,
                issue_date: dateActivity ? dayjs(dateActivity).format("YYYY-MM-DD") : "",
                activity_time: time,
                activity_description: activityDetail,
                team_id: team,
                responsible_id: responsible
            });

            if (response.statusCode === 200) {
                showToast("สร้างรายการกิจกรรมเรียบร้อยแล้ว", true);
                navigate("/customer-activity")

            } else {
                showToast("รายการกิจกรรมนี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างรายการกิจกรรมได้", false);
        }
    };


    return (
        <>
            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full">

                    {/* ข้อมูลกิจกรรม */}
                    <h1 className="text-xl font-semibold mb-1">ข้อมูลกิจกรรม</h1>
                    <div className="border-b-2 border-main mb-6"></div>



                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">

                            <div className="">
                                <DatePickerComponent
                                    id="doc-date"
                                    label="วันที่กิจกรรม"
                                    placeholder="dd/mm/yy"
                                    selectedDate={dateActivity}
                                    onChange={(date) => setDateActivity(date)}
                                    classNameLabel="w-1/2"
                                    classNameInput="w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                id="customer"
                                onChange={(option) => setCustomer(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataCustomerDropdown}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ลูกค้า"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                nextFields={{ up: "customer-contact", down: "team" }}
                                require="require"
                            />
                        </div>
                        <div className="flex sm:flex-nowrap sm:items-center gap-2">

                            <label className="whitespace-nowrap w-1/2">เวลาของกิจกรรม</label>

                            <InputAction
                                id="hour"
                                placeholder="hh"
                                label=""
                                labelOrientation="horizontal"
                                onChange={(e) => setHour(e.target.value)}
                                value={hour}
                                onAction={handleConfirm}
                                classNameLabel=""
                                classNameInput="w-full"
                                nextFields={{ left: "team", right: "minute", up: "date-activity", down: "activity-detail" }}
                                require="require"
                            />
                            <label>:</label>
                            <InputAction
                                id="minute"
                                placeholder="mm"
                                label=""
                                labelOrientation="horizontal"
                                onChange={(e) => setMinute(e.target.value)}
                                value={minute}
                                onAction={handleConfirm}
                                classNameLabel=""
                                classNameInput="w-full"
                                nextFields={{ left: "hour", right: "team", up: "date-activity", down: "activity-detail" }}
                                require="require"
                            />

                            <label className="">น.</label>

                        </div>
                        <div className="">
                            <DependentSelectComponent
                                id="team"
                                value={teamOptions.find((opt) => opt.value === team) || null}
                                onChange={(option) => setTeam(option ? String(option.value) : null)}
                                onInputChange={handleTeamSearch}
                                fetchDataFromGetAPI={fetchDataTeamDropdown}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ทีมผู้รับผิดชอบ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "province", down: "responsible-telno" }}
                                require="require"

                            />

                        </div>
                        <div className="">

                            <TextArea
                                id="activity-detail"
                                placeholder=""
                                onChange={(e) => setActivityDetail(e.target.value)}
                                value={activityDetail}
                                label="รายละเอียดกิจกรรม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameInput="w-full"
                                onMicrophone={true}
                                nextFields={{ left: "responsible", right: "responsible", up: "hour", down: "date-activity" }}
                                require="require"
                            />
                        </div>
                        <div className="">

                            <DependentSelectComponent
                                id="responsible"
                                value={responsibleOptions.find((opt) => opt.value === responsible) || null}
                                onChange={(option) => { setResponsible(option ? String(option.value) : null); }}
                                onInputChange={handleEmployeeSearch}
                                fetchDataFromGetAPI={fetchDataMemberInteam}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ผู้รับผิดชอบ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "responsible-telno", down: "responsible-email" }}
                                require="require"

                            />
                        </div>



                    </div>


                </div>
                <div className="flex justify-center md:justify-end space-x-5 mt-5">
                    <Buttons
                        btnType="primary"
                        variant="outline"
                        className="w-30"
                        onClick={handleConfirm}
                    >
                        สร้าง
                    </Buttons>
                    <Link to="/customer-activity">
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

        </>

    );
}
