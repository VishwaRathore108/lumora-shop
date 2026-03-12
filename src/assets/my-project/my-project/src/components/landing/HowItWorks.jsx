import React from 'react';
import { CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">From Lead to Loyal Customer</h2>
          <p className="text-gray-500">See how Leadcore automates your entire sales cycle.</p>
        </div>

        {/* Step 1 */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
          <div className="md:w-1/2">
            <div className="w-16 h-16 bg-blue-100 text-brand-navy rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">1</div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">Capture Leads Everywhere</h3>
            <p className="text-gray-500 leading-relaxed text-lg">
              Connect your website, LinkedIn, and email. Leadcore automatically scrapes data and creates a rich profile.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-gray-600"><CheckCircle size={20} className="text-brand-green" /> LinkedIn Extension included</li>
              <li className="flex items-center gap-3 text-gray-600"><CheckCircle size={20} className="text-brand-green" /> Auto-enrichment</li>
            </ul>
          </div>
          <div className="md:w-1/2 bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg min-h-[200px] flex items-center justify-center">
             <span className="text-gray-400 font-medium">Visual: Data Capture Animation</span>
          </div>
        </div>

       
        {/* Step 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="md:w-1/2">
            <div className="w-16 h-16 bg-green-100 text-brand-green rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">2</div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">Focus on the "Hot" Leads</h3>
            <p className="text-gray-500 leading-relaxed text-lg">
              Stop calling everyone. Our AI analyzes behavior and tells you exactly who is ready to buy with a "Win Probability" score.
            </p>
            {/* Badge showing it's static for now */}
            <span className="inline-block mt-4 px-3 py-1 bg-brand-beige text-brand-navy text-xs font-bold rounded-full border border-brand-gold/20">
              AI Feature (Coming Soon in Demo)
            </span>
          </div>
          
          {/* Updated Static Visual for AI */}
          <div className="md:w-1/2 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg min-h-[250px] flex items-center justify-center relative overflow-hidden">
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'radial-gradient(#0B1C33 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
             
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center relative z-10">
               <div className="text-sm text-gray-400 mb-2">AI Analysis Output (Simulation)</div>
               <div className="text-6xl font-extrabold text-brand-green leading-none">85%</div>
               <div className="text-sm font-bold text-brand-navy mt-2 uppercase tracking-wider">Win Probability</div>
               <div className="mt-4 flex gap-2 justify-center">
                 <div className="h-1.5 w-8 bg-brand-green rounded-full"></div>
                 <div className="h-1.5 w-8 bg-brand-green rounded-full"></div>
                 <div className="h-1.5 w-8 bg-brand-green/30 rounded-full"></div>
               </div>
             </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default HowItWorks;