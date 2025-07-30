import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import Select from '../common/Select';

const InvoiceAdd = () => {
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      invoiceNumber: '', // Will be auto-generated and displayed
      invoiceDate: new Date().toISOString().split('T')[0], // Auto-set current date
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // Auto-set due date (7 days from now)
      salesperson: '',
      client: '',
      items: [{ itemId: '', itemName: '', quantity: 1, rate: 0, taxRate: 0 }],
      subTotal: 0,
      discount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      roundOff: 0,
      totalAmount: 0,
      bankDetails: {
        accountNumber: '',
        ifsc: '',
        bankName: '',
        branch: '',
      },
      customerNotes: '',
      termsAndConditions: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchedItems = useWatch({ control, name: 'items' });
  const discount = useWatch({ control, name: 'discount' });
  const roundOff = useWatch({ control, name: 'roundOff' });

  // Function to get next invoice number
  const getNextInvoiceNumber = async () => {
    try {
      const response = await axios.get('http://localhost:4000/invoices');
      const invoices = response.data.invoices || [];
      
      if (invoices.length === 0) {
        return 'INV-001';
      }
      
      // Find the latest invoice number
      const latestInvoice = invoices.reduce((latest, invoice) => {
        const currentNumber = parseInt(invoice.invoiceNumber.replace('INV-', ''));
        const latestNumber = parseInt(latest.replace('INV-', ''));
        return currentNumber > latestNumber ? invoice.invoiceNumber : latest;
      }, 'INV-000');
      
      // Generate next number
      const nextNumber = parseInt(latestInvoice.replace('INV-', '')) + 1;
      return `INV-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error fetching next invoice number:', error);
      return 'INV-001'; // Fallback
    }
  };

  // Fetch clients, items, and next invoice number when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, itemsResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/clients'),
          axios.get(`http://localhost:4000/api/items?userId=${localStorage.getItem('userId')}`)
        ]);
        
        setClients(clientsResponse.data.clients || []);
        setItems(itemsResponse.data || []);
        
        // Get and set next invoice number
        const nextNumber = await getNextInvoiceNumber();
        setNextInvoiceNumber(nextNumber);
        setValue('invoiceNumber', nextNumber);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [setValue]);

  // Auto-fill client details when client is selected
  const handleClientChange = (clientId) => {
    const selectedClient = clients.find(client => client._id === clientId);
    if (selectedClient) {
      // Auto-fill client details
      setValue("client", selectedClient._id);
      // Don't set invoice number - let it be auto-generated
      // Don't override dates - they're already auto-set
      setValue("salesperson", selectedClient.salesperson || '');
      setValue("customerNotes", selectedClient.notes || '');
      setValue("termsAndConditions", selectedClient.terms || '');
      setValue("bankDetails.accountNumber", selectedClient.bankAccount || '');
      setValue("bankDetails.ifsc", selectedClient.ifsc || '');
      setValue("bankDetails.bankName", selectedClient.bankName || '');
      setValue("bankDetails.branch", selectedClient.branch || '');
    }
  };

  // Auto-fill item details when item is selected
  const handleItemChange = (itemId, index) => {
    const selectedItem = items.find(item => item._id === itemId);
    if (selectedItem) {
      setValue(`items.${index}.itemId`, selectedItem._id);
      setValue(`items.${index}.itemName`, selectedItem.name);
      setValue(`items.${index}.rate`, selectedItem.salesInfo?.sellingPrice || 0);
      setValue(`items.${index}.taxRate`, 18); // Default tax rate
    } else {
      // Clear fields if no item is selected
      setValue(`items.${index}.itemId`, '');
      setValue(`items.${index}.itemName`, '');
      setValue(`items.${index}.rate`, 0);
      setValue(`items.${index}.taxRate`, 0);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      const transformedData = {
        client: data.client,
        invoiceNumber: data.invoiceNumber, // Use the pre-filled or edited number
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        salesperson: data.salesperson,
        items: data.items.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          rate: item.rate,
          taxRate: item.taxRate,
          amount: item.quantity * item.rate,
        })),
        subTotal: data.subTotal,
        discount: data.discount,
        cgstAmount: data.cgstAmount,
        sgstAmount: data.sgstAmount,
        roundOff: data.roundOff,
        totalAmount: data.totalAmount,
        customerNotes: data.customerNotes,
        termsAndConditions: data.termsAndConditions,
        bankDetails: data.bankDetails,
      };

      const response = await axios.post('http://localhost:4000/invoices', transformedData);
      console.log('Invoice saved successfully:', response.data);
      
      // Get the generated invoice number
      const generatedInvoiceNumber = response.data.invoiceNumber;
      
      // Display the generated invoice number in the field
      setValue('invoiceNumber', generatedInvoiceNumber);
      
      // Show success message and ask user what to do next
      const userChoice = confirm(
        `Invoice created successfully!\n\nInvoice Number: ${generatedInvoiceNumber}\n\nClick OK to view all invoices or Cancel to create another invoice.`
      );
      
      if (userChoice) {
        // User clicked OK - go to invoice list
        reset();
        navigate('/dashboard/invoice');
      } else {
        // User clicked Cancel - reset form for new invoice
        reset();
        // Get the next invoice number for the new invoice
        const nextNumber = await getNextInvoiceNumber();
        setNextInvoiceNumber(nextNumber);
        setValue('invoiceNumber', nextNumber);
      }
    } catch (error) {
      console.error('Error saving invoice:', error.response?.data?.error || error.message);
      alert('Failed to save invoice. Please try again.');
    }
  };

  useEffect(() => {
    const subTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.rate || 0), 0);
    const totalTax = watchedItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate || 0;
      return sum + (item.taxRate / 100) * itemTotal;
    }, 0);

    const cgst = totalTax / 2;
    const sgst = totalTax / 2;
    // const total = subTotal - (parseFloat(discount || 0)) + cgst + sgst + (parseFloat(roundOff || 0));
    const discountedTotal = subTotal - parseFloat(discount || 0);
    const totalBeforeRoundOff = discountedTotal + cgst + sgst;
    const computedRoundOff = Math.round(totalBeforeRoundOff) - totalBeforeRoundOff;
    const total = totalBeforeRoundOff + computedRoundOff;


    setValue('subTotal', parseFloat(subTotal.toFixed(2)));
    setValue('cgstAmount', parseFloat(cgst.toFixed(2)));
    setValue('sgstAmount', parseFloat(sgst.toFixed(2)));
    setValue('roundOff', parseFloat(computedRoundOff.toFixed(2)));
    setValue('totalAmount', parseFloat(total.toFixed(2)));
  }, [watchedItems, discount, roundOff, setValue]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Create New Invoice</h2>
            <p className="text-blue-100 mt-1">Fill in the details below to create a new invoice</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number 
                    <span className="text-green-600 text-xs ml-1">(Auto-generated, editable)</span>
                  </label>
                  <input 
                    {...register("invoiceNumber")} 
                    placeholder="Next invoice number will appear here" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 The next invoice number is automatically generated. You can edit it if needed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date
                    <span className="text-blue-600 text-xs ml-1">(Auto-set to today)</span>
                  </label>
                  <input 
                    {...register("invoiceDate")} 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                    <span className="text-blue-600 text-xs ml-1">(Auto-set to 7 days)</span>
                  </label>
                  <input 
                    {...register("dueDate")} 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salesperson</label>
                  <input 
                    {...register("salesperson")} 
                    placeholder="Salesperson name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
              </div>
            </div>

            {/* Client Selection */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Client Information
              </h3>
              <div>
                <Select
                  label="Select Client"
                  options={clients.map(client => ({
                    _id: client._id,
                    name: client.name,
                    label: client.name,
                    phone: client.phone,
                    email: client.email
                  }))}
                  value={useWatch({ control, name: 'client' })}
                  onChange={(value, option) => {
                    setValue('client', value);
                    handleClientChange(value);
                  }}
                  placeholder="-- Select a client --"
                  searchable={true}
                  required={true}
                  showDescription={true}
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Invoice Items
                </h3>
                <button 
                  type="button" 
                  onClick={() => append({ itemId: '', itemName: '', quantity: 1, rate: 0, taxRate: 0 })} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Add Item
                </button>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto relative">
                <table className="min-w-full bg-white rounded-lg shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {fields.map((field, index) => {
                      const quantity = watchedItems[index]?.quantity || 0;
                      const rate = watchedItems[index]?.rate || 0;
                      const totalPrice = (quantity * rate).toFixed(2);

                      return (
                        <tr key={field.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 relative">
                            <Select
                              options={items.map(item => ({
                                _id: item._id,
                                name: item.name,
                                label: item.name,
                                stockQuantity: item.stockQuantity || 0,
                                rate: item.salesInfo?.sellingPrice || 0
                              }))}
                              value={watchedItems[index]?.itemId || ''}
                              onChange={(value, option) => {
                                console.log('Item selected:', value, option);
                                handleItemChange(value, index);
                              }}
                              placeholder="-- Select Item --"
                              searchable={true}
                              showStock={true}
                              className="text-sm"
                            />
                            {watchedItems[index]?.itemName && (
                              <div className="mt-1 text-xs text-green-600 font-medium">
                                ✓ {watchedItems[index].itemName}
                              </div>
                            )}
                            <input {...register(`items.${index}.itemId`)} type="hidden" />
                            <input {...register(`items.${index}.itemName`)} type="hidden" />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              {...register(`items.${index}.quantity`)} 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder="Qty" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              {...register(`items.${index}.rate`)} 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder="Rate" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              {...register(`items.${index}.taxRate`)} 
                              type="number" 
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="Tax %" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gray-900">₹{totalPrice}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              type="button" 
                              onClick={() => remove(index)} 
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Invoice Summary
              </h3>
              <div className="flex justify-end">
                <div className="w-full max-w-md space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                    <input 
                      {...register("discount")} 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0" 
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Sub Total</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(useWatch({ control, name: 'subTotal' }) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">CGST</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(useWatch({ control, name: 'cgstAmount' }) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">SGST</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(useWatch({ control, name: 'sgstAmount' }) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Round Off</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(roundOff || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-md">
                      <span className="text-base font-bold text-blue-900">Total Amount</span>
                      <span className="text-base font-bold text-blue-900">₹{(useWatch({ control, name: 'totalAmount' }) || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...register("bankDetails.accountNumber")} placeholder="Account Number" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input {...register("bankDetails.ifsc")} placeholder="IFSC Code" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input {...register("bankDetails.bankName")} placeholder="Bank Name" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input {...register("bankDetails.branch")} placeholder="Branch" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                Additional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
                  <textarea 
                    {...register("customerNotes")} 
                    placeholder="Any additional notes for the customer..." 
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <textarea 
                    {...register("termsAndConditions")} 
                    placeholder="Terms and conditions..." 
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard/invoice')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceAdd;
