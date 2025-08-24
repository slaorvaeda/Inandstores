const Invoice = require('../Schema/Invoice.model');
const PurchaseBill = require('../Schema/PurchaseBill.model');

class AutoNumberGenerator {
  /**
   * Generate next invoice number
   * Format: INV-YY-001 (e.g., INV-25-001 for year 2025)
   */
  static async getNextInvoiceNumber(userId) {
    try {
      const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
      const yearPrefix = `INV-${currentYear}-`;
      
      // Find the last invoice for this user in the current year
      const lastInvoice = await Invoice.findOne({
        userId,
        invoiceNumber: { $regex: `^${yearPrefix}` }
      }).sort({ invoiceNumber: -1 });
      
      let nextNumber = 1;
      
      if (lastInvoice && lastInvoice.invoiceNumber) {
        // Extract the number part from the last invoice number
        const match = lastInvoice.invoiceNumber.match(new RegExp(`^${yearPrefix}(\\d+)$`));
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }
      
      // Format with leading zeros (3 digits)
      const nextInvoiceNumber = `${yearPrefix}${nextNumber.toString().padStart(3, '0')}`;
      
      return { nextInvoiceNumber, currentYear };
    } catch (error) {
      console.error('Error generating invoice number:', error);
      throw new Error('Failed to generate invoice number');
    }
  }

  /**
   * Generate next purchase bill number
   * Format: PB-YY-001 (e.g., PB-25-001 for year 2025)
   */
  static async getNextPurchaseBillNumber(userId) {
    try {
      const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
      const yearPrefix = `PB-${currentYear}-`;
      
      // Find the last purchase bill for this user in the current year
      const lastBill = await PurchaseBill.findOne({
        userId,
        billNumber: { $regex: `^${yearPrefix}` }
      }).sort({ billNumber: -1 });
      
      let nextNumber = 1;
      
      if (lastBill && lastBill.billNumber) {
        // Extract the number part from the last bill number
        const match = lastBill.billNumber.match(new RegExp(`^${yearPrefix}(\\d+)$`));
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }
      
      // Format with leading zeros (3 digits)
      const nextBillNumber = `${yearPrefix}${nextNumber.toString().padStart(3, '0')}`;
      
      return { nextBillNumber, currentYear };
    } catch (error) {
      console.error('Error generating purchase bill number:', error);
      throw new Error('Failed to generate purchase bill number');
    }
  }

  /**
   * Generate next number for any document type
   * @param {string} type - 'invoice' or 'purchasebill'
   * @param {string} userId - User ID
   */
  static async getNextNumber(type, userId) {
    switch (type.toLowerCase()) {
      case 'invoice':
        return await this.getNextInvoiceNumber(userId);
      case 'purchasebill':
      case 'purchase_bill':
      case 'purchase-bill':
        return await this.getNextPurchaseBillNumber(userId);
      default:
        throw new Error(`Unsupported document type: ${type}`);
    }
  }

  /**
   * Validate if a number follows the correct format
   * @param {string} number - The number to validate
   * @param {string} type - 'invoice' or 'purchasebill'
   */
  static validateNumberFormat(number, type) {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    
    switch (type.toLowerCase()) {
      case 'invoice':
        const invoicePattern = new RegExp(`^INV-${currentYear}-\\d{3}$`);
        return invoicePattern.test(number);
      case 'purchasebill':
      case 'purchase_bill':
      case 'purchase-bill':
        const billPattern = new RegExp(`^PB-${currentYear}-\\d{3}$`);
        return billPattern.test(number);
      default:
        return false;
    }
  }

  /**
   * Get the current year's prefix for a document type
   * @param {string} type - 'invoice' or 'purchasebill'
   */
  static getYearPrefix(type) {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    
    switch (type.toLowerCase()) {
      case 'invoice':
        return `INV-${currentYear}-`;
      case 'purchasebill':
      case 'purchase_bill':
      case 'purchase-bill':
        return `PB-${currentYear}-`;
      default:
        throw new Error(`Unsupported document type: ${type}`);
    }
  }

  /**
   * Extract year from a document number
   * @param {string} number - The document number
   */
  static extractYear(number) {
    const match = number.match(/^(INV|PB)-(\d{2})-\d{3}$/);
    return match ? `20${match[2]}` : null;
  }

  /**
   * Extract sequence number from a document number
   * @param {string} number - The document number
   */
  static extractSequenceNumber(number) {
    const match = number.match(/^(INV|PB)-\d{2}-(\d{3})$/);
    return match ? parseInt(match[2]) : null;
  }
}

module.exports = AutoNumberGenerator;

// Test function to verify the generator works
if (require.main === module) {
  // This will only run if the file is executed directly
  const testGenerator = async () => {
    try {
      console.log('Testing Auto Number Generator...');
      
      const currentYear = new Date().getFullYear().toString().slice(-2);
      console.log('Current year (2 digits):', currentYear);
      
      // Test year prefix generation
      console.log('Invoice prefix:', AutoNumberGenerator.getYearPrefix('invoice'));
      console.log('Purchase bill prefix:', AutoNumberGenerator.getYearPrefix('purchasebill'));
      
      // Test number validation
      const testInvoiceNumber = `INV-${currentYear}-001`;
      const testBillNumber = `PB-${currentYear}-001`;
      
      console.log('Validating invoice number:', testInvoiceNumber);
      console.log('Is valid invoice:', AutoNumberGenerator.validateNumberFormat(testInvoiceNumber, 'invoice'));
      
      console.log('Validating bill number:', testBillNumber);
      console.log('Is valid bill:', AutoNumberGenerator.validateNumberFormat(testBillNumber, 'purchasebill'));
      
      console.log('Test completed successfully!');
    } catch (error) {
      console.error('Test failed:', error);
    }
  };
  
  testGenerator();
}
