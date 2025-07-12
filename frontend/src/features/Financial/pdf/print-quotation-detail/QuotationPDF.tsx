import React from 'react';
import { Font, Image } from '@react-pdf/renderer';
import THSarabunRegular from '../../../../../font/THSarabunNew.ttf';
import THSarabunBold from '../../../../../font/THSarabunNew Bold.ttf';
import { companyLogoBase64 } from '@/assets/images/logoBase64';
import {
    Document,
    Page,
    Text,
    View,
} from '@react-pdf/renderer';

import { styles } from './style';
import { TypeQuotationResponse } from '@/types/response/response.quotation';

Font.register({
    family: 'THSarabunNew',
    fonts: [
        { src: THSarabunRegular },
        { src: THSarabunBold, fontWeight: 'bold' }
    ]
});

const QuotationPDF = ({ quotation }: { quotation: TypeQuotationResponse }) => {
    const latestStatus = quotation.status?.[quotation.status.length - 1];
    const issuerName = latestStatus?.created_by_employee?.first_name || 'ไม่ระบุ';
    const issueDate = new Date(quotation.issue_date).toLocaleDateString("th-TH");
    const expectedClosingDate = new Date(quotation.expected_closing_date).toLocaleDateString("th-TH");
    const expectedDeliveryDate = new Date(quotation.expected_delivery_date).toLocaleDateString("th-TH");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerRow}>
                    {/* ซ้าย โลโก้ + ที่อยู่บริษัท */}
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>ฺBluePeak</Text>
                        <Text style={styles.label}>{quotation.address}, {quotation.district?.district_name}, {quotation.province?.province_name}, {quotation.country?.country_name}</Text>
                        <Text >
                            <Text style={styles.label}>เลขประจำตัวผู้เสียภาษี: </Text>
                            1310200129631
                        </Text>
                        <Text>
                            <Text style={styles.label}>ผู้ติดต่อ / Contact: </Text>
                            {quotation.contact_name} ({quotation.contact_phone})
                        </Text>
                    </View>

                    {/* ขว ชื่อเอกสาร + วันที่ + เลขที่ */}
                    <View style={styles.quotationInfo}>
                        <Text style={styles.titleHighlight}>ใบเสนอราคา</Text>
                        <Text>
                            <Text style={styles.label}>เลขที่: </Text>
                            QT202507070001

                        </Text>
                        <Text>
                            <Text style={styles.label}>วันที่: </Text>
                            {issueDate}
                        </Text>
                        <Text>
                            <Text style={styles.label}>ผู้ออก:  </Text>
                            {issuerName}
                        </Text>
                    </View>
                </View>

                {/* ข้อมูลลูกค้า */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={styles.col50}>
                            <Text>
                                <Text style={styles.label}>ลูกค้า: </Text>
                                {quotation.customer?.company_name}
                            </Text>
                            <Text>
                                <Text style={styles.label}>วันที่คาดว่าจะปิดดีล: </Text>
                                {expectedClosingDate}
                            </Text>

                        </View>
                        <View style={styles.col50}>

                            <Text>
                                <Text style={styles.label}>ขนส่ง: </Text>
                                {quotation.shipping_method}
                            </Text>
                            <Text>
                                <Text style={styles.label}>วันจัดส่งสินค้า: </Text>
                                {expectedDeliveryDate}
                            </Text>
                        </View>
                    </View>
                </View>

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

                    {quotation.quotation_products.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.cellIndex}>{index + 1}</Text>
                            <Text style={styles.cell}>{item.product.product_name}</Text>
                            <Text style={styles.cellRight}>{item.quotation_item_count}</Text>
                            <Text style={styles.cellRight}>{item.unit.unit_name}</Text>
                            <Text style={styles.cellRight}>{item.unit_price.toLocaleString()}</Text>
                            <Text style={styles.cellRight}>{item.quotation_item_price.toLocaleString()}</Text>
                        </View>
                    ))}

                </View>

                {/* สรุปราคา */}
                <View>
                    <Text style={styles.total}>
                        <Text style={styles.label}>รวมเป็นเงิน (ส่วนลด {quotation.special_discount} บาท): </Text>

                        {quotation.amount_after_discount.toLocaleString()} {quotation.currency?.currency_name}
                    </Text>
                    <Text style={styles.total}>
                        <Text style={styles.label}>ภาษีมูลค่าเพิ่ม ({quotation.vat.vat_percentage}%):  </Text>
                        
                        {quotation.vat_amount.toLocaleString()} {quotation.currency?.currency_name}
                    </Text>
                    <Text style={styles.total}>
                        <Text style={styles.label}>จำนวนเงินรวมทั้งสิ้น: </Text>
                        {quotation.grand_total.toLocaleString()} {quotation.currency?.currency_name}
                    </Text>
                </View>

                {/* หมายเหตุ */}
                <View style={styles.section}>
                    <Text>
                        <Text style={styles.label}>หมายเหตุ / Remark: </Text>
                        {quotation.remark?.trim() ? quotation.remark : 'ไม่มีหมายเหตุ'}
                    </Text>
                </View>

                {/* ลายเซ็น */}
                <View style={styles.signatureRow}>
                    {/* ฝั่งซ้าย: ผู้ซื้อ */}
                    <View style={styles.signatureBlock}>
                        <Text style={styles.centerText}>ในนาม {quotation.customer.company_name}</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.centerText}>ผู้สั่งซื้อสินค้า</Text>
                        <View style={styles.signatureGap} />
                        <Text style={styles.centerText}>วันที่</Text>
                    </View>

                    {/* ฝั่งขวา: ผู้ออกใบเสนอราคา */}
                    <View style={styles.signatureBlock}>
                        <Text style={styles.centerText}>ในนาม บริษัทของคุณ</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.centerText}>ผู้ออกเอกสาร</Text>
                        <View style={styles.signatureGap} />
                        <Text style={styles.centerText}>วันที่</Text>
                    </View>
                </View>


            </Page>
        </Document>
    );
};

export default QuotationPDF;
