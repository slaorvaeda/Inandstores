import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const CreateOrde = () => {
    const [clients, setClients] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const navigate = useNavigate();

    const { register, handleSubmit, control, reset, setValue } = useForm({
        defaultValues: {
            client: '',
            orderNumber: '',
            currency: 'INR',
            orderDate: new Date().toISOString().split('T')[0],
            items: [{ item: '', quantity: 1 }],
            subTotal: 0,
            discount: 0,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 0,
            roundOff: 0,
            totalAmount: 0,
            customerNotes: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const watchedItems = useWatch({ control, name: 'items' });
    const discount = useWatch({ control, name: 'discount' });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.CLIENTS);
                setClients(res.data.clients || []);
            } catch (err) {
                console.error('Error fetching clients:', err);
            }
        };

        const fetchItems = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error('User ID not found in localStorage.');
                    return;
                }

                const res = await axios.get(getApiUrlWithUserId(API_ENDPOINTS.ITEMS));
                setItemsList(res.data || []);
            } catch (err) {
                console.error('Error fetching items:', err.response?.data || err.message);
            }
        };

        fetchClients();
        fetchItems();
    }, []);

    useEffect(() => {
        let subTotal = 0;
        let totalTax = 0;

        watchedItems.forEach((item) => {
            const matchedItem = itemsList.find((i) => i._id === item.item);
            if (matchedItem) {
                const rate = matchedItem?.salesInfo?.sellingPrice || 0;
                const taxRate = matchedItem?.salesInfo?.taxRate || 18;
                const lineTotal = rate * item.quantity;
                const lineTax = (taxRate / 100) * lineTotal;
                subTotal += lineTotal;
                totalTax += lineTax;
            }
        });

        const cgst = totalTax / 2;
        const sgst = totalTax / 2;
        const discountedTotal = subTotal - parseFloat(discount || 0);
        const totalBeforeRoundOff = discountedTotal + cgst + sgst;
        const computedRoundOff = Math.round(totalBeforeRoundOff) - totalBeforeRoundOff;
        const total = totalBeforeRoundOff + computedRoundOff;

        setValue('subTotal', parseFloat(subTotal.toFixed(2)));
        setValue('cgstAmount', parseFloat(cgst.toFixed(2)));
        setValue('sgstAmount', parseFloat(sgst.toFixed(2)));
        setValue('roundOff', parseFloat(computedRoundOff.toFixed(2)));
        setValue('totalAmount', parseFloat(total.toFixed(2)));
    }, [watchedItems, discount, setValue, itemsList]);

    const onSubmit = async (data) => {
        try {
            const userId = localStorage.getItem('userId');

            const transformedItems = data.items.map((entry) => {
                const matched = itemsList.find((i) => i._id === entry.item);
                const rate = matched?.salesInfo?.sellingPrice || 0;
                const taxRate = matched?.salesInfo?.taxRate || 18;
                const quantity = Number(entry.quantity);
                const amount = rate * quantity;

                return {
                    item: entry.item,
                    quantity,
                    rate,
                    amount,
                    taxRate,
                };
            });

            const orderData = {
                user: userId, // ✅ Use "user", not "userId"
                client: data.client,
                orderNumber: data.orderNumber,
                currency: data.currency,
                orderDate: data.orderDate,
                items: transformedItems,
                subTotal: Number(data.subTotal),
                discount: Number(data.discount),
                cgstAmount: Number(data.cgstAmount),
                sgstAmount: Number(data.sgstAmount),
                igstAmount: Number(data.igstAmount),
                roundOff: Number(data.roundOff),
                totalAmount: Number(data.totalAmount),
                customerNotes: data.customerNotes,
            };

            await axios.post(API_ENDPOINTS.ORDER_CREATE, orderData);

            alert('Order saved successfully!');
            reset();
            navigate('/dashboard/order');
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Failed to save order. Please try again.');
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
            <h2 className="text-2xl font-bold">Create Order</h2>

            <div className="grid grid-cols-2 gap-4">
                <input {...register('orderNumber')} placeholder="Order Number" className="border p-2" />
                <input {...register('orderDate')} type="date" className="border p-2" />
            </div>

            <div>
                <h3 className="font-semibold">Select Client</h3>
                <select {...register('client')} className="border p-2 w-full mt-2" required>
                    <option value="">-- Select a client --</option>
                    {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="flex gap-1 m-2 font-semibold">
                    <div className="w-80">Item</div>
                    <div className="w-20">Qty</div>
                    <div className="w-40 text-center">Rate</div>
                </div>

                {fields.map((field, index) => {
                    const itemId = watchedItems[index]?.item;
                    const quantity = watchedItems[index]?.quantity || 0;
                    const item = itemsList.find((i) => i._id === itemId);
                    const rate = item?.salesInfo?.sellingPrice || 0;
                    const lineTotal = (rate * quantity).toFixed(2);

                    return (
                        <div key={field.id} className="flex gap-1 m-2 items-center">
                            <select {...register(`items.${index}.item`)} className="border p-2 w-80">
                                <option value="">Select Item</option>
                                {itemsList.map((i) => (
                                    <option key={i._id} value={i._id}>
                                        {i.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                {...register(`items.${index}.quantity`)}
                                type="number"
                                placeholder="Qty"
                                className="border p-1 w-20 text-sm rounded-md"
                            />
                            <div className="w-40 text-center font-semibold">₹{lineTotal}</div>
                            <button type="button" onClick={() => remove(index)} className="text-red-500">
                                <MdDelete />
                            </button>
                        </div>
                    );
                })}
                <button
                    type="button"
                    onClick={() => append({ item: '', quantity: 1 })}
                    className="text-sm bg-blue-500 text-white px-4 py-1 rounded"
                >
                    + Add Item
                </button>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold mt-4">Summary</h3>
                <div className="flex justify-between">
                    <span>Sub Total</span>
                    <span>₹{useWatch({ control, name: 'subTotal' }).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>CGST</span>
                    <span>₹{useWatch({ control, name: 'cgstAmount' }).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>SGST</span>
                    <span>₹{useWatch({ control, name: 'sgstAmount' }).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Round Off</span>
                    <span>₹{useWatch({ control, name: 'roundOff' }).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{useWatch({ control, name: 'totalAmount' }).toFixed(2)}</span>
                </div>
            </div>

            <textarea
                {...register('customerNotes')}
                placeholder="Customer Notes"
                className="border p-2 w-full mt-2"
            />

            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                Save Order
            </button>
        </form>
    );
};

export default CreateOrde;
