import { useEffect, useMemo, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import Buttons from "@/components/customs/button/button.main.component";

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
import { closeSale, rejectSale } from "@/services/saleOrder.service";
import TextArea from "@/components/customs/textAreas/textarea.main.component";
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
    const [isRejectDealDialogOpen, setIsRejectDealDialogOpen] = useState<boolean>(false);
    const [isCloseSaleDialogOpen, setIsCloseSaleDialogOpen] = useState<boolean>(false);


    const [dataSaleOrder, setDataSaleOrder] = useState<TypeSaleOrderResponse>();
    const [selectedPaymentFiles, setSelectedPaymentFiles] = useState<{ payment_file_url: string }[]>([]);

    //หาสถานะล่าสุด
    const latestStatus = dataSaleOrder?.status?.[dataSaleOrder.status.length - 1].sale_order_status;

    const [saleOrderRemark, setSaleOrderRemark] = useState("");

    const { showToast } = useToast();
    //
    const navigate = useNavigate();


    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [paymentLogId, setPaymentLogId] = useState<string>("");
    const [saleOrderPaymentFile, setSaleOrderPaymentFile] = useState<TypeSaleOrderPaymentFileResponse>();




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
                        { value: Number(item.unit_price).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.sale_order_item_count).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.unit_discount).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.unit_discount_percent).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: Number(item.sale_order_item_price).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
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
                        { value: Number(item.amount_paid).toFixed(2).toLocaleString() ?? 0, className: "text-right" },
                        { value: item.payment_term_name ?? "-", className: "text-center" },
                        { value: item.payment_method.payment_method_name ?? "-", className: "text-center" },
                        { value: item.payment_remark ?? "-", className: "text-center" },
                    ],
                    data: item,
                })

            );
            setPaymentLog(formattedData);
        }
    }, [dataSaleOrder]);

    const getLatestFieldDate = (logs: any[], field: string): string | null => {
        const filtered = logs
            .filter(log => log[field])
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return filtered.length > 0 ? filtered[0][field] : null;
    };

    //ถ้าโหลด สถานะ ทั้งหมดเสร็จ ค่อยให้เอาเข้า ฟังก์ชัน
    const {
        latestExpectManufactureDate,
        latestManufactureDate,
        latestExpectDeliveryDate,
        latestDeliveryDate,
        latestExpectReceiptDate,
        latestReceiptDate,
    } = useMemo(() => {
        if (!dataSaleOrder?.status) {
            return {
                latestExpectManufactureDate: null,
                latestManufactureDate: null,
                latestExpectDeliveryDate: null,
                latestDeliveryDate: null,
                latestExpectReceiptDate: null,
                latestReceiptDate: null,
            };
        }

        return {
            latestExpectManufactureDate: getLatestFieldDate(dataSaleOrder.status, "expected_manufacture_factory_date"),
            latestManufactureDate: getLatestFieldDate(dataSaleOrder.status, "manufacture_factory_date"),
            latestExpectDeliveryDate: getLatestFieldDate(dataSaleOrder.status, "expected_delivery_date_success"),
            latestDeliveryDate: getLatestFieldDate(dataSaleOrder.status, "delivery_date_success"),
            latestExpectReceiptDate: getLatestFieldDate(dataSaleOrder.status, "expected_receipt_date"),
            latestReceiptDate: getLatestFieldDate(dataSaleOrder.status, "receipt_date"),
        };
    }, [dataSaleOrder]);



    const handleOpenPdf = async () => {
        if (!saleOrderId || !dataSaleOrder) return;

        const blob = await pdf(<SaleorderPDF saleorder={dataSaleOrder} />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
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
    //เปิด
    const handleViewOpen = (item: TypeSaleOrderPaymentLog) => {

        setPaymentLogId(item.payment_log_id);
        setIsViewDialogOpen(true);

    };

    const handleRejectSaleOpen = () => {
        setIsRejectDealDialogOpen(true);
    };
    const handleCloseSaleOpen = () => {
        setIsCloseSaleDialogOpen(true);
    };
    const handleViewClose = () => {
        // setSelectedItem(item);
        setIsViewDialogOpen(false);
    };
    //ปิด
    const handleRejectSaleClose = () => {

        setIsRejectDealDialogOpen(false);
    };
    const handleCloseSaleClose = () => {

        setIsCloseSaleDialogOpen(false);
    };
    //ยกเลิกการขาย
    const handleRejectSale = async () => {
        try {
            const res = await rejectSale(saleOrderId, {
                sale_order_status_remark: saleOrderRemark
            });
            if (res.statusCode === 200) {
                showToast("ยกเลิกการขายสำเร็จ", true);
                handleRejectSaleClose();
                refetchSaleOrder();
                setSaleOrderRemark("");
            } else {
                showToast("ไม่สามารถยกเลิกการขายได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะยกเลิกการขาย", false);
            console.error(err);
        }

    }
    //ปิดการขาย
    const handleCloseSale = async () => {
        try {
            const res = await closeSale(saleOrderId, {

                sale_order_status_remark: saleOrderRemark
            });
            if (res.statusCode === 200) {
                showToast("ปิดการขายสำเร็จ", true);
                handleCloseSaleClose();
                refetchSaleOrder();
                setSaleOrderRemark("");
            }
            else if (res.statusCode === 400) {
                if (res.message === "Awaiting Receipt or full payment") {
                    showToast("กรุณาระบุวันที่ได้รับสินค้า ", false);
                }
                else {
                    showToast("ไม่สามารถปิดการขายได้ เนื่องจากยังชำระเงินไม่ครบ", false);
                }
            }
            else {
                showToast("ไม่สามารถปิดการขายได้", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดขณะปิดการขาย", false);
            console.error(err);
        }

    }
    const remainingTotal = dataSaleOrder?.grand_total - dataSaleOrder?.totalAmountPaid;

    return (
        <>
            <div className="flex text-2xl font-bold mb-3">
                <p className="me-2">รายละเอียดใบสั่งขาย</p>
                {
                    latestStatus && !["สำเร็จ", "ไม่สำเร็จ"].includes(latestStatus) && (
                        <IconButton
                            variant="ghost"
                            aria-label="Edit"
                            onClick={() => navigate(`/edit-sale-order/${saleOrderId}`)}
                        >
                            <LuPencil style={{ fontSize: "18px" }} /><span>แก้ไข</span>
                        </IconButton>
                    )
                }

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
                    <h1 className="text-xl font-semibold mb-1">
                        รายละเอียดการชำระเงิน (
                        {remainingTotal === 0 ? (
                            <span className="text-green-600">ชำระเงินเรียบร้อย</span>
                        ) : (
                            <span className="text-red-500">ยอดค้างชำระ {remainingTotal.toFixed(2).toLocaleString()} บาท</span>
                        )}

                        )
                    </h1>
                    <div className="border-b-2 border-main mb-6"></div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* ฝั่งซ้าย */}
                        <div className="space-y-4">

                            <div className="flex justify-between space-x-4">
                                <label>ราคารวม</label>
                                <label>{Number(dataSaleOrder?.total_amount).toFixed(2).toLocaleString()}</label>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <label>ส่วนลดพิเศษ (<span className="text-main"> {Number(dataSaleOrder?.special_discount).toFixed(2).toLocaleString()} บาท </span>)</label>
                                <label>{Number(dataSaleOrder?.amount_after_discount).toFixed(2).toLocaleString()}</label>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <label>VAT (%)</label>
                                <label>{Number(dataSaleOrder?.vat_amount).toFixed(2).toLocaleString()}</label>
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
                                    <LabelWithValue label="วันที่คาดว่าจะผลิตเสร็จ" value={latestExpectManufactureDate ? new Date(latestExpectManufactureDate).toLocaleDateString("th-TH") : "-"} />
                                    <LabelWithValue label="วันที่ผลิตเสร็จจริง" value={latestManufactureDate ? new Date(latestManufactureDate).toLocaleDateString("th-TH") : "-"} />


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
                                    <LabelWithValue label="วันที่คาดว่าจะจัดส่งเสร็จ" value={latestExpectDeliveryDate ? new Date(latestExpectDeliveryDate).toLocaleDateString("th-TH") : "-"} />
                                    <LabelWithValue label="วันจัดส่งสินค้าเสร็จจริง" value={latestDeliveryDate ? new Date(latestDeliveryDate).toLocaleDateString("th-TH") : "-"} />



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
                                    <LabelWithValue label="วันที่คาดว่าจะได้รับสินค้า" value={latestExpectReceiptDate ? new Date(latestExpectReceiptDate).toLocaleDateString("th-TH") : "-"} />
                                    <LabelWithValue label="วันที่ได้รับสินค้าจริง" value={latestReceiptDate ? new Date(latestReceiptDate).toLocaleDateString("th-TH") : "-"} />




                                </div>

                            </div>
                        </div>


                        {/* ฝั่งขวา */}

                        <div>
                            <h1 className="text-xl font-semibold mb-1">ประวัติเอกสาร</h1>
                            <div className="border-b-2 border-main mb-4"></div>


                            <div className="max-h-[620px] overflow-y-auto pr-2 space-y-4">
                                {dataSaleOrder?.status.map((status, index) => {
                                    const getStatusColor = (statusName) => {
                                        if (statusName.includes("การผลิต")) return "bg-green-500 text-white";
                                        if (statusName.includes("ขนส่ง")) return "bg-sky-400 text-white";
                                        if (statusName.includes("ได้รับ")) return "bg-blue-600 text-white";
                                        return "bg-yellow-300 text-black";
                                    };
                                    const labelColor = getStatusColor(status.sale_order_status);
                                    let label = "";
                                    let dateValue = "";
                                    let remark = "";
                                    if (status.expected_manufacture_factory_date) {
                                        label = "วันที่คาดว่าจะผลิตเสร็จ";
                                        dateValue = new Date(status.expected_manufacture_factory_date).toLocaleDateString("th-TH");
                                    } else if (status.manufacture_factory_date) {
                                        label = "วันที่ผลิตเสร็จจริง";
                                        dateValue = new Date(status.manufacture_factory_date).toLocaleDateString("th-TH");
                                    } else if (status.expected_delivery_date_success) {
                                        label = "วันที่คาดว่าจะจัดส่งเสร็จ";
                                        dateValue = new Date(status.expected_delivery_date_success).toLocaleDateString("th-TH");
                                    } else if (status.delivery_date_success) {
                                        label = "วันที่จัดส่งสินค้าเสร็จจริง";
                                        dateValue = new Date(status.delivery_date_success).toLocaleDateString("th-TH");
                                    } else if (status.expected_receipt_date) {
                                        label = "วันที่คาดว่าจะได้รับสินค้า";
                                        dateValue = new Date(status.expected_receipt_date).toLocaleDateString("th-TH");
                                    } else if (status.receipt_date) {
                                        label = "วันที่ได้รับสินค้าจริง";
                                        dateValue = new Date(status.receipt_date).toLocaleDateString("th-TH");
                                    }

                                    if (["สำเร็จ", "ไม่สำเร็จ"].includes(status.sale_order_status)) {
                                        remark = status.sale_order_status_remark || "-";
                                    }


                                    const createdDate = status.created_at
                                        ? new Date(status.created_at).toLocaleDateString("th-TH")
                                        : "-";
                                    const fullName = `${status.created_by_employee.first_name || ""} ${status.created_by_employee.last_name || ""}`.trim();

                                    return (
                                        <div key={index} className="flex items-start gap-3">

                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white text-lg">
                                                <LuSquareCheckBig />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className={`${labelColor}  text-sm px-2 py-1 rounded-md inline-block`}>
                                                    สถานะใบสั่งขาย: <span className="font-bold">{status.sale_order_status}</span>
                                                </div>

                                                {label && (
                                                    <div className="text-sm text-slate-700">
                                                        {label}: <span className="font-semibold">{dateValue}</span>
                                                    </div>
                                                )}

                                                <p className="text-sm text-slate-600">
                                                    วันที่ดำเนินการ: <span className="font-medium ms-1">{createdDate}</span>
                                                </p>

                                                <p className="text-sm text-slate-600">
                                                    ชื่อผู้ดำเนินการ: <span className="font-medium ms-1">{fullName || "-"}</span>
                                                </p>
                                                {["สำเร็จ", "ไม่สำเร็จ"].includes(status.sale_order_status) && (
                                                    <div className="text-sm text-slate-700">
                                                        หมายเหตุ: <span className="font-semibold">{status.sale_order_status_remark || "-"}</span>
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                    {latestStatus && !["สำเร็จ", "ไม่สำเร็จ"].includes(latestStatus) && (
                        <>


                            <Buttons
                                btnType="submit"
                                variant="solid"
                                className="w-30"
                                onClick={() => handleCloseSaleOpen()}
                            >
                                ปิดการขาย
                            </Buttons>
                            <Buttons
                                btnType="delete"
                                variant="solid"
                                className="w-30"
                                onClick={() => handleRejectSaleOpen()}
                            >
                                ยกเลิกการขาย
                            </Buttons>
                        </>
                    )}

                    <Link to="/sale-order">
                        <Buttons
                            btnType="cancel"
                            variant="soft"
                            className="w-30 "
                        >
                            กลับ
                        </Buttons>
                    </Link>
                </div>
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
                            />
                        </Dialog.Content>
                    </Dialog.Root>
                )}
            </DialogComponent>

            {/* ยกเลิกการขาย */}
            <DialogComponent
                isOpen={isRejectDealDialogOpen}
                onClose={handleRejectSaleClose}
                title="เพิ่มหมายเหตุยกเลิกการขาย"
                onConfirm={handleRejectSale}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                confirmBtnType="primary"
            >
                <div className="flex flex-col space-y-5">

                    <TextArea
                        id="note"
                        placeholder=""
                        onChange={(e) => setSaleOrderRemark(e.target.value)}
                        value={saleOrderRemark}
                        label="หมายเหตุ"
                        labelOrientation="horizontal"
                        onAction={handleRejectSale}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>

            {/* ปิดการขาย */}
            <DialogComponent
                isOpen={isCloseSaleDialogOpen}
                onClose={handleCloseSaleClose}
                title="เพิ่มหมายเหตุปิดการขาย"
                onConfirm={handleCloseSale}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                confirmBtnType="primary"
            >
                <div className="flex flex-col space-y-5">

                    <TextArea
                        id="note"
                        placeholder=""
                        onChange={(e) => setSaleOrderRemark(e.target.value)}
                        value={saleOrderRemark}
                        label="หมายเหตุ"
                        labelOrientation="horizontal"
                        onAction={handleCloseSale}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>
        </>

    );
}
