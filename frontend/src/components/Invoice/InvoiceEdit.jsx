import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdDelete } from "react-icons/md";

const InvoiceEdit = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [clients, setClients] = useState([]);
    const [clientsLoaded, setClientsLoaded] = useState(false);

    const { register, handleSubmit, control, reset, setValue } = useForm({
        defaultValues: {
            invoiceNumber: '',
            invoiceDate: '',
            dueDate: '',
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

    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const watchedItems = useWatch({ control, name: 'items' });
    const discount = useWatch({ control, name: 'discount' });
    const roundOff = useWatch({ control, name: 'roundOff' });

    // Load data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoiceRes, clientsRes] = await Promise.all([
                    axios.get(`http://localhost:4000/invoices/${invoiceId}`),
                    axios.get('http://localhost:4000/api/clients')
                ]);

                setInvoiceData(invoiceRes.data);
                setClients(clientsRes.data.clients);
                setClientsLoaded(true);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };

        fetchData();
    }, [invoiceId]);

    // Reset form after data and clients are loaded
    useEffect(() => {
        if (invoiceData && clientsLoaded) {
            reset({
                ...invoiceData,
                client: invoiceData.client?._id || '',
                invoiceDate: invoiceData.invoiceDate?.split('T')[0],
                dueDate: invoiceData.dueDate?.split('T')[0],
            });

            handleClientChange(invoiceData.client?._id);
        }
    }, [invoiceData, clientsLoaded, reset]);

    const handleClientChange = (clientId) => {
        const selectedClient = clients.find(c => c._id === clientId);
        if (!selectedClient) return;

        setValue("salesperson", selectedClient.salesperson || '');
        setValue("customerNotes", selectedClient.notes || '');
        setValue("termsAndConditions", selectedClient.terms || '');
        setValue("bankDetails.accountNumber", selectedClient.bankAccount || '');
        setValue("bankDetails.ifsc", selectedClient.ifsc || '');
        setValue("bankDetails.bankName", selectedClient.bankName || '');
        setValue("bankDetails.branch", selectedClient.branch || '');
    };

    const handleFormSubmit = async (data) => {
        try {
            const updatedInvoice = {
                ...data,
                items: data.items.map(item => ({
                    ...item,
                    amount: item.quantity * item.rate
                }))
            };

            await axios.put(`http://localhost:4000/invoices/${invoiceId}`, updatedInvoice);
            alert('Invoice updated successfully!');
            navigate('/dashboard/invoice');
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert('Failed to update invoice');
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mx-auto bg-white p-6 rounded shadow space-y-6 max-w-3xl">
            <h2 className="text-2xl font-bold">Edit Invoice</h2>

            <div className="grid grid-cols-2 gap-4">
                <input {...register("invoiceNumber")} placeholder="Invoice Number" className="border p-2" />
                <input {...register("invoiceDate")} type="date" className="border p-2" />
                <input {...register("dueDate")} type="date" className="border p-2" />
                <input {...register("salesperson")} placeholder="Salesperson" className="border p-2" />
            </div>

            <div>
                <h3 className="font-semibold">Select Client</h3>
                <select {...register("client")} onChange={(e) => handleClientChange(e.target.value)} className="border p-2 w-full mt-2" required>
                    <option value="">-- Select a client --</option>
                    {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="flex gap-1 m-2 font-semibold">
                    <div className="w-80">Item Name</div>
                    <div className="w-20">Qty</div>
                    <div className="w-20">Rate</div>
                    <div className="w-20">Tax %</div>
                    <div className="w-40 text-center">Total</div>
                </div>
                {fields.map((field, index) => {
                    const quantity = watchedItems[index]?.quantity || 0;
                    const rate = watchedItems[index]?.rate || 0;
                    const totalPrice = (quantity * rate).toFixed(2);

                    return (
                        <div key={field.id} className="flex gap-1 m-2">
                            <input {...register(`items.${index}.itemName`)} placeholder="Item Name" className="border p-2 w-80" />
                            <input {...register(`items.${index}.quantity`)} type="number" className="border p-1 w-20 text-sm" />
                            <input {...register(`items.${index}.rate`)} type="number" className="border p-1 w-20 text-sm" />
                            <input {...register(`items.${index}.taxRate`)} type="number" className="border p-1 w-20 text-sm" />
                            <div className="flex items-center justify-center text-sm font-semibold w-40">₹{totalPrice}</div>
                            <button type="button" onClick={() => remove(index)} className="cursor-pointer text-red-500"><MdDelete /></button>
                        </div>
                    );
                })}
                <button type="button" onClick={() => append({ itemName: '', quantity: 1, rate: 0, taxRate: 0 })} className="text-sm bg-blue-500 text-white px-4 py-1 rounded">
                    + Add Item
                </button>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold mt-4">Summary</h3>
                <div className="flex justify-between"><span>Sub Total</span><span>₹{(useWatch({ control, name: 'subTotal' }) || 0).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>CGST</span><span>₹{(useWatch({ control, name: 'cgstAmount' }) || 0).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>SGST</span><span>₹{(useWatch({ control, name: 'sgstAmount' }) || 0).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Round Off</span><span>₹{(roundOff || 0).toFixed(2)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>₹{(useWatch({ control, name: 'totalAmount' }) || 0).toFixed(2)}</span></div>
            </div>

            <div>
                <h3 className="font-semibold">Bank Details</h3>
                <input {...register("bankDetails.accountNumber")} placeholder="Account Number" className="border p-2 w-full mt-2" />
                <input {...register("bankDetails.ifsc")} placeholder="IFSC Code" className="border p-2 w-full mt-2" />
                <input {...register("bankDetails.bankName")} placeholder="Bank Name" className="border p-2 w-full mt-2" />
                <input {...register("bankDetails.branch")} placeholder="Branch" className="border p-2 w-full mt-2" />
            </div>

            <textarea {...register("customerNotes")} placeholder="Customer Notes" className="border p-2 w-full mt-2" />
            <textarea {...register("termsAndConditions")} placeholder="Terms & Conditions" className="border p-2 w-full mt-2" />

            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Update Invoice</button>
        </form>
    );
};

export default InvoiceEdit;
