import React from 'react';
import {
  LayoutGrid,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  LogOut,
  Star,
  CreditCard,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logoImg from '../assets/logo.png';
import { logout, selectUser } from '../features/auth/authSlice';

const UserSidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const displayName = user?.name && user.name.trim().length > 0 ? user.name : 'Beauty Lover';

  const NAV_ITEMS = [
    { id: 'overview', label: "My Overview", icon: LayoutGrid },
    { id: 'orders', label: "My Orders", icon: ShoppingBag },
    { id: 'wishlist', label: "Wishlist", icon: Heart },
    { id: 'addresses', label: "Saved Addresses", icon: MapPin },
    { id: 'payments', label: "Payment Methods", icon: CreditCard },
    { id: 'reviews', label: "My Reviews", icon: Star },
    { id: 'profile', label: "Account Settings", icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl md:shadow-none md:static md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-100 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        {/* 1. Header (Logo) */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={logoImg}
              alt="Lumora"
              className="h-9 w-auto max-w-[140px] object-contain object-left"
            />
          </div>
          <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-red-500 shrink-0">
            <X size={24} />
          </button>
        </div>

        {/* 2. User Profile Snippet (Dynamic) */}
        <div className="px-6 mb-6">
          <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex items-center gap-3">
            <img
              src={user?.profileImage || 'https://i.pravatar.cc/150?u=user'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <p className="text-xs text-gray-500 font-medium">Hello,</p>
              <p className="text-sm font-bold text-gray-800 truncate max-w-[9rem]">{displayName}</p>
            </div>
          </div>
        </div>

        {/* 3. Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const to =
              item.id === 'overview' ? '/user' : `/user/${item.id}`;

            return (
              <NavLink
                key={item.id}
                to={to}
                end={item.id === 'overview'}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 w-full px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group ${isActive
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#985991]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={18}
                      className={`transition-colors ${isActive
                        ? 'text-pink-300'
                        : 'text-gray-400 group-hover:text-[#985991]'
                        }`}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* 4. Footer (Logout) */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors justify-center"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

      </aside>
    </>
  );
};

export default UserSidebar;