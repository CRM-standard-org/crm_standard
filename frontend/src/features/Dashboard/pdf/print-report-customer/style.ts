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
    //stat value
    infoGrid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTop: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
        marginTop: 6,
    },

    infoRow: {
        width: '50%',
        paddingVertical: 4,
        paddingHorizontal: 2,
        borderBottom: '0.5px solid #eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    infoRowFull: {
        width: '100%',
        paddingVertical: 4,
        paddingHorizontal: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    infoLabel: {
        fontSize: 10,
        color: '#444',
    },

    infoValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },


    //table 
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '0.5px solid #eee',
    },
    rowHighlight: {
        backgroundColor: '#e2f0ff',
    },
    headerCell: {
        width: '7%',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 10,
        paddingVertical: 2,
    },
    labelCell: {
        width: '16%',
        fontSize: 10,
        paddingLeft: 2,
    },
    dataCell: {
        width: '7%',
        fontSize: 10,
        textAlign: 'right',
        paddingRight: 3,
    },
    BoldTableText: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
    },


    //chart
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
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
    chartImage: {
        width: '100%',
        height: 250,
        objectFit: 'contain',
    },
    // รายงานสถิติและพฤติกรรมลูกค้า 
    grid3: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-start',
    },
    card: {
        border: '1px solid #ccc',
        borderRadius: 6,
        padding: 10,
        width: '32%', 
        minHeight: 100,
    },


    cardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
        borderBottom: '1px solid #ccc',
    },

    cardRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        paddingVertical: 2,
    },


});
