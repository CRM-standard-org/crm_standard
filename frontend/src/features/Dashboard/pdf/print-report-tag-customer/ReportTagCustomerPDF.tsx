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

type ReportTagCustomerProps = {
    chartImage1: string | null;
    chartImage2: string | null;
    chartImage3: string | null;
    chartImage4: string | null;
    range: { start_date: string; end_date: string };
    customerCounts: { total_customers: number; leads: number; new_customers: number; existing_customers: number };
    activitiesByTag: Array<{ tag_id: string; tag_name: string; activity_count: number }>;

    salesByTag: Array<{ tag_id: string; tag_name: string; total_sales: number; sales_share_percent: number }>;
};
const ReportTagCustomerPDF: React.FC<ReportTagCustomerProps> = ({ chartImage1, chartImage2, chartImage3, chartImage4, range, customerCounts, activitiesByTag, salesByTag }) => {
    const topActivities = activitiesByTag.slice(0,10);
    const topSales = salesByTag.slice(0,10);
    const totalActivity = topActivities.reduce((a,c)=>a + c.activity_count,0) || 0;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานวิเคราะห์ยอดขายตามแท็กลูกค้า</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                        <Text style={styles.companySubSmall}>{range.start_date} - {range.end_date}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>สรุป</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={{ width: '50%', fontSize: 10 }}>ลูกค้าทั้งหมด: {customerCounts.total_customers}</Text>
                        <Text style={{ width: '50%', fontSize: 10 }}>ว่าที่ลูกค้า: {customerCounts.leads}</Text>
                        <Text style={{ width: '50%', fontSize: 10 }}>ลูกค้าใหม่: {customerCounts.new_customers}</Text>
                        <Text style={{ width: '50%', fontSize: 10 }}>ลูกค้าเดิม: {customerCounts.existing_customers}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.chartRow}>
                        <View style={styles.chartBox}>
                            <Text style={styles.chartLabel}>ลูกค้า</Text>
                            {chartImage1 && <Image src={chartImage1} style={styles.chartImage} />}
                        </View>
                        <View style={styles.chartBox}>
                            <Text style={styles.chartLabel}>กิจกรรมตามช่วงวัน</Text>
                            {chartImage2 && <Image src={chartImage2} style={styles.chartImage} />}
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.chartRow}>
                        <View style={styles.chartBox}>
                            <Text style={styles.chartLabel}>กิจกรรมตามแท็ก</Text>
                            {chartImage3 && <Image src={chartImage3} style={styles.chartImage} />}
                        </View>
                        <View style={styles.chartBox}>
                            <Text style={styles.chartLabel}>ยอดขายตามแท็ก (THB)</Text>
                            {chartImage4 && <Image src={chartImage4} style={styles.chartImage} />}
                        </View>
                    </View>
                </View>

                {/* Top Activities Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top กิจกรรมตามแท็ก</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>#</Text>
                        <Text style={[styles.labelCell,{width:'40%'}]}>แท็ก</Text>
                        <Text style={styles.dataCell}>กิจกรรม</Text>
                        <Text style={styles.dataCell}>%</Text>
                    </View>
                    {topActivities.map((t,idx)=>{
                        const share = totalActivity? (t.activity_count/totalActivity)*100:0;
                        return (
                          <View key={t.tag_id} style={styles.tableRow}>
                            <Text style={styles.headerCell}>{idx+1}</Text>
                            <Text style={[styles.labelCell,{width:'40%'}]}>{t.tag_name}</Text>
                            <Text style={styles.dataCell}>{t.activity_count.toLocaleString()}</Text>
                            <Text style={styles.dataCell}>{share.toFixed(2)}</Text>
                          </View>
                        );
                    })}
                </View>
                {/* Top Sales Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top ยอดขายตามแท็ก</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>#</Text>
                        <Text style={[styles.labelCell,{width:'40%'}]}>แท็ก</Text>
                        <Text style={styles.dataCell}>ยอดขาย</Text>
                        <Text style={styles.dataCell}>%</Text>
                    </View>
                    {topSales.map((t,idx)=>(
                      <View key={t.tag_id} style={styles.tableRow}>
                        <Text style={styles.headerCell}>{idx+1}</Text>
                        <Text style={[styles.labelCell,{width:'40%'}]}>{t.tag_name}</Text>
                        <Text style={styles.dataCell}>{t.total_sales.toLocaleString()}</Text>
                        <Text style={styles.dataCell}>{t.sales_share_percent.toFixed(2)}</Text>
                      </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default ReportTagCustomerPDF;
