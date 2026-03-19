import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Search, X, Instagram, Facebook, Twitter, Linkedin, Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';
import serumIcon from '../assets/serum.jpg';
import moistIcon from '../assets/moisture.jpg';
import sunIcon from '../assets/sunscreen.jpg';
import heroVideo from '../assets/video/video2.mp4';
import CategoryMegaMenu from './nav/CategoryMegaMenu';
import BrandsMegaMenu from './nav/BrandsMegaMenu';
import { CATEGORY_DROPDOWNS, CATEGORY_NAV_ORDER } from '../data/navDropdowns';
import { useNavData } from '../hooks/useNavData';

// Brand colour token (kept in sync with hero section)
const BRAND_COLOR = '#985991'; // mauve / dusty rose

// Central place to configure all brand tiles shown in the mega‑menu.
// You can easily add/remove brands or tweak their media here.
const BRAND_SHOWCASE = [
  {
    id: 'lumora-signature',
    name: 'Lumora Signature',
    tagline: 'Glow-boosting skincare ritual',
    description: 'Clean, vegan actives that leave your skin glassy, hydrated and camera-ready.',
    imageAlt: 'Lumora Signature Radiance Serum',
    // Uses existing hero media so it feels on‑brand out of the box.
    image: serumIcon,
    video: heroVideo,
    tags: ['Bestseller', 'Vegan', 'For all skin types'],
  },
  {
    id: 'sunveil',
    name: 'SunVeil Defense',
    tagline: 'SPF that feels like skincare',
    description: 'Feather‑light sunscreen gels that defend against sun, screen and city pollution.',
    imageAlt: 'SunVeil sunscreen gel on a soft pink background',
    image: sunIcon,
    // video: heroVideo,
    tags: ['SPF 30 / 50', 'No white cast', 'Water resistant'],
  },
  {
    id: 'hydraglow',
    name: 'HydraGlow Cloud',
    tagline: 'Moisture cloud cushions for your skin',
    description: 'Whipped moisturisers that lock in hydration without any heaviness or stickiness.',
    imageAlt: 'HydraGlow moisturiser texture close‑up',
    image: moistIcon,
    // video: heroVideo,
    tags: ['Long‑lasting hydration', 'Barrier friendly'],
  },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const iconsRef = useRef(null);

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);
  const { cartItems } = useCart();
  const { brands: apiBrands } = useNavData();

  // Use static dropdowns for a consistent UI (Women, Men, Kids, Skincare, Hair, Makeup, Body)
  const categoryDropdowns = CATEGORY_DROPDOWNS;
  const categoryKeys = CATEGORY_NAV_ORDER.filter((key) => categoryDropdowns[key]);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const isHome = location.pathname === '/';
  const isHeroNav = isHome && !isScrolled;

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from(linksRef.current, { y: 12, opacity: 0, stagger: 0.06, delay: 0.2, duration: 0.5, ease: 'power3.out' });
      gsap.from(iconsRef.current, { opacity: 0, delay: 0.3, duration: 0.4, ease: 'power3.out' });
    }, navRef);
    return () => ctx.revert();
  }, []);

  // Toggle solid vs transparent navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setShowSearch(false);
      const q = query.trim();
      navigate(`/shop?search=${encodeURIComponent(q)}`, { state: { searchQuery: q } });
      setQuery('');
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md transition-colors overflow-visible ${isHeroNav ? 'bg-black/20 border-b border-white/15' : 'bg-white/95 border-b border-gray-100 shadow-sm'
        }`}
    >
      {/* Promo strip (merged from PromoBanners) - Marquee announcement */}
      <div className={isHeroNav ? 'bg-white/5 border-b border-white/10' : 'bg-[#985991] border-b border-[#985991]'}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <Link
              to="/track-order"
              className={`text-xs font-medium transition-colors ${isHeroNav ? 'text-white/90 hover:text-white' : 'text-white hover:text-white/90'}`}
            >
              Track Order
            </Link>
            <span className={`w-px h-3 ${isHeroNav ? 'bg-white/40' : 'bg-white/60'}`} aria-hidden />
            <Link
              to="/contact"
              className={`text-xs font-medium transition-colors ${isHeroNav ? 'text-white/90 hover:text-white' : 'text-white hover:text-white/90'}`}
            >
              Help Centre
            </Link>
          </div>
          {/* Infinite marquee - scrolls right-to-left, pauses on hover */}
          <div className="marquee-wrapper flex-1 min-w-0 overflow-hidden">
            <div className="marquee-track flex items-center gap-4 whitespace-nowrap py-0.5">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="inline-flex items-center gap-2 flex-shrink-0">
                  <Sparkles className={`w-3.5 h-3.5 shrink-0 hidden sm:inline ${isHeroNav ? 'text-[#DCC9DA]' : 'text-[#F5E6D3]'}`} />
                  <span className={`text-xs ${isHeroNav ? 'text-white/90' : 'text-white'}`}>
                    <span className="font-semibold">New:</span> Radiance Serum – Free shipping on orders over ₹999
                  </span>
                  <Link
                    to="/shop"
                    className={`text-xs font-semibold underline underline-offset-2 transition-colors shrink-0 ${isHeroNav ? 'text-white hover:text-[#DCC9DA]' : 'text-white hover:text-[#F5E6D3]'}`}
                  >
                    Shop now
                  </Link>
                  {i < 3 && <span className={`mx-6 opacity-60 ${isHeroNav ? 'text-white/50' : 'text-white/60'}`} aria-hidden>•</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" className={`transition-colors ${isHeroNav ? 'text-white/80 hover:text-white' : 'text-white hover:text-white/90'}`} aria-label="Instagram"><Instagram size={12} /></a>
            <a href="#" className={isHeroNav ? 'text-white/80 hover:text-white' : 'text-white hover:text-white/90'} aria-label="Facebook"><Facebook size={12} /></a>
            <a href="#" className={isHeroNav ? 'text-white/80 hover:text-white' : 'text-white hover:text-white/90'} aria-label="Twitter"><Twitter size={12} /></a>
            <a href="#" className={isHeroNav ? 'text-white/80 hover:text-white' : 'text-white hover:text-white/90'} aria-label="LinkedIn"><Linkedin size={12} /></a>
          </div>
        </div>
      </div>

      {/* Main nav row + secondary nav + dropdowns */}
      <div
        className="max-w-7xl mx-auto px-4 relative overflow-visible"
        onMouseLeave={() => {
          setIsBrandOpen(false);
          setActiveCategory(null);
        }}
      >
        <div className="py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center z-10">
          <img src={logoImg} alt="The Beauty Hub" className="h-10 md:h-12 w-auto" />
        </Link>

        {!showSearch && (
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-8 text-sm font-medium tracking-[0.18em]">
            <Link
              to="/"
              ref={(el) => (linksRef.current[0] = el)}
              className={`uppercase text-[11px] transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:transition-all duration-300 ${isHeroNav ? (isActive('/') ? 'text-white after:w-full after:bg-white font-semibold' : 'text-white/80 hover:text-white after:w-0 after:bg-white hover:after:w-full') : (isActive('/') ? 'text-[#985991] after:w-full after:bg-[#985991] font-semibold' : 'text-gray-600 hover:text-[#985991] after:w-0 after:bg-[#985991] hover:after:w-full')
                }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              ref={(el) => (linksRef.current[1] = el)}
              className={`uppercase text-[11px] transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:transition-all duration-300 ${isHeroNav ? (isActive('/shop') ? 'text-white after:w-full after:bg-white font-semibold' : 'text-white/80 hover:text-white after:w-0 after:bg-white hover:after:w-full') : (isActive('/shop') ? 'text-[#985991] after:w-full after:bg-[#985991] font-semibold' : 'text-gray-600 hover:text-[#985991] after:w-0 after:bg-[#985991] hover:after:w-full')
                }`}
            >
              Shop
            </Link>
            <Link
              to="/story"
              ref={(el) => (linksRef.current[2] = el)}
              className={`uppercase text-[11px] transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:transition-all duration-300 ${isHeroNav ? (isActive('/story') ? 'text-white after:w-full after:bg-white font-semibold' : 'text-white/80 hover:text-white after:w-0 after:bg-white hover:after:w-full') : (isActive('/story') ? 'text-[#985991] after:w-full after:bg-[#985991] font-semibold' : 'text-gray-600 hover:text-[#985991] after:w-0 after:bg-[#985991] hover:after:w-full')
                }`}
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              ref={(el) => (linksRef.current[3] = el)}
              className={`uppercase text-[11px] transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:transition-all duration-300 ${isHeroNav ? (isActive('/contact') ? 'text-white after:w-full after:bg-white font-semibold' : 'text-white/80 hover:text-white after:w-0 after:bg-white hover:after:w-full') : (isActive('/contact') ? 'text-[#985991] after:w-full after:bg-[#985991] font-semibold' : 'text-gray-600 hover:text-[#985991] after:w-0 after:bg-[#985991] hover:after:w-full')
                }`}
            >
              Contact
            </Link>
            {/* Youvana Professional - brand link */}
            <Link
              to="/shop?brand=youvana-professional"
              ref={(el) => (linksRef.current[4] = el)}
              className={`uppercase text-[11px] transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:transition-all duration-300 ${isHeroNav ? 'text-white/80 hover:text-white after:w-0 after:bg-white hover:after:w-full' : 'text-gray-600 hover:text-[#985991] after:w-0 after:bg-[#985991] hover:after:w-full'}`}
            >
              Youvana Professional
            </Link>
            {/* Brands mega‑menu trigger */}
            <button
              type="button"
              ref={(el) => (linksRef.current[5] = el)}
              onMouseEnter={() => {
                setIsBrandOpen(true);
                setActiveCategory(null);
              }}
              className={`uppercase text-[11px] transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:transition-all duration-300 ${isHeroNav
                ? isBrandOpen
                  ? 'text-white after:w-full after:bg-white font-semibold'
                  : 'text-white/80 hover:text-white after:w-0 after:bg-white hover:after:w-full'
                : isBrandOpen
                  ? 'text-[#985991] after:w-full after:bg-[#985991] font-semibold'
                  : 'text-gray-600 hover:text-[#985991] after:w-0 after:bg-[#985991] hover:after:w-full'
                }`}
            >
              Brands
            </button>
          </div>
        )}

        {showSearch && (
          <div className={`absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center px-4 md:static md:flex-1 md:max-w-sm ${isHeroNav ? 'bg-black/30 backdrop-blur-sm md:bg-transparent' : 'bg-white md:bg-transparent'}`}>
            <div className="relative w-full max-w-md">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isHeroNav ? 'text-white/60' : 'text-gray-400'}`} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search serum, cream..."
                className={`w-full pl-10 pr-10 py-2 rounded-full text-sm focus:outline-none ${isHeroNav ? 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#DCC9DA]' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#985991]'}`}
                autoFocus
              />
              <button onClick={() => setShowSearch(false)} className={isHeroNav ? 'absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white' : 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'}>
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div ref={iconsRef} className="flex items-center gap-4">
          {/* Mobile: Shop By drawer trigger */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide ${
              isHeroNav
                ? 'border-white/40 text-white/90 bg-white/10'
                : 'border-gray-200 text-gray-700 bg-white'
            }`}
          >
            <span>Shop By</span>
            <ChevronDown size={14} />
          </button>
          <Link
            to="/contact"
            className={`sm:hidden ${isHeroNav ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-[#985991]'} transition-colors`}
            aria-label="Help"
          >
            <HelpCircle size={18} />
          </Link>
          {!showSearch && (
            <button onClick={() => setShowSearch(true)} className={isHeroNav ? 'text-white/80 hover:text-white transition-colors' : 'text-gray-500 hover:text-[#985991] transition-colors'}>
              <Search size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className={`relative ${isHeroNav ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-[#985991]'} transition-colors`}
            aria-label="View cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#985991] text-white text-[10px] font-semibold flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
          <Link to="/login" className="hidden md:block">
            <span className={isHeroNav ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-1.5 rounded-full text-xs font-medium transition-colors' : 'bg-[#985991] hover:bg-[#7A4774] text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors'}>
              Sign In
            </span>
          </Link>
          <Link to="/login" className={isHeroNav ? 'md:hidden text-white/80 hover:text-white' : 'md:hidden text-gray-500 hover:text-[#985991]'}>
            <User size={18} />
          </Link>
        </div>
        </div>

        {/* Secondary nav row - Women, Men, Kids, Skincare, Hair, Makeup, Body */}
        {!showSearch && (
          <div
            className={`hidden md:flex items-center justify-center gap-8 py-3 border-t scrollbar-hide text-[11px] font-medium tracking-[0.12em] uppercase ${
              isHeroNav ? 'border-white/10' : 'border-gray-100'
            }`}
          >
            {categoryKeys.map((key) => {
              const config = categoryDropdowns[key];
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  onMouseEnter={() => {
                    setActiveCategory(key);
                    setIsBrandOpen(false);
                  }}
                  className={`whitespace-nowrap transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:transition-all duration-300 ${
                    isHeroNav
                      ? isActive
                        ? 'text-white after:w-full after:bg-white'
                        : 'text-white/75 hover:text-white after:w-0 after:bg-white hover:after:w-full'
                      : isActive
                        ? 'text-[#985991] after:w-full after:bg-[#985991]'
                        : 'text-gray-600 hover:text-[#985991] after:w-0 after:bg-[#985991] hover:after:w-full'
                  }`}
                >
                  {categoryDropdowns[key].label}
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop Brands mega‑menu – constrained width so it doesn’t cover full page content */}
        {isBrandOpen && !showSearch && (
          <div
            className="hidden md:block absolute left-4 right-auto max-w-[680px] w-full z-40 mt-2"
            style={{ top: '100%' }}
            onMouseEnter={() => setIsBrandOpen(true)}
          >
            <div
              className={`overflow-hidden rounded-2xl border shadow-2xl ${isHeroNav ? 'bg-black/80 border-white/15 backdrop-blur-xl' : 'bg-white border-gray-100'
                }`}
            >
              <BrandsMegaMenu
                isHeroNav={isHeroNav}
                onNavigate={() => setIsBrandOpen(false)}
                brandShowcase={BRAND_SHOWCASE}
                brandsList={apiBrands?.length ? apiBrands : undefined}
              />
            </div>
          </div>
        )}

        {/* Desktop Category mega‑menu */}
        {activeCategory && !showSearch && (
          <div
            className="hidden md:block absolute left-0 right-0 z-40 pt-1"
            style={{ top: '100%' }}
            onMouseEnter={() => setActiveCategory(activeCategory)}
          >
            <div
              className={`overflow-hidden rounded-b-2xl border-x border-b shadow-2xl mx-4 px-6 py-5 ${isHeroNav ? 'bg-black/80 border-white/15 backdrop-blur-xl' : 'bg-white border-gray-100'
                }`}
            >
              <CategoryMegaMenu
                config={categoryDropdowns[activeCategory]}
                isHeroNav={isHeroNav}
                onNavigate={() => setActiveCategory(null)}
              />
            </div>
          </div>
        )}
        
      </div>
      
      {/* Mobile full-screen nav drawer – category + sub options (accordion), inspired by Tira-style menu */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden
          />
          <div className="absolute h-screen z-50 inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold tracking-[0.18em] uppercase text-gray-900">
                Shop By
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
              {categoryKeys.map((key) => {
                const config = categoryDropdowns[key];
                const isOpen = openMobileCategory === key;

                const handleToggle = () => {
                  setOpenMobileCategory((prev) => (prev === key ? null : key));
                };

                return (
                  <div key={key} className="border-b border-gray-100 last:border-b-0 py-1.5">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="w-full flex items-center justify-between py-2 text-left"
                    >
                      <span className="text-sm font-semibold text-gray-900">
                        {config.label}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="pl-2 pb-2 space-y-3">
                        {config.columns?.map((col) => (
                          <div key={col.title}>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                              {col.title}
                            </p>
                            <ul className="space-y-0.5">
                              {col.items?.map((item) => {
                                const label =
                                  typeof item === 'object' && item !== null && 'label' in item
                                    ? item.label
                                    : item;
                                const slug =
                                  typeof item === 'object' && item !== null && 'slug' in item
                                    ? item.slug
                                    : String(item)
                                        .toLowerCase()
                                        .replace(/\\s*&\\s*/g, '-')
                                        .replace(/\\s+/g, '-');
                                return (
                                  <li key={`${col.title}-${slug}`}>
                                    <Link
                                      to={`/shop?category=${slug}`}
                                      onClick={() => {
                                        setIsMobileNavOpen(false);
                                        setOpenMobileCategory(null);
                                      }}
                                      className="block text-sm py-1 text-gray-600 hover:text-[#985991]"
                                    >
                                      {label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}

                        {config.shopBy?.length > 0 && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                              Shop By
                            </p>
                            <ul className="flex flex-wrap gap-1.5">
                              {config.shopBy.map(({ label, slug }) => (
                                <li key={slug}>
                                  <Link
                                    to={`/shop?filter=${slug}`}
                                    onClick={() => {
                                      setIsMobileNavOpen(false);
                                      setOpenMobileCategory(null);
                                    }}
                                    className="inline-flex items-center px-2 py-1 rounded-full border border-gray-200 text-[11px] text-gray-700 hover:border-[#985991] hover:text-[#985991]"
                                  >
                                    {label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
    </nav>
  );
};

export default Navbar;
