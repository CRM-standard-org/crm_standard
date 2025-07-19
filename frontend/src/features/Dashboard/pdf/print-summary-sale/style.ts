import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        fontFamily: 'THSarabunNew',
        fontSize: 12,
        padding: 30,
    },
    headerRow: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    companyInfo: {
        flexDirection: 'column',
    },
    logo: {
        width: 80,
        height: 40,
        marginBottom: 8,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    companySub: {
        fontSize: 14,
        color: '#555',
    },
    companySubSmall: {
        fontSize: 10,
        color: '#888',
    },
    section: {
        marginBottom: 10,
    },
    //table 
    row3col: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    cellBox: {
        flex: 1,
        // border: '1px solid #ccc',
        // borderRadius: 4,
        padding: 2,
    },

    subTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },

    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        paddingVertical: 2,
    },

    headerCell: {
        flex: 1,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    tableRow: {
        flexDirection: 'row',
        borderBottom: '0.5px solid #eee',
    },

    dataCell: {
        flex: 1,
        fontSize: 10,
        textAlign: 'center',
        paddingVertical: 2,
    },

    //chart
   
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    chartBox: {
        width: '48%',
        borderRadius: 4,
    },

    chartLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    chartImage: {
        width: '100%',
        height: 160,
        objectFit: 'contain',
    },



});
