import React from 'react';
import {
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Heart,
  MapPin,
  User,
  LogOut,
  Star,
  CreditCard,
  ReceiptText,
  X,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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

  const displayName = user?.name && user.name.trim().length > 0 ? user.name.trim() : 'Beauty Enthusiast';
  const profileImage = user?.profilePicture || user?.profilePic || user?.profileImage || '';
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'BE';

  const NAV_ITEMS = [
    { id: 'overview', label: "My Overview", icon: LayoutGrid },
    { id: 'orders', label: "My Orders", icon: ShoppingBag },
    { id: 'cart', label: "My Cart", icon: ShoppingCart },
    { id: 'wishlist', label: "Wishlist", icon: Heart },
    { id: 'addresses', label: "Saved Addresses", icon: MapPin },
    { id: 'billing-invoices', label: "Billing & Invoices", icon: ReceiptText },
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
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2 min-w-0 shrink-0 no-underline text-inherit"
          >
            <img
              src={logoImg}
              alt="Lumora"
              className="h-9 w-auto max-w-[140px] object-contain object-left"
            />
          </Link>
          <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-red-500 shrink-0">
            <X size={24} />
          </button>
        </div>

        {/* 2. User Profile Snippet (Dynamic) */}
        <div className="px-6 mb-6">
          <div className="rounded-3xl border border-[#EEDFEA] bg-gradient-to-br from-[#FFF7FB] via-[#FEF8FB] to-[#F6ECF8] p-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md shadow-[#D9BBD5]/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#985991] text-white flex items-center justify-center text-sm font-semibold tracking-wide shadow-md shadow-[#CFAFCC]/60">
                  {userInitials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#A1789D] font-semibold">
                  The Beauty Hub
                </p>
                <p className="text-base font-semibold text-gray-900 truncate max-w-[10rem]">{displayName}</p>
                <p className="text-xs text-gray-500">Welcome back</p>
              </div>
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