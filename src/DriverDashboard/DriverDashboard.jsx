import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DriverSidebar from './DriverSidebar';
import DashboardHeader from '../AdminDashboard/DashboardHeader';
import { selectUser } from '../features/auth/authSlice';
import logoImg from '../assets/logo.png';

const DriverDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const user = useSelector(selectUser);
  const headerUser = {
    name: user?.name || 'Driver',
    email: user?.email || '',
    image: user?.profileImage || logoImg,
  };

  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];
  const currentSection = !lastSegment || lastSegment === 'driver' ? 'dashboard' : lastSegment;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DriverSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader title={currentSection.replace(/-/g, ' ')} user={headerUser} toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
