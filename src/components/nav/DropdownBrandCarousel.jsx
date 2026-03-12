import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DROPDOWN_BRANDS } from '../../data/navDropdowns';

const DropdownBrandCarousel = ({ brands = DROPDOWN_BRANDS, isHeroNav = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const itemsPerView = 4;
  const totalSlides = Math.ceil(brands.length / itemsPerView) || 1;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollWidth = el.scrollWidth / totalSlides;
    el.scrollTo({ left: activeIndex * scrollWidth, behavior: 'smooth' });
  }, [activeIndex, totalSlides]);

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {brands.map((brand, i) => (
          <Link
            key={`${brand.name}-${i}`}
            to={`/shop?brand=${encodeURIComponent(brand.name)}`}
            className="flex-shrink-0 flex items-center justify-center h-10 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-[80px]"
          >
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-5 w-auto object-contain opacity-80 hover:opacity-100 max-h-6"
              />
            ) : (
              <span className={`text-xs font-semibold truncate max-w-[72px] ${isHeroNav ? 'text-white/90' : 'text-gray-700'}`}>
                {brand.name}
              </span>
            )}
          </Link>
        ))}
        <Link
          to="/shop"
          className={`flex-shrink-0 flex items-center gap-1 px-4 rounded-lg text-sm font-medium ${isHeroNav ? 'text-white/80 hover:text-white bg-white/10' : 'text-gray-600 hover:text-[#985991] bg-gray-50 hover:bg-gray-100'}`}
        >
          & more brands
        </Link>
      </div>
      {totalSlides > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-[#985991] w-4' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownBrandCarousel;
