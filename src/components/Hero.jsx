// src/components/Hero.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Tag, Clock } from 'lucide-react';
import { getActivePromoDeal } from '../services/productService';

import serumIcon from '../assets/serum.jpg';
import moistIcon from '../assets/moisture.jpg';
import lipIcon from '../assets/glowlip.jpg';
import sunIcon from '../assets/sunscreen.jpg';
import heroVideo from '../assets/video/video2.mp4';

const BRAND = '#985991';

const Hero = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const quickCardsRef = useRef([]);
  const float1Ref = useRef(null);
  const float2Ref = useRef(null);
  const float3Ref = useRef(null);
  const [activeDeal, setActiveDeal] = useState(null);
  const [dealExpired, setDealExpired] = useState(false);

  const quickProducts = [
    { name: 'Sunscreen Gel', subtitle: 'SPF 30', image: sunIcon },
    { name: 'HydraGlow', subtitle: 'Moisturizer', image: moistIcon },
    { name: 'Radiance', subtitle: 'Serum', image: serumIcon },
    { name: 'Velvet Glow', subtitle: 'Lip', image: lipIcon },
  ];

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [showDealCard, setShowDealCard] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDeal = async () => {
      try {
        const res = await getActivePromoDeal();
        if (!mounted) return;
        if (res?.success && res.deal?.product) {
          setActiveDeal(res.deal);
          setDealExpired(false);
          setShowDealCard(true);
        } else {
          setActiveDeal(null);
          setShowDealCard(false);
        }
      } catch {
        if (!mounted) return;
        setActiveDeal(null);
        setShowDealCard(false);
      }
    };

    fetchDeal();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeDeal?.dealEndTime) return undefined;

    const endTime = new Date(activeDeal.dealEndTime).getTime();
    if (Number.isNaN(endTime)) {
      setDealExpired(true);
      return undefined;
    }

    const updateTime = () => {
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({ h, m, s });
      if (diff <= 0) {
        setDealExpired(true);
        setShowDealCard(false);
      }
    };

    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, [activeDeal]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(contentRef.current?.children || [], {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
      }).from(
        quickCardsRef.current,
        { y: 24, opacity: 0, stagger: 0.06, duration: 0.5 },
        '-=0.4'
      );

      gsap.to(float1Ref.current, { y: -20, x: 8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(float2Ref.current, { y: 16, x: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(float3Ref.current, { y: -12, scale: 1.06, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover -z-40"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 -z-[15] bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

      {/* Soft blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <filter id="heroBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
            </filter>
            <linearGradient id="blobGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={BRAND} stopOpacity="0.15" />
              <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse ref={float1Ref} cx="80" cy="80" rx="100" ry="120" fill="url(#blobGrad1)" filter="url(#heroBlur)" />
          <ellipse ref={float2Ref} cx="320" cy="200" rx="110" ry="90" fill="url(#blobGrad1)" filter="url(#heroBlur)" />
          <ellipse ref={float3Ref} cx="200" cy="140" rx="140" ry="120" fill="url(#blobGrad1)" filter="url(#heroBlur)" />
        </svg>
      </div>

      {/* Announcement / marquee bar (above hero, just under navbar) */}
     

      {/* Main hero content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mt-16 px-4 pt-24 pb-16 sm:mt-20 sm:pt-[7rem] md:pt-[8rem] md:pb-20">
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div className="max-w-xl text-center lg:text-left px-2 sm:px-4">
            <p className="text-[#DCC9DA] text-[11px] md:text-xs font-medium tracking-[0.32em] uppercase mb-3">
              The Beauty Hub
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-white leading-tight mb-4 break-words whitespace-normal">
              Discover the
              <br />
              <span className="text-[#DCC9DA]">Secret of Natural Beauty</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-7 max-w-md mx-auto lg:mx-0 px-2 sm:px-0">
              Clean, vegan essentials crafted to hydrate, brighten, and protect your skin—perfect for your everyday ritual and Indian climate.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
              <button
                onClick={() => navigate('/shop')}
                className="bg-white text-[#985991] px-8 py-3 rounded-full text-sm font-semibold shadow-[0_14px_40px_rgba(0,0,0,0.45)] hover:bg-[#DCC9DA] hover:text-white transition-all"
              >
                Explore Now
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors"
                onClick={() => {
                  const el = document.querySelector('video');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <span className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center">
                  <span className="w-2 h-2 border-l border-t border-white rotate-45 translate-x-0.5" />
                </span>
                Watch Video
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-white/70">
              <span>Clean</span>
              <span className="text-[#DCC9DA]">·</span>
              <span>Vegan</span>
              <span className="text-[#DCC9DA]">·</span>
              <span>Dermatologist-approved</span>
            </div>
          </div>

          {/* Right: Deal of the Hour card */}
          {showDealCard && activeDeal?.product ? (
            <div className="relative flex justify-center mt-6 lg:mt-0">
              <div className="w-full max-w-sm bg-black/45 border border-white/15 rounded-3xl px-4 sm:px-5 py-5 sm:py-6 backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#DCC9DA]">
                    Deal of the Hour
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
                    <Clock size={12} />
                    {dealExpired
                      ? 'Deal Expired'
                      : `${String(timeLeft.h).padStart(2, '0')}:${String(timeLeft.m).padStart(2, '0')}:${String(timeLeft.s).padStart(2, '0')}`}
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#6B3D66] via-[#985991] to-[#A86BA1] p-4 text-white">
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    <div className="w-24 h-24 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex-shrink-0 shadow-md">
                      <img
                        src={activeDeal.product.image || sunIcon}
                        alt={activeDeal.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1 min-w-0 text-center sm:text-left">
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/70">
                        <Tag size={12} />
                        Limited Time
                      </span>
                      <h2 className="text-sm md:text-base font-serif font-semibold leading-snug">
                        {activeDeal.product.name}
                      </h2>
                      <p className="text-[11px] text-white/70 truncate">
                        {activeDeal.product.subtitle || 'Special limited-time offer'}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-lg font-semibold">₹{activeDeal.product.price}</span>
                        <span className="text-xs line-through text-white/60">₹{activeDeal.product.originalPrice}</span>
                        {activeDeal.product.discountPercent > 0 && (
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-300/90 text-[#6B3D66] font-semibold">
                            {activeDeal.product.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/product-details/${activeDeal.product._id}`)}
                    className="mt-4 w-full rounded-full bg-white text-[#985991] text-xs font-semibold py-2 hover:bg-pink-50 transition-colors"
                  >
                    Grab Now
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Quick product chips under hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 md:mt-12">
          {quickProducts.map((product, index) => (
            <button
              key={index}
              ref={(el) => (quickCardsRef.current[index] = el)}
              onClick={() => navigate('/shop')}
              className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/15 flex items-center gap-3 hover:bg-white/20 hover:border-white/30 transition-all text-left group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-11 h-11 rounded-full object-cover border border-white/30"
              />
              <div>
                <p className="font-serif text-white text-sm">{product.name}</p>
                <p className="text-[10px] text-[#DCC9DA] font-medium uppercase">{product.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .hero-marquee {
          animation: heroMarquee 18s linear infinite;
        }
        @keyframes heroMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;