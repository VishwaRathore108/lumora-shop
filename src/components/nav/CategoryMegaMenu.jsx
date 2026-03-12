import React from 'react';
import { Link } from 'react-router-dom';
import DropdownBrandCarousel from './DropdownBrandCarousel';
import { DROPDOWN_BRANDS } from '../../data/navDropdowns';

const CategoryMegaMenu = ({ config, isHeroNav, onNavigate }) => {
  if (!config) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Multi-column grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-4">
        {config.columns?.map((col) => (
          <div key={col.title} className="min-w-0">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${isHeroNav ? 'text-white/90' : 'text-gray-900'}`}>
              {col.title}
            </h4>
            <ul className="space-y-1">
              {col.items?.map((item) => {
                const label = typeof item === 'object' && item !== null && 'label' in item ? item.label : item;
                const slug = typeof item === 'object' && item !== null && 'slug' in item ? item.slug : item.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-');
                return (
                  <li key={slug}>
                    <Link
                      to={`/shop?category=${slug}`}
                      onClick={() => onNavigate?.()}
                      className={`text-[13px] block py-0.5 transition-colors ${isHeroNav ? 'text-white/75 hover:text-white' : 'text-gray-600 hover:text-[#985991]'}`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Shop By column */}
        {config.shopBy?.length > 0 && (
          <div className="min-w-0">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${isHeroNav ? 'text-white/90' : 'text-gray-900'}`}>
              Shop By
            </h4>
            <ul className="space-y-1">
              {config.shopBy.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    to={`/shop?filter=${slug}`}
                    onClick={() => onNavigate?.()}
                    className={`text-[13px] block py-0.5 transition-colors ${isHeroNav ? 'text-white/75 hover:text-white' : 'text-gray-600 hover:text-[#985991]'}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Brands To Know column */}
        {config.brandsToKnow?.length > 0 && (
          <div className="min-w-0">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${isHeroNav ? 'text-white/90' : 'text-gray-900'}`}>
              Brands To Know
            </h4>
            <ul className="space-y-1">
              {config.brandsToKnow.slice(0, 12).map((brand) => (
                <li key={brand}>
                  <Link
                    to={`/shop?brand=${encodeURIComponent(brand)}`}
                    onClick={() => onNavigate?.()}
                    className={`text-[13px] block py-0.5 transition-colors ${isHeroNav ? 'text-white/75 hover:text-white' : 'text-gray-600 hover:text-[#985991]'}`}
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Brand logo carousel at bottom */}
      <DropdownBrandCarousel brands={DROPDOWN_BRANDS} isHeroNav={isHeroNav} />
    </div>
  );
};

export default CategoryMegaMenu;
