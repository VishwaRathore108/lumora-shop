import React, { useState } from 'react';
// Lucide icons import kar rahe hain (Make sure npm install lucide-react kiya ho)
import { LayoutDashboard, Users, Bot, BarChart3, Settings, LogOut, Zap } from 'lucide-react';

const Sidebar = () => {
  const [active, setActive] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'All Leads', icon: Users },
    { name: 'AI Agents', icon: Bot, highlight: true }, // AI Feature Highlighted
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      
      {/* 1. Logo Section */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Zap className="text-white w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">LeadCore</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">AI CRM Suite</p>
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${active === item.name 
                ? 'bg-brand-primary text-white shadow-lg shadow-indigo-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <item.icon 
              size={20} 
              className={`transition-colors ${item.highlight && active !== item.name ? 'text-brand-accent' : ''}`} 
            />
            <span className="font-medium">{item.name}</span>
            
            {/* AI Badge */}
            {item.highlight && (
              <span className="ml-auto text-[10px] font-bold bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full border border-brand-accent/20">
                NEW
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* 3. User Profile / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
          <LogOut size={18} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;