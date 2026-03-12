import React from 'react';

const SocialProof = () => {
  return (
    <section className="py-12 bg-[#F8FAFC] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          
          {/* Label */}
          <div className="md:w-1/4 text-center md:text-left">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Trusted by 1000+ Revenue Teams
            </p>
          </div>

          {/* Logos Strip */}
          <div className="md:w-3/4 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using text styles that mimic logos if images aren't available */}
            <span className="text-2xl font-extrabold text-slate-800 tracking-tighter">stripe</span>
            <span className="text-2xl font-bold text-slate-800 italic">Intercom</span>
            <span className="text-xl font-bold text-slate-800 flex items-center gap-1">
              <div className="w-6 h-6 bg-slate-800 rounded-full"></div> ZOOM
            </span>
            <span className="text-2xl font-semibold text-slate-800 tracking-widest">Uber</span>
            <span className="text-2xl font-bold text-slate-800 font-serif">Notion</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocialProof;