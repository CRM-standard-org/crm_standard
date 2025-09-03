import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Font
} from '@react-pdf/renderer';
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

interface KPIData {
    annual_goal: number;
    actual_to_date: number;
    forecast_year_end: number;
    forecast_achievement_percent: number;
    gap_to_goal: number;
}

interface SalesTableRow {
    label: string;
    values: number[];
}

interface PriorityBreakdown {
    priority: number;
    count: number;
    amount: number;
    weight_percent: number;
}

interface TopCustomer {
    customer_id: string;
    company_name: string;
    probability: number;
}

interface StatusBreakdown {
    status: string;
    count: number;
    amount: number;
    weighted_amount: number;
}

type ForcastSalePDFProps = {
    chartImage1: string | null;
    chartImage2: string | null;
    chartImage3: string | null;
    year: number;
    dateRange?: { start_date: string; end_date: string };
    kpiData: KPIData;
    salesTable: SalesTableRow[];
    priorityBreakdown: PriorityBreakdown[];
    topCustomers: TopCustomer[];
    statusBreakdown: StatusBreakdown[];
};

const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const formatNumber = (n: number) => n.toLocaleString();

const ForcastSalePDF: React.FC<ForcastSalePDFProps> = ({ 
    chartImage1, 
    chartImage2, 
    chartImage3, 
    year, 
    dateRange, 
    kpiData, 
    salesTable, 
    priorityBreakdown, 
    topCustomers, 
    statusBreakdown 
}) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานพยากรณ์ยอดขาย</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>ปี {year}</Text>
                        {dateRange && (
                            <Text style={styles.companySubSmall}>{dateRange.start_date} - {dateRange.end_date}</Text>
                        )}
                    </View>
                </View>

                {/* KPI Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>เป้าหมายรวม vs คาดการณ์รวม</Text>
                    <View style={styles.row}>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>เป้าหมายทั้งปี</Text>
                            <Text style={styles.boldText}>THB {formatNumber(kpiData.annual_goal)}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>ยอดขายสะสมถึงปัจจุบัน</Text>
                            <Text style={styles.boldText}>THB {formatNumber(kpiData.actual_to_date)}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>คาดการณ์เมื่อสิ้นปี</Text>
                            <Text style={styles.boldText}>THB {formatNumber(kpiData.forecast_year_end)}</Text>
                            <Text style={styles.textSmall}>อัตราบรรลุ: {kpiData.forecast_achievement_percent.toFixed(1)}%</Text>
                        </View>
                    </View>
                </View>

                {/* Chart */}
                {chartImage1 && (
                    <View>
                        <Text style={styles.sectionTitle}>เป้าหมายยอดขายสะสม เทียบ ยอดขายสะสมคาดการณ์</Text>
                        <Image src={chartImage1} style={styles.chartImage} />
                    </View>
                )}

                {/* ค่าเฉลี่ยรายเดือน Table */}
                {salesTable.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>ค่าเฉลี่ยรายเดือน (เป้าหมาย / คาดการณ์ / จริง)</Text>
                        <View style={styles.tableHeader}>
                            <Text style={styles.labelCell}>ค่าเงิน THB</Text>
                            {months.map((month) => (
                                <Text key={month} style={styles.headerCell}>{month}</Text>
                            ))}
                        </View>

                        {salesTable.map((row) => (
                            <View key={row.label} style={styles.tableRow}>
                                <Text style={styles.labelCell}>{row.label}</Text>
                                {row.values.map((val, i) => (
                                    <Text key={`${row.label}-${i}`} style={styles.dataCell}>
                                        {formatNumber(val)}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Charts Row */}
                {chartImage2 && chartImage3 && (
                    <View>
                        <View style={styles.chartRow}>
                            <View style={styles.chartBox}>
                                {chartImage2 && <Image src={chartImage2} style={styles.chart2Image} />}
                            </View>
                            <View style={styles.chartBox}>
                                {chartImage3 && <Image src={chartImage3} style={styles.chart2Image} />}
                            </View>
                        </View>
                    </View>
                )}

                {/* Tables Section */}
                <View>
                    <View style={styles.row3col}>
                        {/* สัดส่วนใบเสนอราคาคาดการณ์ แบ่งตามความสำคัญ */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>สัดส่วนใบเสนอราคาคาดการณ์ แบ่งตามความสำคัญ</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>ระดับความสำคัญ</Text>
                                <Text style={styles.headerCell}>จำนวน</Text>
                                <Text style={styles.headerCell}>%</Text>
                                <Text style={styles.headerCell}>มูลค่ารวม</Text>
                            </View>

                            {priorityBreakdown.length > 0 ? priorityBreakdown.map((row) => (
                                <View key={`priority-${row.priority}`} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>★{row.priority}</Text>
                                    <Text style={styles.dataCell}>{row.count}</Text>
                                    <Text style={styles.dataCell}>{row.weight_percent.toFixed(2)}</Text>
                                    <Text style={styles.dataCell}>{formatNumber(row.amount)}</Text>
                                </View>
                            )) : (
                                <View style={styles.tableRow}>
                                    <Text style={styles.dataCell}>- ไม่มีข้อมูล -</Text>
                                </View>
                            )}
                        </View>

                        {/* 10 อันดับลูกค้าที่มีโอกาสซื้อสูงสุด */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 อันดับลูกค้าที่มีโอกาสซื้อสูงสุด</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>อันดับที่</Text>
                                <Text style={styles.headerCell}>ลูกค้า</Text>
                                <Text style={styles.headerCell}>โอกาส%</Text>
                            </View>

                            {topCustomers.length > 0 ? topCustomers.slice(0, 10).map((row, i) => (
                                <View key={row.customer_id} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{i + 1}</Text>
                                    <Text style={styles.dataCell}>{row.company_name}</Text>
                                    <Text style={styles.dataCell}>{row.probability}</Text>
                                </View>
                            )) : (
                                <View style={styles.tableRow}>
                                    <Text style={styles.dataCell}>- ไม่มีข้อมูล -</Text>
                                </View>
                            )}
                        </View>

                        {/* สรุปใบเสนอราคาแยกตามสถานะ */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>สรุปใบเสนอราคาแยกตามสถานะ</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>สถานะ</Text>
                                <Text style={styles.headerCell}>จำนวน</Text>
                                <Text style={styles.headerCell}>มูลค่า</Text>
                            </View>

                            {statusBreakdown.length > 0 ? statusBreakdown.map((row) => (
                                <View key={row.status} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{row.status}</Text>
                                    <Text style={styles.dataCell}>{row.count}</Text>
                                    <Text style={styles.dataCell}>{formatNumber(row.weighted_amount)}</Text>
                                </View>
                            )) : (
                                <View style={styles.tableRow}>
                                    <Text style={styles.dataCell}>- ไม่มีข้อมูล -</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default ForcastSalePDF;
