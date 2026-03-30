import React, { useMemo, useState } from 'react';
import { Download, ReceiptText } from 'lucide-react';

const GST_RATE = 0.18;

const calculateBill = (baseAmount) => {
  const amount = Number(baseAmount) || 0;
  const gstAmount = amount * GST_RATE;
  const totalAmount = amount + gstAmount;

  return { gstAmount, totalAmount };
};

const DashboardBilling = () => {
  const [pastOrders] = useState([
    { id: 'ORD123', date: '2026-03-25', baseAmount: 1000, status: 'Paid' },
    { id: 'ORD124', date: '2026-03-19', baseAmount: 2450, status: 'Paid' },
    { id: 'ORD125', date: '2026-03-11', baseAmount: 799, status: 'Paid' },
    { id: 'ORD126', date: '2026-03-03', baseAmount: 3499, status: 'Paid' },
  ]);

  const ordersWithTax = useMemo(
    () => pastOrders.map((order) => ({ ...order, ...calculateBill(order.baseAmount) })),
    [pastOrders]
  );

  return (
    <section className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-full bg-pink-50 text-[#985991] flex items-center justify-center">
            <ReceiptText size={18} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Billing & Invoices</h3>
            <p className="text-sm text-gray-500">View your previous orders, tax breakdown, and invoice actions.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                <th className="py-3 pr-3">Order ID</th>
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-3">Base Amount</th>
                <th className="py-3 pr-3">GST (18%)</th>
                <th className="py-3 pr-3">Total Paid</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersWithTax.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 text-sm text-gray-700">
                  <td className="py-4 pr-3 font-semibold text-gray-900">{order.id}</td>
                  <td className="py-4 pr-3">{order.date}</td>
                  <td className="py-4 pr-3">Rs {Number(order.baseAmount).toFixed(2)}</td>
                  <td className="py-4 pr-3">Rs {Number(order.gstAmount).toFixed(2)}</td>
                  <td className="py-4 pr-3 font-semibold text-gray-900">Rs {Number(order.totalAmount).toFixed(2)}</td>
                  <td className="py-4 pr-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Downloading Invoice for', order.id);
                        alert(`Downloading Invoice for ${order.id}`);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-black transition-colors"
                    >
                      <Download size={14} />
                      Download Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashboardBilling;
