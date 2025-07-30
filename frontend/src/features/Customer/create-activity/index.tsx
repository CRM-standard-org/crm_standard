import { useCallback, useEffect, useState } from "react";


import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate} from "react-router-dom";
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



//
export default function CreateActivity() {


    const [customer, setCustomer] = useState<string | null>(null);
    const [dateActivity, setDateActivity] = useState<Date | null>(new Date());
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [activityDesciption, setActivityDesciption] = useState("");


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
    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

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
       
        const errorMap: Record<string, boolean> = {};

        if (!customer) errorMap.customer = true;
        if (!dateActivity) errorMap.dateActivity = true;
        if (!responsible || responsibleOptions.length === 0) { errorMap.responsible = true; }

        if (!team) errorMap.team = true;
        if (!hour) errorMap.hour = true;
        if (!minute) errorMap.minute = true;
        if (!activityDesciption) errorMap.activityDesciption = true;
       
        setErrorFields(errorMap);
        const time = hour + ":" + minute
        try {
            const response = await postActivity({
                customer_id: customer,
                issue_date: dateActivity ? dayjs(dateActivity).format("YYYY-MM-DD") : "",
                activity_time: time,
                activity_description: activityDesciption,
                team_id: team,
                responsible_id: responsible
            });

            if (response.statusCode === 200) {
                showToast("สร้างรายการกิจกรรมเรียบร้อยแล้ว", true);
                navigate("/customer-activity")

            } else {
                showToast("ไม่สามารถสร้างรายการกิจกรรมได้", false);
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
                            <DatePickerComponent
                                id="date-activity"
                                label="วันที่กิจกรรม"
                                placeholder="dd/mm/yy"
                                selectedDate={dateActivity}
                                onChange={(date) => setDateActivity(date)}
                                onAction={handleConfirm}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                required
                                isError={errorFields.dateActivity}
                                nextFields={{ up: "responsible", down: "customer" }}

                            />
                        </div>

                        <div className="">
                            <MasterSelectComponent
                                id="customer"
                                onChange={(option) => setCustomer(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataCustomerDropdown}
                                onAction={handleConfirm}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ลูกค้า"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                nextFields={{ up: "date-activity", down: "hour" }}
                                require="require"
                                isError={errorFields.customer}

                            />
                        </div>
                        <div className="flex sm:flex-nowrap sm:items-center gap-2">

                            <label className="whitespace-nowrap w-1/2">เวลาของกิจกรรม<span style={{ color: "red" }}>*</span></label>

                            <InputAction
                                id="hour"
                                placeholder="hh"
                                label=""
                                labelOrientation="horizontal"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // จำกัดให้เป็นตัวเลข และไม่เกิน 23
                                    const number = Math.min(parseInt(val || "0"), 23);
                                    setHour(isNaN(number) ? "" : String(number));
                                }}
                                value={hour}
                                onAction={handleConfirm}
                                classNameLabel=""
                                classNameInput="w-full"
                                nextFields={{ up: "customer", down: "minute" }}
                                require="require"
                                isError={errorFields.hour}

                            />
                            <label>:</label>
                            <InputAction
                                id="minute"
                                placeholder="mm"
                                label=""
                                labelOrientation="horizontal"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // จำกัดไม่เกิน 59
                                    const number = Math.min(parseInt(val || "0"), 59);
                                    setMinute(isNaN(number) ? "" : String(number));
                                }}
                                value={minute}
                                onAction={handleConfirm}
                                classNameLabel=""
                                classNameInput="w-full"
                                nextFields={{ up: "hour", down: "team" }}
                                require="require"
                                isError={errorFields.minute}

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
                                onAction={handleConfirm}

                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ทีมผู้รับผิดชอบ"
                                labelOrientation="horizontal"

                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "minute", down: "activity-detail" }}
                                require="require"
                                isError={errorFields.team}


                            />

                        </div>
                        <div className="">

                            <TextArea
                                id="activity-detail"
                                placeholder=""
                                onChange={(e) => setActivityDesciption(e.target.value)}
                                value={activityDesciption}
                                onAction={handleConfirm}
                                label="รายละเอียดกิจกรรม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameInput="w-full"
                                onMicrophone={true}
                                nextFields={{ up: "team", down: "responsible" }}
                                require="require"
                                isError={errorFields.activityDesciption}

                            />
                        </div>
                        <div className="">

                            <DependentSelectComponent
                                id="responsible"
                                value={responsibleOptions.find((opt) => opt.value === responsible) || null}
                                onChange={(option) => { setResponsible(option ? String(option.value) : null); }}
                                onInputChange={handleEmployeeSearch}
                                fetchDataFromGetAPI={fetchDataMemberInteam}
                                onAction={handleConfirm}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ผู้รับผิดชอบ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "activity-detail", down: "date-activity" }}
                                require="require"
                                isError={errorFields.responsible}

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
