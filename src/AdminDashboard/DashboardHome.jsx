import React from 'react';
import { 
  TrendingUp, 
  Package, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight,
  Calendar,
  MoreHorizontal,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const DashboardHome = () => {
  
  // --- 1. TOP STATS DATA ---
  const stats = [
    { label: "Total Revenue", value: "₹8,42,000", change: "+12.5%", icon: TrendingUp, color: "bg-purple-50 text-[#985991]", trend: "up" },
    { label: "Total Orders", value: "1,205", change: "+18%", icon: Package, color: "bg-blue-50 text-blue-600", trend: "up" },
    { label: "Delivered", value: "1,180", change: "98% rate", icon: CheckCircle, color: "bg-green-50 text-green-600", trend: "neutral" },
    { label: "Cancelled", value: "24", change: "-2%", icon: XCircle, color: "bg-red-50 text-red-500", trend: "down" },
  ];

  // --- 2. CHART DATA: Revenue Overview (Area Chart) ---
  const revenueData = [
    { name: 'Jan', current: 4000, previous: 2400 },
    { name: 'Feb', current: 3000, previous: 1398 },
    { name: 'Mar', current: 2000, previous: 9800 },
    { name: 'Apr', current: 2780, previous: 3908 },
    { name: 'May', current: 1890, previous: 4800 },
    { name: 'Jun', current: 2390, previous: 3800 },
    { name: 'Jul', current: 3490, previous: 4300 },
    { name: 'Aug', current: 4200, previous: 3100 },
    { name: 'Sep', current: 5100, previous: 4600 },
  ];

  // --- 3. CHART DATA: Sales by Category (Pie Chart) ---
  const categoryData = [
    { name: 'Skincare', value: 55 },
    { name: 'Makeup', value: 30 },
    { name: 'Haircare', value: 15 },
  ];
  const COLORS = ['#985991', '#DCC9DA', '#A86BA1']; // Burgundy theme

  // Custom Tooltip for Area Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">{label}</p>
          <p className="text-sm text-[#985991] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#985991]"></span>
            Current: ₹{payload[0].value}
          </p>
          <p className="text-sm text-cyan-500 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
            Previous: ₹{payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm">Welcome back, Admin! Here's today's update.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Calendar size={16} /> This Month
        </button>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-green-50 text-green-600' : 
                stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={12} className="ml-1" /> : stat.trend === 'down' ? <ArrowDownRight size={12} className="ml-1" /> : null}
              </span>
            </div>
            <div>
               <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
               <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
        
        {/* 1. MAIN AREA CHART (Revenue) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="font-bold text-gray-800 text-lg">Revenue Report</h3>
               <p className="text-sm text-gray-400">Comparison vs last period</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#985991" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#985991" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dx={-10} tickFormatter={(value) => `₹${value}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#985991', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="current" stroke="#985991" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="previous" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPrev)" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. DOUGHNUT CHART (Category Sales) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 text-lg">Sales by Category</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-gray-800">85%</span>
               <span className="text-xs text-gray-500 uppercase tracking-wider">Skincare Lead</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="mt-4 space-y-3">
            {categoryData.map((item, index) => (
               <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                     <span className="text-gray-600">{item.name}</span>
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

export default DashboardHome;