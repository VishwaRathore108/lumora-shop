import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Check, X } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="font-sans bg-white min-h-screen">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-500">No hidden fees. Cancel anytime.</p>
          
          {/* Toggle (Visual Only) */}
          <div className="mt-8 inline-flex bg-slate-100 p-1 rounded-full">
             <button className="px-6 py-2 bg-white rounded-full shadow-sm text-sm font-bold text-slate-900">Monthly</button>
             <button className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900">Yearly (Save 20%)</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          
          {/* STARTER CARD */}
          <div className="p-10 rounded-[2.5rem] border border-slate-200 hover:border-blue-200 transition-all duration-300">
            <h3 className="font-bold text-xl mb-2 text-slate-900">Starter</h3>
            <p className="text-slate-500 text-sm mb-6">For individuals and side projects.</p>
            <div className="text-5xl font-extrabold mb-6 text-slate-900">₹999<span className="text-lg font-medium text-slate-400">/mo</span></div>
            <button className="w-full py-4 border-2 border-slate-900 rounded-xl font-bold mb-8 hover:bg-slate-900 hover:text-white transition-colors">Get Started</button>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
               <li className="flex gap-3"><Check size={18} className="text-green-500"/> 1,000 Leads</li>
               <li className="flex gap-3"><Check size={18} className="text-green-500"/> Basic AI Scoring</li>
               <li className="flex gap-3"><Check size={18} className="text-green-500"/> Email Support</li>
               <li className="flex gap-3 opacity-50"><X size={18}/> <span>GenAI Agents</span></li>
            </ul>
          </div>
          
          {/* PRO CARD (Highlighted) */}
          <div className="relative p-10 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl transform scale-105 z-10">
            <div className="absolute top-0 right-0 bg-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-[2rem]">MOST POPULAR</div>
            <h3 className="font-bold text-xl mb-2 text-blue-100">Pro Growth</h3>
            <p className="text-blue-200 text-sm mb-6">For growing sales teams.</p>
            <div className="text-5xl font-extrabold mb-6">₹2,999<span className="text-lg font-medium text-blue-200">/mo</span></div>
            <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold mb-8 hover:bg-blue-50 transition-colors shadow-lg">Start Free Trial</button>
            <ul className="space-y-4 text-sm text-blue-50 font-medium">
               <li className="flex gap-3"><Check size={18} className="text-white"/> Unlimited Leads</li>
               <li className="flex gap-3"><Check size={18} className="text-white"/> Generative AI Agents</li>
               <li className="flex gap-3"><Check size={18} className="text-white"/> CRM Integration</li>
               <li className="flex gap-3"><Check size={18} className="text-white"/> Priority Support</li>
            </ul>
          </div>

          {/* ENTERPRISE CARD */}
          <div className="p-10 rounded-[2.5rem] border border-slate-200 hover:border-blue-200 transition-all duration-300">
            <h3 className="font-bold text-xl mb-2 text-slate-900">Enterprise</h3>
            <p className="text-slate-500 text-sm mb-6">For large organizations.</p>
            <div className="text-5xl font-extrabold mb-6 text-slate-900">Custom</div>
            <button className="w-full py-4 border-2 border-slate-900 rounded-xl font-bold mb-8 hover:bg-slate-900 hover:text-white transition-colors">Contact Sales</button>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
               <li className="flex gap-3"><Check size={18} className="text-green-500"/> Custom LLM Models</li>
               <li className="flex gap-3"><Check size={18} className="text-green-500"/> Dedicated Success Manager</li>
               <li className="flex gap-3"><Check size={18} className="text-green-500"/> SSO & Advanced Security</li>
               <li className="flex gap-3"><Check size={18} className="text-green-500"/> API Access</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;