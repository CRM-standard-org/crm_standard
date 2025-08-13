import React from 'react';
import { Font, Image, Document, Page, Text, View } from '@react-pdf/renderer';
import THSarabunRegular from '../../../../../font/THSarabunNew.ttf';
import THSarabunBold from '../../../../../font/THSarabunNew Bold.ttf';
import { companyLogoBase64 } from '@/assets/images/logoBase64';
import { styles } from './style';

Font.register({
    family: 'THSarabunNew',
    fonts: [
        { src: THSarabunRegular },
        { src: THSarabunBold, fontWeight: 'bold' }
    ]
});

type SummarySalePDFProps = {
    chartImage1: string | null;
    chartImage2: string | null;
    range: { start_date: string; end_date: string };
    metrics: {
        activities: number; successful_sales: number; new_customers: number; existing_customers: number; sale_value_successful: number; sale_value_unsuccessful: number;
    };
    topCustomers: Array<{ rank: number; company_name: string; percent: number; }>,
    topCategories: Array<{ rank: number; name: string; total_sales: number; }>,
    topEmployees: Array<{ rank: number; employee_name: string; percent: number; }>,
};

const formatNumber = (n: number) => n.toLocaleString();
const formatPercent = (n: number) => n.toFixed(2) + '%';

const SummarySalePDF: React.FC<SummarySalePDFProps> = ({ chartImage1, chartImage2, range, metrics, topCustomers, topCategories, topEmployees }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานสรุปยอดขาย</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>{range.start_date} - {range.end_date}</Text>
                    </View>
                </View>

                {/* Metrics summary under header (optional compact) */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '48%', padding: 4, borderBottom: '0.5px solid #eee' }}><Text style={{ fontSize: 10, color: '#555' }}>กิจกรรม</Text><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatNumber(metrics.activities)}</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '48%', padding: 4, borderBottom: '0.5px solid #eee' }}><Text style={{ fontSize: 10, color: '#555' }}>ปิดการขาย</Text><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatNumber(metrics.successful_sales)}</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '48%', padding: 4, borderBottom: '0.5px solid #eee' }}><Text style={{ fontSize: 10, color: '#555' }}>ลูกค้าใหม่</Text><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatNumber(metrics.new_customers)}</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '48%', padding: 4, borderBottom: '0.5px solid #eee' }}><Text style={{ fontSize: 10, color: '#555' }}>ลูกค้าเดิม</Text><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatNumber(metrics.existing_customers)}</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '48%', padding: 4, borderBottom: '0.5px solid #eee' }}><Text style={{ fontSize: 10, color: '#555' }}>ยอดขายสำเร็จ (THB)</Text><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatNumber(metrics.sale_value_successful)}</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '48%', padding: 4, borderBottom: '0.5px solid #eee' }}><Text style={{ fontSize: 10, color: '#555' }}>ยอดขายไม่สำเร็จ (THB)</Text><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatNumber(metrics.sale_value_unsuccessful)}</Text></View>
                    </View>
                </View>

                {/* Chart */}
                {chartImage1 && chartImage2 && (
                    <View style={styles.section}>
                        <View style={styles.chartRow}>
                            <View style={styles.chartBox}>
                                <Text style={styles.chartLabel}>กิจกรรมและลูกค้า</Text>
                                {chartImage1 && <Image src={chartImage1} style={styles.chartImage} />}
                            </View>
                            <View style={styles.chartBox}>
                                <Text style={styles.chartLabel}>มูลค่าการขาย</Text>
                                {chartImage2 && <Image src={chartImage2} style={styles.chartImage} />}
                            </View>
                        </View>
                    </View>
                )}

                {/* Tables */}
                <View style={styles.section}>
                    <View style={styles.row3col}>
                        {/* Top Customers */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 อันดับลูกค้า</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>อันดับที่</Text>
                                <Text style={styles.headerCell}>ลูกค้า</Text>
                                <Text style={styles.headerCell}>สัดส่วนรายได้(%)</Text>
                            </View>
                            {topCustomers.length ? topCustomers.map(c => (
                                <View key={c.rank} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{c.rank}</Text>
                                    <Text style={styles.dataCell}>{c.company_name}</Text>
                                    <Text style={styles.dataCell}>{formatPercent(c.percent)}</Text>
                                </View>
                            )) : <Text style={styles.dataCell}>- ไม่มีข้อมูล -</Text>}
                        </View>

                        {/* Top Categories */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 หมวดหมู่สินค้า</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>อันดับที่</Text>
                                <Text style={styles.headerCell}>หมวดหมู่</Text>
                                <Text style={styles.headerCell}>รายได้</Text>
                            </View>
                            {topCategories.length ? topCategories.map(cat => (
                                <View key={cat.rank} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{cat.rank}</Text>
                                    <Text style={styles.dataCell}>{cat.name}</Text>
                                    <Text style={styles.dataCell}>THB {formatNumber(cat.total_sales)}</Text>
                                </View>
                            )) : <Text style={styles.dataCell}>- ไม่มีข้อมูล -</Text>}
                        </View>

                        {/* Top Employees */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 พนักงานขาย</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>อันดับที่</Text>
                                <Text style={styles.headerCell}>พนักงาน</Text>
                                <Text style={styles.headerCell}>สัดส่วนรายได้(%)</Text>
                            </View>
                            {topEmployees.length ? topEmployees.map(emp => (
                                <View key={emp.rank} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{emp.rank}</Text>
                                    <Text style={styles.dataCell}>{emp.employee_name}</Text>
                                    <Text style={styles.dataCell}>{formatPercent(emp.percent)}</Text>
                                </View>
                            )) : <Text style={styles.dataCell}>- ไม่มีข้อมูล -</Text>}
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default SummarySalePDF;
