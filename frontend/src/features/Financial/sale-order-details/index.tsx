import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import Buttons from "@/components/customs/button/button.main.component";

import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";

// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";



import { IconButton, Dialog } from "@radix-ui/themes";
import { LabelWithValue } from "@/components/ui/label";
import RatingShow from "@/components/customs/rating/rating.show.component";
import { FaTruck } from "react-icons/fa";
import { LuPencil, LuSquareCheckBig } from "react-icons/lu";
import { IoIosCube } from "react-icons/io";
import { FiPrinter } from "react-icons/fi";

import { TypeSaleOrderPaymentFileResponse, TypeSaleOrderPaymentLog, TypeSaleOrderProducts, TypeSaleOrderResponse } from "@/types/response/response.saleorder";
import { usePaymentFileById, useSaleOrderById } from "@/hooks/useSaleOrder";
import { appConfig } from "@/configs/app.config";

import { MdImageNotSupported } from "react-icons/md";
import SaleorderPDF from "../pdf/print-saleorder-detail/SaleorderPDF";
import { pdf } from "@react-pdf/renderer";
type dateTableType = {
    className: string;
    cells: {
        value: React.ReactNode;
        className: string;
    }[];
    data: TypeSaleOrderProducts; //ตรงนี้

}[];
type dateTablePaymentLogType = {
    className: string;
    cells: {
        value: React.ReactNode;
        className: string;
    }[];
    data: TypeSaleOrderPaymentLog; //ตรงนี้

}[];
type ProductRow = {
    id: string;
    detail: string;
    amount: string;
    unit: string;
    price: string;
    discount: string;
    discountPercent: string;
    value: string;
    group: string;
};
//
export default function SaleOrderDetails() {

    const { saleOrderId } = useParams<{ saleOrderId: string }>();
    const [data, setData] = useState<dateTableType>([]);
    const [paymentLog, setPaymentLog] = useState<dateTablePaymentLogType>([]);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);


    const [dataSaleOrder, setDataSaleOrder] = useState<TypeSaleOrderResponse>();
    const [selectedPaymentFiles, setSelectedPaymentFiles] = useState<{ payment_file_url: string }[]>([]);

    const [produceDate, setProduceDate] = useState<Date | null>(null);
    const [shipDate, setShipDate] = useState<Date | null>(null);
    const [receivedDate, setReceivedDate] = useState<Date | null>(null);


    const { showToast } = useToast();
    //
    const navigate = useNavigate();


    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [paymentLogId, setPaymentLogId] = useState<string>("");
    const [saleOrderPaymentFile, setSaleOrderPaymentFile] = useState<TypeSaleOrderPaymentFileResponse>();

    const [searchPayment, setSearchPayment] = useState("");

    const [productRows, setProductRows] = useState<ProductRow[]>([
        { id: "", detail: "", amount: "", unit: "", price: "", discount: "", discountPercent: "", value: "", group: "" }
    ]);


    const headers = [
        { label: "ลำดับ", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดสินค้า", colSpan: 1, className: "w-auto" },
        { label: "จำนวน", colSpan: 1, className: "w-auto" },
        { label: "หน่วย", colSpan: 1, className: "w-auto " },
        { label: "ราคา/หน่วย", colSpan: 1, className: "w-auto" },
        { label: "ส่วนลด/หน่วย", colSpan: 1, className: "w-auto" },
        { label: "ส่วนลด(%)/หน่วย", colSpan: 1, className: "w-auto" },
        { label: "มูลค่า", colSpan: 1, className: "w-auto" },
        { label: "กลุ่มสินค้า", colSpan: 1, className: "w-auto" },
    ];

    const headersSaleOrder = [
        { label: "ครั้งที่", colSpan: 1, className: "w-auto" },
        { label: "วันที่ชำระ", colSpan: 1, className: "w-auto" },
        { label: "จำนวนเงินที่ชำระ", colSpan: 1, className: "w-auto" },
        { label: "เงื่อนไขการชำระเงิน", colSpan: 1, className: "w-auto " },
        { label: "วิธีการชำระเงิน", colSpan: 1, className: "w-auto " },
        { label: "หมายเหตุ", colSpan: 1, className: "w-auto " },
        { label: "ดูหลักฐาน", colSpan: 1, className: "w-auto " },

    ];
    //fetch quotation detail 
    if (!saleOrderId) {
        throw Error;
    }
    const { data: saleOrderDetails, refetch: refetchSaleOrder } = useSaleOrderById({ saleOrderId });
    useEffect(() => {
        if (saleOrderDetails?.responseObject) {
            setDataSaleOrder(saleOrderDetails.responseObject);
        }

    }, [saleOrderDetails]);

    useEffect(() => {

        if (dataSaleOrder?.sale_order_product) {
            const formattedData = dataSaleOrder?.sale_order_product.map(
                (item: TypeSaleOrderProducts, index: number) => ({
                    className: "",
                    cells: [
                        { value: index + 1, className: "text-center" },
                        { value: item.product.product_name ?? "-", className: "text-center" },
                        { value: item.group_product.group_product_name ?? "-", className: "text-center" },
                        { value: item.unit.unit_name ?? "-", className: "text-center" },
                        { value: item.unit_price ?? 0, className: "text-right" },
                        { value: item.sale_order_item_count ?? 0, className: "text-right" },
                        { value: item.unit_discount ?? 0, className: "text-right" },
                        { value: item.unit_discount_percent ?? 0, className: "text-right" },
                        { value: item.sale_order_item_price ?? 0, className: "text-right" },
                    ],
                    data: item,
                })

            );
            setData(formattedData);
        }
    }, [dataSaleOrder]);

    useEffect(() => {

        if (dataSaleOrder?.sale_order_payment_log) {
            const formattedData = dataSaleOrder?.sale_order_payment_log.map(
                (item: TypeSaleOrderPaymentLog, index: number) => ({
                    className: "",
                    cells: [
                        { value: index + 1, className: "text-center" },
                        { value: new Date(item.payment_date).toLocaleDateString("th-TH"), className: "text-center" },
                        { value: item.amount_paid, className: "text-right" },
                        { value: item.payment_term_name ?? "-", className: "text-center" },
                        { value: item.payment_method.payment_method_name ?? 0, className: "text-center" },
                        { value: item.payment_remark ?? 0, className: "text-center" },
                    ],
                    data: item,
                })

            );
            setPaymentLog(formattedData);
        }
    }, [dataSaleOrder]);

    const handleOpenPdf = async () => {
        if (!saleOrderId || !dataSaleOrder) return;
      
        const blob = await pdf(<SaleorderPDF saleorder={dataSaleOrder} />).toBlob();
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

    const handleViewOpen = (item: TypeSaleOrderPaymentLog) => {

        setPaymentLogId(item.payment_log_id);
        setIsViewDialogOpen(true);

    };

    const { data: dataPaymentFile, refetch: refetchPaymentFile } = usePaymentFileById({ paymentLogId });

    useEffect(() => {
        if (paymentLogId) {
            refetchPaymentFile();
        }
    }, [paymentLogId]);

    useEffect(() => {
        if (dataPaymentFile?.responseObject) {
            setSaleOrderPaymentFile(dataPaymentFile.responseObject);
        }
    }, [dataPaymentFile]);

    const handleViewClose = () => {
        // setSelectedItem(item);
        setIsViewDialogOpen(false);

    };

    return (
        <>
            <div className="flex text-2xl font-bold mb-3">
                <p className="me-2">รายละเอียดใบสั่งขาย</p>
                <IconButton
                    variant="ghost"
                    aria-label="Edit"
                    onClick={() => navigate(`/edit-sale-order/${saleOrderId}`)}
                >
                    <LuPencil style={{ fontSize: "18px" }} /><span>แก้ไข</span>
                </IconButton>
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
                                <LabelWithValue label="ลูกค้า" value={`${dataSaleOrder?.customer.company_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="flex flex-row ">
                                <label className="whitespace-nowrap 2xl:me-28">ความสำคัญ<span style={{ color: "red" }}>*</span></label>
                                <RatingShow value={dataSaleOrder?.priority ?? 0} className="2xl:ms-14 w-6 h-6" />

                            </div>

                            <div className="">
                                <LabelWithValue
                                    label="วันออกเอกสาร"
                                    value={
                                        dataSaleOrder?.issue_date
                                            ? new Date(dataSaleOrder.issue_date).toLocaleDateString("th-TH")
                                            : "-"
                                    }
                                    classNameLabel="sm:w-1/2"
                                    classNameValue="w-80"
                                />

                            </div>
                            <div className="">
                                <LabelWithValue label="เลขผู้เสียภาษี" value={`${dataSaleOrder?.customer.tax_id}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">
                            <div className="">
                                <LabelWithValue label="ทีมผู้รับผิดชอบ" value={`${dataSaleOrder?.team.name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                            <div className="">

                                <LabelWithValue label="ผู้รับผิดชอบ" value={`${dataSaleOrder?.responsible.first_name} ${dataSaleOrder?.responsible.last_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>
                            <div className="">
                                <LabelWithValue
                                    label="วันยื่นราคา"
                                    value={
                                        dataSaleOrder?.price_date
                                            ? new Date(dataSaleOrder.price_date).toLocaleDateString("th-TH")
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
                                <LabelWithValue label="การรับสินค้า" value={`${dataSaleOrder?.shipping_method}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>


                            <div className="">
                                <LabelWithValue
                                    label="วันจัดส่งสินค้า"
                                    value={
                                        dataSaleOrder?.expected_delivery_date
                                            ? new Date(dataSaleOrder.expected_delivery_date).toLocaleDateString("th-TH")
                                            : "-"
                                    }
                                    classNameLabel="sm:w-1/2"
                                    classNameValue="w-80"
                                />
                            </div>

                            <div className="">
                                <LabelWithValue label="ชื่อสถานที่" value={`${dataSaleOrder?.place_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="ที่อยู่" value={`${dataSaleOrder?.address}.`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">
                            {
                                dataSaleOrder?.shipping_remark && (
                                    <div className="">
                                        <LabelWithValue label="อื่นๆ โปรดระบุ" value={`${dataSaleOrder?.shipping_remark}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                                    </div>
                                )
                            }
                            <div className="">
                                <LabelWithValue label="ประเภท" value={`${dataSaleOrder?.country.country_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="จังหวัด" value={`${dataSaleOrder?.province.province_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="อำเภอ" value={`${dataSaleOrder?.district.district_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
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
                                <LabelWithValue label="ชื่อผู้ติดต่อ" value={`${dataSaleOrder?.contact_name}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                            <div className="">
                                <LabelWithValue label="อีเมลผู้ติดต่อ" value={`${dataSaleOrder?.contact_email}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>

                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">

                            <div className="">
                                <LabelWithValue label="เบอร์ผู้ติดต่อ" value={`${dataSaleOrder?.contact_phone}`} classNameLabel="sm:w-1/2" classNameValue="w-80" />
                            </div>



                        </div>
                    </div>
                </div>
            </div>


            {/* Table */}
            <MasterTableFeature
                title=""
                hideTitleBtn={true}
                headers={headers}
                rowData={data}
                totalData={dataSaleOrder?.sale_order_product.length}
                hidePagination={true}
            />

            {/* รายละเอียดการชำระเงิน */}
            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mt-7" >
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    <h1 className="text-xl font-semibold mb-1">รายละเอียดการชำระเงิน <span className="text-red-500">( {dataSaleOrder?.payment_status} )</span></h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* ฝั่งซ้าย */}
                        <div className="space-y-4">

                            <div className="flex justify-between space-x-4">
                                <label>ราคารวม</label>
                                <label>{dataSaleOrder?.total_amount}</label>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <label>ส่วนลดพิเศษ (<span className="text-main">{dataSaleOrder?.special_discount} บาท</span>)</label>
                                <label>{dataSaleOrder?.amount_after_discount}</label>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <label>VAT (%)</label>
                                <label>{dataSaleOrder?.vat_amount}</label>
                            </div>


                            <div className="border-b-2 border-main mb-6"></div>


                            <div className="flex justify-between space-x-4">

                                <label>ยอดรวมทั้งหมด</label>
                                <label>{dataSaleOrder?.grand_total}</label>
                            </div>

                            <div className="border-b-2 border-main mb-6 "></div>

                            <div >
                                <label>บันทึกเพิ่มเติม</label><br />
                                <p className="mt-2 text-blue-600">{dataSaleOrder?.additional_notes ?? "-"}</p>
                            </div>


                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">


                            <div className="flex justify-between space-x-4">
                                <label>เงื่อนไขการชำระเงิน</label>
                                {dataSaleOrder?.payment_term_name === "เต็มจำนวน" && (
                                    <div className="flex flex-row space-x-5">
                                        <p className="text-blue-600">{dataSaleOrder?.payment_term_name}</p>
                                        <label>ภายใน</label>
                                        <p className="text-blue-600">{dataSaleOrder?.payment_term_day}</p>

                                        <label>วัน</label>
                                    </div>
                                )}
                                {dataSaleOrder?.payment_term_name === "แบ่งชำระ" && (
                                    <div className="flex flex-row space-x-5">
                                        <p className="text-blue-600">{dataSaleOrder?.payment_term_name}</p>
                                        <label>ภายใน</label>
                                        <p className="text-blue-600">{dataSaleOrder?.payment_term_installment}</p>

                                        <label>งวด</label>
                                    </div>

                                )}

                            </div>


                            {dataSaleOrder?.payment_term_name === "แบ่งชำระ" && (
                                <>
                                    <div className="mt-4 border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
                                        <h3 className="text-base font-semibold text-gray-700 mb-3">
                                            รายละเอียดงวดการชำระเงิน
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                            {dataSaleOrder?.sale_order_payment_term?.map((term, index) => (
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
                                <label className="text-blue-600">{dataSaleOrder?.payment_method.payment_method_name}</label>
                            </div>
                            <div className="flex justify-between space-x-4">
                                <label>สกุลเงิน</label>
                                <label className="text-blue-600">{dataSaleOrder?.currency.currency_name}</label>
                            </div>


                            <div className="flex justify-between space-x-4">
                                <label>หมายเหตุ</label>
                                <label className="text-blue-600">{dataSaleOrder?.remark ?? 'ไม่มีหมายเหตุ'}</label>
                            </div>
                            <div className="">
                                <label className="block font-medium mb-2">เอกสารที่แนบ</label>

                                <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
                                    {saleOrderDetails?.responseObject?.sale_order_file?.map((file, index) => {
                                        const fileUrl = `${appConfig.baseApi}${file.sale_order_file_url}`;
                                        const isPdf = file.sale_order_file_url.toLowerCase().endsWith(".pdf");

                                        return isPdf ? (
                                            <div
                                                key={file.sale_order_file_id}
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
                                                key={file.sale_order_file_id}
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
            <MasterTableFeature
                title=""
                hideTitleBtn={true}
                headers={headersSaleOrder}
                rowData={paymentLog}
                totalData={dataSaleOrder?.sale_order_payment_log.length}
                onView={handleViewOpen}
                hidePagination={true}
            />


            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* ฝั่งซ้าย */}
                        <div>
                            <h1 className="text-xl font-semibold mb-1">สถานะจัดส่ง</h1>
                            <div className="border-b-2 border-main mb-6"></div>

                            {/* สถานะ กำลังผลิต */}
                            <div className="flex items-start gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-lg">
                                    <IoIosCube />
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="bg-green-500 text-white text-sm px-2 py-1 rounded-md inline-block mb-2">
                                        สถานะการจัดส่ง: กำลังผลิต
                                    </div>
                                    <DatePickerComponent
                                        label="วันที่คาดว่าจะเสร็จ"
                                        selectedDate={produceDate}
                                        onChange={setProduceDate}
                                        placeholder="dd/mm/yy"
                                        required
                                        classNameLabel="w-full sm:w-1/2"
                                        classNameInput="w-full"
                                    />
                                    <DatePickerComponent
                                        label="วันที่ผลิตเสร็จจริง"
                                        selectedDate={produceDate}
                                        onChange={setProduceDate}
                                        placeholder="dd/mm/yy"
                                        required
                                        classNameLabel="w-full sm:w-1/2"
                                        classNameInput="w-full"
                                    />
                                </div>

                            </div>

                            {/* สถานะ กำลังจัดส่ง */}
                            <div className="flex items-start gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center text-white text-lg">
                                    <FaTruck />
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="bg-sky-400 text-white text-sm px-2 py-1 rounded-md inline-block mb-2">
                                        สถานะการจัดส่ง: กำลังจัดส่ง
                                    </div>
                                    <DatePickerComponent
                                        label="วันที่คาดว่าจะส่งเสร็จ"
                                        selectedDate={shipDate}
                                        onChange={setShipDate}
                                        placeholder="dd/mm/yy"
                                        required
                                        classNameLabel="w-full sm:w-1/2"
                                        classNameInput="w-full"
                                    />
                                    <DatePickerComponent
                                        label="วันจัดส่งสินค้าเสร็จจริง"
                                        selectedDate={shipDate}
                                        onChange={setShipDate}
                                        placeholder="dd/mm/yy"
                                        required
                                        classNameLabel="w-full sm:w-1/2"
                                        classNameInput="w-full"
                                    />
                                </div>


                            </div>

                            {/* สถานะ ได้รับสินค้าแล้ว */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white text-lg">
                                    <LuSquareCheckBig />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="bg-blue-600 text-white text-sm px-2 py-1 rounded-md inline-block mb-2">
                                        สถานะการจัดส่ง: ได้รับสินค้าแล้ว
                                    </div>
                                    <DatePickerComponent
                                        label="วันที่คาดว่าจะได้รับสินค้า"
                                        selectedDate={receivedDate}
                                        onChange={setReceivedDate}
                                        placeholder="dd/mm/yy"
                                        required
                                        classNameLabel="w-full sm:w-1/2"
                                        classNameInput="w-full"
                                    />
                                    <DatePickerComponent
                                        label="วันที่ได้รับสินค้าจริง"
                                        selectedDate={receivedDate}
                                        onChange={setReceivedDate}
                                        placeholder="dd/mm/yy"
                                        required
                                        classNameLabel="w-full sm:w-1/2"
                                        classNameInput="w-full"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* ฝั่งขวา */}
                        <div>

                            <h1 className="text-xl font-semibold mb-1">ประวัติเอกสาร</h1>
                            <div className="border-b-2 border-main mb-6"></div>

                            {dataSaleOrder?.status.map((status, index) => (
                                <div key={index} className="flex items-start gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white text-lg">
                                        <LuSquareCheckBig />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-yellow-300 text-slate-800 text-sm px-2 py-1 rounded-md inline-block mb-2">
                                            สถานะใบสั่งขาย: <span className="font-bold">{status.sale_order_status}</span>

                                        </div>
                                        <p className="text-sm text-slate-600">
                                            วันออกเอกสาร:
                                            <span className="font-medium ms-1">{status?.created_at
                                                ? new Date(status?.created_at).toLocaleDateString("th-TH")
                                                : "-"}
                                            </span>
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            ชื่อผู้รับผิดชอบ:
                                            <span className="font-medium ms-1">
                                                {dataSaleOrder.responsible.first_name} {dataSaleOrder.responsible.last_name}
                                            </span>
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            ชื่อผู้บันทึก:
                                            <span className="font-medium ms-1">
                                                {status.created_by_employee.first_name} {status.created_by_employee.last_name}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="submit"
                    variant="solid"
                    className="w-30"
                >
                    บันทึก
                </Buttons>
                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                    onClick={handleOpenPdf}
                >
                    <FiPrinter style={{ fontSize: 18 }} />

                    พิมพ์
                </Buttons>
                <Link to="/sale-order">
                    <Buttons
                        btnType="cancel"
                        variant="soft"
                        className="w-30 "
                    >
                        ยกเลิก
                    </Buttons>
                </Link>

            </div>

            {/* ดูภาพหลักฐาน */}
            <DialogComponent
                isOpen={isViewDialogOpen}
                onClose={handleViewClose}
                title="รูปภาพหลักฐาน"
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                confirmBtnType="primary"
            >
                <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
                    {saleOrderPaymentFile?.payment_file?.length > 0 ? (
                        saleOrderPaymentFile.payment_file.map((file, index) => {
                            const fileUrl = `${appConfig.baseApi}${file.payment_file_url}`;
                            const isPdf = file.payment_file_url.toLowerCase().endsWith(".pdf");

                            return isPdf ? (
                                <div
                                    key={index}
                                    className="w-40 h-40 border p-2 rounded shadow flex-shrink-0"
                                >
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex justify-center text-blue-500 underline"
                                    >
                                        PDF ไฟล์ {index + 1}
                                    </a>
                                </div>
                            ) : (
                                <div
                                    key={index}
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
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full text-gray-500 py-10">
                            <MdImageNotSupported className="text-6xl mb-2" />
                            <span className="text-sm">ไม่มีภาพแนบ</span>
                        </div>
                    )}
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
            </DialogComponent>

        </>

    );
}
