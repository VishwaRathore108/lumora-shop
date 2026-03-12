import React, { useState, useRef, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRANDS_TABS, BRANDS_LIST, DROPDOWN_BRANDS } from '../../data/navDropdowns';

const ALPHABET = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

const BrandsMegaMenu = ({ isHeroNav, onNavigate, brandShowcase = [], brandsList }) => {
  const [activeTab, setActiveTab] = useState('loves');
  const [brandSearch, setBrandSearch] = useState('');
  const listRef = useRef(null);
  const list = Array.isArray(brandsList) && brandsList.length > 0 ? brandsList : BRANDS_LIST;

  // Filter brands by search
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return list;
    const q = brandSearch.toLowerCase();
    return list.filter((b) => (typeof b === 'string' ? b : b.name || '').toLowerCase().includes(q));
  }, [brandSearch, list]);

  // Group brands by first letter (brand can be string or { name } from API)
  const groupedBrands = useMemo(() => {
    const groups = { '#': [] };
    ALPHABET.forEach((l) => {
      if (l !== '#') groups[l] = [];
    });
    filteredBrands.forEach((b) => {
      const name = typeof b === 'string' ? b : (b && b.name) || '';
      const first = name[0]?.toUpperCase();
      if (first && /[A-Z]/.test(first)) {
        groups[first] = groups[first] || [];
        groups[first].push(b);
      } else {
        groups['#'].push(b);
      }
    });
    return groups;
  }, [filteredBrands]);

  const scrollToLetter = (letter) => {
    const el = listRef.current?.querySelector(`[data-letter="${letter}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="grid grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] gap-0 min-h-[340px]">
      {/* Left: Search + Brand list */}
      <div className={`px-5 py-4 border-r ${isHeroNav ? 'border-white/15 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="relative mb-3">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isHeroNav ? 'text-white/50' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search Brands"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none ${isHeroNav ? 'bg-white/10 border border-white/20 text-white placeholder-white/50' : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'}`}
          />
        </div>
        <div className="flex gap-1">
          <div ref={listRef} className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-3">
            {ALPHABET.map((letter) => {
              const list = groupedBrands[letter] || [];
              if (list.length === 0) return null;
              return (
                <div key={letter} data-letter={letter} className="scroll-mt-2">
                  <span className={`text-[10px] font-bold uppercase ${isHeroNav ? 'text-white/60' : 'text-gray-400'}`}>
                    {letter}
                  </span>
                    <ul className="mt-1 space-y-0.5">
                    {list.map((brand) => {
                      const name = typeof brand === 'string' ? brand : (brand && brand.name) || '';
                      return (
                        <li key={name}>
                          <Link
                            to={`/shop?brand=${encodeURIComponent(name)}`}
                            onClick={() => onNavigate?.()}
                            className={`text-[12px] block py-0.5 truncate ${isHeroNav ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#985991]'}`}
                          >
                            {name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-0.5 text-[10px]">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => scrollToLetter(letter)}
                className={`px-1 py-0.5 rounded ${isHeroNav ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-[#985991] hover:bg-gray-100'}`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Tabs + Grid */}
      <div className={`p-5 flex flex-col ${isHeroNav ? 'bg-gradient-to-br from-[#4d1435]/40 to-[#7b2c55]/20' : 'bg-white'}`}>
        <div className={`flex gap-1 mb-4 overflow-x-auto pb-1 ${isHeroNav ? 'border-b border-white/15' : 'border-b border-gray-100'}`}>
          {BRANDS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? isHeroNav
                    ? 'bg-white/20 text-white'
                    : 'bg-[#985991] text-white'
                  : isHeroNav
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#985991]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 flex-1 content-start">
            {(brandShowcase.length ? brandShowcase : DROPDOWN_BRANDS).slice(0, 10).map((brand, i) => (
            <Link
              key={brand.id || brand.name || i}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              onClick={() => onNavigate?.()}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-[#985991]/30 hover:shadow-sm transition-all group"
            >
              {(brand.image || brand.logo) ? (
                <img
                  src={brand.image || brand.logo}
                  alt={brand.name}
                  className="h-10 w-10 object-contain mb-1 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <span className="text-xs font-bold text-[#985991]">{brand.name.charAt(0)}</span>
                </div>
              )}
              <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#985991] truncate w-full text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsMegaMenu;
