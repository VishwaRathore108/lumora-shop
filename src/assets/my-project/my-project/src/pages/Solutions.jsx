import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Building2, Rocket, ArrowRight, BarChart, Users, Globe } from 'lucide-react';

const Solutions = () => {
  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Solutions for Every Stage</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Whether you are a day-one Startup or a global Enterprise, Leadcore adapts to your workflow.
        </p>
      </div>

      {/* Split Section */}
      <div className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
           
           {/* Startup Card */}
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                 <Rocket size={32} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">For Startups</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                 Move fast and break things, but not your sales process. Get setup in minutes and start closing your first 100 customers with automated outreach.
              </p>
              <a href="#" className="text-blue-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                 View Startup Kit <ArrowRight size={18} />
              </a>
           </div>

           {/* Enterprise Card */}
           <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 group text-white">
              <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mb-8">
                 <Building2 size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">For Enterprise</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                 Bank-grade security, role-based access control, and custom AI model training. Scale your revenue operations without the chaos.
              </p>
              <a href="#" className="text-white font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                 Contact Sales Team <ArrowRight size={18} />
              </a>
           </div>

        </div>
      </div>

      {/* Roles Grid */}
      <div className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
           <h3 className="text-2xl font-bold text-center mb-16">Built for every role in your team</h3>
           <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                 <div className="bg-green-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"><BarChart className="text-green-600"/></div>
                 <h4 className="font-bold text-lg mb-2">Sales Managers</h4>
                 <p className="text-sm text-slate-500">Track pipeline health and agent performance in real-time.</p>
              </div>
              <div className="text-center">
                 <div className="bg-purple-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"><Users className="text-purple-600"/></div>
                 <h4 className="font-bold text-lg mb-2">SDRs & AEs</h4>
                 <p className="text-sm text-slate-500">Eliminate data entry and focus on closing deals.</p>
              </div>
              <div className="text-center">
                 <div className="bg-orange-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"><Globe className="text-orange-600"/></div>
                 <h4 className="font-bold text-lg mb-2">Marketing</h4>
                 <p className="text-sm text-slate-500">Attribute revenue to campaigns with AI-driven attribution.</p>
              </div>
           </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Solutions;