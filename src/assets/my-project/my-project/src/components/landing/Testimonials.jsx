import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';

// Swiper styles import karna zaroori hai
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  { id: 1, name: "Vikram Singh", role: "Sales Director, TechCorp", quote: "Leadcore changed the game for us. The AI scoring is unbelievably accurate. We closed 30% more deals in the first month." },
  { id: 2, name: "Sarah Jenkins", role: "CEO, GrowthLabs", quote: "Finally, a CRM that my team actually enjoys using. The interface is clean, and the automation saves us hours every week." },
  { id: 3, name: "Amit Patel", role: "Founder, StartupX", quote: "As a small team, we couldn't afford complex tools. Leadcore gave us enterprise power at a fraction of the cost and effort." },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-brand-navy">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Trusted by Fast-Growing Teams</h2>
        
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 }, // Tablet par 2 slide
            1024: { slidesPerView: 3 }, // Desktop par 3 slide
          }}
          className="pb-12" // Pagination ke liye jagah
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-brand-navy/50 border border-white/10 backdrop-blur-sm p-8 rounded-2xl text-left h-full flex flex-col">
                <div className="flex gap-1 mb-6 text-brand-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-lg text-gray-300 leading-relaxed flex-1">"{item.quote}"</p>
                <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;