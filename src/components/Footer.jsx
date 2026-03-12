import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Sparkles, Mail } from 'lucide-react';

const Footer = () => {
  const brandColor = '#985991'; // mauve / dusty rose

  const quickLinks = {
    about: [
      { label: 'Our Story', to: '/story' },
      { label: 'Sustainability', to: '/story' },
      { label: 'Careers', to: '/contact' },
    ],
    care: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Shipping & Delivery', to: '/contact' },
      { label: 'Returns & Exchanges', to: '/contact' },
    ],
    shop: [
      { label: 'All Products', to: '/shop' },
      { label: 'Bestsellers', to: '/shop' },
      { label: 'New Arrivals', to: '/shop' },
    ],
  };

  return (
    <footer className="relative bg-black text-white pt-16 pb-8 overflow-hidden">
      {/* Soft gradient blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-10 w-72 h-72 rounded-full blur-3xl" style={{ background: brandColor }} />
        <div className="absolute -bottom-24 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: '#DCC9DA' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Top call-to-action strip */}
        <div className="mb-10 rounded-3xl border border-white/15 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Sparkles className="w-5 h-5 text-[#DCC9DA]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-pink-100 mb-1">Glow Letter</p>
              <h3 className="text-lg md:text-xl font-serif font-semibold text-white">
                Get early access to drops, offers & glow rituals.
              </h3>
              <p className="text-xs md:text-sm text-white/70 mt-1">
                No spam. Just skincare intel crafted for Indian skin and climate.
              </p>
            </div>
          </div>
          <form
            className="w-full md:w-auto flex flex-col sm:flex-row gap-3 sm:items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1 min-w-[220px]">
              <Mail className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/5 border border-white/20 text-xs md:text-sm text-white placeholder-white/60 focus:outline-none focus:border-[#DCC9DA]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-white text-[#985991] text-xs md:text-sm font-semibold hover:bg-[#FFF5F5] hover:text-[#7A4774] transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
            >
              Join the Glow List
            </button>
          </form>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] gap-10 md:gap-12 pb-10 border-b border-white/10">
          {/* Brand column */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-pink-100 mb-3">The Beauty Hub</p>
            <h4 className="text-2xl font-serif font-semibold mb-3">Everyday luxury for Indian skin.</h4>
            <p className="text-sm text-white/70 mb-5 max-w-xs">
              Skin, sun and self‑care essentials crafted to keep you glowing from AM meetings to PM plans.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>100% authentic products</span>
              <span className="text-pink-200/70">•</span>
              <span>Dermatologist-tested</span>
            </div>
          </div>

          {/* Link columns */}
          <div>
            <h5 className="text-sm font-semibold tracking-[0.18em] uppercase text-white/80 mb-4">
              About
            </h5>
            <ul className="space-y-2 text-sm text-white/70">
              {quickLinks.about.map((item) => (
                <li key={item.label}>
                  <Link className="hover:text-pink-200 transition-colors" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold tracking-[0.18em] uppercase text-white/80 mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2 text-sm text-white/70">
              {quickLinks.care.map((item) => (
                <li key={item.label}>
                  <Link className="hover:text-pink-200 transition-colors" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold tracking-[0.18em] uppercase text-white/80 mb-4">
              Shop
            </h5>
            <ul className="space-y-2 text-sm text-white/70">
              {quickLinks.shop.map((item) => (
                <li key={item.label}>
                  <Link className="hover:text-pink-200 transition-colors" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] md:text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} YOUVANA PROFESSIONAL. Crafted with love for Indian skin.
          </p>
          <div className="flex items-center gap-4">
            <button className="text-white/70 hover:text-white text-xs">Privacy Policy</button>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <button className="text-white/70 hover:text-white text-xs">Terms</button>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <span className="text-[11px] uppercase tracking-[0.18em]">Follow</span>
            <a href="#" className="p-1.5 rounded-full bg-white/5 border border-white/15 hover:bg-white/15">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 rounded-full bg-white/5 border border-white/15 hover:bg-white/15">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 rounded-full bg-white/5 border border-white/15 hover:bg-white/15">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 rounded-full bg-white/5 border border-white/15 hover:bg-white/15">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;