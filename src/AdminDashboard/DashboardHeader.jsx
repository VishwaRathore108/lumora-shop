import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  MoreVertical, 
  LogOut, 
  User, 
  Settings 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const DashboardHeader = ({ title, user, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      
      {/* --- LEFT SIDE: Mobile Menu & Page Title --- */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 capitalize tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-gray-400 hidden md:block">
            {new Date().toDateString()}
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Actions & Profile --- */}
      <div className="flex items-center gap-6">
        
        {/* 1. Global Search (Optional but Professional) */}
        <div className="hidden md:flex items-center bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 focus-within:border-[#985991] focus-within:ring-2 focus-within:ring-purple-100 transition-all w-64">
           <Search size={16} className="text-gray-400" />
           <input 
             type="text" 
             placeholder="Search..." 
             className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder:text-gray-400"
           />
        </div>

        {/* 2. Notification Bell with Badge */}
        <button className="relative p-2 text-gray-400 hover:text-[#985991] hover:bg-purple-50 rounded-full transition-colors">
          <Bell size={22} />
          {/* Pulse Animation Badge */}
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
        </button>

        {/* 3. Divider */}
        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

        {/* 4. User Profile Section (Clickable) */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
          >
            {/* User Image */}
            <img 
              src={user.image} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
            
            {/* Name & Email (Hidden on Mobile) */}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-gray-800 leading-none">{user.name}</span>
              <span className="text-[11px] text-gray-500 leading-none mt-1">{user.email}</span>
            </div>

            {/* Three Dots Icon */}
            <MoreVertical size={18} className="text-gray-400" />
          </button>

          {/* --- DROPDOWN MENU --- */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              
              {/* Dropdown Header */}
              <div className="px-4 py-3 border-b border-gray-100 mb-2">
                <p className="text-sm font-bold text-gray-800">Signed in as</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              {/* Menu Items */}
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 hover:text-[#985991] flex items-center gap-2">
                <User size={16} /> My Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 hover:text-[#985991] flex items-center gap-2">
                <Settings size={16} /> Account Settings
              </button>
              
              <div className="my-2 border-t border-gray-100"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;