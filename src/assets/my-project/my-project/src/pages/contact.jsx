import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <div>
            <div className="inline-block px-3 py-1 bg-brand-beige text-brand-navy text-xs font-bold rounded-full mb-4">
              Contact Sales
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy mb-6">
              Let's Scale Your <br /> 
              <span className="text-brand-green">Revenue Together.</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Have questions about pricing, integrations, or enterprise features? Our team is ready to help you upgrade your sales process.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-brand-navy rounded-xl flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Email us</p>
                  <p className="text-lg font-bold text-brand-navy">hello@leadcore.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-brand-green rounded-xl flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Call us</p>
                  <p className="text-lg font-bold text-brand-navy">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-brand-gold rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Visit us</p>
                  <p className="text-lg font-bold text-brand-navy">Mumbai, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Form */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Send a Message</h3>
            
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-navy focus:bg-white transition-all" placeholder="Rahul" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-navy focus:bg-white transition-all" placeholder="Sharma" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-navy focus:bg-white transition-all" placeholder="rahul@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-navy focus:bg-white transition-all" placeholder="Tech Solutions Pvt Ltd" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-navy focus:bg-white transition-all" placeholder="Tell us about your requirements..."></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/20">
                Send Request <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;