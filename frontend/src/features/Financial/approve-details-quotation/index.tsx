import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import Buttons from "@/components/customs/button/button.main.component";

// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";

import { IconButton, Dialog } from "@radix-ui/themes";
import { LuPencil, LuSquareCheckBig } from "react-icons/lu";

import { LabelWithValue } from "@/components/ui/label";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { FiPrinter } from "react-icons/fi";
import { useQuotationById } from "@/hooks/useQuotation";
import { TypeQuotationProducts, TypeQuotationResponse } from "@/types/response/response.quotation";
import { appConfig } from "@/configs/app.config";
import { approveQuotation, cancelApproveQuotation, rejectDealQuotation, rejectQuotation, requestApproveQuotation, requestEditQuotation } from "@/services/quotation.service";

type dateTableType = {
    className: string;
    cells: {
        value: React.ReactNode;
        className: string;
    }[];
    data: TypeQuotationProducts; //ตรงนี้

}[];

//
export default function ApproveDetailsQuotation() {

    const { quotationId } = useParams<{ quotationId: string }>();
    const [data, setData] = useState<dateTableType>([]);
    const [dataQuotation, setDataQuotation] = useState<TypeQuotationResponse>();

    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState<boolean>(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);


    const [previewImage, setPreviewImage] = useState<string | null>(null);

    //หาสถานะล่าสุด
    const latestStatus = dataQuotation?.status?.[dataQuotation.status.length - 1]?.quotation_status;


    const [note, setNote] = useState("");
    const [quotationRemark, setQuotationRemark] = useState("");

    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";

    //searchText control


    const headers = [
        { label: "ลำดับ", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดสินค้า", colSpan: 1, className: "min-w-40" },
        { label: "กลุ่มสินค้า", colSpan: 1, className: "min-w-30" },
        { label: "หน่วย", colSpan: 1, className: "min-w-20" },
        { label: "ราคา/หน่วย", colSpan: 1, className: "min-w-20" },
        { label: "จำนวน", colSpan: 1, className: "min-w-20" },
        { label: "ส่วนลด/หน่วย", colSpan: 1, className: "min-w-20" },
        { label: "ส่วนลด(%)/หน่วย", colSpan: 1, className: "min-w-20" },
        { label: "มูลค่า", colSpan: 1, className: "min-w-20" },
    ];




    //fetch quotation detail 
    if (!quotationId) {
        throw Error;
    }
    const { data: quotationDetails, refetch: refetchQuotation } = useQuotationById({ quotationId });
    useEffect(() => {
        if (quotationDetails?.responseObject) {
            setDataQuotation(quotationDetails.responseObject);
        }
    }, [quotationDetails]);

    useEffect(() => {

        if (dataQuotation?.quotation_products) {
            const formattedData = dataQuotation?.quotation_products.map(
                (item: TypeQuotationProducts, index: number) => ({
                    className: "",
                    cells: [
                        { value: index + 1, className: "text-center" },
                        { value: item.product.product_name ?? "-", className: "text-center" },
                        { value: item.group_product.group_product_name ?? "-", className: "text-center" },
                        { value: item.unit.unit_name ?? "-", className: "text-center" },
                        { value: Number(item.unit_price).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.quotation_item_count).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.unit_discount).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.unit_discount_percent).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.quotation_item_price).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                    ],
                    data: item,
                })

            );
            setData(formattedData);
        }
    }, [dataQuotation]);
    const getStatusColor = (status: string) => {
        switch (status) {
            case "ระหว่างดำเนินการ":
            case "รออนุมัติ":
                return "bg-yellow-300 text-gray-800";
            case "ยกเลิกคำขออนุมัติ":
            case "ไม่อนุมัติ":
                return "bg-orange-300 text-gray-800";
            case "อนุมัติ":
            case "สำเร็จ":
                return "bg-green-400 text-white";
            case "ไม่สำเร็จ":
            case "ยกเลิก":
                return "bg-red-500 text-white";
            case "ปรับปรุง":
                return "bg-blue-300 text-white";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };


    const handleNavCreate = () => {
        navigate('/create-customer');
    }

    //เปิด
    const handleApproveOpen = () => {
        // setRoleName("");
        // setRoleDescription("");
        setIsApproveDialogOpen(true);
    };
    const handleRejectOpen = () => {
        setIsRejectDialogOpen(true);
    };


    //ปิด
    const handleApproveClose = () => {
        // setRoleName("");
        // setRoleDescription("");
        setIsApproveDialogOpen(false);
    };
    const handleRejectClose = () => {

        setIsRejectDialogOpen(false);
    };

    //ยืนยันไดอะล็อค
    const handleApproveConfirm = async () => {
        try {
            const res = await approveQuotation(quotationId, {
                quotation_status: "อนุมัติ",
                quotation_status_remark: quotationRemark
            });
            if (res.statusCode === 200) {
                showToast("อนุมัติใบเสนอราคาสำเร็จ", true);
                handleApproveClose();
                refetchQuotation();
                setQuotationRemark("");
                navigate("/approve-quotation");
            } else {
                showToast("ไม่สามารถอนุมัติใบเสนอราคาได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะอนุมัติใบเสนอราคา", false);
            console.error(err);
        }
    };
    //ส่งขอแก้ไข
    const handleRejectConfirm = async () => {
        try {
            const res = await rejectQuotation(quotationId, {
                quotation_status: "ไม่อนุมัติ",
                quotation_status_remark: quotationRemark
            });
            if (res.statusCode === 200) {
                showToast("ไม่อนุมัติใบเสนอราคาสำเร็จ", true);
                handleRejectClose();
                refetchQuotation();
                setQuotationRemark("");
                navigate("/approve-quotation");

            } else {
                showToast("ไม่สามารถไม่อนุมัติใบเสนอราคาได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะไม่อนุมัติใบเสนอราคา", false);
            console.error(err);
        }

    }



    return (
        <>
            <div className="flex flex-col xl:flex-row gap-6 items-start min-h-screen">

                {/* ฝั่งซ้าย */}
                <div className="w-full flex-1">

                    <div className="flex text-2xl font-bold mb-3">
                        <p className="me-2">รายละเอียดใบเสนอราคา</p>
                    </div>


                    <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mb-5 ">
                        <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                            {/* รายละเอียดเอกสาร */}
                            <h1 className="text-xl font-semibold mb-1">รายละเอียดเอกสาร</h1>
                            <div className="border-b-2 border-main mb-6"></div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                                {/* ฝั่งซ้าย */}
                                <div className="space-y-4">
                                    <div className="">
                                        <LabelWithValue label="ลูกค้า" value={`${dataQuotation?.customer.company_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                    <div className="flex flex-row ">
                                        <label className="whitespace-nowrap">ความสำคัญ<span style={{ color: "red" }}>*</span></label>
                                        <RatingShow value={dataQuotation?.priority ?? 0} className="w-6 h-6" />
                                    </div>

                                    <div className="">
                                        <LabelWithValue
                                            label="วันออกเอกสาร"
                                            value={
                                                dataQuotation?.issue_date
                                                    ? new Date(dataQuotation.issue_date).toLocaleDateString("th-TH")
                                                    : "-"
                                            }
                                            classNameLabel="sm:w-1/2"
                                            classNameValue="w-80"
                                        />

                                    </div>
                                    <div className="">
                                        <LabelWithValue label="เลขผู้เสียภาษี" value={`${dataQuotation?.customer.tax_id}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                </div>

                                {/* ฝั่งขวา */}
                                <div className="space-y-4">
                                    <div className="">
                                        <LabelWithValue label="ทีมผู้รับผิดชอบ" value={`${dataQuotation?.team.name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>
                                    <div className="">

                                        <LabelWithValue label="ผู้รับผิดชอบ" value={`${dataQuotation?.responsible.first_name} ${dataQuotation?.responsible.last_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>
                                    <div className="">
                                        <LabelWithValue
                                            label="วันยื่นราคา"
                                            value={
                                                dataQuotation?.price_date
                                                    ? new Date(dataQuotation.price_date).toLocaleDateString("th-TH")
                                                    : "-"
                                            }
                                            classNameLabel="sm:w-1/2"
                                            classNameValue="w-80"
                                        />
                                    </div>
                                    <div className="">
                                        <LabelWithValue
                                            label="วันที่คาดว่าจะปิดดีล"
                                            value={
                                                dataQuotation?.expected_closing_date
                                                    ? new Date(dataQuotation.expected_closing_date).toLocaleDateString("th-TH")
                                                    : "-"
                                            }
                                            classNameLabel="sm:w-1/2"
                                            classNameValue="w-80"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* รายละเอียดการจัดส่ง */}
                            <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดการจัดส่ง</h1>
                            <div className="border-b-2 border-main mb-6"></div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {/* ฝั่งซ้าย */}
                                <div className="space-y-4">

                                    <div className="">
                                        <LabelWithValue label="การรับสินค้า" value={`${dataQuotation?.shipping_method}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>


                                    <div className="">
                                        <LabelWithValue
                                            label="วันจัดส่งสินค้า"
                                            value={
                                                dataQuotation?.expected_delivery_date
                                                    ? new Date(dataQuotation.expected_delivery_date).toLocaleDateString("th-TH")
                                                    : "-"
                                            }
                                            classNameLabel="sm:w-1/2"
                                            classNameValue="w-80"
                                        />
                                    </div>

                                    <div className="">
                                        <LabelWithValue label="ชื่อสถานที่" value={`${dataQuotation?.place_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                    <div className="">
                                        <LabelWithValue label="ที่อยู่" value={`${dataQuotation?.address}.`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                </div>

                                {/* ฝั่งขวา */}
                                <div className="space-y-4">

                                    {
                                        dataQuotation?.shipping_remark && (
                                            <div className="">
                                                <LabelWithValue label="อื่นๆ โปรดระบุ" value={`${dataQuotation?.shipping_remark}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                            </div>
                                        )
                                    }

                                    <div className="">
                                        <LabelWithValue label="ประเภท" value={`${dataQuotation?.country.country_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                    <div className="">
                                        <LabelWithValue label="จังหวัด" value={`${dataQuotation?.province.province_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                    <div className="">
                                        <LabelWithValue label="อำเภอ" value={`${dataQuotation?.district.district_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>
                                </div>
                            </div>

                            {/* รายละเอียดผู้ติดต่อ */}
                            <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดผู้ติดต่อ</h1>
                            <div className="border-b-2 border-main mb-6"></div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {/* ฝั่งซ้าย */}
                                <div className="space-y-4">

                                    <div className="">
                                        <LabelWithValue label="ชื่อผู้ติดต่อ" value={`${dataQuotation?.contact_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                    <div className="">
                                        <LabelWithValue label="อีเมลผู้ติดต่อ" value={`${dataQuotation?.contact_email}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>

                                </div>

                                {/* ฝั่งขวา */}
                                <div className="space-y-4">

                                    <div className="">
                                        <LabelWithValue label="เบอร์ผู้ติดต่อ" value={`${dataQuotation?.contact_phone}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>

                    <MasterTableFeature
                        title=""
                        hideTitleBtn={true}
                        headers={headers}
                        rowData={data}
                        totalData={dataQuotation?.quotation_products.length}
                        hidePagination={true}
                    />



                    {/* รายละเอียดการชำระเงิน */}
                    <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mt-7" >
                        <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                            <h1 className="text-xl font-semibold mb-1">รายละเอียดการชำระเงิน</h1>
                            <div className="border-b-2 border-main mb-6"></div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                                {/* ฝั่งซ้าย */}
                                <div className="space-y-4">

                                    <div className="flex justify-between space-x-4">
                                        <label>ราคารวม</label>
                                        <label>{Number(dataQuotation?.total_amount).toFixed(2).toLocaleString()}</label>
                                    </div>

                                    <div className="flex justify-between space-x-4">
                                        <label>ส่วนลดพิเศษ (<span className="text-main">{Number(dataQuotation?.special_discount).toFixed(2).toLocaleString()} บาท</span>)</label>
                                        <label>{Number(dataQuotation?.amount_after_discount).toFixed(2).toLocaleString()}</label>
                                    </div>

                                    <div className="flex justify-between space-x-4">
                                        <label>VAT (%)</label>
                                        <label>{Number(dataQuotation?.vat_amount).toFixed(2).toLocaleString()}</label>
                                    </div>


                                    <div className="border-b-2 border-main mb-6"></div>


                                    <div className="flex justify-between space-x-4">
                                        <label>ยอดรวมทั้งหมด</label>
                                        <label>{Number(dataQuotation?.grand_total).toFixed(2).toLocaleString()}</label>
                                    </div>

                                    <div className="border-b-2 border-main mb-6 "></div>

                                    <div >
                                        <label>บันทึกเพิ่มเติม</label><br />
                                        <p className="mt-2 text-blue-600">{dataQuotation?.additional_notes ?? "-"}</p>
                                    </div>


                                </div>

                                {/* ฝั่งขวา */}
                                <div className="space-y-4">


                                    <div className="flex justify-between space-x-4">
                                        <label>เงื่อนไขการชำระเงิน</label>
                                        {dataQuotation?.payment_term_name === "เต็มจำนวน" && (
                                            <div className="flex flex-row space-x-5">
                                                <p className="text-blue-600">{dataQuotation?.payment_term_name}</p>
                                                <label>ภายใน</label>
                                                <p className="text-blue-600">{dataQuotation?.payment_term_day}</p>

                                                <label>วัน</label>
                                            </div>
                                        )}
                                        {dataQuotation?.payment_term_name === "แบ่งชำระ" && (
                                            <div className="flex flex-row space-x-5">
                                                <p className="text-blue-600">{dataQuotation?.payment_term_name}</p>
                                                <label>ภายใน</label>
                                                <p className="text-blue-600">{dataQuotation?.payment_term_installment}</p>

                                                <label>งวด</label>
                                            </div>

                                        )}

                                    </div>


                                    {dataQuotation?.payment_term_name === "แบ่งชำระ" && (
                                        <>
                                            <div className="mt-4 border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
                                                <h3 className="text-base font-semibold text-gray-700 mb-3">
                                                    รายละเอียดงวดการชำระเงิน
                                                </h3>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                                    {dataQuotation?.payment_term?.map((term, index) => (
                                                        <div key={term.payment_term_id || index} className="flex items-center gap-2">
                                                            <label className="text-sm font-semibold whitespace-nowrap text-gray-600">
                                                                งวด {term.installment_no}
                                                            </label>
                                                            <div className="w-24 px-3 py-1.5 border rounded bg-gray-100 text-gray-800 text-sm text-center">
                                                                {Number(term.installment_price).toLocaleString()}
                                                            </div>
                                                            <label className="text-sm text-gray-600 whitespace-nowrap">บาท</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </>
                                    )}
                                    <div className="flex justify-between space-x-4">
                                        <label>วิธีการชำระเงิน</label>
                                        <label className="text-blue-600">{dataQuotation?.payment_method.payment_method_name}</label>
                                    </div>

                                    <div className="flex justify-between space-x-4">
                                        <label>สกุลเงิน</label>
                                        <label className="text-blue-600">{dataQuotation?.currency.currency_name}</label>
                                    </div>

                                    <div className="flex justify-between space-x-4">
                                        <label>หมายเหตุ</label>
                                        <label className="text-blue-600">{dataQuotation?.remark ?? 'ไม่มีหมายเหตุ'}</label>
                                    </div>
                                    <div className="">
                                        <label className="block font-medium mb-2">เอกสารที่แนบ</label>

                                        <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
                                            {quotationDetails?.responseObject?.quotation_file?.map((file, index) => {
                                                const fileUrl = `${appConfig.baseApi}${file.quotation_file_url}`;
                                                const isPdf = file.quotation_file_url.toLowerCase().endsWith(".pdf");

                                                return isPdf ? (
                                                    <div
                                                        key={file.quotation_file_id}
                                                        className="w-40 h-40 border p-2 rounded shadow flex-shrink-0"
                                                    >
                                                        <a
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex justify-center  text-blue-500 underline"
                                                        >
                                                            PDF ไฟล์ {index + 1}
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={file.quotation_file_id}
                                                        className="w-40 h-40 border rounded shadow relative flex-shrink-0"
                                                    >
                                                        <img
                                                            src={fileUrl}
                                                            alt={`preview-${index}`}
                                                            className="w-full h-full object-cover rounded cursor-pointer"
                                                            onClick={() => setPreviewImage(fileUrl)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Dialog Zoom สำหรับรูปภาพ */}
                                        {previewImage && (
                                            <Dialog.Root open onOpenChange={() => setPreviewImage(null)}>
                                                <Dialog.Content className="w-auto flex justify-center items-center bg-white p-4 rounded shadow">
                                                    <img
                                                        src={previewImage}
                                                        className="max-h-[80vh] object-contain"
                                                        alt="Full preview"
                                                    />
                                                </Dialog.Content>
                                            </Dialog.Root>
                                        )}
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="flex justify-between space-x-5 mt-5">
                        <Buttons
                            btnType="primary"
                            variant="outline"
                            className="w-30"
                        >
                            <FiPrinter style={{ fontSize: 18 }} />

                            พิมพ์
                        </Buttons>
                        <div className="space-x-3">
                            {latestStatus && ["รออนุมัติ"].includes(latestStatus) && (

                                <>
                                    <Buttons
                                        btnType="submit"
                                        variant="solid"
                                        className="w-30"
                                        onClick={() => handleApproveOpen()}
                                    >
                                        อนุมัติ
                                    </Buttons>
                                    <Buttons
                                        btnType="delete"
                                        variant="solid"
                                        className="w-30"
                                        onClick={() => handleRejectOpen()}
                                    >
                                        ไม่อนุมัติ
                                    </Buttons>
                                </>
                            )}
                            <Link to="/approve-quotation">
                                <Buttons
                                    btnType="cancel"
                                    variant="soft"
                                    className="w-30"
                                >
                                    กลับ
                                </Buttons>
                            </Link>
                        </div>


                    </div>
                </div>

        
                {/* ฝั่งขวา */}
                <div className="max-h-[600px] xl:max-h-[1920px] w-full xl:w-[280px] bg-white shadow-lg rounded-lg p-4 self-stretch">
                    <h2 className="text-lg font-semibold mb-3">ประวัติใบเสนอราคา</h2>

                    {dataQuotation?.status.map((status, index) => {
                        const isLatest = index === dataQuotation.status.length - 1;

                        return (
                            <div
                                key={index}
                                className={`border rounded-lg p-4 space-y-2 mb-3 ${isLatest ? "bg-green-100 border-green-400" : "bg-gray-50 border-gray-200"}`}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-lg">
                                        <LuSquareCheckBig />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <span className="text-md font-semibold text-gray-800">
                                                สถานะใบเสนอราคา
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <span
                                    className={`text-xs font-medium rounded px-2 py-0.5 ${getStatusColor(
                                        status.quotation_status
                                    )}`}
                                >
                                    {status.quotation_status}
                                </span>

                                <div className="text-sm text-gray-600">
                                    วันที่ดำเนินการ:{" "}
                                    <span className="font-medium">
                                        {status?.created_at
                                            ? new Date(status.created_at).toLocaleDateString("th-TH")
                                            : "-"}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    ชื่อผู้ดำเนินการ:{" "}
                                    <span className="font-medium">
                                        {status.created_by_employee.first_name}{" "}
                                        {status.created_by_employee.last_name}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    หมายเหตุ:{" "}
                                    <span className="italic text-gray-500">
                                        {status.quotation_status_remark || "-"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>


            </div>
            {/* อนุมัติ */}
            <DialogComponent
                isOpen={isApproveDialogOpen}
                onClose={handleApproveClose}
                title="เพิ่มหมายเหตุของการอนุมัติ"
                onConfirm={handleApproveConfirm}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                confirmBtnType="primary"
            >
                <div className="flex flex-col space-y-5">

                    <TextArea
                        id="note"
                        placeholder=""
                        onChange={(e) => setQuotationRemark(e.target.value)}
                        value={quotationRemark}
                        label="หมายเหตุ"
                        labelOrientation="horizontal"
                        onAction={handleApproveConfirm}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>

            {/* ไม่อนุมัติ */}
            <DialogComponent
                isOpen={isRejectDialogOpen}
                onClose={handleRejectClose}
                title="เพิ่มหมายเหตุของการไม่อนุมัติ"
                onConfirm={handleRejectConfirm}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                confirmBtnType="primary"
            >
                <div className="flex flex-col space-y-5">

                    <TextArea
                        id="note"
                        placeholder=""
                        onChange={(e) => setQuotationRemark(e.target.value)}
                        value={quotationRemark}
                        label="หมายเหตุ"
                        labelOrientation="horizontal"
                        onAction={handleRejectConfirm}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>


        </>

    );
}
