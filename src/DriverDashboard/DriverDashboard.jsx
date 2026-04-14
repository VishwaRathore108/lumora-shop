import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DriverSidebar from './DriverSidebar';
import DashboardHeader from '../AdminDashboard/DashboardHeader';

const DriverDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];
  const currentSection = !lastSegment || lastSegment === 'driver' ? 'dashboard' : lastSegment;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DriverSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader title={currentSection.replace(/-/g, ' ')} toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
