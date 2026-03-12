import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  MoreHorizontal, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  Truck
} from 'lucide-react';

// Mock Data for Cosmetic Orders
const MOCK_ORDERS = [
  { id: "#ORD-7782", customer: "Wonder woman", items: "Radiance Serum (x2)", date: "Oct 24, 2024", amount: "₹2,598", payment: "Paid", status: "New", img: "https://i.pravatar.cc/150?u=1" },
  { id: "#ORD-7783", customer: "Rahul gandhi", items: "Velvet Glow Lip - Red", date: "Oct 23, 2024", amount: "₹799", payment: "Pending", status: "Shipped", img: "https://i.pravatar.cc/150?u=2" },
  { id: "#ORD-7784", customer: "Sneha Kapoor", items: "Sunscreen Gel SPF 50", date: "Oct 22, 2024", amount: "₹999", payment: "Paid", status: "Delivered", img: "https://i.pravatar.cc/150?u=3" },
  { id: "#ORD-7785", customer: "Priya Singh", items: "Hydra Moisturizer", date: "Oct 21, 2024", amount: "₹1,099", payment: "Failed", status: "Cancelled", img: "https://i.pravatar.cc/150?u=4" },
  { id: "#ORD-7786", customer: "Arjun Mehta", items: "Night Repair Oil", date: "Oct 20, 2024", amount: "₹1,499", payment: "Paid", status: "Delivered", img: "https://i.pravatar.cc/150?u=5" },
  { id: "#ORD-7787", customer: "Vikram Malhotra", items: "Biofine Botox Kit", date: "Oct 24, 2024", amount: "₹2,499", payment: "Paid", status: "New", img: "https://i.pravatar.cc/150?u=6" },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  // --- 1. FILTER LOGIC ---
  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeStatus === 'All' || order.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  // --- 2. DYNAMIC TABS (Counts orders automatically) ---
  const tabs = [
    { name: "All", count: MOCK_ORDERS.length },
    { name: "New", count: MOCK_ORDERS.filter(o => o.status === "New").length },
    { name: "Shipped", count: MOCK_ORDERS.filter(o => o.status === "Shipped").length },
    { name: "Delivered", count: MOCK_ORDERS.filter(o => o.status === "Delivered").length },
    { name: "Cancelled", count: MOCK_ORDERS.filter(o => o.status === "Cancelled").length },
  ];

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch(status) {
      case "New": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Shipped": return "bg-purple-50 text-purple-600 border-purple-100";
      case "Delivered": return "bg-green-50 text-green-600 border-green-100";
      case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-gray-500 text-sm">Manage and track your customer orders.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#985991] text-white rounded-lg text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100">
            <Plus size={16} /> Create Order
          </button>
        </div>
      </div>

      {/* --- TABS (Based on Reference Image) --- */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex space-x-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveStatus(tab.name)}
              className={`pb-4 text-sm font-medium relative transition-colors ${
                activeStatus === tab.name 
                  ? "text-[#985991]" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name} 
              <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${
                activeStatus === tab.name ? "bg-purple-100 text-[#985991]" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
              {activeStatus === tab.name && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#985991] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- TOOLBAR --- */}
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
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
             <Calendar size={16} /> Date Range
           </button>
           <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
             <Filter size={16} /> More Filters
           </button>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="p-4 font-semibold"><input type="checkbox" className="rounded text-[#985991] focus:ring-[#985991]" /></th>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product Info</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4"><input type="checkbox" className="rounded text-[#985991] focus:ring-[#985991]" /></td>
                    <td className="p-4 font-bold text-gray-800">{order.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={order.img} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                        <span className="font-medium text-gray-700">{order.customer}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate" title={order.items}>
                      {order.items}
                    </td>
                    <td className="p-4 text-gray-500 flex items-center gap-2">
                       <Calendar size={14} /> {order.date}
                    </td>
                    <td className="p-4 font-bold text-gray-800">{order.amount}</td>
                    <td className="p-4">
                       <span className={`text-xs font-bold ${order.payment === "Paid" ? "text-green-600" : "text-orange-500"}`}>
                         {order.payment}
                       </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-[#985991] rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <p>Showing 1-10 of 209 orders</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Orders;