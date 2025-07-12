import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { pdf } from '@react-pdf/renderer';
import QuotationPDF from '@/features/Financial/pdf/print-quotation-detail/QuotationPDF'; 

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
import { cancelApproveQuotation, closeDealQuotation, rejectDealQuotation, requestApproveQuotation, requestEditQuotation } from "@/services/quotation.service";

type dateTableType = {
    className: string;
    cells: {
        value: React.ReactNode;
        className: string;
    }[];
    data: TypeQuotationProducts; //ตรงนี้

}[];

//
export default function QuotationDetails() {

    const { quotationId } = useParams<{ quotationId: string }>();
    const [data, setData] = useState<dateTableType>([]);
    const [dataQuotation, setDataQuotation] = useState<TypeQuotationResponse>();

    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState<boolean>(false);
    const [isRequestEditDialogOpen, setIsRequestEditDialogOpen] = useState<boolean>(false);
    const [isCancelApproveDialogOpen, setIsCancelApproveDialogOpen] = useState<boolean>(false);
    const [isRejectDealDialogOpen, setIsRejectDealDialogOpen] = useState<boolean>(false);
    const [isCloseDealDialogOpen, setIsCloseDealDialogOpen] = useState<boolean>(false);

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
                        { value: item.unit_price ?? 0, className: "text-right" },
                        { value: item.quotation_item_count ?? 0, className: "text-right" },
                        { value: item.unit_discount ?? 0, className: "text-right" },
                        { value: item.unit_discount_percent ?? 0, className: "text-right" },
                        { value: item.quotation_item_price ?? 0, className: "text-right" },
                    ],
                    data: item,
                })

            );
            setData(formattedData);
        }
    }, [dataQuotation]);

    const handleOpenPdf = async () => {
        if (!quotationId || !dataQuotation) return;
      
        const blob = await pdf(<QuotationPDF quotation={dataQuotation} />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };
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
    const handleRequestEditOpen = () => {
        setIsRequestEditDialogOpen(true);
    };
    const handleCancelApproveOpen = () => {
        setIsCancelApproveDialogOpen(true);
    };
    const handleRejectDealOpen = () => {
        setIsRejectDealDialogOpen(true);
    };
    const handleCloseDealOpen = () => {
        setIsCloseDealDialogOpen(true);
    };

    //ปิด
    const handleApproveClose = () => {
        // setRoleName("");
        // setRoleDescription("");
        setIsApproveDialogOpen(false);
    };
    const handleRequestEditClose = () => {

        setIsRequestEditDialogOpen(false);
    };
    const handleCancelApproveClose = () => {

        setIsCancelApproveDialogOpen(false);
    };
    const handleRejectDealClose = () => {

        setIsRejectDealDialogOpen(false);
    };
    const handleCloseDealClose = () => {

        setIsCloseDealDialogOpen(false);
    };
    //ยืนยันไดอะล็อค
    const handleApproveConfirm = async () => {
        try {
            const res = await requestApproveQuotation(quotationId, {
                quotation_status: "รออนุมัติ",
                quotation_status_remark: quotationRemark
            });
            if (res.statusCode === 200) {
                showToast("ส่งคำขออนุมัติสำเร็จ", true);
                handleApproveClose();
                refetchQuotation();
                setQuotationRemark("");
                navigate("/quotation");
            } else {
                showToast("ไม่สามารถส่งคำขออนุมัติได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะส่งคำขออนุมัติ", false);
            console.error(err);
        }
    };
    //ส่งขอแก้ไข
    const handleRequestEdit = async () => {
        try {
            const res = await requestEditQuotation(quotationId, {
                quotation_status: "ปรับปรุง",
                quotation_status_remark: quotationRemark
            });
            if (res.statusCode === 200) {
                showToast("ขอแก้ไขสำเร็จ", true);
                handleRequestEditClose();
                refetchQuotation();
                setQuotationRemark("");
            } else {
                showToast("ไม่สามารถส่งคำขอแก้ไขสำเร็จ", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะส่งคำขอแก้ไข", false);
            console.error(err);
        }

    }
    //ยกเลิกคำขออนุมัติ
    const handleCancelApprove = async () => {
        try {
            const res = await cancelApproveQuotation(quotationId, {
                quotation_status: "ยกเลิกคำขออนุมัติ",
                quotation_status_remark: quotationRemark
            });
            if (res.statusCode === 200) {
                showToast("ยกเลิกคำขออนุมัติสำเร็จ", true);
                handleCancelApproveClose();
                refetchQuotation();
                setQuotationRemark("");
            } else {
                showToast("ไม่สามารถยกเลิกคำขออนุมัติได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะยกเลิกคำขออนุมัติ", false);
            console.error(err);
        }

    }
    //ยกเลิกการขาย
    const handleRejectDeal = async () => {
        try {
            const res = await rejectDealQuotation(quotationId, {
                quotation_status: "ไม่สำเร็จ",
                quotation_status_remark: quotationRemark
            });
            if (res.statusCode === 200) {
                showToast("ยกเลิกการขายสำเร็จ", true);
                handleRejectDealClose();
                refetchQuotation();
                setQuotationRemark("");
            } else {
                showToast("ไม่สามารถยกเลิกการขายได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะยกเลิกการขาย", false);
            console.error(err);
        }

    }
    //ปิดการขาย
    const handleCloseDeal = async () => {
        try {
            const res = await closeDealQuotation(quotationId, {
                quotation_status: "สำเร็จ",
                quotation_status_remark: quotationRemark
            });
            if (res.statusCode === 200) {
                showToast("ปิดการขายสำเร็จ", true);
                handleCloseDealClose();
                refetchQuotation();
                setQuotationRemark("");
            } else {
                showToast("ไม่สามารถปิดการขายได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะปิดการขาย", false);
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
                        {latestStatus && ["ระหว่างดำเนินการ", "ยกเลิกคำขออนุมัติ", "ปรับปรุง"].includes(latestStatus) && (
                            <IconButton
                                variant="ghost"
                                aria-label="Edit"
                                onClick={() => navigate(`/edit-info-quotation/${quotationId}`)}
                            >
                                <LuPencil style={{ fontSize: "18px" }} />
                                <span>แก้ไข</span>
                            </IconButton>
                        )}

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
                                        <label>{dataQuotation?.total_amount}</label>
                                    </div>

                                    <div className="flex justify-between space-x-4">
                                        <label>ส่วนลดพิเศษ (<span className="text-main">{dataQuotation?.special_discount} บาท</span>)</label>
                                        <label>{dataQuotation?.amount_after_discount}</label>
                                    </div>

                                    <div className="flex justify-between space-x-4">
                                        <label>VAT (%)</label>
                                        <label>{dataQuotation?.vat_amount}</label>
                                    </div>


                                    <div className="border-b-2 border-main mb-6"></div>


                                    <div className="flex justify-between space-x-4">
                                        <label>ยอดรวมทั้งหมด</label>
                                        <label>{dataQuotation?.grand_total}</label>
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
                                                            crossOrigin="anonymous"
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
                                                        crossOrigin="anonymous"
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
                                onClick={handleOpenPdf}
                            >
                                <FiPrinter style={{ fontSize: 18 }} />

                                พิมพ์
                            </Buttons>
                       

                        <div className="space-x-3">

                            {latestStatus && ["ระหว่างดำเนินการ", "ยกเลิกคำขออนุมัติ", "ปรับปรุง"].includes(latestStatus) && (
                                <Buttons
                                    btnType="primary"
                                    variant="outline"
                                    className="w-30"
                                    onClick={() => handleApproveOpen()}
                                >
                                    ส่งคำขออนุมัติ
                                </Buttons>
                            )}



                            {latestStatus && ["รออนุมัติ"].includes(latestStatus) && (
                                <Buttons
                                    btnType="primary"
                                    variant="outline"
                                    className="w-30"
                                    onClick={() => handleCancelApproveOpen()}
                                >
                                    ยกเลิกคำขออนุมัติ
                                </Buttons>
                            )}
                            {latestStatus && ["อนุมัติ", "ไม่อนุมัติ"].includes(latestStatus) &&
                                (
                                    <Buttons
                                        btnType="primary"
                                        variant="outline"
                                        className="w-30"
                                        onClick={() => handleRequestEditOpen()}
                                    >
                                        ขอแก้ไข
                                    </Buttons>
                                )}

                            {latestStatus && ["อนุมัติ"].includes(latestStatus) && (
                                <>


                                    <Buttons
                                        btnType="submit"
                                        variant="solid"
                                        className="w-30"
                                        onClick={() => handleCloseDealOpen()}
                                    >
                                        ปิดการขาย
                                    </Buttons>
                                    <Buttons
                                        btnType="delete"
                                        variant="solid"
                                        className="w-30"
                                        onClick={() => handleRejectDealOpen()}
                                    >
                                        ยกเลิกการขาย
                                    </Buttons>
                                </>
                            )}

                            <Link to="/quotation">
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
                <div className="w-full xl:w-[280px] bg-white shadow-lg rounded-lg p-4 self-stretch">
                    <h2 className="text-lg font-semibold mb-3">ประวัติใบเสนอราคา</h2>

                    {dataQuotation?.status.map((status, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2 mb-3"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-lg">
                                    <LuSquareCheckBig />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-md font-semibold text-gray-800">สถานะใบเสนอราคา</span>
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`text-xs font-medium rounded px-2 py-0.5 ${getStatusColor(status.quotation_status)}`}
                            >
                                {status.quotation_status}
                            </span>

                            <div className="text-sm text-gray-600">วันที่ดำเนินการ: <span className="font-medium">{status?.created_at
                                ? new Date(status?.created_at).toLocaleDateString("th-TH")
                                : "-"}</span></div>
                            <div className="text-sm text-gray-600">ชื่อผู้ดำเนินการ: <span className="font-medium">{status.created_by_employee.first_name} {status.created_by_employee.last_name}</span></div>
                            <div className="text-sm text-gray-600">หมายเหตุ: <span className="italic text-gray-500">{status.quotation_status_remark || "-"}</span></div>
                        </div>
                    ))}
                </div>


            </div>
            {/* ส่งคำขออนุมัติ */}
            <DialogComponent
                isOpen={isApproveDialogOpen}
                onClose={handleApproveClose}
                title="เพิ่มหมายเหตุ การส่งคำขออนุมัติ"
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

            {/* ขอแก้ไขใบเสนอราคา */}
            <DialogComponent
                isOpen={isRequestEditDialogOpen}
                onClose={handleRequestEditClose}
                title="เพิ่มหมายเหตุการขอแก้ไข"
                onConfirm={handleRequestEdit}
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
                        onAction={handleRequestEdit}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>

            {/* ยกเลิกคำขออนุมัติ */}
            <DialogComponent
                isOpen={isCancelApproveDialogOpen}
                onClose={handleCancelApproveClose}
                title="เพิ่มหมายเหตุยกเลิกคำขออนุมัติ"
                onConfirm={handleCancelApprove}
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
                        onAction={handleCancelApprove}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>

            {/* ยกเลิกการขาย */}
            <DialogComponent
                isOpen={isRejectDealDialogOpen}
                onClose={handleRejectDealClose}
                title="เพิ่มหมายเหตุยกเลิกการขาย"
                onConfirm={handleRejectDeal}
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
                        onAction={handleRejectDeal}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>

            {/* ปิดการขาย */}
            <DialogComponent
                isOpen={isCloseDealDialogOpen}
                onClose={handleCloseDealClose}
                title="เพิ่มหมายเหตุปิดการขาย"
                onConfirm={handleCloseDeal}
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
                        onAction={handleCloseDeal}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>
        </>

    );
}
