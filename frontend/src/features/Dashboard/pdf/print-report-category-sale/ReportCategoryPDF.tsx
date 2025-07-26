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
type ReportCategoryPDFProps = {
    chartImage1: string | null;
    chartImage2: string | null;
    chartImage3: string | null;
};

//mockup chart
const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.'];
const salesDataTable = [
    {
        label: 'มูลค่าใบเสนอราคาจริง',
        values: [859837, 827474, 805669, 782765],
    },
    {
        label: 'มูลค่าใบเสนอราคาคาดการณ์',
        values: [859837, 827474, 805669, 782765],
    },

];

const quotationData = [
    { month: "ม.ค.", realValue: 860000, predictValue: 915000 },
    { month: "ก.พ.", realValue: 825000, predictValue: 840000 },
    { month: "มี.ค.", realValue: 810000, predictValue: 855000 },
    { month: "เม.ย.", realValue: 775000, predictValue: 870000 },

];


//mockup 2 table
const HeaderColumns = [
    { header: 'ระดับความสำคัญ', key: 'priority' },
    { header: 'จำนวน', key: 'amount' },
    { header: '%', key: 'percent', },
    { header: 'มูลค่ารวม', key: 'value', align: 'right' },
];

const realValues = [
    { priority: "★5", amount: 30, percent: 33.33, value: 1091806 },
    { priority: "★4", amount: 15, percent: 26.67, value: 873641 },
    { priority: "★3", amount: 20, percent: 20.00, value: 655149 },
    { priority: "★2", amount: 15, percent: 13.33, value: 436657 },
    { priority: "★1", amount: 20, percent: 6.67, value: 218492 },
    { priority: "★0", amount: 0, percent: 0, value: 0 },
];


const predictValues = [
    { priority: "★5", amount: 30, percent: 33.44, value: 1166715 },
    { priority: "★4", amount: 15, percent: 26.68, value: 930859 },
    { priority: "★3", amount: 20, percent: 20.00, value: 697796 },
    { priority: "★2", amount: 15, percent: 13.26, value: 462638 },
    { priority: "★1", amount: 20, percent: 6.62, value: 230970 },
    { priority: "★0", amount: 0, percent: 0, value: 0 },
];
const ReportCategoryPDF: React.FC<ReportCategoryPDFProps> = ({ chartImage1, chartImage2, chartImage3 }) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานพยากรณ์ยอดขายตามหมวดหมู่</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>1 มกราคม 2024 - 31 เมษายน 2024</Text>
                        <Text style={styles.companySubSmall}>หมวดหมู่สินค้า : ทั้งหมด ทีม : ทั้งหมด</Text>
                        <Text style={styles.companySubSmall}>มูลค่าใบเสนอราคาจริง เทียบ มูลค่าใบเสนอราคาคาดการณ์ (Q01)</Text>
                    </View>
                </View>

                {/* table  */}
                <View>
                    <View style={styles.tableHeader}>
                        <Text style={styles.labelCell}>มูลค่า</Text>
                        {months.map((month) => (
                            <Text key={month} style={styles.headerCell}>{month}</Text>
                        ))}
                    </View>

                    {salesDataTable.map((row, idx) => (


                        <View
                            key={idx}
                            style={[
                                styles.tableRow,
                            ]}
                        >
                            <Text style={styles.labelCell}>
                                {row.label}
                            </Text>
                            {row.values.map((val, i) => (
                                <Text
                                    key={i}
                                    style={styles.dataCell}
                                >
                                    {typeof val === 'number' ? val.toLocaleString() : val}
                                </Text>
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
