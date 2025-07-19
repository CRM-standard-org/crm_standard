import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Font
} from '@react-pdf/renderer';
import { styles } from './style'; // สมมติว่าคุณมี style ตั้งไว้
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

type ReportYearPDFProps = {
    chartImage: string | null;
};

const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// mock data จากหน้าเว็บ
const salesDataTable = [
    {
      label: 'เป้าหมาย 2024',
      values: [916859, 844316, 855697, 872106, 916769, 904125, 856576, 980155, 836722, 955851, 950295, 985710],
    },
    {
      label: 'ยอดขาย 2023',
      values: [859837, 827474, 805669, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: 'ยอดขาย 2024',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    }, {
      label: '%การเติบโต',
      values: [15.38, 15.58, 6.74, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: 'เฉลี่ยต่อคำสั่งซื้อ 2023',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
    {
      label: 'เฉลี่ยต่อคำสั่งซื้อ 2024',
      values: [859837, 827474, 805669, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: '%การเติบโต',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
    {
      label: 'จำนวนลูกค้า 2023',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
    {
      label: 'จำนวนลูกค้า 2024',
      values: [859837, 827474, 805669, 782765, 879842, 941068, 781089, 999466, 744191, 980393, 863313, 938388],
    },
    {
      label: '%การเติบโต',
      values: [880082, 677175, 675333, 818799, 790505, 832800, 907190, 963810, 726755, 869910, 727310, 1005770],
    },
  ];


const ReportYearPDF: React.FC<ReportYearPDFProps> = ({ chartImage }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานยอดขายประจำปี</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>เปรียบเทียบยอดขาย ปี 2023 และ ปี 2024</Text>
                    </View>
                </View>

                {/* Summary Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>สรุปยอดรวม</Text>
                    <View style={styles.row}>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>ยอดขายรวมปี 2023</Text>
                            <Text style={styles.boldText}>THB 9,859,774</Text>
                            <Text style={styles.textSmall}>เฉลี่ยต่อคำสั่งซื้อ THB 826.20</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>ยอดขายรวมปี 2024 (YTD)</Text>
                            <Text style={styles.boldText}>THB 10,403,495</Text>
                            <Text style={styles.textSmall}>เฉลี่ยต่อคำสั่งซื้อ THB 880.08</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.label}>เป้าหมายการขายปี 2024</Text>
                            <Text style={styles.boldText}>THB 10,875,181</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ตารางเปรียบเทียบรายเดือน</Text>

                    <View style={styles.tableHeader}>
                        <Text style={styles.labelCell}>ค่าเงิน THB</Text>
                        {months.map((month) => (
                            <Text key={month} style={styles.headerCell}>{month}</Text>
                        ))}
                    </View>

                    {salesDataTable.map((row, idx) => {
                        const isGrowthRow = row.label.includes('%');

                        return (
                            <View
                                key={idx}
                                style={[
                                    styles.tableRow,
                                    isGrowthRow ? styles.rowHighlight : null,
                                ]}
                            >
                                <Text style={[styles.labelCell, isGrowthRow && styles.BoldTableText]}>
                                    {row.label}
                                </Text>
                                {row.values.map((val, i) => (
                                    <Text
                                        key={i}
                                        style={[styles.dataCell, isGrowthRow && styles.BoldTableText]}
                                    >
                                        {typeof val === 'number' ? val.toLocaleString() : val}
                                    </Text>
                                ))}
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
