import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { EnhancedSelect, DetailsPanel } from '../common';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const InvoiceAdd = () => {
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientPanel, setShowClientPanel] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      salesperson: '',
      client: '',
      items: [],
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

  // Calculate average tax rate for display
  const calculateAverageTaxRate = () => {
    if (!watchedItems || watchedItems.length === 0) return 0;
    
    let totalTaxableAmount = 0;
    let totalTaxAmount = 0;
    
    watchedItems.forEach(item => {
      if (item.quantity && item.rate && item.taxRate) {
        const quantity = parseFloat(item.quantity) || 0;
        const rate = parseFloat(item.rate) || 0;
        const taxRate = parseFloat(item.taxRate) || 0;
        
        const itemTotal = quantity * rate;
        totalTaxableAmount += itemTotal;
        totalTaxAmount += (itemTotal * taxRate) / 100;
      }
    });
    
    return totalTaxableAmount > 0 ? (totalTaxAmount / totalTaxableAmount) * 100 : 0;
  };

  // Function to convert fraction to decimal
  const convertFractionToDecimal = (value) => {
    if (!value || typeof value !== 'string') return value;
    
    // Check if the value contains a fraction (e.g., "9/3", "1/2", "3/4")
    const fractionRegex = /^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/;
    const match = value.trim().match(fractionRegex);
    
    if (match) {
      const numerator = parseFloat(match[1]);
      const denominator = parseFloat(match[2]);
      
      if (denominator !== 0) {
        const result = numerator / denominator;
        return result.toFixed(2);
      }
    }
    
    return value;
  };

  // Function to handle rate input with fraction conversion
  const handleRateInputChange = (index, value) => {
    const convertedValue = convertFractionToDecimal(value);
    setValue(`items.${index}.rate`, convertedValue);
  };

  // Function to handle quantity input with fraction conversion
  const handleQuantityInputChange = (index, value) => {
    const convertedValue = convertFractionToDecimal(value);
    setValue(`items.${index}.quantity`, convertedValue);
  };

  // Function to get next invoice number
  const getNextInvoiceNumber = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.INVOICE_NEXT_NUMBER, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.nextInvoiceNumber;
    } catch (error) {
      console.error('Error fetching next invoice number:', error);
      const currentYear = new Date().getFullYear().toString().slice(-2);
      return `INV-${currentYear}-001`;
    }
  };

  // Fetch clients, items, and next invoice number when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, itemsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.CLIENTS),
          axios.get(getApiUrlWithUserId(API_ENDPOINTS.ITEMS))
        ]);
        
        setClients(clientsResponse.data.clients || []);
        setItems(itemsResponse.data || []);
        
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
      setSelectedClient(selectedClient);
      setShowClientPanel(true);
      
      setValue("client", selectedClient._id);
      setValue("salesperson", selectedClient.salesperson || '');
      setValue("customerNotes", selectedClient.notes || '');
      setValue("termsAndConditions", selectedClient.terms || '');
      setValue("bankDetails.accountNumber", selectedClient.bankAccount || '');
      setValue("bankDetails.ifsc", selectedClient.ifsc || '');
      setValue("bankDetails.bankName", selectedClient.bankName || '');
      setValue("bankDetails.branch", selectedClient.branch || '');
    } else {
      setSelectedClient(null);
      setShowClientPanel(false);
    }
  };

  // Auto-fill item details when item is selected
  const handleItemChange = (itemId, index) => {
    const selectedItem = items.find(item => item._id === itemId);
    if (selectedItem) {
      setValue(`items.${index}.itemId`, selectedItem._id);
      setValue(`items.${index}.itemName`, selectedItem.name);
      setValue(`items.${index}.rate`, selectedItem.sellingPrice || selectedItem.salesInfo?.sellingPrice || 0);
      setValue(`items.${index}.taxRate`, selectedItem.taxRates?.cgst || 18);
    } else {
      setValue(`items.${index}.itemId`, '');
      setValue(`items.${index}.itemName`, '');
      setValue(`items.${index}.rate`, 0);
      setValue(`items.${index}.taxRate`, 0);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      const validItems = data.items.filter(item => item.itemId && item.itemName);
      if (validItems.length === 0) {
        alert('Please add at least one item to the invoice.');
        return;
      }
      
      const transformedData = {
        client: data.client,
        invoiceNumber: data.invoiceNumber,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        salesperson: data.salesperson,
        items: data.items
          .filter(item => item.itemId && item.itemName)
          .map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: parseFloat(item.quantity) || 1,
            rate: parseFloat(item.rate) || 0,
            taxRate: parseFloat(item.taxRate) || 0,
            amount: (parseFloat(item.quantity) || 1) * (parseFloat(item.rate) || 0),
            unit: 'Nos',
            description: '',
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

      const response = await axios.post(API_ENDPOINTS.INVOICES, transformedData);
      
      const userChoice = confirm(
        `Invoice created successfully!\n\nInvoice Number: ${response.data.invoiceNumber}\n\nWould you like to view the invoice?`
      );
      
      if (userChoice) {
        navigate(`/dashboard/invoice/${response.data._id}`);
      } else {
        navigate('/dashboard/invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice. Please try again.');
    }
  };

  // Calculate totals whenever items change
  useEffect(() => {
    const calculateTotals = () => {
      let subTotal = 0;
      let totalCGST = 0;
      let totalSGST = 0;
      
      if (watchedItems) {
        watchedItems.forEach(item => {
          if (item.quantity && item.rate) {
            const quantity = parseFloat(item.quantity) || 0;
            const rate = parseFloat(item.rate) || 0;
            const itemTotal = quantity * rate;
            subTotal += itemTotal;
            
            // Calculate tax based on individual item tax rate
            const taxRate = parseFloat(item.taxRate) || 0;
            if (taxRate > 0) {
              // Split tax rate into CGST and SGST (assuming equal split)
              const cgstRate = taxRate / 2;
              const sgstRate = taxRate / 2;
              
              totalCGST += (itemTotal * cgstRate) / 100;
              totalSGST += (itemTotal * sgstRate) / 100;
            }
          }
        });
      }
      
      const discountAmount = (subTotal * (parseFloat(discount) || 0)) / 100;
      const taxableAmount = subTotal - discountAmount;
      
      // Apply discount proportionally to taxes
      const discountRatio = taxableAmount / subTotal;
      const finalCGST = totalCGST * discountRatio;
      const finalSGST = totalSGST * discountRatio;
      
      const totalBeforeRoundOff = taxableAmount + finalCGST + finalSGST;
      const computedRoundOff = Math.round(totalBeforeRoundOff) - totalBeforeRoundOff;
      const total = totalBeforeRoundOff + computedRoundOff;
      
      setValue('subTotal', parseFloat(subTotal.toFixed(2)));
      setValue('cgstAmount', parseFloat(finalCGST.toFixed(2)));
      setValue('sgstAmount', parseFloat(finalSGST.toFixed(2)));
      setValue('roundOff', parseFloat(computedRoundOff.toFixed(2)));
      setValue('totalAmount', parseFloat(total.toFixed(2)));
    };
    
    calculateTotals();
  }, [watchedItems, discount, roundOff, setValue]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Create New Invoice</h2>
              <p className="text-blue-100 mt-1">Fill in the details below to create a new invoice</p>
            </div>

            <form 
              onSubmit={handleSubmit(handleFormSubmit)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              className="p-6 space-y-8"
            >
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                    <input 
                      {...register("invoiceNumber")} 
                      placeholder="Auto-generated" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                    <input 
                      {...register("invoiceDate")} 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
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

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Information</h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <EnhancedSelect
                      label="Select Client"
                      options={clients.map(client => ({
                        value: client._id,
                        label: client.name,
                        description: client.email || client.phone || ''
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
                  {selectedClient && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setShowClientPanel(!showClientPanel)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                      >
                        <span className="mr-2">Details ({selectedClient.name})</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Invoice Items</h3>
                  <button 
                    type="button" 
                    onClick={() => append({ itemId: '', itemName: '', quantity: 1, rate: 0, taxRate: 0 })} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <span className="mr-2">+</span> Add Item
                  </button>
                </div>

                <div className="relative">
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
                            <td className="px-4 py-3">
                              <EnhancedSelect
                                options={items.map(item => ({
                                  value: item._id,
                                  label: item.name,
                                  stockQuantity: item.stockQuantity || 0,
                                  rate: item.sellingPrice || item.salesInfo?.sellingPrice || 0
                                }))}
                                value={watchedItems[index]?.itemId || ''}
                                onChange={(value, option) => {
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
                                type="text"
                                defaultValue={watchedItems[index]?.quantity || ''}
                                placeholder="Qty (e.g., 9/3)" 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                onBlur={(e) => handleQuantityInputChange(index, e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleQuantityInputChange(index, e.target.value);
                                    e.target.blur();
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="text"
                                defaultValue={watchedItems[index]?.rate || ''}
                                placeholder="Rate (e.g., 9/3)" 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                onBlur={(e) => handleRateInputChange(index, e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRateInputChange(index, e.target.value);
                                    e.target.blur();
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                {...register(`items.${index}.taxRate`)} 
                                type="number" 
                                step="0.01"
                                min="0"
                                placeholder="Tax %" 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              ₹{totalPrice}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-900"
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

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                    <input 
                      {...register("discount")} 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Sub Total</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(useWatch({ control, name: 'subTotal' }) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">CGST ({(calculateAverageTaxRate() / 2).toFixed(1)}%)</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(useWatch({ control, name: 'cgstAmount' }) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">SGST ({(calculateAverageTaxRate() / 2).toFixed(1)}%)</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(useWatch({ control, name: 'sgstAmount' }) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Total Tax ({calculateAverageTaxRate().toFixed(1)}%)</span>
                      <span className="text-sm font-semibold text-gray-900">₹{((useWatch({ control, name: 'cgstAmount' }) || 0) + (useWatch({ control, name: 'sgstAmount' }) || 0)).toFixed(2)}</span>
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

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input {...register("bankDetails.accountNumber")} placeholder="Account Number" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <input {...register("bankDetails.ifsc")} placeholder="IFSC Code" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <input {...register("bankDetails.bankName")} placeholder="Bank Name" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <input {...register("bankDetails.branch")} placeholder="Branch" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
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
          
          <DetailsPanel
            isOpen={showClientPanel}
            onClose={() => setShowClientPanel(false)}
            data={selectedClient}
            type="client"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceAdd;
