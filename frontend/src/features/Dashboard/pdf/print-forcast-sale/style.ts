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


    //table 
    labelCell: {
        width: '16%',
        fontSize: 9,
    
    },

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
        fontSize: 10,
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
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    tableRow: {
        flexDirection: 'row',
        borderBottom: '0.5px solid #eee',
    },

    dataCell: {
        flex: 1,
        fontSize: 9,
        textAlign: 'center',
        paddingVertical: 2,
    },


    //chart
    sectionTitle: {
        fontSize: 11, 
        fontWeight: 'bold',
        marginBottom: 4,
      },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        width: '32%',
        padding: 6,
        border: '1px solid #ddd',
        borderRadius: 4,
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
    },
    boldText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    textSmall: {
        fontSize: 11,
        color: '#444',
    },

    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    chartBox: {
        width: '48%',
        borderRadius: 4,
    },

    chartImage: {
        width: '100%',
        height: 180, 
        objectFit: 'contain',
    },

    chart2Image: {
        width: '100%',
        height: 120, 
        objectFit: 'contain',
    },

});
