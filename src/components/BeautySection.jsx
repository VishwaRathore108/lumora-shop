import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Main categories aligned with backend Category seed
const COSMETIC_CATEGORIES = [
  { id: 1, name: 'Makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop' },
  { id: 2, name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop' },
  { id: 3, name: 'Haircare', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop' },
  { id: 4, name: 'Bath & Body', image: 'https://media.istockphoto.com/id/584574708/photo/soap-bar-and-liquid-shampoo-shower-gel-towels-spa-kit.jpg?s=612x612&w=0&k=20&c=TFeQmTwVUwKY0NDKFFORe3cwDCxRtotFgEujMswn3dc=' },
  { id: 5, name: "Men's Grooming", image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop' },
  { id: 6, name: 'Fragrance', image: 'https://cdn.pixabay.com/photo/2017/03/14/11/41/perfume-2142824_640.jpg' },
  { id: 7, name: 'Tools & Accessories', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop' },
];

const BeautySection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeTab] = useState('cosmetics');

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    navigate('/shop');
  };

  return (
    <section className="py-16 bg-white border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
              Top Categories
            </h2>
            <div className="h-1 w-20 bg-[#985991] mt-2 rounded-full opacity-80"></div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/shop', { state: { filter: activeTab } })}
              className="group flex items-center gap-2 text-sm font-semibold text-[#985991] hover:text-[#7A4774] transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
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
                <span className="font-medium text-gray-900 group-hover:text-[#985991] transition-colors text-center">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeautySection;
