import React from 'react';
import { ShieldCheck, Truck, Gem, Headphones } from 'lucide-react';

const brandColor = '#985991'; // mauve / dusty rose

const Features = () => {
  const features = [
    {
      icon: Gem,
      label: '100% Authentic',
      desc: 'Direct brand partnerships so every bottle is batch‑fresh and genuine.',
    },
    {
      icon: Truck,
      label: 'Express Indore Delivery',
      desc: 'Same‑day and next‑day delivery options within Indore city limits.',
    },
    {
      icon: ShieldCheck,
      label: 'Secure Payments',
      desc: 'Encrypted checkout with UPI, cards and safe cash on delivery.',
    },
    {
      icon: Headphones,
      label: 'Expert Support',
      desc: 'Chat with in‑house skin experts for personalised routines.',
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#FFF5FA] via-white to-[#FFF5FA] border-y border-pink-100/60 py-12 md:py-14">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div
          className="absolute -top-20 right-10 w-52 h-52 rounded-full blur-3xl"
          style={{ background: brandColor }}
        />
        <div
          className="absolute -bottom-16 left-6 w-64 h-64 rounded-full blur-3xl"
          style={{ background: '#fbb6ce' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#985991] mb-2">
              Why Shop with The Beauty Hub
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-gray-900">
              Built for your everyday glow routine.
            </h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 max-w-md">
            From how we source to how we ship, every step is designed around Indian skin, climate and busy schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.label}
                className="group relative rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-100/80 shadow-sm hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)] px-4 py-5 flex flex-col"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#fdf2f8] border border-pink-100 group-hover:bg-white group-hover:border-[#fbb6ce] transition-colors">
                    <Icon className="w-5 h-5 text-[#985991]" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">{item.label}</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;