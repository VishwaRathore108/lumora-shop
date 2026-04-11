import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package } from 'lucide-react';
import api from '../services/apiClient';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderIdValue = orderId.trim();
    const emailValue = email.trim();
    const mobileValue = mobile.trim();
    if (!orderIdValue) {
      setError('Please enter order id.');
      return;
    }
    if (!emailValue && !mobileValue) {
      setError('Please enter email or mobile.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await api.post('/orders/track', {
        orderId: orderIdValue,
        email: emailValue,
        mobile: mobileValue,
      });
      if (response.data?.success && response.data?.order) {
        setResult(response.data.order);
      } else {
        setError('Order not found.');
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to track order.');
    } finally {
      setLoading(false);
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
            <p className="text-gray-500">Enter your order ID and email/mobile to check delivery status</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-pink-50/50 p-8 rounded-2xl border border-pink-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#985991]"
                placeholder="Order id shown in your order details"
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile (optional)</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#985991]"
                placeholder="Mobile used for this order"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#985991] text-white py-3 rounded-lg font-medium hover:bg-[#7A4774] transition-colors"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100 text-center">
              <p className="text-sm text-gray-700 font-medium">
                Order #{String(result._id || '').slice(-8).toUpperCase()} is currently{' '}
                <span className="capitalize">{result.orderStatus || result.status}</span>.
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Total: Rs {Number(result.totalAmount || 0).toLocaleString('en-IN')} | Payment:{' '}
                {String(result.paymentStatus || 'pending').toUpperCase()}
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
