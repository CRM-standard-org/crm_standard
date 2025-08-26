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

// no longer need saleorder type here

Font.register({
    family: 'THSarabunNew',
    fonts: [
        { src: THSarabunRegular },
        { src: THSarabunBold, fontWeight: 'bold' }
    ]
});
type ReportCategoryPDFProps = {
    chartImage1: string | null;
    chartImage2: string | null;
    chartImage3: string | null;
    // optional live data to render in PDF
    startDate?: string;
    endDate?: string;
    tagName?: string;
    teamName?: string;
    months?: string[];
    salesDataTable?: { label: string; values: (number | string)[] }[];
    quotationData?: { month: string; realValue: number; predictValue: number }[];
    realValues?: { priority: string; amount: number; percent: number; value: number }[];
    predictValues?: { priority: string; amount: number; percent: number; value: number }[];
};

const HeaderColumns = [
    { header: 'ระดับความสำคัญ', key: 'priority' },
    { header: 'จำนวน', key: 'amount' },
    { header: '%', key: 'percent', },
    { header: 'มูลค่ารวม', key: 'value', align: 'right' },
];
// HeaderColumns remains static
const ReportCategoryPDF: React.FC<ReportCategoryPDFProps> = ({
    chartImage1,
    chartImage2,
    chartImage3,
    startDate,
    endDate,
    tagName,
    teamName,
    months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.'],
    salesDataTable = [],
    quotationData = [],
    realValues = [],
    predictValues = [],
}) => {

    const headerStart = startDate || '';
    const headerEnd = endDate || '';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานพยากรณ์ยอดขายตามหมวดหมู่</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>{headerStart ? `${headerStart} - ${headerEnd}` : ''}</Text>
                        <Text style={styles.companySubSmall}>{`หมวดหมู่สินค้า : ${tagName || 'ทั้งหมด'} ทีม : ${teamName || 'ทั้งหมด'}`}</Text>
                        <Text style={styles.companySubSmall}>มูลค่าใบเสนอราคาจริง เทียบ มูลค่าใบเสนอราคาคาดการณ์ (Q01)</Text>
                    </View>
                </View>

                {/* table  */}
                <View>
                    <View style={styles.tableHeader}>
                        <Text style={styles.labelCell}>มูลค่า</Text>
                        {months.map((m) => (
                            <Text key={m} style={styles.headerCell}>{m}</Text>
                        ))}
                    </View>

                    {salesDataTable.map((row, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={styles.labelCell}>{row.label}</Text>
                            {row.values.map((val, i) => (
                                <Text key={i} style={styles.dataCell}>{typeof val === 'number' ? val.toLocaleString() : String(val)}</Text>
                            ))}
                        </View>
                    ))}
                </View>
                {/* Chart */}
                {chartImage1 && (
                    <View >
                        <Text style={styles.sectionTitle}>กราฟเปรียบเทียบยอดขายรายเดือน</Text>
                        <Image src={chartImage1} style={styles.chartImage} />
                    </View>
                )}




                {chartImage2 && chartImage3 && (
                    <View style={styles.chartRow}>
                        {/* กราฟซ้าย */}
                        <View style={styles.chartBox}>
                            <Text style={styles.subTitle}>สัดส่วนใบเสนอราคาจริง แบ่งตามความสำคัญ</Text>
                            {chartImage2 && <Image src={chartImage2} style={styles.chart2Image} />}
                        </View>

                        {/* กราฟขวา */}
                        <View style={styles.chartBox}>
                            <Text style={styles.subTitle}>สัดส่วนใบเสนอราคาคาดการณ์ แบ่งตามความสำคัญ</Text>
                            {chartImage3 && <Image src={chartImage3} style={styles.chart2Image} />}
                        </View>
                    </View>


                )}
                {/* table */}
                <View >

                    {/* 2 table */}
                    <View style={styles.row3col} wrap={false}>
                       
                        <View style={styles.cellBox}>
                            <View style={styles.tableHeader}>
                                {HeaderColumns.map((col) => (
                                    <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
                                ))}
                            </View>

                            {realValues.map((row, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{row.priority}</Text>
                                    <Text style={styles.dataCell}>{row.amount}</Text>
                                    <Text style={styles.dataCell}>{row.percent}</Text>
                                    <Text style={styles.dataCell}>{row.value}</Text>
                                </View>
                            ))}
                        </View>

                        {/*  อันดับลูกค้าที่มีโอกาสซื้อสูงสุด */}
                        <View style={styles.cellBox}>

                            <View style={styles.tableHeader}>
                                {HeaderColumns.map((col) => (
                                    <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
                                ))}
                            </View>

                            {predictValues.map((row, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{row.priority}</Text>
                                    <Text style={styles.dataCell}>{row.amount}</Text>
                                    <Text style={styles.dataCell}>{row.percent}</Text>
                                    <Text style={styles.dataCell}>{row.value}</Text>
                                </View>
                            ))}
                        </View>

                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ReportCategoryPDF;
