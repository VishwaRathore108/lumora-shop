import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Printer, 
  TrendingUp, 
  PieChart as PieIcon,
  Share2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const Reports = () => {
  
  // Mock Data for Charts
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const inventoryData = [
    { name: 'Skin', stock: 120 },
    { name: 'Makeup', stock: 80 },
    { name: 'Hair', stock: 45 },
    { name: 'Body', stock: 30 },
  ];

  // Mock File List
  const RECENT_REPORTS = [
    { name: "October_Sales_Report.pdf", type: "PDF", size: "2.4 MB", date: "Oct 25, 2024", icon: FileText, color: "text-red-500 bg-red-50" },
    { name: "Q3_Financial_Summary.xlsx", type: "Excel", size: "1.8 MB", date: "Oct 01, 2024", icon: FileSpreadsheet, color: "text-green-600 bg-green-50" },
    { name: "Inventory_Audit_Log.csv", type: "CSV", size: "850 KB", date: "Oct 20, 2024", icon: FileText, color: "text-blue-500 bg-blue-50" },
    { name: "Customer_Growth_Analysis.pdf", type: "PDF", size: "3.2 MB", date: "Sep 30, 2024", icon: FileText, color: "text-red-500 bg-red-50" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Reports</h2>
          <p className="text-gray-500 text-sm">Analyze performance and download statements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600">
             <Calendar size={16}/>
             <span>Oct 1, 2024 - Oct 25, 2024</span>
          </div>
          <button className="bg-[#985991] text-white p-2.5 rounded-lg hover:bg-[#7A4774] shadow-md shadow-purple-100">
             <Printer size={18} />
          </button>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <TrendingUp size={18} className="text-[#985991]"/> Sales Performance
              </h3>
              <select className="text-xs border-none bg-gray-50 rounded px-2 py-1 outline-none text-gray-600 cursor-pointer">
                 <option>This Week</option>
                 <option>Last Month</option>
              </select>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={salesData}>
                    <defs>
                       <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#985991" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#985991" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                    <Area type="monotone" dataKey="sales" stroke="#985991" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Inventory Report Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <PieIcon size={18} className="text-blue-500"/> Stock Distribution
              </h3>
              <button className="text-xs text-blue-500 font-medium hover:underline">View Details</button>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10}/>
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                    <Bar dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>

      {/* --- DOWNLOAD CENTER --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
               <h3 className="font-bold text-gray-800">Generated Reports</h3>
               <p className="text-xs text-gray-500">Download history of your requested reports.</p>
            </div>
            <button className="text-sm text-[#985991] font-medium hover:underline">View All History</button>
         </div>
         
         <div className="divide-y divide-gray-50">
            {RECENT_REPORTS.map((file, index) => (
               <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg ${file.color} flex items-center justify-center`}>
                        <file.icon size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#985991] transition-colors">{file.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                           <span>{file.date}</span>
                           <span>•</span>
                           <span>{file.size}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors" title="Share">
                        <Share2 size={16}/>
                     </button>
                     <button className="p-2 text-gray-400 hover:text-[#985991] hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100" title="Download">
                        <Download size={18}/>
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default Reports;