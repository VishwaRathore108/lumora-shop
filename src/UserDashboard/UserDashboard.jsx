import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserSidebar from './UserSidebar';
import { Menu, Bell, Search, ShoppingBag } from 'lucide-react';
import { selectUser } from '../features/auth/authSlice';

const UserDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector(selectUser);
  const displayName = user?.name && user.name.trim().length > 0 ? user.name : 'Beauty Lover';

  // Derive current section from URL for header title/search behavior
  const pathParts = location.pathname.split('/').filter(Boolean);
  let currentSection = 'overview';
  const userIndex = pathParts.indexOf('user');
  if (userIndex !== -1 && pathParts[userIndex + 1]) {
    currentSection = pathParts[userIndex + 1];
  }

  const formatTitle = (slug) => {
    if (slug === 'profile') return 'Account Settings';
    if (!slug || slug === 'overview') return 'Overview';
    return slug.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FDF9FB] to-[#F4ECF8] font-sans overflow-hidden">

      {/* 1. Sidebar */}
      <UserSidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-pink-100 flex items-center justify-between px-4 md:px-8 lg:px-10 sticky top-0 z-20 shadow-sm">

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <Menu size={24} />
            </button>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-pink-400 hidden md:block">
                Lumora Beauty Club
              </p>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {formatTitle(currentSection)}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search (Optional - Hidden on Profile page) */}
            {currentSection !== 'profile' && (
              <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100 w-64">
                <Search size={16} className="text-gray-400" />
                <input type="text" placeholder="Search orders..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" />
              </div>
            )}

            {/* Notification */}
            <button className="relative p-2 text-gray-400 hover:text-[#985991] hover:bg-pink-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* User pill */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#985991] to-[#B87AB2] text-white flex items-center justify-center text-xs font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 max-w-[8rem] truncate">
                  {displayName}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body (nested user routes render here) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default UserDashboard;