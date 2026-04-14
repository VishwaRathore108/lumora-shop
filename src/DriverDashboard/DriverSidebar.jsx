import React from 'react';
import { Home, Truck, LogOut, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import logoImg from '../assets/logo.png';
import { logout } from '../features/auth/authSlice';

const DriverSidebar = ({ isOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeSidebar}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 md:static md:translate-x-0 transition-transform duration-300 border-r border-gray-100 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2 min-w-0 shrink-0 no-underline text-inherit"
          >
            <img src={logoImg} alt="Lumora Driver" className="h-9 w-auto max-w-[140px] object-contain object-left" />
          </Link>
          <button onClick={closeSidebar} className="md:hidden text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Driver Dashboard', icon: Home, to: '/driver' },
            { id: 'orders', label: 'Driver Orders', icon: Truck, to: '/driver/orders' },
          ].map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.id === 'dashboard'}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${isActive ? 'bg-[#985991]/10 text-[#985991]' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default DriverSidebar;
