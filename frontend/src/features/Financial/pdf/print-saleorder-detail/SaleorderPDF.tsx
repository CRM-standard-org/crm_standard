import React from 'react';
import { Font, Image, Document, Page, Text, View } from '@react-pdf/renderer';
import THSarabunRegular from '../../../../../font/THSarabunNew.ttf';
import THSarabunBold from '../../../../../font/THSarabunNew Bold.ttf';
import { companyLogoBase64 } from '@/assets/images/logoBase64';
import { styles } from './style';
import { TypeSaleOrderResponse, TypeSaleOrderProducts } from '@/types/response/response.saleorder';

Font.register({
    family: 'THSarabunNew',
    fonts: [
        { src: THSarabunRegular },
        { src: THSarabunBold, fontWeight: 'bold' }
    ]
});

// header
const SaleOrderHeader = ({ saleorder }: { saleorder: TypeSaleOrderResponse }) => {
    const latestStatus = saleorder.status?.[saleorder.status.length - 1];
    const issuerName = latestStatus?.created_by_employee?.first_name || 'ไม่ระบุ';
    const issueDate = new Date(saleorder.issue_date).toLocaleDateString("th-TH");
    const expectedDeliveryDate = new Date(saleorder.expected_delivery_date).toLocaleDateString("th-TH");

    return (
        <View>
            <View style={styles.headerRow}>
                {/* ซ้าย */}
                <View style={styles.companyInfo}>
                    <Image src={companyLogoBase64} style={styles.logo} />
                    <Text style={styles.companyName}>BluePeak</Text>
                    <Text style={styles.label}>{saleorder.address}, {saleorder.district?.district_name}, {saleorder.province?.province_name}, {saleorder.country?.country_name}</Text>
                    <Text><Text style={styles.label}>เลขประจำตัวผู้เสียภาษี: </Text>{saleorder.customer.tax_id}</Text>
                    <Text><Text style={styles.label}>ผู้ติดต่อ / Contact: </Text>{saleorder.contact_name} ({saleorder.contact_phone})</Text>
                </View>
                {/* ขวา */}
                <View style={styles.quotationInfo}>
                    <Text style={styles.titleHighlight}>ใบสั่งขาย</Text>
                    <Text><Text style={styles.label}>เลขที่: </Text>{saleorder.sale_order_number}</Text>
                    <Text><Text style={styles.label}>วันที่: </Text>{issueDate}</Text>
                    <Text><Text style={styles.label}>ผู้ออก: </Text>{issuerName}</Text>
                </View>
            </View>
            {/* ข้อมูลลูกค้า */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text><Text style={styles.label}>ลูกค้า: </Text>{saleorder.customer?.company_name}</Text>
                    </View>
                    <View style={styles.col50}>
                        <Text><Text style={styles.label}>ขนส่ง: </Text>{saleorder.shipping_method}</Text>
                        <Text><Text style={styles.label}>วันจัดส่งสินค้า: </Text>{expectedDeliveryDate}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

// สรุปยอดเงินและหมายเหตุ
const TotalsAndRemarks = ({ saleorder }: { saleorder: TypeSaleOrderResponse }) => (
    <View>
        <View>
            <Text style={styles.total}>รวมเป็นเงิน (ส่วนลด {saleorder.special_discount} บาท): {saleorder.amount_after_discount.toLocaleString()} {saleorder.currency?.currency_name}</Text>
            <Text style={styles.total}>ภาษีมูลค่าเพิ่ม ({saleorder.vat.vat_percentage}%): {saleorder.vat_amount.toLocaleString()} {saleorder.currency?.currency_name}</Text>
            <Text style={styles.total}><Text style={styles.label}>จำนวนเงินรวมทั้งสิ้น: </Text>{saleorder.grand_total.toLocaleString()} {saleorder.currency?.currency_name}</Text>
        </View>
        <View style={styles.section}>
            <Text><Text style={styles.label}>หมายเหตุ / Remark: </Text>{saleorder.remark?.trim() ? saleorder.remark : 'ไม่มีหมายเหตุ'}</Text>
        </View>
    </View>
);

// ลายเซ็น 
const SignatureSection = ({ saleorder }: { saleorder: TypeSaleOrderResponse }) => (
    <View style={styles.signatureRow}>
        <View style={styles.signatureBlock}>
            <Text style={styles.centerText}>ในนาม {saleorder.customer.company_name}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.centerText}>ผู้สั่งซื้อสินค้า</Text>
            <View style={styles.signatureGap} />
            <Text style={styles.centerText}>วันที่</Text>
        </View>
        <View style={styles.signatureBlock}>
            <Text style={styles.centerText}>ในนาม บริษัทของคุณ</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.centerText}>ผู้ออกเอกสาร</Text>
            <View style={styles.signatureGap} />
            <Text style={styles.centerText}>วันที่</Text>
        </View>
    </View>
);


const SaleorderPDF = ({ saleorder }: { saleorder: TypeSaleOrderResponse }) => {
    
    const itemsPerPage = 10;
    const products = saleorder.sale_order_product;

    const productChunks: TypeSaleOrderProducts[][] = [];
    for (let i = 0; i < products.length; i += itemsPerPage) {
        productChunks.push(products.slice(i, i + itemsPerPage));
    }

    if (productChunks.length === 0) {
        productChunks.push([]);
    }

    return (
        <Document>
            {productChunks.map((chunk, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage = pageIndex === productChunks.length - 1;

                return (
                    <Page key={pageIndex} size="A4" style={styles.page}>
                        
                        <SaleOrderHeader saleorder={saleorder} />

                        {/* ตารางสินค้า */}
                        <View>
                            <View style={styles.tableHeader}>
                                <Text style={styles.cellIndex}>#</Text>
                                <Text style={styles.cell}>รายละเอียด</Text>
                                <Text style={styles.cellRight}>จำนวน</Text>
                                <Text style={styles.cellRight}>หน่วย</Text>
                                <Text style={styles.cellRight}>ราคาต่อหน่วย</Text>
                                <Text style={styles.cellRight}>ยอดรวม</Text>
                            </View>

                            {chunk.map((item, itemIndex) => {
                                const itemNumber = (pageIndex * itemsPerPage) + itemIndex + 1;
                                return (
                                    <View key={itemIndex} style={styles.tableRow}>
                                        <Text style={styles.cellIndex}>{itemNumber}</Text>
                                        <Text style={styles.cell}>{item.product.product_name}</Text>
                                        <Text style={styles.cellRight}>{item.sale_order_item_count}</Text>
                                        <Text style={styles.cellRight}>{item.unit.unit_name}</Text>
                                        <Text style={styles.cellRight}>{item.unit_price.toLocaleString()}</Text>
                                        <Text style={styles.cellRight}>{item.sale_order_item_price.toLocaleString()}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        
                        {/* แสดงยอดรวมเงินเฉพาะหน้าสุดท้าย */}
                        {isLastPage && <TotalsAndRemarks saleorder={saleorder} />}
                        
                        {/* แสดงลายเซ็นที่หน้าแรกและหน้าสุดท้าย */}
                        {(isFirstPage || isLastPage) && <SignatureSection saleorder={saleorder} />}
                    </Page>
                );
            })}
        </Document>
    );
};

export default SaleorderPDF;