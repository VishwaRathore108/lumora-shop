import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
   ArrowLeft,
   Package,
   Truck,
   CheckCircle,
   MapPin,
   CreditCard,
   Download,
   HelpCircle,
   Phone,
   Calendar,
   ShoppingBag
} from 'lucide-react';

const ViewOrderDetails = () => {
   const navigate = useNavigate();
   const { orderId } = useParams();

   // Mock Order Data
   const ORDER = {
      id: "#ORD-7782",
      date: "Oct 24, 2024 at 10:42 AM",
      status: "In Transit",
      estimatedDelivery: "Oct 26, 2024",
      paymentMethod: "UPI (Google Pay)",
      total: "₹2,598",
      items: [
         {
            id: 1,
            name: "Radiance Vitamin C Serum",
            variant: "30ml",
            qty: 1,
            price: "₹1,299",
            img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200"
         },
         {
            id: 2,
            name: "Velvet Matte Lipstick",
            variant: "Ruby Red",
            qty: 1,
            price: "₹799",
            img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200"
         },
         {
            id: 3,
            name: "Rose Water Toner",
            variant: "100ml",
            qty: 1,
            price: "₹500",
            img: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=200"
         }
      ],
      timeline: [
         { status: "Order Placed", date: "Oct 24, 10:42 AM", completed: true },
         { status: "Packed", date: "Oct 24, 02:30 PM", completed: true },
         { status: "Shipped", date: "Oct 25, 09:15 AM", completed: true },
         { status: "Out for Delivery", date: "Expected Oct 26", completed: false },
         { status: "Delivered", date: "", completed: false },
      ],
      shippingAddress: {
         name: "Ananya Sharma",
         line1: "Flat 402, Krishna Heights",
         line2: "Scheme 54, Ring Road",
         city: "Indore, MP - 452010",
         phone: "+91 98765 43210"
      },
      pricing: {
         subtotal: "₹2,598",
         discount: "-₹0",
         shipping: "Free",
         tax: "₹150", // Included or extra depending on logic
         grandTotal: "₹2,598"
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
                        Order {orderId || ORDER.id}
                     </h2>
                     <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                        <Truck size={12} /> {ORDER.status}
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                     <Calendar size={14} /> Placed on {ORDER.date}
                  </p>
               </div>
            </div>

            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-[#985991] hover:border-[#985991] transition-all">
                  <Download size={16} /> Invoice
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-md shadow-purple-100 transition-transform active:scale-95">
                  <HelpCircle size={16} /> Need Help?
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- 2. LEFT COLUMN (Timeline & Items) --- */}
            <div className="lg:col-span-2 space-y-6">

               {/* Timeline Card */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-6">Order Status</h3>
                  <div className="relative flex justify-between items-start">
                     {/* Connecting Line */}
                     <div className="absolute top-3 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                     <div
                        className="absolute top-3 left-0 h-1 bg-[#985991] -z-10 rounded-full transition-all duration-1000"
                        style={{ width: '60%' }} // Dynamic based on progress
                     ></div>

                     {ORDER.timeline.map((step, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 text-center w-24">
                           <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${step.completed
                              ? "bg-[#985991] border-[#985991] text-white"
                              : "bg-white border-gray-200 text-gray-300"
                              }`}>
                              {step.completed ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-200 rounded-full"></div>}
                           </div>
                           <div>
                              <p className={`text-xs font-bold ${step.completed ? "text-gray-800" : "text-gray-400"}`}>{step.status}</p>
                              <p className="text-[10px] text-gray-500 mt-1">{step.date}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Items List */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <ShoppingBag size={18} className="text-[#985991]" /> Items in Order ({ORDER.items.length})
                  </h3>
                  <div className="divide-y divide-gray-50">
                     {ORDER.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-4">
                           <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{item.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">Variant: {item.variant}</p>
                              <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-[#985991]">{item.price}</p>
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
                        <span className="font-bold">{ORDER.pricing.subtotal}</span>
                     </div>
                     <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>{ORDER.pricing.discount}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-[#985991] font-bold">{ORDER.pricing.shipping}</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                     <span className="font-bold text-gray-800 text-lg">Total</span>
                     <span className="font-bold text-[#985991] text-xl">{ORDER.pricing.grandTotal}</span>
                  </div>
                  <div className="mt-4 bg-gray-50 p-3 rounded-xl flex items-center gap-3 text-xs text-gray-600">
                     <CreditCard size={16} />
                     <span>Paid via {ORDER.paymentMethod}</span>
                  </div>
               </div>

               {/* Shipping Details */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Shipping Details</h3>
                  <div className="flex items-start gap-3">
                     <div className="mt-1 text-[#985991]">
                        <MapPin size={20} />
                     </div>
                     <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-bold text-gray-900">{ORDER.shippingAddress.name}</p>
                        <p>{ORDER.shippingAddress.line1}</p>
                        <p>{ORDER.shippingAddress.line2}</p>
                        <p>{ORDER.shippingAddress.city}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                     <Phone size={16} className="text-gray-400" />
                     <span className="text-sm font-bold text-gray-700">{ORDER.shippingAddress.phone}</span>
                  </div>
               </div>

            </div>

         </div>
      </div>
   );
};

export default ViewOrderDetails;