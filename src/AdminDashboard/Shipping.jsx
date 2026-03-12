import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  Search, 
  Filter, 
  Printer, 
  ExternalLink, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Box,
  ArrowRight
} from 'lucide-react';

const Shipping = () => {
  const [activeTab, setActiveTab] = useState('In Transit');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Shipping Data
  const SHIPMENTS = [
    { 
      id: "SHP-8821", 
      orderId: "#ORD-7782", 
      customer: "Ananya Sharma", 
      destination: "Mumbai, MH", 
      carrier: "BlueDart", 
      tracking: "BD123456789", 
      status: "In Transit", 
      progress: 60, 
      eta: "Oct 26, 2024",
      cost: "₹120"
    },
    { 
      id: "SHP-8822", 
      orderId: "#ORD-7783", 
      customer: "Rahul Verma", 
      destination: "Delhi, DL", 
      carrier: "Delhivery", 
      tracking: "DL987654321", 
      status: "Out for Delivery", 
      progress: 85, 
      eta: "Today",
      cost: "₹80"
    },
    { 
      id: "SHP-8823", 
      orderId: "#ORD-7784", 
      customer: "Sneha Kapoor", 
      destination: "Bangalore, KA", 
      carrier: "FedEx", 
      tracking: "FX445566778", 
      status: "Delivered", 
      progress: 100, 
      eta: "Delivered",
      cost: "₹150"
    },
    { 
      id: "SHP-8824", 
      orderId: "#ORD-7785", 
      customer: "Priya Singh", 
      destination: "Pune, MH", 
      carrier: "BlueDart", 
      tracking: "BD998877665", 
      status: "Exception", 
      progress: 40, 
      eta: "Delayed",
      cost: "₹120"
    },
  ];

  const filteredShipments = SHIPMENTS.filter(s => 
    (activeTab === 'All' || s.status === activeTab || (activeTab === 'In Transit' && (s.status === 'In Transit' || s.status === 'Out for Delivery'))) &&
    (s.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || s.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Shipping & Logistics</h2>
          <p className="text-gray-500 text-sm">Track shipments and manage courier partners.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95">
          <Printer size={18} /> Print Manifest
        </button>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Truck size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">In Transit</p>
              <h3 className="text-2xl font-bold text-gray-800">42</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Clock size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Pending Pickup</p>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Delivered (Wk)</p>
              <h3 className="text-2xl font-bold text-gray-800">185</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-red-50 text-red-500 rounded-xl"><AlertTriangle size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Exceptions</p>
              <h3 className="text-2xl font-bold text-gray-800">03</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: SHIPMENT TABLE (Wider) --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
           
           {/* Tabs & Search */}
           <div className="p-5 border-b border-gray-100 space-y-4">
              <div className="flex gap-4 border-b border-gray-100">
                {['In Transit', 'Pending', 'Delivered', 'Exception', 'All'].map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-[#985991] text-[#985991]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                   >
                     {tab}
                   </button>
                ))}
              </div>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search by Order ID, Customer..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991]"
                 />
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                    <tr>
                       <th className="p-4">Shipment Details</th>
                       <th className="p-4">Carrier</th>
                       <th className="p-4">Status & ETA</th>
                       <th className="p-4 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredShipments.map((ship) => (
                       <tr key={ship.id} className="hover:bg-gray-50 group">
                          <td className="p-4">
                             <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 text-[#985991] rounded-lg"><Box size={20}/></div>
                                <div>
                                   <p className="font-bold text-gray-800">{ship.orderId}</p>
                                   <p className="text-xs text-gray-500">{ship.customer}</p>
                                   <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {ship.destination}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-4">
                             <p className="font-medium text-gray-700">{ship.carrier}</p>
                             <p className="text-xs text-[#985991] font-mono cursor-pointer hover:underline" title="Click to track">{ship.tracking}</p>
                          </td>
                          <td className="p-4 min-w-[150px]">
                             <div className="flex justify-between text-xs mb-1">
                                <span className={`font-bold ${ship.status === 'Exception' ? 'text-red-500' : ship.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>{ship.status}</span>
                                <span className="text-gray-500">{ship.eta}</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${ship.status === 'Exception' ? 'bg-red-500' : ship.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'}`} 
                                  style={{width: `${ship.progress}%`}}
                                ></div>
                             </div>
                          </td>
                          <td className="p-4 text-right">
                             <button className="p-2 text-gray-400 hover:text-[#985991] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                                <ExternalLink size={16}/>
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* --- RIGHT: SIDEBAR INFO --- */}
        <div className="space-y-6">
           
           {/* Shipping Calculator */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Truck size={18} className="text-[#985991]"/> Rate Calculator
              </h3>
              <div className="space-y-3">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode (From)</label>
                    <input type="text" defaultValue="460001" className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 text-gray-500" disabled/>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode (To)</label>
                    <input type="text" placeholder="e.g. 400001" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-[#985991] outline-none"/>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Weight (kg)</label>
                    <input type="number" placeholder="0.5" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-[#985991] outline-none"/>
                 </div>
                 <button className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-black mt-2">
                    Check Rates
                 </button>
              </div>
           </div>

           {/* Carrier Performance */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Carrier Performance</h3>
              <div className="space-y-4">
                 {[
                    { name: "BlueDart", rating: "4.8", color: "bg-blue-600", speed: "Fast" },
                    { name: "Delhivery", rating: "4.5", color: "bg-red-500", speed: "Avg" },
                    { name: "FedEx", rating: "4.9", color: "bg-purple-600", speed: "Fast" }
                 ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${c.color} text-white flex items-center justify-center text-xs font-bold`}>
                             {c.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{c.name}</p>
                             <p className="text-xs text-gray-500">{c.rating} ★ Rating</p>
                          </div>
                       </div>
                       <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{c.speed}</span>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default Shipping;