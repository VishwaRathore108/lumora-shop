import React from 'react';
import { Zap, BarChart3, ShieldCheck } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-24 bg-brand-beige/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Why Industry Leaders Choose Leadcore</h2>
          <p className="text-gray-500">We replaced the clutter of traditional CRMs with a system that actually helps you sell.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="text-white" size={24} />}
            title="AI Automation"
            desc="Stop manual data entry. Our AI captures leads from emails and LinkedIn automatically."
            color="bg-brand-navy"
          />
          <FeatureCard 
            icon={<BarChart3 className="text-white" size={24} />}
            title="Predictive Scoring"
            desc="Know exactly who will buy. Our scoring engine predicts revenue with 94% accuracy."
            color="bg-brand-green"
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-white" size={24} />}
            title="Enterprise Security"
            desc="Bank-grade encryption keeps your customer data safe. Compliant with GDPR & SOC2."
            color="bg-brand-gold"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-brand-navy mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default Features;