import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen py-16" style={{ paddingTop: 'var(--navbar-height, 200px)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-serif text-[#985991] mb-2 text-center">Contact Us</h1>
          <p className="text-center text-gray-500 mb-10">We'd love to hear from you!</p>

          <form className="space-y-6 bg-pink-50 p-8 rounded-2xl border border-pink-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#985991]" placeholder="Your Name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#985991]" placeholder="hello@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#985991]" placeholder="How can we help?"></textarea>
            </div>

            <button className="w-full bg-[#985991] text-white py-3 rounded-lg font-medium hover:bg-[#7A4774] transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;