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
type ForcastSalePDFProps = {
    chartImage1: string | null;
    chartImage2: string | null;
    chartImage3: string | null;
};

const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];


const salesDataTable = [
    {
        label: 'เป้าหมายยอดขายสะสม',
        values: [
            916859, 1761175, 2616872, 3488978,
            4405747, 5309872, 6166448, 7146603,
            7983325, 8939176, 9889471, 10875181
        ],
    },
    {
        label: 'ยอดขายสะสมคาดการณ์',
        values: [
            900000, 1500000, 2500000, 3500000,
            4500000, 5000000, 6000000, 7000000,
            8000000, 9000000, 10000000, 11000000
        ],
    },
    {
        label: 'เป้าหมายยอดขายรายเดือน',
        values: [
            916859, 844316, 855697, 872106,
            916769, 904125, 856576, 980155,
            836722, 955851, 950295, 985710
        ],
    },
    {
        label: 'ยอดขายรายเดือนคาดการณ์',
        values: [
            900000, 1000000, 1000000, 515000,
            1000000, 500000, 1000000, 1000000,
            1000000, 1000000, 1000000, 1000000
        ],
    },
    {
        label: 'ยอดขายจริงรายเดือน',
        values: [
            859837, 827474, 805669, 782765,
            879842, 941068, 781089, 999466,
            744191, 980393, 863313, 938388
        ],
    },
];
//mockup table
const HeaderPredict = [
    { header: 'ระดับความสำคัญ', key: 'priority' },
    { header: 'จำนวน', key: 'amount' },
    { header: '%', key: 'percent', },
    { header: 'มูลค่ารวม', key: 'value', align: 'right' },
];

const predictValues = [
    { priority: "★5", amount: 30, percent: 33.44, value: 1166715 },
    { priority: "★4", amount: 15, percent: 26.68, value: 930859 },
    { priority: "★3", amount: 20, percent: 20.00, value: 697796 },
    { priority: "★2", amount: 15, percent: 13.26, value: 462638 },
    { priority: "★1", amount: 20, percent: 6.62, value: 230970 },
    { priority: "★0", amount: 0, percent: 0, value: 0 },
];

const HeaderCustomer = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'ลูกค้า', key: 'customer' },
    { header: 'โอกาส%', key: 'percent', },

];

const customers = [
    { rank: 1, customer: "บริษัท A", percent: 80 },
    { rank: 2, customer: "บริษัท B", percent: 77 },
    { rank: 3, customer: "บริษัท C", percent: 75 },
    { rank: 4, customer: "บริษัท D", percent: 72 },
    { rank: 5, customer: "บริษัท E", percent: 70 },
    { rank: 6, customer: "บริษัท F", percent: 50 },
    { rank: 7, customer: "บริษัท G", percent: 45 },
    { rank: 8, customer: "บริษัท H", percent: 20 },
    { rank: 9, customer: "บริษัท I", percent: 15 },
    { rank: 10, customer: "บริษัท J", percent: 10 },
];
const ForcastSalePDF: React.FC<ForcastSalePDFProps> = ({ chartImage1, chartImage2, chartImage3 }) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานพยากรณ์ยอดขาย</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>ปี 2024</Text>
                    </View>
                </View>

                {/* Chart */}
                {chartImage1 && (
                    <View >
                        <Text style={styles.sectionTitle}>เป้าหมายยอดขายสะสม เทียบ ยอดขายสะสมคาดการณ์</Text>
                        <Image src={chartImage1} style={styles.chartImage} />
                    </View>
                )}

                {/* table  */}
                <View>
                    <Text style={styles.sectionTitle}>ตารางเปรียบเทียบรายเดือน</Text>

                    <View style={styles.tableHeader}>
                        <Text style={styles.labelCell}>ค่าเงิน THB</Text>
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
                {chartImage2 && chartImage3 && (
                    <View >

                        <View style={styles.chartRow}>
                            {/* กราฟซ้าย */}
                            <View style={styles.chartBox}>
                                {chartImage2 && <Image src={chartImage2} style={styles.chart2Image} />}
                            </View>

                            {/* กราฟขวา */}
                            <View style={styles.chartBox}>
                                {chartImage3 && <Image src={chartImage3} style={styles.chart2Image} />}
                            </View>
                        </View>
                    </View>

                )}

                {/* table */}
                <View >

                    {/* 2 table */}
                    <View style={styles.row3col}>
                        {/* สัดส่วนใบเสนอราคาคาดการณ์ แบ่งตามความสำคัญ */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>สัดส่วนใบเสนอราคาคาดการณ์ แบ่งตามความสำคัญ</Text>
                            <View style={styles.tableHeader}>
                                {HeaderPredict.map((col) => (
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

                        {/*  อันดับลูกค้าที่มีโอกาสซื้อสูงสุด */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 อันดับลูกค้าที่มีโอกาสซื้อสูงสุด</Text>
                            <View style={styles.tableHeader}>
                                {HeaderCustomer.map((col) => (
                                    <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
                                ))}
                            </View>

                            {customers.map((row, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{row.rank}</Text>
                                    <Text style={styles.dataCell}>{row.customer}</Text>
                                    <Text style={styles.dataCell}>{row.percent}</Text>
                                </View>
                            ))}
                        </View>

                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default ForcastSalePDF;
