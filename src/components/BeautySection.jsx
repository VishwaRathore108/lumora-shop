import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Scissors } from 'lucide-react';
import SalonEquipmentCard from './SalonEquipmentCard';
import { SALON_PRODUCTS } from '../data/salonProducts';

// Cosmetics categories – high-quality Unsplash images
const COSMETIC_CATEGORIES = [
  { id: 1, name: 'Makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=400&h=400&fit=crop' },
  { id: 2, name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop' },
  { id: 3, name: 'Hair', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=400&fit=crop' },
  { id: 4, name: 'Fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop' },
  { id: 5, name: 'Bath & Body', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop' },
  { id: 6, name: 'Men', image: 'https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=400&h=400&fit=crop' },
  { id: 7, name: 'Lips', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop' },
];

// Salon category – special card that expands or navigates
const SALON_CATEGORY = {
  id: 'salon',
  name: 'Salon',
  image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
  isSalon: true,
};

const BeautySection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('cosmetics'); // 'cosmetics' | 'salon'

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    if (cat.isSalon) {
      setActiveTab('salon');
      return;
    }
    navigate('/shop');
  };

  return (
    <section className="py-16 bg-white border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header + Filter Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
              Top Categories
            </h2>
            <div className="h-1 w-20 bg-[#985991] mt-2 rounded-full opacity-80"></div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100">
              <button
                onClick={() => setActiveTab('cosmetics')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'cosmetics'
                    ? 'bg-[#985991] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cosmetics
              </button>
              <button
                onClick={() => setActiveTab('salon')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'salon'
                    ? 'bg-[#985991] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Scissors size={16} />
                Salon Equipment
              </button>
            </div>

            <button
              onClick={() => navigate('/shop', { state: { filter: activeTab } })}
              className="group flex items-center gap-2 text-sm font-semibold text-[#985991] hover:text-[#7A4774] transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Cosmetics Carousel */}
        {activeTab === 'cosmetics' && (
          <div className="relative group/carousel">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:text-[#985991] hidden md:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:text-[#985991] hidden md:flex"
            >
              <ChevronRight size={20} />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {COSMETIC_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex-shrink-0 w-36 md:w-48 flex flex-col items-center gap-3 cursor-pointer group snap-start"
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all group-hover:border-[#985991]/30">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-[#985991] transition-colors">
                    {cat.name}
                  </span>
                </div>
              ))}
              {/* Salon category card */}
              <div
                onClick={() => handleCategoryClick(SALON_CATEGORY)}
                className="flex-shrink-0 w-36 md:w-48 flex flex-col items-center gap-3 cursor-pointer group snap-start"
              >
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-[#985991]/40 shadow-sm group-hover:shadow-md transition-all group-hover:border-[#985991]">
                  <img
                    src={SALON_CATEGORY.image}
                    alt={SALON_CATEGORY.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#985991] text-white text-[10px] font-semibold uppercase">
                    New
                  </span>
                </div>
                <span className="font-medium text-gray-900 group-hover:text-[#985991] transition-colors">
                  {SALON_CATEGORY.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Salon Equipment Grid */}
        {activeTab === 'salon' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {SALON_PRODUCTS.map((product) => (
              <SalonEquipmentCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                badge={product.badge}
                startingPrice={product.startingPrice}
                isPremium={product.isPremium}
                slug={product.slug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BeautySection;
