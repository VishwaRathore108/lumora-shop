import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  MoreHorizontal
} from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Mock Transaction Data
  const TRANSACTIONS = [
    { id: "TXN-8821", user: "Ananya Sharma", amount: "₹2,598", date: "Oct 24, 2024, 10:42 AM", method: "UPI", provider: "GPay", upiId: "ananya@oksbi", status: "Success" },
    { id: "TXN-8822", user: "Rahul Verma", amount: "₹799", date: "Oct 24, 2024, 09:15 AM", method: "Card", provider: "Visa", cardLast4: "4242", status: "Success" },
    { id: "TXN-8823", user: "Sneha Kapoor", amount: "₹1,499", date: "Oct 23, 2024, 04:30 PM", method: "PayPal", provider: "PayPal", email: "sneha@gmail.com", status: "Pending" },
    { id: "TXN-8824", user: "Priya Singh", amount: "₹1,099", date: "Oct 23, 2024, 02:20 PM", method: "UPI", provider: "PhonePe", upiId: "priya@ybl", status: "Failed" },
    { id: "TXN-8825", user: "Arjun Mehta", amount: "₹2,499", date: "Oct 22, 2024, 11:10 AM", method: "Card", provider: "Mastercard", cardLast4: "8890", status: "Refunded" },
  ];

  // Helper to render Payment Icon
  const getPaymentIcon = (method, provider) => {
    if (method === 'UPI') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <Smartphone size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700">{provider}</p>
            <p className="text-[10px] text-gray-400">UPI</p>
          </div>
        </div>
      );
    }
    if (method === 'PayPal') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <span className="font-bold text-xs italic">Pay</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700">PayPal</p>
            <p className="text-[10px] text-gray-400">Wallet</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-[#985991]">
          <CreditCard size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-700">{provider}</p>
          <p className="text-[10px] text-gray-400">Card</p>
        </div>
      </div>
    );
  };

  const filteredTxns = TRANSACTIONS.filter(t => 
    (activeTab === 'All' || t.status === activeTab) &&
    (t.user.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payments & Transactions</h2>
          <p className="text-gray-500 text-sm">Monitor revenue flow, refunds, and gateway status.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
            <RefreshCcw size={16} /> Sync Gateways
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#985991] text-white rounded-lg text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                 <ArrowUpRight size={12}/> +12%
              </span>
           </div>
           <p className="text-sm text-gray-500 font-medium">Total Balance</p>
           <h3 className="text-3xl font-bold text-gray-800">₹8,42,000</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><RefreshCcw size={24}/></div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                 4 Processing
              </span>
           </div>
           <p className="text-sm text-gray-500 font-medium">Pending Settlements</p>
           <h3 className="text-3xl font-bold text-gray-800">₹12,450</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-xl"><ArrowDownRight size={24}/></div>
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                 -2% this week
              </span>
           </div>
           <p className="text-sm text-gray-500 font-medium">Refunds Processed</p>
           <h3 className="text-3xl font-bold text-gray-800">₹4,200</h3>
        </div>
      </div>

      {/* --- TRANSACTION TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
            {['All', 'Success', 'Pending', 'Refunded', 'Failed'].map(status => (
               <button
                 key={status}
                 onClick={() => setActiveTab(status)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                   activeTab === status 
                   ? 'bg-[#985991] text-white border-[#985991]' 
                   : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                 }`}
               >
                 {status}
               </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search transaction ID..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991]"
             />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
               <tr>
                 <th className="p-4">Transaction Details</th>
                 <th className="p-4">User</th>
                 <th className="p-4">Method</th>
                 <th className="p-4">Amount</th>
                 <th className="p-4">Status</th>
                 <th className="p-4">Date</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredTxns.map((t) => (
                 <tr key={t.id} className="hover:bg-gray-50 group">
                    <td className="p-4">
                       <p className="font-bold text-gray-800">{t.id}</p>
                       <p className="text-xs text-gray-400">Web Checkout</p>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{t.user}</td>
                    <td className="p-4">
                       {getPaymentIcon(t.method, t.provider)}
                    </td>
                    <td className="p-4 font-bold text-gray-800">{t.amount}</td>
                    <td className="p-4">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          t.status === 'Success' ? 'bg-green-50 text-green-600 border-green-100' :
                          t.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          t.status === 'Refunded' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-red-50 text-red-600 border-red-100'
                       }`}>
                          {t.status}
                       </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">{t.date}</td>
                    <td className="p-4 text-right">
                       <button className="p-2 text-gray-400 hover:text-[#985991] hover:bg-purple-50 rounded-lg transition-colors">
                          <MoreHorizontal size={18}/>
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;