import React, { useEffect, useMemo, useState } from 'react';
import { Package, Search, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, selectMyOrders, selectOrdersError, selectOrdersLoading } from '../features/orders/orderSlice';

const MyOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const st = String(order.orderStatus || order.status || '').toLowerCase();
      const isActive = ['pending', 'confirmed', 'shipped'].includes(st);
      const isCompleted = st === 'delivered';
      const isCancelled = st === 'cancelled';
      const tabOk =
        activeTab === 'all' ||
        (activeTab === 'active' && isActive) ||
        (activeTab === 'completed' && isCompleted) ||
        (activeTab === 'cancelled' && isCancelled);
      const searchOk = !q || String(order._id).toLowerCase().includes(q);
      return tabOk && searchOk;
    });
  }, [orders, activeTab, searchTerm]);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
           <p className="text-gray-500 text-sm">Track your packages and view order history.</p>
        </div>
        
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search by Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#985991] shadow-sm" 
           />
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2.5 text-sm font-bold rounded-t-xl transition-all relative ${
              activeTab === tab.key
                ? "text-[#985991] bg-white border border-b-0 border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-white"></div>}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {loading && <p className="text-sm text-gray-500">Loading orders...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg capitalize">{order.orderStatus || order.status}</h3>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {(order.items || []).slice(0, 2).map((item, index) => (
                  <div key={`${order._id}-${index}`} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0] || 'https://placehold.co/64x64?text=Item'}
                      alt={item.product?.name || 'Product'}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.product?.name || 'Product'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => navigate(`/user/orders/${order._id}`)}
                  className="px-5 py-2 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774]"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32}/>
            </div>
            <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
            <p className="text-gray-500 text-sm mt-1">Place your first order to track status here.</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-6 px-6 py-2.5 bg-[#985991] text-white rounded-full text-sm font-bold hover:bg-[#7A4774] inline-flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              Start Shopping
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyOrders;