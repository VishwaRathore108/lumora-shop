import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Sparkles, Bot, Zap, MessageSquare, BrainCircuit, ArrowRight } from 'lucide-react';

const GenerativeAI = () => {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm mb-8 shadow-lg shadow-blue-500/30 animate-pulse">
            <Sparkles size={16} /> LeadCore Intelligence Layer
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
            Meet Your New <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">AI Sales Employee</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed">
            Stop writing emails manually. Our GenAI doesn't just draft text—it understands context, negotiates terms, and schedules meetings autonomously.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:scale-105 flex items-center gap-2">
              Deploy AI Agent <ArrowRight size={18} />
            </button>
            <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- FEATURE GRID (Glass Cards) --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Autonomous Agents</h3>
              <p className="text-slate-500 leading-relaxed">Agents that work 24/7 to nurture leads, answer queries, and book meetings while you sleep.</p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Hyper-Personalization</h3>
              <p className="text-slate-500 leading-relaxed">Generates unique outreach for every prospect based on their LinkedIn activity and company news.</p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare size={32} className="text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Instant Context</h3>
              <p className="text-slate-500 leading-relaxed">Summarizes hour-long calls into actionable bullet points and updates the CRM in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GenerativeAI;