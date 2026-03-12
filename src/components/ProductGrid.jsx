import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Star, Zap, Clock, ArrowRight } from 'lucide-react';

// Using generic images for demonstration
// Added stable ids and basic ratings so product clicks & UI feel realistic
const ALL_PRODUCTS = {
  'Best Sellers': [
    { id: 1, name: 'Radiance Serum', price: '₹1,299', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', badge: 'Hot', rating: 4.8, reviews: 382 },
    { id: 2, name: 'Velvet Lip Tint', price: '₹799', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500', badge: 'Best Seller', rating: 4.7, reviews: 241 },
    { id: 3, name: 'Night Repair Oil', price: '₹1,499', image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=500', badge: '', rating: 4.6, reviews: 190 },
    { id: 4, name: 'Hydra Gel', price: '₹999', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', badge: 'Indore Fav', rating: 4.9, reviews: 420 },
  ],
  'New Arrivals': [
    { id: 5, name: 'Vitamin C Toner', price: '₹899', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500', badge: 'New', rating: 4.5, reviews: 88 },
    { id: 6, name: 'Glow Mist', price: '₹599', image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500', badge: 'Just In', rating: 4.4, reviews: 67 },
    { id: 7, name: 'Peptide Cream', price: '₹1,599', image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=500', badge: 'New', rating: 4.6, reviews: 54 },
    { id: 8, name: 'Sun Block Matte', price: '₹699', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', badge: 'Summer', rating: 4.3, reviews: 143 },
  ],
  'On Sale': [
    { id: 9, name: 'Charcoal Mask', price: '₹499', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=500', badge: '-30% OFF', rating: 4.2, reviews: 110 },
    { id: 10, name: 'Rose Water', price: '₹299', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbb8?w=500', badge: 'Deal', rating: 4.7, reviews: 305 },
    { id: 11, name: 'Travel Kit', price: '₹999', image: 'https://images.unsplash.com/photo-1556228578-1f1985ca7517?w=500', badge: 'Bundle', rating: 4.4, reviews: 76 },
    { id: 12, name: 'Hair Serum', price: '₹1,199', image: 'https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=500', badge: '-15% OFF', rating: 4.5, reviews: 129 },
  ]
};

const ProductGrid = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Best Sellers');

  const tabs = [
    { id: 'Best Sellers', icon: <Star size={16} /> },
    { id: 'New Arrivals', icon: <Zap size={16} /> },
    { id: 'On Sale', icon: <Clock size={16} /> },
  ];

  // Navigate to shop with the active filter
  const handleViewAll = () => {
    navigate('/shop', { state: { filter: activeTab } });
  };

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">

        {/* --- PROFESSIONAL HEADER WITH TABS --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif text-gray-900 mb-2">
              Shop Our <span className="text-[#985991] italic">Heroes</span>
            </h2>
            <p className="text-gray-500 text-sm tracking-wide">
              Curated collections just for you.
            </p>
          </div>

          {/* Animated Tabs */}
          <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-100 self-start md:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-[#985991] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.id}</span>
                <span className="md:hidden">{tab.id.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div key={activeTab} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fadeIn">
          {ALL_PRODUCTS[activeTab].map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* --- CENTERED VIEW ALL BUTTON --- */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleViewAll}
            className="group relative px-8 py-3 bg-white text-gray-900 font-semibold rounded-full border border-gray-200 shadow-sm hover:border-[#985991] hover:text-[#985991] transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">View All {activeTab}</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />

            {/* Hover Fill Effect */}
            <div className="absolute inset-0 bg-pink-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 -z-0"></div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ProductGrid;