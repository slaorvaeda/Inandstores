import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router";
import { FaUserTie, FaUsers, FaBoxOpen, FaFileInvoice, FaFileAlt } from 'react-icons/fa';

export default function DashboardContent() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:4000/api/dashboard?userId=${userId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <DashboardSkeleton />;

  const { counts, recentInvoices, recentPurchaseBills, totals, topClients, topVendors } = data;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <div onClick={() => navigate('client')} className="cursor-pointer">
          <StatCard title="Clients" value={counts.clientsCount} icon={<FaUsers className="text-blue-500" />} />
        </div>
        <div onClick={() => navigate('vendor')} className="cursor-pointer">
          <StatCard title="Vendors" value={counts.vendorsCount} icon={<FaUserTie className="text-green-500" />} />
        </div>
        <div onClick={() => navigate('item/list')} className="cursor-pointer">
          <StatCard title="Items" value={counts.itemsCount} icon={<FaBoxOpen className="text-yellow-500" />} />
        </div>
        <div onClick={() => navigate('invoice')} className="cursor-pointer">
          <StatCard title="Invoices" value={counts.invoicesCount} icon={<FaFileInvoice className="text-purple-500" />} />
        </div>
        <div onClick={() => navigate('purchasebill')} className="cursor-pointer">
          <StatCard title="Purchase Bills" value={counts.purchaseBillsCount} icon={<FaFileAlt className="text-red-500" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <SectionCard title="Recent Invoices">
          <ScrollableTable
            data={recentInvoices}
            columns={['Invoice Number', 'Client', 'Date', 'Total']}
            renderRow={(invoice,index) => (
              <tr key={invoice._id} className={`hover:bg-gray-50 cursor-pointer border-b-0 shadow ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`} onClick={() => navigate(`invoice/${invoice._id}`)}>
                <td className="py-1 whitespace-nowrap border-b-0">{invoice.invoiceNumber}</td>
                <td>{invoice.client?.name}</td>
                <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                <td>₹{invoice.totalAmount.toFixed(2)}</td>
              </tr>
            )}
          />
        </SectionCard>

        <SectionCard title="Recent Purchase Bills">
          <ScrollableTable
            data={recentPurchaseBills}
            columns={['Bill Number', 'Vendor', 'Date', 'Total']}
            renderRow={(bill,index) => (
              <tr key={bill._id} className={`hover:bg-gray-50 cursor-pointer border-b-0 shadow ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                <td className="py-1 whitespace-nowrap border-b-0">{bill.billNumber}</td>
                <td>{bill.vendor?.name}</td>
                <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                <td>₹{bill.totalAmount.toFixed(2)}</td>
              </tr>
            )}
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SummaryCard title="Sales & Purchase Summary (This Month)">
          <p className="text-lg mb-2">Sales: <span className="font-semibold text-blue-600">₹{totals.salesThisMonth.toFixed(2)}</span></p>
          <p className="text-lg">Purchase: <span className="font-semibold text-green-600">₹{totals.purchaseThisMonth.toFixed(2)}</span></p>
        </SummaryCard>

        <SummaryCard title="Top Clients (Last 6 Months)">
          <ul className="space-y-1">
            {topClients.map(c => (
              <li key={c.clientName} className="text-gray-700">{c.clientName}: <span className="text-blue-600 font-medium">₹{c.totalSpent.toFixed(2)}</span></li>
            ))}
          </ul>
        </SummaryCard>

        <SummaryCard title="Top Vendors (Last 6 Months)">
          <ul className="space-y-1">
            {topVendors.map(v => (
              <li key={v.vendorName} className="text-gray-700">{v.vendorName}: <span className="text-green-600 font-medium">₹{v.totalSpent.toFixed(2)}</span></li>
            ))}
          </ul>
        </SummaryCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ScrollableTable({ data, columns, renderRow }) {
  return (
    <div className="overflow-auto border border-gray-200 rounded ">
      <table className="min-w-full text-sm text-left ">
        <thead className="bg-gray-100 text-gray-700">
          <tr className=' p-2'>
            {columns.map(col => (
              <th key={col} className="px-4 py-2 ">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody >{data.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function SummaryCard({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-10 w-40 bg-gray-300 rounded mb-8"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-6 w-12 bg-gray-400 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-4">
            <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              {Array(5).fill(0).map((_, j) => (
                <div key={j} className="h-4 w-full bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-4 h-full">
            <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              {Array(4).fill(0).map((_, j) => (
                <div key={j} className="h-4 w-full bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
