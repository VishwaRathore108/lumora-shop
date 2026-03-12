import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter, 
  RefreshCcw,
  MapPin,
  FileText
} from 'lucide-react';

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('Active'); // 'Active', 'Completed', 'Cancelled'

  // Mock Order Data
  const ORDERS = [
    {
      id: "ORD-7782",
      date: "Oct 24, 2024",
      total: "₹2,598",
      status: "In Transit",
      eta: "Arriving by Oct 26",
      items: [
        { name: "Radiance Serum", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100", qty: 1 },
        { name: "Velvet Lip Tint", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=100", qty: 2 }
      ],
      progress: 60, // For progress bar
      action: "Track Package"
    },
    {
      id: "ORD-7720",
      date: "Oct 10, 2024",
      total: "₹1,299",
      status: "Delivered",
      eta: "Delivered on Oct 12",
      items: [
        { name: "Rose Clay Mask", img: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=100", qty: 1 }
      ],
      progress: 100,
      action: "Write Review"
    },
    {
      id: "ORD-7650",
      date: "Sep 28, 2024",
      total: "₹3,450",
      status: "Delivered",
      eta: "Delivered on Oct 01",
      items: [
        { name: "Luxury Night Cream", img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=100", qty: 1 },
        { name: "Gold Eye Patch", img: "https://images.unsplash.com/photo-1571781535014-53bd94295ea8?auto=format&fit=crop&q=80&w=100", qty: 1 }
      ],
      progress: 100,
      action: "Reorder"
    }
  ];

  // Filter Logic
  const filteredOrders = ORDERS.filter(order => {
    if (activeTab === 'Active') return order.status === 'In Transit' || order.status === 'Processing';
    if (activeTab === 'Completed') return order.status === 'Delivered';
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
           <p className="text-gray-500 text-sm">Track your packages and view order history.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search by Order ID..." 
             className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#985991] shadow-sm" 
           />
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
        {['Active', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-bold rounded-t-xl transition-all relative ${
              activeTab === tab 
                ? "text-[#985991] bg-white border border-b-0 border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-white"></div>}
          </button>
        ))}
      </div>

      {/* --- ORDER LIST --- */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
               
               {/* 1. Top Bar: Info & Status */}
               <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-full ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {order.status === 'Delivered' ? <CheckCircle size={20}/> : <Truck size={20}/>}
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800 text-lg">{order.status}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                           <Clock size={12}/> {order.eta}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-gray-800">Order {order.id}</p>
                     <p className="text-xs text-gray-500">{order.date} • {order.total}</p>
                  </div>
               </div>

               {/* 2. Products Section */}
               <div className="p-6">
                  {/* Progress Bar (Only for Active) */}
                  {order.status !== 'Delivered' && (
                     <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                           <span className="text-[#985991]">Confirmed</span>
                           <span className={order.progress >= 50 ? "text-[#985991]" : ""}>Shipped</span>
                           <span className={order.progress >= 80 ? "text-[#985991]" : ""}>Out for Delivery</span>
                           <span>Delivered</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[#985991] rounded-full" style={{ width: `${order.progress}%` }}></div>
                        </div>
                     </div>
                  )}

                  {/* Items List */}
                  <div className="flex flex-col gap-4">
                     {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                              <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                           </div>
                           {/* Only show 'Buy Again' text on desktop */}
                           <button className="hidden md:block text-xs font-bold text-[#985991] hover:underline">
                              View Product
                           </button>
                        </div>
                     ))}
                  </div>
               </div>

               {/* 3. Footer: Actions */}
               <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors flex items-center gap-2">
                     <FileText size={16}/> Invoice
                  </button>
                  <button className="px-6 py-2 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-md shadow-purple-100 transition-transform active:scale-95 flex items-center gap-2">
                     {order.status === 'Delivered' ? <RefreshCcw size={16}/> : <MapPin size={16}/>}
                     {order.action}
                  </button>
               </div>

            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
             <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32}/>
             </div>
             <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
             <p className="text-gray-500 text-sm mt-1">Looks like you haven't placed any orders in this category yet.</p>
             <button className="mt-6 px-6 py-2.5 bg-[#985991] text-white rounded-full text-sm font-bold hover:bg-[#7A4774]">
                Start Shopping
             </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyOrders;