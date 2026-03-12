import React from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

const StoreLocations = () => {
  const locations = [
    {
      id: 1,
      name: "THE BEAUTY HUB - khatipura front of maharaja complex,11 12 laal gali, near novelty market, Indore, Madhya Pradesh 452001",
      address: "front of maharaja complex,11 12 laal gali, near novelty market, Indore, Madhya Pradesh 452001",
      phone: "+91 9039299946",
      hours: "10:30 AM - 10:00 PM",
      image: "https://images.unsplash.com/photo-1522335789203-abd652327216?q=80&w=2670&auto=format&fit=crop" // Replace with actual shop photo
    },
    {
      id: 2,
      name: "The Beauty Hub - Vijay Nagar",
      address: "G-3,AB-84, Ankur Annex Near state Bank of Indore, Scheme NO.54, Indore, Madhya Pradesh 452010",
      phone: "+91 9039299946",
      hours: "11:30 AM - 10:00 PM",
      image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2670&auto=format&fit=crop" // Replace with actual shop photo
    }
  ];

  return (
    <section className="py-20 bg-[#FDF2F8]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <span className="text-[#985991] font-bold tracking-widest text-xs uppercase">Visit Us Offline</span>
            <h2 className="text-4xl font-serif text-gray-900 mt-2 mb-4">Experience Luxury in Indore</h2>
            <p className="text-gray-600 leading-relaxed">
              Step into our world of beauty at our exclusive experience centers.
              Try products before you buy, get free consultations from experts,
              and explore 100% authentic international brands.
            </p>
          </div>
          <div className="hidden lg:block h-px bg-[#985991]/20 w-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="group relative rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.35)] bg-gradient-to-br from-[#4d1435] via-[#7b2c55] to-[#cc6fa0] text-white"
            >
              {/* Background image with soft overlay */}
              <div className="absolute inset-0 opacity-60 mix-blend-overlay">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/80" />

              {/* Content */}
              <div className="relative z-10 p-6 md:p-7 flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] uppercase tracking-[0.2em] text-pink-100 mb-2">
                      Indore • Experience Store
                    </span>
                    <h3 className="text-lg md:text-xl font-serif font-semibold leading-snug">
                      {loc.name}
                    </h3>
                  </div>
                  <div className="hidden sm:block w-16 h-16 rounded-2xl overflow-hidden border border-white/25 shadow-md bg-white/10">
                    <img
                      src={loc.image}
                      alt={`${loc.name} storefront`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-pink-50/95 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#fbb6ce] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{loc.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#fbb6ce] shrink-0" />
                    <p>{loc.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#fbb6ce] shrink-0" />
                    <p>{loc.hours}</p>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-white text-[#985991] text-sm font-semibold hover:bg-pink-50 hover:text-[#7A4774] transition-colors group-hover:shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                  <p className="text-[11px] text-pink-100/80 text-center">
                    Try products in-store • Free skin consults • 100% authentic brands
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreLocations;