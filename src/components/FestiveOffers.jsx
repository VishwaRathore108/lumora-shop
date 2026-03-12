import React from 'react';
import { Gift, Sparkles, Star } from 'lucide-react';

// Silk/liquid pastel theme – aligns with OffersSection & MegaOffers
const FESTIVE_BG_IMAGE = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=90&fit=crop';
const FESTIVE_BG_OVERLAY = 'linear-gradient(90deg, rgba(245,240,255,0.9) 0%, rgba(255,252,255,0.85) 50%, rgba(248,242,255,0.9) 100%)';

const FestiveOffers = () => {
    return (
        <section className="relative overflow-hidden py-6 min-h-[140px]">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${FESTIVE_BG_IMAGE})` }} aria-hidden />
            <div className="absolute inset-0" style={{ background: FESTIVE_BG_OVERLAY }} aria-hidden />
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-white/30 blur-[60px] -translate-x-1/2 -translate-y-1/2" aria-hidden />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md">
                        <Sparkles className="w-5 h-5 text-[#985991]" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-[0.28em] uppercase text-[#985991]">
                            Festive Glow Event
                        </p>
                        <p className="text-sm md:text-base text-gray-800 font-medium">
                            Up to 25% off on curated beauty boxes, gifting sets & festive essentials.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-1 text-xs text-gray-700">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Free gift wrap on all festive orders</span>
                    </div>
                    <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#985991] text-white text-xs md:text-sm font-semibold shadow-lg shadow-rose-200 hover:bg-[#7A4774] transition-all">
                        Shop Festive Offers
                        <Gift className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FestiveOffers;

