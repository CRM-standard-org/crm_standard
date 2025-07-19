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

import { TypeSaleOrderResponse } from '@/types/response/response.saleorder';

Font.register({
    family: 'THSarabunNew',
    fonts: [
        { src: THSarabunRegular },
        { src: THSarabunBold, fontWeight: 'bold' }
    ]
});
type ReportCustomerPDFProps = {
    chartImage: string | null;
};
const ReportCustomerPDF: React.FC<ReportCustomerPDFProps> = ({ chartImage }) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานวิเคราะห์ลูกค้า : บริษัท A</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>1 มกราคม 2024 - 31 มกราคม 2024</Text>
                    </View>
                </View>

                {/* Customer Info Section */}
                <View style={styles.section}>


                    {/* ข้อมูลลูกค้า */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>มูลค่าการซื้อทั้งหมดของลูกค้า</Text>
                            <Text style={styles.infoValue}>128,976</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>สถานะ</Text>
                            <Text style={styles.infoValue}>ลูกค้าประจำ</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>มูลค่าเฉลี่ยต่อคำสั่งซื้อ</Text>
                            <Text style={styles.infoValue}>880.08</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>คำสั่งซื้อล่าสุด</Text>
                            <Text style={styles.infoValue}>20 มกราคม 2024</Text>
                        </View>
                        <View style={styles.infoRowFull}>
                            <Text style={styles.infoLabel}>มูลค่าการซื้อสะสมทั้งหมดในระบบ</Text>
                            <Text style={styles.infoValue}>591,426</Text>
                        </View>
                    </View>
                </View>





                {/* Chart */}
                {chartImage && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>จำนวนการสั่งซื้อของลูกค้าประจำเดือน มกราคม</Text>
                        <Image src={chartImage} style={styles.chartImage} />
                    </View>
                )}

                {/* รายงานสถิติและพฤติกรรมลูกค้า */}
                <View style={styles.section}>
                    <View style={styles.grid3}>
                        {/* 5 กล่องทั้งหมด รวมไว้ใน grid เดียวกันเลย */}

                        {/* กล่อง 1 */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สถิติ (โดยเฉลี่ย)</Text>
                            <View style={styles.cardRow}><Text>ระยะเวลาจากการเสนอราคา</Text><Text>7 วัน</Text></View>
                            <View style={styles.cardRow}><Text>ระยะเวลาจากคำสั่งขายถึงชำระเงิน</Text><Text>15 วัน</Text></View>
                            <View style={styles.cardRow}><Text>อัตราการแปลงเป็นคำสั่งซื้อ</Text><Text>80%</Text></View>
                            <View style={styles.cardRow}><Text>จำนวนครั้งติดตามลูกค้า</Text><Text>3 ครั้ง</Text></View>
                        </View>

                        {/* กล่อง 2 */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>เงื่อนไขการชำระเงิน</Text>
                            <View style={styles.cardRow}><Text>ผ่อนชำระ 3 เดือน ดอกเบี้ย 5%</Text><Text>3 คำสั่งซื้อ</Text></View>
                            <View style={styles.cardRow}><Text>เงินสด ภายใน 7 วัน</Text><Text>7 คำสั่งซื้อ</Text></View>
                        </View>

                        {/* กล่อง 3 */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สัดส่วนยอดขาย</Text>
                            <View style={styles.cardRow}><Text>เทียบกับลูกค้าทั้งหมด</Text><Text>15.00%</Text></View>
                            <View style={styles.cardRow}><Text>มูลค่ายอดขายรวม</Text><Text>THB 128,976</Text></View>
                        </View>

                        {/* กล่อง 4 */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สินค้าปิดการขายสำเร็จ</Text>
                            <View style={styles.cardRow}><Text>เฟอร์นิเจอร์สำนักงาน</Text><Text>150 หน่วย</Text></View>
                            <View style={styles.cardRow}><Text>เครื่องใช้ไฟฟ้า</Text><Text>100 หน่วย</Text></View>
                            <View style={styles.cardRow}><Text>คอมพิวเตอร์</Text><Text>50 หน่วย</Text></View>
                            <View style={styles.cardRow}><Text>ของตกแต่งสำนักงาน</Text><Text>40 หน่วย</Text></View>
                        </View>

                        {/* กล่อง 5 */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สินค้าที่ลูกค้าไม่ซื้อ</Text>
                            <View style={styles.cardRow}><Text>อุปกรณ์สำนักงาน</Text><Text>20 หน่วย</Text></View>
                            <View style={styles.cardRow}><Text>คอมพิวเตอร์</Text><Text>10 หน่วย</Text></View>
                        </View>

                    </View>
                </View>


            </Page>
        </Document>
    );
};

export default ReportCustomerPDF;
