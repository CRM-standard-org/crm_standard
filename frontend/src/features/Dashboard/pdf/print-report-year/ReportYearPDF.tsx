import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Font
} from '@react-pdf/renderer';
import { styles } from './style';
import { companyLogoBase64 } from '@/assets/images/logoBase64';
import THSarabunRegular from '../../../../../font/THSarabunNew.ttf';
import THSarabunBold from '../../../../../font/THSarabunNew Bold.ttf';

Font.register({
    family: 'THSarabunNew',
    fonts: [
        { src: THSarabunRegular },
        { src: THSarabunBold, fontWeight: 'bold' },
    ],
});

interface YearSummary { year: number; total_sales: number; total_orders: number; avg_per_order: number; }
interface YearComparison { previous?: YearSummary; current: YearSummary; target?: number; }
interface TableRow { label: string; values: number[]; }

interface ReportYearPDFProps {
    chartImage: string | null;
    comparison: YearComparison;
    table: TableRow[];
    years: { previousYear: number; currentYear: number };
}

const formatNumber = (n: number | undefined) => (n ?? 0).toLocaleString();
const formatAvg = (n: number | undefined) => (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const ReportYearPDF: React.FC<ReportYearPDFProps> = ({ chartImage, comparison, table, years }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานยอดขายประจำปี</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>เปรียบเทียบยอดขาย ปี {years.previousYear} และ ปี {years.currentYear}</Text>
                    </View>
                </View>

                {/* Summary Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>สรุปยอดรวม</Text>
                    <View style={styles.row}>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>ยอดขายรวมปี {years.previousYear}</Text>
                            <Text style={styles.boldText}>THB {formatNumber(comparison.previous?.total_sales)}</Text>
                            <Text style={styles.textSmall}>เฉลี่ยต่อคำสั่งซื้อ THB {formatAvg(comparison.previous?.avg_per_order)}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>ยอดขายรวมปี {years.currentYear} (YTD)</Text>
                            <Text style={styles.boldText}>THB {formatNumber(comparison.current.total_sales)}</Text>
                            <Text style={styles.textSmall}>เฉลี่ยต่อคำสั่งซื้อ THB {formatAvg(comparison.current.avg_per_order)}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>เป้าหมายการขายปี {years.currentYear}</Text>
                            <Text style={styles.boldText}>THB {formatNumber(comparison.target)}</Text>
                        </View>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ตารางเปรียบเทียบรายเดือน</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.labelCell}>ค่าเงิน THB</Text>
                        {months.map((m) => (
                            <Text key={m} style={styles.headerCell}>{m}</Text>
                        ))}
                    </View>
                    {table.map((row) => {
                        const isGrowthRow = row.label.includes('%');
                        const rowKey = 'row-' + row.label;
                        return (
                            <View key={rowKey} style={[styles.tableRow, isGrowthRow ? styles.rowHighlight : null]}>
                                <Text style={[styles.labelCell, isGrowthRow && styles.BoldTableText]}>{row.label}</Text>
                                {row.values.map((val, i) => {
                                    const cellKey = rowKey + '-' + months[i] + '-' + String(val);
                                    return (
                                        <Text key={cellKey} style={[styles.dataCell, isGrowthRow && styles.BoldTableText]}>{val.toLocaleString()}</Text>
                                    );
                                })}
                            </View>
                        );
                    })}
                </View>

                {/* Chart */}
                {chartImage && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>กราฟเปรียบเทียบยอดขายรายเดือน</Text>
                        <Image src={chartImage} style={styles.chartImage} />
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ReportYearPDF;
