import React from 'react';
import { Font, Image, Document, Page, Text, View } from '@react-pdf/renderer';
import THSarabunRegular from '../../../../../font/THSarabunNew.ttf';
import THSarabunBold from '../../../../../font/THSarabunNew Bold.ttf';
import { companyLogoBase64 } from '@/assets/images/logoBase64';
import { styles } from './style';

// Register Thai font
Font.register({
    family: 'THSarabunNew',
    fonts: [
        { src: THSarabunRegular },
        { src: THSarabunBold, fontWeight: 'bold' }
    ]
});

// Props definition for dynamic customer analytics report
interface ReportCustomerPDFProps {
    chartImage: string | null;
    range: { start_date: string; end_date: string };
    overview: {
        total_purchase_value: number;
        status: string | null;
        average_order_value: number;
        last_order_date: string | null;
        accumulated_purchase_value: number;
    };
    averages?: {
        avg_days_quotation_to_order: number | null;
        avg_days_order_to_payment: number | null;
        quotation_to_order_conversion_rate: number | null;
        avg_follow_up_activity_count: number | null;
    };
    paymentTerms: { payment_term_name: string; orders_count: number }[];
    successProducts: { group_product_id: string; group_product_name: string; units: number }[];
    rejectedProducts: { group_product_id: string; group_product_name: string; units: number }[];
    share?: { customer_revenue_share_percent: number; total_successful_revenue_scope: number } | null;
}

const formatNumber = (n: number | null | undefined, fraction = 0) => {
    if (n == null || isNaN(n)) return '-';
    return n.toLocaleString(undefined, { minimumFractionDigits: fraction, maximumFractionDigits: fraction });
};

const formatDate = (iso: string | null) => {
    if (!iso) return '-';
    try {
        return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return iso; }
};

const ReportCustomerPDF: React.FC<ReportCustomerPDFProps> = ({
    chartImage,
    range,
    overview,
    averages,
    paymentTerms,
    successProducts,
    rejectedProducts,
    share
}) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานวิเคราะห์ลูกค้า</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>{range.start_date} - {range.end_date}</Text>
                    </View>
                </View>

                {/* Summary / Overview */}
                <View style={styles.section}>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>มูลค่าการซื้อทั้งหมดของลูกค้า</Text>
                            <Text style={styles.infoValue}>{formatNumber(overview.total_purchase_value)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>สถานะ</Text>
                            <Text style={styles.infoValue}>{overview.status || '-'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>มูลค่าเฉลี่ยต่อคำสั่งซื้อ</Text>
                            <Text style={styles.infoValue}>{formatNumber(overview.average_order_value, 2)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>คำสั่งซื้อล่าสุด</Text>
                            <Text style={styles.infoValue}>{formatDate(overview.last_order_date)}</Text>
                        </View>
                        <View style={styles.infoRowFull}>
                            <Text style={styles.infoLabel}>มูลค่าการซื้อสะสมทั้งหมดในระบบ</Text>
                            <Text style={styles.infoValue}>{formatNumber(overview.accumulated_purchase_value)}</Text>
                        </View>
                    </View>
                </View>

                {/* Chart */}
                {chartImage && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>จำนวนคำสั่งซื้อ (รายวัน)</Text>
                        <Image src={chartImage} style={styles.chartImage} />
                    </View>
                )}

                {/* Analytics Grids */}
                <View style={styles.section}>
                    <View style={styles.grid3}>
                        {/* Averages */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สถิติ (โดยเฉลี่ย)</Text>
                            <View style={styles.cardRow}><Text>ระยะเวลาจากใบเสนอราคาถึงคำสั่งซื้อ</Text><Text>{averages?.avg_days_quotation_to_order != null ? averages.avg_days_quotation_to_order + ' วัน' : '-'}</Text></View>
                            <View style={styles.cardRow}><Text>ระยะเวลาจากคำสั่งซื้อถึงการชำระครั้งแรก</Text><Text>{averages?.avg_days_order_to_payment != null ? averages.avg_days_order_to_payment + ' วัน' : '-'}</Text></View>
                            <View style={styles.cardRow}><Text>อัตราแปลง Quotation → Order</Text><Text>{averages?.quotation_to_order_conversion_rate != null ? formatNumber(averages.quotation_to_order_conversion_rate, 2) + '%' : '-'}</Text></View>
                            <View style={styles.cardRow}><Text>กิจกรรมติดตาม (เฉลี่ย)</Text><Text>{averages?.avg_follow_up_activity_count ?? '-'}</Text></View>
                        </View>

                        {/* Payment Terms */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>เงื่อนไขการชำระเงิน</Text>
                            {paymentTerms.length ? paymentTerms.map(pt => (
                                <View key={pt.payment_term_name} style={styles.cardRow}>
                                    <Text>{pt.payment_term_name}</Text>
                                    <Text>{pt.orders_count} คำสั่งซื้อ</Text>
                                </View>
                            )) : <Text style={styles.cardRow}>- ไม่มีข้อมูล -</Text>}
                        </View>

                        {/* Revenue Share */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สัดส่วนยอดขาย</Text>
                            <View style={styles.cardRow}><Text>เทียบกับลูกค้าทั้งหมด</Text><Text>{share ? formatNumber(share.customer_revenue_share_percent, 2) + '%' : '-'}</Text></View>
                            <View style={styles.cardRow}><Text>มูลค่ายอดขายรวมในช่วง</Text><Text>THB {formatNumber(overview.total_purchase_value)}</Text></View>
                        </View>

                        {/* Success Products */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สินค้าปิดการขายสำเร็จ</Text>
                            {successProducts.length ? successProducts.map(p => (
                                <View key={p.group_product_id} style={styles.cardRow}>
                                    <Text>{p.group_product_name}</Text>
                                    <Text>{formatNumber(p.units)}</Text>
                                </View>
                            )) : <Text style={styles.cardRow}>- ไม่มีข้อมูล -</Text>}
                        </View>

                        {/* Rejected Products */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สินค้าที่ไม่ซื้อ</Text>
                            {rejectedProducts.length ? rejectedProducts.map(p => (
                                <View key={p.group_product_id} style={styles.cardRow}>
                                    <Text>{p.group_product_name}</Text>
                                    <Text>{formatNumber(p.units)}</Text>
                                </View>
                            )) : <Text style={styles.cardRow}>- ไม่มีข้อมูล -</Text>}
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ReportCustomerPDF;
