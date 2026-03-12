import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Copy, 
  Calendar, 
  Trash2, 
  Edit, 
  X,
  CheckCircle,
  Clock,
  Percent,
  DollarSign,
  ShoppingBag
} from 'lucide-react';

const Coupons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Mock Data
  const COUPONS = [
    { 
      id: 1, 
      code: "WELCOME50", 
      discount: "50% OFF", 
      desc: "New user sign up bonus", 
      expiry: "Dec 31, 2025", 
      used: 1240, 
      limit: 5000, 
      status: "Active", 
      type: "percentage",
      color: "bg-purple-50 text-[#985991] border-purple-200"
    },
    { 
      id: 2, 
      code: "GLOWUP20", 
      discount: "20% OFF", 
      desc: "Min. order value ₹1499", 
      expiry: "Oct 15, 2025", 
      used: 450, 
      limit: 1000, 
      status: "Active", 
      type: "percentage",
      color: "bg-pink-50 text-pink-600 border-pink-200"
    },
    { 
      id: 3, 
      code: "FREESHIP", 
      discount: "Free Shipping", 
      desc: "Applicable on all orders", 
      expiry: "Nov 01, 2025", 
      used: 890, 
      limit: 2000, 
      status: "Active", 
      type: "fixed",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    { 
      id: 4, 
      code: "SUMMER10", 
      discount: "10% OFF", 
      desc: "Summer sale special", 
      expiry: "Aug 30, 2024", 
      used: 5000, 
      limit: 5000, 
      status: "Expired", 
      type: "percentage",
      color: "bg-gray-50 text-gray-500 border-gray-200"
    },
  ];

  // Filter Logic
  const filteredCoupons = COUPONS.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy Function
  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Coupons & Offers</h2>
          <p className="text-gray-500 text-sm">Create and manage promo codes for marketing.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Ticket size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Active Coupons</p>
              <h3 className="text-2xl font-bold text-gray-800">03</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-purple-50 text-[#985991] rounded-xl"><ShoppingBag size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Total Redemptions</p>
              <h3 className="text-2xl font-bold text-gray-800">2,580</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Discount Given</p>
              <h3 className="text-2xl font-bold text-gray-800">₹4.2 Lakh</h3>
           </div>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by coupon code..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#985991] shadow-sm"
        />
      </div>

      {/* --- COUPON TICKETS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            
            {/* Top Section: Visual Ticket Header */}
            <div className={`p-5 border-b border-dashed ${coupon.color} bg-opacity-30 relative`}>
               {/* Left/Right Circle Cutouts for Ticket Effect */}
               <div className="absolute -left-2 bottom-[-10px] w-4 h-4 rounded-full bg-gray-50"></div>
               <div className="absolute -right-2 bottom-[-10px] w-4 h-4 rounded-full bg-gray-50"></div>

               <div className="flex justify-between items-start">
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-bold tracking-wider shadow-sm border border-white/50">
                    {coupon.code}
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                     coupon.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-gray-600 border-gray-300'
                  }`}>
                    {coupon.status}
                  </div>
               </div>
               <div className="mt-4">
                  <h3 className="text-3xl font-bold">{coupon.discount}</h3>
                  <p className="text-xs opacity-80 mt-1">{coupon.desc}</p>
               </div>
            </div>

            {/* Bottom Section: Details */}
            <div className="p-5 bg-white">
               
               <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={14}/> Expires:</span>
                  <span className="font-medium text-gray-700">{coupon.expiry}</span>
               </div>

               {/* Usage Progress Bar */}
               <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                     <span className="text-gray-500">Redeemed</span>
                     <span className="font-bold text-gray-700">{coupon.used} / {coupon.limit}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                     <div 
                       className={`h-full rounded-full ${coupon.status === 'Active' ? 'bg-[#985991]' : 'bg-gray-400'}`} 
                       style={{ width: `${(coupon.used / coupon.limit) * 100}%` }}
                     ></div>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => handleCopy(coupon.code, coupon.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-[#985991] hover:text-white rounded-lg transition-colors"
                  >
                    {copiedId === coupon.id ? <CheckCircle size={16}/> : <Copy size={16}/>}
                    {copiedId === coupon.id ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#985991] hover:bg-purple-50 rounded-lg">
                     <Edit size={18}/>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                     <Trash2 size={18}/>
                  </button>
               </div>
            </div>

          </div>
        ))}
      </div>

      {/* --- CREATE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">Create New Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
               
               {/* Code Generation */}
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                 <div className="flex gap-2">
                    <input type="text" placeholder="e.g. SUMMER25" className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none uppercase font-bold" />
                    <button className="px-3 py-2 text-xs bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200">Generate</button>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Type</label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none appearance-none bg-white">
                        <option>Percentage (%)</option>
                        <option>Fixed Amount (₹)</option>
                        <option>Free Shipping</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                    <input type="number" placeholder="20" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
                  </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                 <input type="text" placeholder="e.g. Valid for orders above ₹1500" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                    <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usage Limit</label>
                    <input type="number" placeholder="1000" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
                  </div>
               </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-[#985991] text-white text-sm font-medium rounded-lg hover:bg-[#7A4774] shadow-md shadow-purple-100">
                 Publish Coupon
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Coupons;