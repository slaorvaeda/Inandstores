import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';

const OrderEdit = () => {
    const [clients, setClients] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const { register, handleSubmit, control, reset, setValue } = useForm({
        defaultValues: {
            client: '',
            orderNumber: '',
            currency: 'INR',
            orderDate: '',
            items: [],
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

    const watchedItems = useWatch({ control, name: 'items' }) || [];
    const discount = useWatch({ control, name: 'discount' }) || 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsRes, itemsRes, orderRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/clients'),
                    axios.get(`http://localhost:4000/api/items?userId=${localStorage.getItem('userId')}`),
                    axios.get(`http://localhost:4000/api/orders/${id}`)
                ]);

                setClients(clientsRes.data.clients);
                
                setItemsList(itemsRes.data);

                const order = orderRes.data;

                const formattedItems = Array.isArray(order.items)
                    ? order.items.map(i => ({
                        item: i.item?._id || i.item,
                        quantity: i.quantity
                    }))
                    : [];

                reset({
                    ...order,
                    items: formattedItems
                });

            } catch (err) {
                console.error('Error loading data:', err);
            }
        };

        fetchData();
    }, [id, reset]);

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

            const updatedOrder = {
                user: userId,
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

            await axios.put(`http://localhost:4000/api/orders/${id}`, updatedOrder);
            alert('Order updated successfully!');
            navigate('/dashboard/order');
        } catch (err) {
            console.error('Failed to update order:', err);
            alert('Error updating order');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
            <h2 className="text-2xl font-bold">Edit Order</h2>

            <div>
                <label>Client:</label>
                <select {...register('client')} className="border p-2 w-full">
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Order Number:</label>
                <input {...register('orderNumber')} className="border p-2 w-full" />
            </div>

            <div>
                <label>Order Date:</label>
                <input type="date" {...register('orderDate')} className="border p-2 w-full" />
            </div>

            <div>
                <label>Currency:</label>
                <input {...register('currency')} className="border p-2 w-full" />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Items</h3>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                        <select
                            {...register(`items.${index}.item`)}
                            className="border p-2 w-1/2"
                        >
                            <option value="">Select Item</option>
                            {itemsList.map(item => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            {...register(`items.${index}.quantity`)}
                            placeholder="Qty"
                            className="border p-2 w-1/4"
                        />
                        <button type="button" onClick={() => remove(index)} className="text-red-600">
                            <MdDelete size={24} />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => append({ item: '', quantity: 1 })} className="bg-blue-500 text-white px-4 py-2 rounded">
                    + Add Item
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Subtotal:</label>
                    <input {...register('subTotal')} readOnly className="border p-2 w-full bg-gray-100" />
                </div>
                <div>
                    <label>Discount:</label>
                    <input type="number" {...register('discount')} className="border p-2 w-full" />
                </div>
                <div>
                    <label>CGST:</label>
                    <input {...register('cgstAmount')} readOnly className="border p-2 w-full bg-gray-100" />
                </div>
                <div>
                    <label>SGST:</label>
                    <input {...register('sgstAmount')} readOnly className="border p-2 w-full bg-gray-100" />
                </div>
                <div>
                    <label>Round Off:</label>
                    <input {...register('roundOff')} readOnly className="border p-2 w-full bg-gray-100" />
                </div>
                <div>
                    <label>Total:</label>
                    <input {...register('totalAmount')} readOnly className="border p-2 w-full bg-gray-100" />
                </div>
            </div>

            <div>
                <label>Customer Notes:</label>
                <textarea {...register('customerNotes')} className="border p-2 w-full" rows={4}></textarea>
            </div>

            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Update Order</button>
        </form>
    );
};

export default OrderEdit;
