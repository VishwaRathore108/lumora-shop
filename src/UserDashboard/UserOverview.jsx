import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  Star,
  Truck,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { selectUser } from '../features/auth/authSlice';

// Mock Data
const RECENT_ORDER = {
  id: "#ORD-7782",
  items: "Radiance Serum, Velvet Lip Tint (+1 more)",
  date: "Oct 24, 2024",
  status: "In Transit",
  total: "₹2,598",
  eta: "Arriving by Oct 26",
  progress: 65
};

const RECOMMENDED_PRODUCTS = [
  { id: 1, name: "Hydra-Glow Moisturizer", price: "₹899", category: "Skincare", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200" },
  { id: 2, name: "Silk Satin Hair Oil", price: "₹599", category: "Haircare", img: "https://images.unsplash.com/photo-1522338242992-e1a54906a8e6?auto=format&fit=crop&q=80&w=200" },
  { id: 3, name: "Rose Clay Mask", price: "₹1,299", category: "Skincare", img: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=200" },
];

const UserOverview = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'there';
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#985991] via-[#A86BA1] to-[#B87AB2] rounded-3xl p-8 md:p-10 text-white overflow-hidden shadow-xl shadow-purple-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-900 opacity-10 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-1">
              Hello, {displayName}! ✨
            </h2>
            <p className="text-purple-100 text-sm md:text-base mb-4 max-w-lg">
              Welcome back to your beauty hub. Track your orders, manage favourites, and keep your glow ritual in one place.
            </p>
            <button className="bg-white text-[#985991] px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-gray-50 transition-transform active:scale-95">
              Redeem Points
            </button>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-black/10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-purple-100/80">Loyalty status</p>
              <p className="text-sm font-semibold text-white">Gold Member · 450 points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">12</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-[#985991] rounded-full flex items-center justify-center">
            <Heart size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">08</p>
            <p className="text-sm text-gray-500">Wishlist Items</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
            <Star size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">4.8</p>
            <p className="text-sm text-gray-500">Review Score</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Latest Order Tracking */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Truck size={20} className="text-[#985991]" /> Track Order
            </h3>
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">
              {RECENT_ORDER.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-800">{RECENT_ORDER.items}</p>
                <p className="text-xs text-gray-500 mt-1">Order ID: {RECENT_ORDER.id}</p>
              </div>
              <p className="text-sm font-bold text-[#985991]">{RECENT_ORDER.total}</p>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-4 pb-2">
              <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                <span className="text-[#985991]">Confirmed</span>
                <span className="text-[#985991]">Shipped</span>
                <span className={RECENT_ORDER.progress > 60 ? "text-[#985991]" : ""}>Out for Delivery</span>
                <span>Delivered</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#985991] rounded-full transition-all duration-1000"
                  style={{ width: `${RECENT_ORDER.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <Clock size={12} /> Estimated Delivery: <span className="font-bold text-gray-700">{RECENT_ORDER.eta}</span>
              </p>
            </div>

            <button
              onClick={() => navigate(`/user/orders/${RECENT_ORDER.id.replace('#', '')}`)}
              className="w-full mt-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              View Order Details
            </button>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500" /> Just for You
            </h3>
            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#985991]">
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {RECOMMENDED_PRODUCTS.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#985991]">{product.price}</p>
                  <button className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-[#985991] mt-1">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserOverview;