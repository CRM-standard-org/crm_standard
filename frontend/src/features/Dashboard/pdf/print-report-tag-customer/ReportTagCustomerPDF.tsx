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
type ReportTagCustomerProps = {
    chartImage1: string | null;
    chartImage2: string | null;
    chartImage3: string | null;
    chartImage4: string | null;
};
const ReportTagCustomerPDF: React.FC<ReportTagCustomerProps> = ({
    chartImage1,
    chartImage2,
    chartImage3,
    chartImage4
}) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.companyInfo}>
                        <Image src={companyLogoBase64} style={styles.logo} />
                        <Text style={styles.companyName}>รายงานวิเคราะห์ยอดขายตามแท็กลูกค้า</Text>
                        <Text style={styles.companySub}>บริษัท CRM Manager (DEMO)</Text>
                    </View>
                </View>




                {/* Chart */}

                <View style={styles.section}>

                    <View style={styles.chartRow}>
                        {/* กราฟซ้าย */}
                        <View style={styles.chartBox}>
                            <View style={styles.justifyBetween}>

                                <Text style={styles.chartLabel}>จอมปราชญ์ รักโลก</Text>
                                <Text style={styles.chartLabel}>1 มกราคม 2024 - 31 มกราคม 2024</Text>
                            </View>
                            {chartImage1 && <Image src={chartImage1} style={styles.chartImage} />}
                        </View>

                        {/* กราฟขวา */}
                        <View style={styles.chartBox}>
                            <Text style={styles.chartLabel}>กิจกรรมการขายแบ่งตามแท็กลูกค้า เดือนมกราคม</Text>
                            {chartImage2 && <Image src={chartImage2} style={styles.chartImage} />}
                        </View>
                    </View>
                </View>



                <View style={styles.section}>

                    <View style={styles.chartRow}>
                        {/* กราฟซ้าย */}
                        <View style={styles.chartBox}>
                            <Text style={styles.chartLabel}>จำนวนกิจกรรมการขายแบ่งตามแท็กลูกค้า</Text>
                            {chartImage3 && <Image src={chartImage3} style={styles.chartImage} />}
                        </View>

                        {/* กราฟขวา */}
                        <View style={styles.chartBox}>
                            <Text style={styles.chartLabel}>ยอดขายแบ่งตามแท็กลูกค้า (THB)</Text>
                            {chartImage4 && <Image src={chartImage4} style={styles.chartImage} />}
                        </View>
                    </View>
                </View>




            </Page>
        </Document>
    );
};

export default ReportTagCustomerPDF;
