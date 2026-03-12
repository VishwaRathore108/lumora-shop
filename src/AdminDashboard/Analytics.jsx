import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Mock Product Images
import serumImg from '../assets/serum.jpg';
import lipImg from '../assets/glowlip.jpg';
import sunImg from '../assets/sunscreen.jpg';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // --- 1. KPI DATA ---
  const kpiData = [
    { title: "Total Sessions", value: "45.2k", change: "+12%", icon: Users, color: "bg-blue-50 text-blue-600", trend: "up" },
    { title: "Avg. Order Value", value: "₹1,850", change: "+5.4%", icon: CreditCard, color: "bg-purple-50 text-[#985991]", trend: "up" },
    { title: "Conversion Rate", value: "3.2%", change: "-0.8%", icon: TrendingUp, color: "bg-orange-50 text-orange-600", trend: "down" },
  ];

  // --- 2. CHART DATA: Sessions Trend (Line Chart) ---
  const sessionsData = [
    { date: '01 Sep', sessions: 1200 }, { date: '05 Sep', sessions: 1500 },
    { date: '10 Sep', sessions: 1100 }, { date: '15 Sep', sessions: 1800 },
    { date: '20 Sep', sessions: 2100 }, { date: '25 Sep', sessions: 1700 },
    { date: '30 Sep', sessions: 2400 },
  ];

  // --- 3. CHART DATA: Conversion Funnel (Bar Chart) ---
  const funnelData = [
    { stage: 'Sessions', users: 45200 },
    { stage: 'Added to Cart', users: 8500 },
    { stage: 'Reached Checkout', users: 4200 },
    { stage: 'Purchased', users: 1450 },
  ];

  // --- 4. CHART DATA: Sales by Channel (Pie Chart) ---
  const channelData = [
    { name: 'Social Media (IG/FB)', value: 45 },
    { name: 'Direct Traffic', value: 25 },
    { name: 'Email Marketing', value: 20 },
    { name: 'Organic Search', value: 10 },
  ];
  const COLORS = ['#985991', '#F472B6', '#C084FC', '#A855F7'];

  // --- 5. TABLE DATA: Top Products ---
  const topProducts = [
    { id: 1, name: "Radiance Serum (30ml)", category: "Skincare", sold: 1240, revenue: "₹16,10,760", stock: "In Stock", img: serumImg },
    { id: 2, name: "Velvet Glow Lip - Red", category: "Makeup", sold: 980, revenue: "₹7,83,020", stock: "Low Stock", img: lipImg },
    { id: 3, name: "Sunscreen Gel SPF 50", category: "Skincare", sold: 850, revenue: "₹8,49,150", stock: "In Stock", img: sunImg },
    { id: 4, name: "Night Repair Oil", category: "Skincare", sold: 620, revenue: "₹9,29,380", stock: "In Stock", img: serumImg },
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-lg">
          <p className="text-sm font-bold text-gray-700">{label}</p>
          <p className="text-sm text-[#985991] font-medium">
            {payload[0].value.toLocaleString()} {payload[0].dataKey === 'sessions' ? 'Visitors' : 'Users'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
          <p className="text-gray-500 text-sm">Deep dive into your store's performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Calendar size={16} /> {dateRange} <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#985991] text-white rounded-lg text-sm font-medium hover:bg-[#7A4774] shadow-md shadow-purple-100">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* --- 1. KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-gray-500 text-sm font-medium mb-1">{kpi.title}</p>
               <h3 className="text-3xl font-bold text-gray-800">{kpi.value}</h3>
               <span className={`text-xs flex items-center gap-1 mt-2 font-medium ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {kpi.change} vs last period
               </span>
            </div>
            <div className={`p-4 rounded-full ${kpi.color}`}><kpi.icon size={24}/></div>
          </div>
        ))}
      </div>

      {/* --- 2. CHARTS ROW 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sessions Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Online Store Sessions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessionsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#985991', strokeWidth: 1, strokeDasharray: '3 3'}} />
                <Line type="monotone" dataKey="sessions" stroke="#985991" strokeWidth={3} dot={{r: 4, fill: '#985991', strokeWidth: 2, stroke: 'white'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Conversion Funnel</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(v) => `${v/1000}k`} />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 500}} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f9fafb'}} />
                <Bar dataKey="users" fill="#985991" radius={[0, 6, 6, 0]} barSize={40}>
                   {funnelData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.15)} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* --- 3. DETAILED TABLES & BREAKDOWNS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Products Table (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Top Performing Products</h3>
            <button className="text-sm text-[#985991] font-medium hover:underline">View Full Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Units Sold</th>
                  <th className="p-4 font-semibold">Revenue</th>
                  <th className="p-4 font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">{p.category}</td>
                    <td className="p-4 font-medium">{p.sold.toLocaleString()}</td>
                    <td className="p-4 font-bold text-[#985991]">{p.revenue}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium ${p.stock === 'Low Stock' ? 'text-red-500' : 'text-green-500'}`}>
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales by Channel Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Sales by Channel</h3>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} itemStyle={{color: '#374151', fontWeight: 'bold'}} formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <Users size={24} className="text-gray-400 mb-1" />
               <span className="text-xs text-gray-500 font-medium">Sources</span>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-3">
            {channelData.map((item, index) => (
               <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                     <span className="text-gray-600 truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">{item.value}%</span>
               </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;