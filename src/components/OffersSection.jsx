import React from 'react';
import { Gift, Percent, Sparkles } from 'lucide-react';

const offers = [
    {
        icon: <Percent className="w-6 h-6 text-[#985991]" />,
        title: 'Pay Day Glow Sale',
        desc: 'Flat 15% off on all orders above ₹1,999. Auto-applied at checkout.',
        tag: 'Limited time',
        image: 'https://plus.unsplash.com/premium_photo-1670152411569-7cbc00946857?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D://images.unsplash.com/photo-1612810432633-96f64dc8ccb6?w=800&auto=format&fit=crop'
    },
    {
        icon: <Gift className="w-6 h-6 text-[#985991]" />,
        title: 'Complimentary Mini',
        desc: 'Free deluxe-size mini on every skincare order above ₹1,499.',
        tag: 'Online exclusive',
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        icon: <Sparkles className="w-6 h-6 text-[#985991]" />,
        title: 'Glow Points Rewards',
        desc: 'Earn 5% back in Glow Points on every purchase. Redeem anytime.',
        tag: 'Loyalty',
        image: 'https://plus.unsplash.com/premium_photo-1672082518029-8619a2c1e9dd?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
];

// High-res silk/liquid texture – pastel lavender, pearlescent white, studio aesthetic
const OFFER_BG_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a43a89281352?w=1920&q=90&fit=crop';
const OFFER_BG_OVERLAY = 'linear-gradient(135deg, rgba(230,230,255,0.85) 0%, rgba(248,240,255,0.75) 35%, rgba(255,250,255,0.9) 60%, rgba(245,240,255,0.85) 100%)';

const OffersSection = () => {
    return (
        <section className="relative py-20 overflow-hidden min-h-[600px]">
            {/* Macro silk/liquid texture background – soft, professional, 8K-ready */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${OFFER_BG_IMAGE})` }}
                aria-hidden
            />
            <div
                className="absolute inset-0"
                style={{ background: OFFER_BG_OVERLAY }}
                aria-hidden
            />
            {/* Bokeh-style floating orbs – studio lighting, depth */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-200/30 blur-[100px] -translate-y-1/2 translate-x-1/2" aria-hidden />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/40 blur-[80px] translate-y-1/2 -translate-x-1/2" aria-hidden />
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-200/20 blur-[120px] -translate-x-1/2 -translate-y-1/2" aria-hidden />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#985991] mb-2">
                            Handpicked Offers
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                            Today&apos;s Beauty Privileges
                        </h2>
                        <p className="text-sm text-gray-600/90 mt-2 max-w-md">
                            Curated savings and surprises designed to make your ritual feel even more luxurious.
                        </p>
                    </div>
                    <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold border border-[#985991]/40 text-[#985991] hover:bg-[#985991] hover:text-white transition-all shadow-sm">
                        View All Offers
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {offers.map((offer, idx) => (
                        <article
                            key={idx}
                            className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {offer.image && (
                                <div className="h-32 w-full overflow-hidden">
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 border border-white/50">
                                        {offer.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-base font-semibold text-gray-900">
                                            {offer.title}
                                        </h3>
                                        <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-white/60 text-[#985991] border border-white/40">
                                            {offer.tag}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {offer.desc}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OffersSection;

