import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId.trim() && email.trim()) {
      setSubmitted(true);
      // In a real app, this would call an API to fetch order status
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen py-16" style={{ paddingTop: 'var(--navbar-height, 200px)' }}>
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#985991]/10 mb-4">
              <Package className="w-8 h-8 text-[#985991]" />
            </div>
            <h1 className="text-3xl font-serif text-[#985991] mb-2">Track Your Order</h1>
            <p className="text-gray-500">Enter your order ID and email to check delivery status</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-pink-50/50 p-8 rounded-2xl border border-pink-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#985991]"
                placeholder="e.g. ORD123456"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#985991]"
                placeholder="Email used for this order"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#985991] text-white py-3 rounded-lg font-medium hover:bg-[#7A4774] transition-colors"
            >
              Track Order
            </button>
          </form>

          {submitted && (
            <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100 text-center">
              <p className="text-sm text-gray-700">
                We've received your request. Check your email for order status updates, or visit{' '}
                <a href="/user/orders" className="text-[#985991] font-medium underline">My Orders</a> if you're logged in.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Can't find your order? <a href="/contact" className="text-[#985991] font-medium hover:underline">Contact us</a> for assistance.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;
