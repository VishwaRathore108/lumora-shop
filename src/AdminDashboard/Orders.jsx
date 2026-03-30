import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminOrders,
  selectAdminOrders,
  selectOrdersError,
  selectOrdersLoading,
  updateAdminOrderStatus,
} from '../features/orders/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchAdminOrders(activeStatus));
  }, [dispatch, activeStatus]);

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const orderId = String(order._id || '').toLowerCase();
      const customer = String(order.user?.name || '').toLowerCase();
      return !q || orderId.includes(q) || customer.includes(q);
    });
  }, [orders, searchTerm]);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-gray-500 text-sm">Manage and track customer orders with live status updates.</p>
        </div>
      </div>

      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex space-x-8 min-w-max">
          {[
            { name: 'all', label: 'All' },
            { name: 'pending', label: 'Pending' },
            { name: 'confirmed', label: 'Confirmed' },
            { name: 'shipped', label: 'Shipped' },
            { name: 'delivered', label: 'Delivered' },
            { name: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveStatus(tab.name)}
              className={`pb-4 text-sm font-medium relative transition-colors ${
                activeStatus === tab.name 
                  ? "text-[#985991]" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeStatus === tab.name && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#985991] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && <p className="p-4 text-sm text-gray-500">Loading orders...</p>}
        {error && <p className="p-4 text-sm text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4 font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={order.user?.profileImage || 'https://i.pravatar.cc/150?u=user'} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                        <span className="font-medium text-gray-700">{order.user?.name || 'Customer'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4 font-bold text-gray-800">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                       <span className={`text-xs font-bold ${(order.paymentStatus || 'pending') === "paid" ? "text-green-600" : "text-orange-500"}`}>
                         {String(order.paymentStatus || 'pending').toUpperCase()}
                       </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus || order.status || 'pending'}
                        onChange={(e) =>
                          dispatch(
                            updateAdminOrderStatus({
                              orderId: order._id,
                              status: e.target.value,
                            })
                          )
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white capitalize focus:outline-none focus:border-[#985991]"
                      >
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Orders;