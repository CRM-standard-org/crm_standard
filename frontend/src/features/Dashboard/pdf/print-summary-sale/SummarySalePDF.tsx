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
type SummarySalePDFProps = {
    chartImage1: string | null;
    chartImage2: string | null;
};
//mockup table
const customerColumns = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'ลูกค้า', key: 'name' },
    { header: 'สัดส่วนรายได้(%)', key: 'percent', align: 'right' },
];
const customers = [
    { rank: 1, name: 'บริษัท A', percent: '15.00%' },
    { rank: 2, name: 'บริษัท B', percent: '12.00%' },
    { rank: 3, name: 'บริษัท C', percent: '11.00%' },
    { rank: 4, name: 'บริษัท D', percent: '9.00%' },
    { rank: 5, name: 'บริษัท E', percent: '6.00%' },
    { rank: 6, name: 'บริษัท F', percent: '4.00%' },
    { rank: 7, name: 'บริษัท G', percent: '3.15%' },
    { rank: 8, name: 'บริษัท H', percent: '3.02%' },
    { rank: 9, name: 'บริษัท I', percent: '3.00%' },
    { rank: 10, name: 'บริษัท J', percent: '2.47%' },
];

const categoryColumns = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'หมวดหมู่', key: 'name' },
    { header: 'รายได้', key: 'amount', align: 'right' },
];
const categories = [
    { rank: 1, name: 'เฟอร์นิเจอร์สำนักงาน', amount: 'THB 343,935' },
    { rank: 2, name: 'เครื่องใช้ไฟฟ้า', amount: 'THB 229,576' },
    { rank: 3, name: 'คอมพิวเตอร์', amount: 'THB 114,358' },
    { rank: 4, name: 'ของตกแต่งสำนักงาน', amount: 'THB 114,358' },
    { rank: 5, name: 'อุปกรณ์สำนักงาน', amount: 'THB 57,609' },
];

const employeeColumns = [
    { header: 'อันดับที่', key: 'rank' },
    { header: 'พนักงาน', key: 'name' },
    { header: 'สัดส่วนรายได้(%)', key: 'percent', align: 'right' },
];
const employees = [
    { rank: 1, name: 'นายแมน ฮับสาร', percent: '37.11%' },
    { rank: 2, name: 'นายจอมปราชญ์ รักโลก', percent: '29.91%' },
    { rank: 3, name: 'นางสาวดี มีปัญญา', percent: '21.16%' },
    { rank: 4, name: 'นายภา อับซาเมฆ', percent: '8.34%' },
];
const SummarySalePDF: React.FC<SummarySalePDFProps> = ({ chartImage1, chartImage2 }) => {


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานสรุปยอดขาย</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>1 มกราคม 2024 - 31 มกราคม 2024</Text>
                    </View>
                </View>

                {/* Chart */}
                {chartImage1 && chartImage2 && (
                    <View style={styles.section}>

                        <View style={styles.chartRow}>
                            {/* กราฟซ้าย */}
                            <View style={styles.chartBox}>
                                <Text style={styles.chartLabel}>กิจกรรมและลูกค้า</Text>
                                {chartImage1 && <Image src={chartImage1} style={styles.chartImage} />}
                            </View>

                            {/* กราฟขวา */}
                            <View style={styles.chartBox}>
                                <Text style={styles.chartLabel}>มูลค่าการขาย</Text>
                                {chartImage2 && <Image src={chartImage2} style={styles.chartImage} />}
                            </View>
                        </View>
                    </View>

                )}

                {/* table */}
                <View style={styles.section}>

                    {/* 3 table */}
                    <View style={styles.row3col}>
                        {/* ลูกค้า */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 อันดับลูกค้า</Text>
                            <View style={styles.tableHeader}>
                                {customerColumns.map((col) => (
                                    <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
                                ))}
                            </View>

                            {customers.map((row, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{row.rank}</Text>
                                    <Text style={styles.dataCell}>{row.name}</Text>
                                    <Text style={styles.dataCell}>{row.percent}</Text>
                                </View>
                            ))}
                        </View>

                        {/* หมวดหมู่สินค้า */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 หมวดหมู่สินค้า</Text>
                            <View style={styles.tableHeader}>
                                {categoryColumns.map((col) => (
                                    <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
                                ))}
                            </View>

                            {categories.map((row, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{row.rank}</Text>
                                    <Text style={styles.dataCell}>{row.name}</Text>
                                    <Text style={styles.dataCell}>{row.amount}</Text>
                                </View>
                            ))}
                        </View>

                        {/* พนักงานขาย */}
                        <View style={styles.cellBox}>
                            <Text style={styles.subTitle}>10 พนักงานขาย</Text>
                            <View style={styles.tableHeader}>
                                {employeeColumns.map((col) => (
                                    <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
                                ))}
                            </View>
                            {employees.map((row, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={styles.dataCell}>{row.rank}</Text>
                                    <Text style={styles.dataCell}>{row.name}</Text>
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

export default SummarySalePDF;
