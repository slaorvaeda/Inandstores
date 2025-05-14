import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#000',
    width: '100%',
    border: '1 solid #ccc',
  },
  heading: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  subheading: {
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table: {
    display: 'table',
    width: 'auto',
    border: '1 solid #ccc',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderRight: '1 solid #ccc',
    padding: 4,
    flex: 1,
  },
  tableColHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  textRight: {
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    textAlign: 'right',
  }
});

const InvoicePDF = ({ invoice }) => (
  <Document className="border border-black p-2">
    <Page size="A4" style={styles.page}>
      
      <Text style={styles.heading} >RAGHUNATH TRADERS</Text>
      <Text style={styles.subheading}>
        Raghunathtraders, Hirli, Near Firestation, Nabarangapur, Odisha - 764059 | GSTIN: 21BEWPN1437B1ZQ
      </Text>

      <View style={[styles.section, styles.row]}>
        <View>
          <Text style={styles.bold}>TAX INVOICE</Text>
          <Text>Invoice #: {invoice.invoiceNumber}</Text>
          <Text>Date: {invoice.invoiceDate}</Text>
          <Text>Due Date: {invoice.dueDate}</Text>
          <Text>Terms: {invoice.terms}</Text>
        </View>
        <View>
          <Text style={styles.bold}>Bill To:</Text>
          <Text>{invoice.client.name}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableColHeader]}>
          <Text style={styles.tableCol}>Item & Description</Text>
          <Text style={styles.tableCol}>Qty</Text>
          <Text style={styles.tableCol}>Rate</Text>
          <Text style={styles.tableCol}>CGST</Text>
          <Text style={styles.tableCol}>SGST</Text>
          <Text style={styles.tableCol}>Amount</Text>
        </View>
        {invoice.items.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.tableCol}>{item.itemName}</Text>
            <Text style={styles.tableCol}>{item.quantity}</Text>
            <Text style={styles.tableCol}>{item.rate}</Text>
            <Text style={styles.tableCol}>{invoice.cgstAmount}%</Text>
            <Text style={styles.tableCol}>{invoice.sgstAmount}%</Text>
            <Text style={styles.tableCol}>
              {(item.quantity * item.rate).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.textRight}>
        <Text>Sub Total: ₹{invoice.subTotal}</Text>
        <Text>CGST {invoice.taxPercent}%: ₹{invoice.cgstAmount}</Text>
        <Text>SGST {invoice.taxPercent}%: ₹{invoice.sgstAmount}</Text>
        <Text>Round Off: ₹{invoice.roundOff}</Text>
        <Text style={styles.bold}>Total: ₹{invoice.totalAmount}</Text>
        <Text>In Words: {invoice.totalInWords}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Bank Details:</Text>
        <Text>Account No: {invoice.bankDetails.accountNumber}</Text>
        <Text>IFSC: {invoice.bankDetails.ifsc}</Text>
        <Text>Bank: {invoice.bankDetails.bankName}</Text>
        <Text>Branch: {invoice.bankDetails.branch}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Notes:</Text>
        <Text>{invoice.customerNotes}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Terms & Conditions:</Text>
        <Text>{invoice.termsAndConditions}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.bold}>Authorized Signature</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
