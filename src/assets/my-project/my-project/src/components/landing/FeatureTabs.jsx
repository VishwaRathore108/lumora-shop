import React, { useState } from 'react';
import { Mail, Linkedin, BarChart, PieChart, Zap } from 'lucide-react';

// Dummy Data for Features
const featuresData = [
  {
    id: 'capture',
    icon: Mail,
    title: "Smart Lead Capture",
    desc: "Automatically connect emails and web forms. We extract contact details without manual entry.",
    mockupBg: "bg-blue-50",
    mockupContent: (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Linkedin size={16} className="text-blue-600"/></div>
          <div><p className="font-semibold text-brand-navy">New Inquiry: Rahul Sharma</p><p className="text-xs text-gray-500">Source: LinkedIn • Added 2m ago</p></div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100 opacity-70">
           <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><Mail size={16} className="text-green-600"/></div>
           <div><p className="font-semibold text-brand-navy">Email Open: Priya Inc.</p><p className="text-xs text-gray-500">Campaign #3 • Added 15m ago</p></div>
        </div>
      </div>
    )
  },
  {
    id: 'scoring',
    icon: Zap,
    title: "AI Win Probability (Static Demo)",
    desc: "Our AI models analyze 50+ signals to predict which leads are ready to buy right now.",
    mockupBg: "bg-green-50",
    mockupContent: (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center mb-4 relative">
          <Zap size={40} className="text-brand-green" />
          <span className="absolute top-0 right-0 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-brand-green"></span></span>
        </div>
        <h3 className="text-4xl font-bold text-brand-navy mb-1">92% Score</h3>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">High Intent Signal</p>
        <div className="mt-6 text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">Adding this feature soon</div>
      </div>
    )
  },
  {
    id: 'pipeline',
    icon: PieChart,
    title: "Visual Pipeline",
    desc: "Drag-and-drop deals through stages. See your entire revenue forecast at a glance.",
    mockupBg: "bg-brand-beige",
    mockupContent: (
      <div className="p-4 flex gap-3 h-full overflow-hidden">
        <div className="w-1/2 bg-white/50 rounded-xl border border-gray-200/50 p-2 space-y-2">
           <div className="text-xs font-semibold text-gray-500 ml-1">Qualified</div>
           <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100"><div className="h-2 w-20 bg-brand-navy/20 rounded mb-1"></div><div className="h-2 w-10 bg-gray-100 rounded"></div></div>
           <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100"><div className="h-2 w-16 bg-brand-navy/20 rounded mb-1"></div><div className="h-2 w-8 bg-gray-100 rounded"></div></div>
        </div>
        <div className="w-1/2 bg-white/50 rounded-xl border border-gray-200/50 p-2 space-y-2">
           <div className="text-xs font-semibold text-gray-500 ml-1">Negotiation</div>
           <div className="bg-white p-3 rounded-lg shadow-md border-l-4 border-brand-green"><div className="h-3 w-24 bg-brand-navy/80 rounded mb-2"></div><div className="h-2 w-12 bg-gray-200 rounded"></div></div>
        </div>
      </div>
    )
  },
];

const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState(featuresData[0].id);

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Everything You Need to Close More Deals</h2>
          <p className="text-gray-500">Explore the powerful features built for modern sales teams.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Side: Tab Buttons */}
          <div className="lg:w-2/5 space-y-4">
            {featuresData.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all duration-300 text-left group ${
                  activeTab === feature.id 
                    ? 'bg-brand-beige border-brand-navy/10 shadow-md scale-[1.02]' 
                    : 'hover:bg-gray-50 border-transparent'
                } border`}
              >
                <div className={`p-3 rounded-lg ${activeTab === feature.id ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-brand-navy/10 group-hover:text-brand-navy'} transition-colors`}>
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${activeTab === feature.id ? 'text-brand-navy' : 'text-gray-700'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${activeTab === feature.id ? 'text-gray-600' : 'text-gray-500'}`}>
                    {feature.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Side: Mockup Display Area */}
          <div className="lg:w-3/5 h-[450px] relative">
            {featuresData.map((feature) => (
               <div 
                 key={feature.id}
                 className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 transition-all duration-500 ${feature.mockupBg} ${
                   activeTab === feature.id ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-8 z-0'
                 }`}
               >
                 {/* Fake Browser Header */}
                 <div className="h-8 bg-white/80 border-b border-gray-100 flex items-center px-4 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                 </div>
                 {/* Content */}
                 <div className="h-[calc(100%-32px)]">
                    {feature.mockupContent}
                 </div>
               </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureTabs;