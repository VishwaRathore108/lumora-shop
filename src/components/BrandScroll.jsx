import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Sparkles, ShieldCheck, BadgeCheck, Star } from 'lucide-react';
import { ALL_BRANDS } from '../data/brands';

const BrandScroll = () => {
  const wrapperRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Calculate total width of one set of logos
      const totalWidth = tickerRef.current.scrollWidth / 2;

      gsap.to(tickerRef.current, {
        x: -totalWidth, // Move left by half the width
        duration: 20,   // Speed (higher = slower)
        ease: "none",
        repeat: -1,     // Infinite loop
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) // Seamless wrapping
        }
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="py-14 bg-gradient-to-b from-[#FFF5FA] via-white to-[#FFF5FA] border-y border-pink-100/60 overflow-hidden"
      ref={wrapperRef}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-pink-100/80 mb-3">
            <Sparkles className="w-4 h-4 text-[#985991]" />
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#985991] uppercase">
              Loved Beauty Brands
            </p>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2">
            International & Indian favourites in one place
          </h3>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Curated labels that your vanity already loves—now with exclusive offers, combos and early access drops.
          </p>
        </div>

        {/* Logo ticker */}
        <div className="relative w-full overflow-hidden flex mask-gradient rounded-3xl border border-pink-100/70 bg-white/60 backdrop-blur-sm py-5">
          {/* The sliding track */}
          <div ref={tickerRef} className="flex items-center gap-10 md:gap-16 px-10 w-max">
            {[...ALL_BRANDS, ...ALL_BRANDS].map((brand, index) => (
              <Link
                key={`${brand.name}-${index}`}
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="flex-shrink-0 px-4 py-3 rounded-2xl bg-white/80 border border-gray-100 shadow-sm hover:shadow-md opacity-80 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer flex items-center justify-center min-w-[100px]"
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-6 md:h-8 w-auto object-contain max-h-8"
                  />
                ) : (
                  <span className="text-xs md:text-sm font-semibold text-gray-700 truncate max-w-[90px]">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Brand benefits row (section below the strip) */}
        <div className="mt-10 grid gap-4 md:gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white shadow-sm border border-pink-100/80 px-5 py-4 flex gap-3 items-start">
            <div className="mt-1">
              <ShieldCheck className="w-5 h-5 text-[#985991]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                100% Authentic & Verified
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Sourced directly from authorised partners so every product on your shelf is batch‑fresh and genuine.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm border border-pink-100/80 px-5 py-4 flex gap-3 items-start">
            <div className="mt-1">
              <BadgeCheck className="w-5 h-5 text-[#985991]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Offers You Actually Use
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Combo deals, cart‑level offers and glow kits built around how you really shop skincare and makeup.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm border border-pink-100/80 px-5 py-4 flex gap-3 items-start">
            <div className="mt-1">
              <Star className="w-5 h-5 text-[#985991]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Curated for Indian Climate
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Lightweight textures and high‑performance actives that survive heat, humidity and long work days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for fading edges */}
      <style>{`
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
};

export default BrandScroll;