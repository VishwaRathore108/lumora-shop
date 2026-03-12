import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../AdminDashboard/AdminSidebar';
import DashboardHeader from '../AdminDashboard/DashboardHeader';
import { selectUser } from '../features/auth/authSlice';
import logoImg from '../assets/logo.png';

const AdminDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector(selectUser);
  const headerUser = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    image: user?.profileImage || logoImg,
  };

  // Derive the current admin section from the URL for header title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];
  const currentSection =
    !lastSegment || lastSegment === 'admin' ? 'dashboard' : lastSegment;

  const formatTitle = (slug) =>
    slug
      .replace('-', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* 1. SIDEBAR */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* 2. MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* HEADER */}
        <DashboardHeader
          title={formatTitle(currentSection)}
          user={headerUser}
          toggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* 3. SCROLLABLE CONTENT (nested routes render here) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;