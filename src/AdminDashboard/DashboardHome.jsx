import React, { useEffect, useMemo, useState } from 'react';
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
  PieChart, Pie, Cell
} from 'recharts';
import AdminWishlistInsights from './AdminWishlistInsights';
import { getDashboardStats } from '../services/adminService';

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDashboardStats();
        if (!mounted) return;
        setDashboardData(data);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || 'Failed to load dashboard stats.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const metrics = dashboardData?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  };

  const deliveryRate = metrics.totalOrders > 0
    ? `${Math.round((metrics.deliveredOrders / metrics.totalOrders) * 100)}% rate`
    : '0% rate';

  const cancelRate = metrics.totalOrders > 0
    ? `${Math.round((metrics.cancelledOrders / metrics.totalOrders) * 100)}%`
    : '0%';

  // --- 1. TOP STATS DATA ---
  const stats = [
    { label: "Total Revenue", value: formatCurrency(metrics.totalRevenue), change: "Delivered/Paid", icon: TrendingUp, color: "bg-purple-50 text-[#985991]", trend: "up" },
    { label: "Total Orders", value: Number(metrics.totalOrders || 0).toLocaleString('en-IN'), change: "All orders", icon: Package, color: "bg-blue-50 text-blue-600", trend: "up" },
    { label: "Delivered", value: Number(metrics.deliveredOrders || 0).toLocaleString('en-IN'), change: deliveryRate, icon: CheckCircle, color: "bg-green-50 text-green-600", trend: "neutral" },
    { label: "Cancelled", value: Number(metrics.cancelledOrders || 0).toLocaleString('en-IN'), change: cancelRate, icon: XCircle, color: "bg-red-50 text-red-500", trend: "down" },
  ];

  // --- 2. CHART DATA: Revenue Overview (Area Chart) ---
  const revenueData = useMemo(
    () => (dashboardData?.revenueByMonth || []).map((item) => ({ month: item.month, revenue: Number(item.revenue || 0) })),
    [dashboardData]
  );

  // --- 3. CHART DATA: Sales by Category (Pie Chart) ---
  const categoryData = useMemo(
    () => (dashboardData?.salesByCategory || []).map((item) => ({ name: item.name, value: Number(item.value || 0) })),
    [dashboardData]
  );
  const COLORS = ['#985991', '#DCC9DA', '#A86BA1']; // Burgundy theme

  const totalCategorySales = categoryData.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const leadingCategory = categoryData[0] || null;
  const leadingCategoryPct = totalCategorySales > 0 && leadingCategory
    ? Math.round((leadingCategory.value / totalCategorySales) * 100)
    : 0;

  // Custom Tooltip for Area Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">{label}</p>
          <p className="text-sm text-[#985991] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#985991]"></span>
            Revenue: {formatCurrency(payload[0].value)}
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
        {(loading ? Array.from({ length: 4 }) : stats).map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              {loading ? (
                <>
                  <div className="p-3 rounded-xl bg-gray-100 w-[46px] h-[46px] animate-pulse" />
                  <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
            <div>
              {loading ? (
                <>
                  <div className="h-8 w-36 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                </>
              )}
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
          {loading ? (
            <div className="flex-1 w-full rounded-xl bg-gray-100 animate-pulse" />
          ) : (
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#985991" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#985991" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dx={-10} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#985991', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="revenue" stroke="#985991" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          )}
        </div>

        {/* 2. DOUGHNUT CHART (Category Sales) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 text-lg">Sales by Category</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
          </div>

          {loading ? (
            <div className="flex-1 rounded-xl bg-gray-100 animate-pulse" />
          ) : (
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
                  formatter={(value, name) => {
                    const num = Number(value || 0);
                    const pct = totalCategorySales > 0 ? Math.round((num / totalCategorySales) * 100) : 0;
                    return [`${num} (${pct}%)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-gray-800">{leadingCategoryPct}%</span>
               <span className="text-xs text-gray-500 uppercase tracking-wider">
                 {leadingCategory ? `${leadingCategory.name} Lead` : 'No Data'}
               </span>
            </div>
          </div>
          )}

          {/* Custom Legend */}
          <div className="mt-4 space-y-3">
            {categoryData.map((item, index) => (
               <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                     <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {totalCategorySales > 0 ? `${Math.round((item.value / totalCategorySales) * 100)}%` : '0%'}
                  </span>
               </div>
            ))}
            {!loading && categoryData.length === 0 ? (
              <p className="text-sm text-gray-400">No category sales data available yet.</p>
            ) : null}
          </div>
        </div>

      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      ) : null}

      <AdminWishlistInsights />
    </div>
  );
};

export default DashboardHome;