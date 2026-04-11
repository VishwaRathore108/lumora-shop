import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
   ArrowLeft,
   CheckCircle,
   MapPin,
   CreditCard,
   Calendar,
   ShoppingBag,
} from 'lucide-react';
import api from '../services/apiClient';
import {
   fetchMyOrderById,
   payNowForCodOrder,
   selectMyOrderDetails,
   selectOrdersError,
   selectOrdersLoading,
} from '../features/orders/orderSlice';

const loadRazorpayScript = () => new Promise((resolve) => {
   if (window.Razorpay) {
      resolve(true);
      return;
   }
   const script = document.createElement('script');
   script.src = 'https://checkout.razorpay.com/v1/checkout.js';
   script.onload = () => resolve(true);
   script.onerror = () => resolve(false);
   document.body.appendChild(script);
});

const ViewOrderDetails = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { orderId } = useParams();
   const order = useSelector(selectMyOrderDetails);
   const loading = useSelector(selectOrdersLoading);
   const error = useSelector(selectOrdersError);

   useEffect(() => {
      if (orderId) dispatch(fetchMyOrderById(orderId));
   }, [dispatch, orderId]);

   if (loading) {
      return <div className="p-8 text-gray-500">Loading order details...</div>;
   }

   if (error) {
      return <div className="p-8 text-red-600">{error}</div>;
   }

   if (!order) {
      return <div className="p-8 text-gray-500">Order not found.</div>;
   }

   const timeline = Array.isArray(order.statusHistory) ? order.statusHistory : [];
   const shippingAddress = order.shippingAddress || {};
   const canPayNow =
      String(order.paymentMethod || '').toLowerCase() === 'cod' &&
      String(order.paymentStatus || '').toLowerCase() !== 'paid' &&
      !['cancelled', 'delivered'].includes(String(order.orderStatus || '').toLowerCase());

   const handlePayNow = async () => {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
         alert('Unable to load payment gateway. Please try again.');
         return;
      }
      try {
         const [orderRes, keyRes] = await Promise.all([
            api.post('/payments/create-order', { amount: Number(order.totalAmount || 0), currency: 'INR' }),
            api.get('/payments/key'),
         ]);
         const payOrder = orderRes.data?.order;
         const key = keyRes.data?.key;
         if (!payOrder || !key) {
            alert('Failed to start payment.');
            return;
         }
         const razorpay = new window.Razorpay({
            key,
            amount: payOrder.amount,
            currency: payOrder.currency,
            name: 'Lumora Shop',
            description: 'COD Order Pay Now',
            order_id: payOrder.id,
            theme: { color: '#985991' },
            handler: async (response) => {
               await dispatch(
                  payNowForCodOrder({
                     orderId: order._id,
                     razorpayOrderId: response.razorpay_order_id,
                     razorpayPaymentId: response.razorpay_payment_id,
                     razorpaySignature: response.razorpay_signature,
                  })
               );
               dispatch(fetchMyOrderById(order._id));
               alert('Payment completed successfully.');
            },
         });
         razorpay.open();
      } catch (paymentError) {
         console.error('handlePayNow error:', paymentError);
         alert('Unable to start payment.');
      }
   };

   return (
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-in slide-in-from-right duration-500">

         {/* --- 1. HEADER & NAVIGATION --- */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
               <button
                  onClick={() => navigate('/user/orders')}
                  className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-[#985991] transition-colors"
               >
                  <ArrowLeft size={20} />
               </button>
               <div>
                  <div className="flex items-center gap-3">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                     </h2>
                     <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1 capitalize">
                        {order.orderStatus || order.status}
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                     <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
               </div>
            </div>

            <div className="text-sm text-gray-600 capitalize">Payment: {order.paymentStatus}</div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- 2. LEFT COLUMN (Timeline & Items) --- */}
            <div className="lg:col-span-2 space-y-6">

               {/* Timeline Card */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-6">Order Status</h3>
                  <div className="space-y-3">
                     {timeline.map((step, index) => (
                        <div key={`${step.status}-${index}`} className="flex items-start gap-3">
                           <div className="mt-0.5 text-[#985991]">
                              <CheckCircle size={16} />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-gray-800 capitalize">{step.status}</p>
                              <p className="text-xs text-gray-500">{new Date(step.changedAt).toLocaleString('en-IN')}</p>
                              {step.note && <p className="text-xs text-gray-500 mt-0.5">{step.note}</p>}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Items List */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <ShoppingBag size={18} className="text-[#985991]" /> Items in Order ({(order.items || []).length})
                  </h3>
                  <div className="divide-y divide-gray-50">
                     {(order.items || []).map((item, idx) => (
                        <div key={`${item.product?._id || idx}`} className="flex items-center gap-4 py-4">
                           <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                              <img src={item.product?.images?.[0] || 'https://placehold.co/80x80?text=Item'} alt={item.product?.name || 'Item'} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{item.product?.name || 'Product'}</h4>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-[#985991]">₹{Number(item.price || 0).toLocaleString('en-IN')}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

            {/* --- 3. RIGHT COLUMN (Summary & Info) --- */}
            <div className="space-y-6">

               {/* Payment Summary */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm text-gray-600 border-b border-gray-50 pb-4">
                     <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-[#985991] font-bold">Included</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                     <span className="font-bold text-gray-800 text-lg">Total</span>
                     <span className="font-bold text-[#985991] text-xl">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-4 bg-gray-50 p-3 rounded-xl flex items-center gap-3 text-xs text-gray-600">
                     <CreditCard size={16} />
                     <span>Paid via {String(order.paymentMethod || 'cod').toUpperCase()}</span>
                  </div>
                  {canPayNow ? (
                     <>
                        <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2">
                           Payment is pending. Your order will not be delivered until payment is completed.
                        </p>
                        <button
                           type="button"
                           onClick={handlePayNow}
                           className="mt-3 w-full bg-[#985991] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#7A4774]"
                        >
                           Pay Now
                        </button>
                     </>
                  ) : null}
               </div>

               {/* Shipping Details */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Shipping Details</h3>
                  <div className="flex items-start gap-3">
                     <div className="mt-1 text-[#985991]">
                        <MapPin size={20} />
                     </div>
                     <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-bold text-gray-900">{shippingAddress.fullName}</p>
                        <p>{shippingAddress.line1}</p>
                        {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                     </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-sm font-bold text-gray-700">{shippingAddress.phone}</div>
               </div>

               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">Assigned Driver</h3>
                  <p className="text-sm text-gray-700">
                     {order.delivery?.assignedDriver?.name || 'Not assigned yet'}
                  </p>
                  <p className="text-xs text-gray-500">
                     {order.delivery?.assignedDriver?.mobile || 'Driver contact not available'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                     Assignment status: {(order.delivery?.assignmentStatus || 'unassigned').toUpperCase()}
                  </p>
               </div>

            </div>

         </div>
      </div>
   );
};

export default ViewOrderDetails;