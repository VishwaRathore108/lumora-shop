import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
  Tag,
  TicketPercent,
  Truck,
  CreditCard,
  FileText,
  Bell,
  Shield,
  UserCog,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import logoImg from '../assets/logo.png';
import { logout } from '../features/auth/authSlice';

const AdminSidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  // Defined navigation groups to organize the sidebar
  const NAV_GROUPS = [
    {
      title: null, // No header for the main group
      items: [
        { id: 'dashboard', label: "Dashboard", icon: LayoutDashboard },
        { id: 'products', label: "Products", icon: Package },
        { id: 'orders', label: "Orders", icon: ShoppingBag },
        { id: 'categories', label: "Categories", icon: Tag },
        { id: 'coupons', label: "Coupons & Offers", icon: TicketPercent },
        { id: 'shipping', label: "Shipping", icon: Truck },
      ]
    },
    {
      title: "USER MANAGEMENT",
      items: [
        { id: 'customers', label: "Customers", icon: Users },
        { id: 'admins', label: "Admins", icon: UserCog },
      ]
    },
    {
      title: "FINANCE & REPORTS",
      items: [
        { id: 'payments', label: "Payments", icon: CreditCard },
        { id: 'reports', label: "Reports", icon: FileText },
        { id: 'analytics', label: "Analytics", icon: BarChart3 },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { id: 'notifications', label: "Notifications", icon: Bell },
        { id: 'security', label: "Security", icon: Shield },
        { id: 'settings', label: "Settings", icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY (Backdrop) --- */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={closeSidebar}
      ></div>

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl md:shadow-none md:static md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-100 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        {/* 1. Header (Logo + Close Button) */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={logoImg}
              alt="Lumora Admin"
              className="h-9 w-auto max-w-[140px] object-contain object-left"
            />
          </div>

          <button onClick={closeSidebar} className="md:hidden text-gray-500 hover:text-red-500 shrink-0">
            <X size={24} />
          </button>
        </div>

        {/* 2. Navigation Items (Scrollable with Sections) */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {NAV_GROUPS.map((group, index) => (
            <div key={index}>
              {group.title && (
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const to =
                    item.id === 'dashboard' ? '/admin' : `/admin/${item.id}`;

                  return (
                    <NavLink
                      key={item.id}
                      to={to}
                      end={item.id === 'dashboard'}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                          ? 'bg-[#985991]/10 text-[#985991]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            size={20}
                            className={
                              isActive
                                ? 'text-[#985991]'
                                : 'text-gray-400 group-hover:text-gray-600'
                            }
                          />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* 3. Footer (Logout) */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;