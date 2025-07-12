// src/components/pdf/style.ts
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'THSarabunNew',
        lineHeight: 1.5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    companyInfo: {
        width: '55%',
        gap: 2,
    },

    quotationInfo: {
        width: '40%',
        alignItems: 'flex-end',
        gap: 2,
    },

    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#001168',
        marginBottom: 4,
    },

    titleHighlight: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#001168',
        marginBottom: 4,
    },

    logo: {
        width: 80,
        height: 40,
        marginBottom: 8,
    },

    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    col50: {
        width: '48%',
    },

    //ตารางสินค้า
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottom: '1pt solid #ccc',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },

    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #eee',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },

    cellIndex: {
        width: '5%',
        fontSize: 11,
        textAlign: 'center',
    },

    cell: {
        width: '35%',
        fontSize: 11,
        textAlign: 'center',
    },

    cellRight: {
        width: '15%',
        fontSize: 11,
        textAlign: 'right',
    },

    //คำนวณยอด
    total: {
        marginTop: 16,
        textAlign: 'right',
        fontSize: 12,
    },

    //โซนเซ้น เอกสาร


    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        gap: 40,
    },

    signatureBlock: {
        width: '45%',
        alignItems: 'center',
    },

    centerText: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 10
    },

    signatureLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        width: '100%',
        marginTop: 12,
        marginBottom: 4,
    },

    signatureGap: {
        height: 12,
    },


    signatureBox: {
        width: '45%',
        alignItems: 'center',
        fontSize: 11,
    },

    signatureLineGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 24,
    },



});
