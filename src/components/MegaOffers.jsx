// src/components/MegaOffers.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import serumIcon from '../assets/serum.jpg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const cards = [
    {
        title: "Beauty's Biggest Heartthrobs",
        subtitle: 'Love at first price drop.',
        badge: 'Blockbuster Deals',
        discount: 'Up to 50% Off',
        image: serumIcon,
        gradient: 'from-[#985991] via-[#A86BA1] to-[#7A4774]',
    },
    {
        title: 'Glow Under ₹999',
        subtitle: 'Serums, mists & more.',
        discount: 'Under ₹999',
        image:
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&auto=format&fit=crop',
        gradient: 'from-[#B87AB2] via-[#a18cd1] to-[#7A4774]',
    },
    {
        title: 'Lip Crush Zone',
        subtitle: 'Bullet, liquid & gloss.',
        discount: 'Buy 2 Get 1',
        image:
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gradient: 'from-[#c9a0c4] via-[#985991] to-[#6B3D66]',
    },
];

const MegaOfferSlide = ({ card, isActive }) => (
    <article
        className={`relative overflow-hidden rounded-2xl md:rounded-3xl text-white shadow-[0_20px_60px_rgba(152,89,145,0.25)] cursor-pointer bg-gradient-to-br ${card.gradient} min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] w-full transition-all duration-500 ease-out border border-white/20 hover:shadow-[0_28px_80px_rgba(152,89,145,0.35)]`}
    >
        <div className="absolute inset-0 opacity-60 mix-blend-overlay">
            <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
        </div>

        <div
            className={`relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 transition-transform duration-500 ease-out ${
                isActive ? 'scale-100' : 'scale-[0.97] opacity-90'
            }`}
        >
            <div className="space-y-3 md:space-y-4">
                {card.badge && (
                    <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.16em] bg-black/30 backdrop-blur-sm transition-transform duration-500 ${
                            isActive ? 'scale-100' : 'scale-95'
                        }`}
                    >
                        {card.badge}
                    </span>
                )}
                <h3
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight transition-transform duration-500 ${
                        isActive ? 'scale-100' : 'scale-[0.98]'
                    }`}
                >
                    {card.title}
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-white/90">{card.subtitle}</p>
            </div>

            <div className="flex items-end justify-between mt-6 md:mt-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                        Just for this weekend
                    </p>
                    <p
                        className={`text-xl md:text-2xl lg:text-3xl font-semibold mt-1 transition-transform duration-500 ${
                            isActive ? 'scale-100' : 'scale-95'
                        }`}
                    >
                        {card.discount}
                    </p>
                </div>
                <button
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white text-[#985991] text-xs md:text-sm font-semibold hover:bg-white/95 hover:scale-105 transition-all duration-300 shadow-lg ${
                        isActive ? 'scale-100' : 'scale-95'
                    }`}
                >
                    Shop Now
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    </article>
);

const MegaOffers = () => {
    const MEGA_BG_IMAGE =
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=90&fit=crop';
    const MEGA_BG_OVERLAY =
        'linear-gradient(165deg, rgba(248,244,255,0.92) 0%, rgba(252,248,255,0.88) 50%, rgba(255,252,255,0.95) 100%)';

    return (
        <section className="relative py-16 overflow-hidden min-h-[500px]">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${MEGA_BG_IMAGE})` }}
                aria-hidden
            />
            <div className="absolute inset-0" style={{ background: MEGA_BG_OVERLAY }} aria-hidden />
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-purple-200/30 blur-[90px]"
                    aria-hidden
                />
                <div
                    className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-rose-100/40 blur-[80px]"
                    aria-hidden
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-12">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#985991] mb-2 flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            Blockbuster Offers
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                            Love at First Price Drop
                        </h2>
                        <p className="text-sm text-gray-600 mt-2 max-w-md">
                            Limited‑time edits inspired by your favourite beauty stores. Big colour,
                            bigger savings.
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-xs md:text-sm font-semibold hover:bg-[#985991] transition-all">
                        Explore All Blockbusters
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="group mega-offers-carousel relative px-1 sm:px-2">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, A11y]}
                        spaceBetween={20}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 16 },
                            640: { slidesPerView: 1, spaceBetween: 20 },
                            1024: { slidesPerView: 1.08, spaceBetween: 24 },
                            1280: { slidesPerView: 1.12, spaceBetween: 28 },
                        }}
                        loop={true}
                        watchSlidesProgress={true}
                        autoplay={{
                            delay: 4500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            prevEl: '.mega-offers-prev',
                            nextEl: '.mega-offers-next',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.mega-offers-pagination',
                            bulletClass:
                                'mega-offers-bullet w-2 h-2 rounded-full bg-gray-300 transition-all duration-300',
                            bulletActiveClass: 'mega-offers-bullet-active !bg-[#985991] !w-6',
                        }}
                        speed={600}
                        grabCursor={true}
                        className="!overflow-visible !pb-2"
                    >
                        {cards.map((card, idx) => (
                            <SwiperSlide key={idx} className="!h-auto">
                                {({ isActive }) => <MegaOfferSlide card={card} isActive={isActive} />}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom arrows - visible on hover */}
                    <button
                        className="mega-offers-prev absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center text-[#985991] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110 active:scale-95 border border-[#985991]/20"
                        aria-label="Previous offer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        className="mega-offers-next absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center text-[#985991] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110 active:scale-95 border border-[#985991]/20"
                        aria-label="Next offer"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Pagination container */}
                    <div className="mega-offers-pagination flex justify-center gap-2 mt-8 [&_.swiper-pagination-bullet]:!m-0" />
                </div>
            </div>

            <style>{`
                .mega-offers-carousel .swiper-pagination {
                    position: relative !important;
                }
                .mega-offers-carousel .mega-offers-bullet {
                    cursor: pointer;
                }
                .mega-offers-carousel .mega-offers-bullet-active {
                    border-radius: 9999px;
                }
            `}</style>
        </section>
    );
};

export default MegaOffers;
