import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Store, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

const FREE_SHIPPING_THRESHOLD = 2000; // Set your amount

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();
  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery' or 'pickup'

  // Calculate progress for free shipping
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  // Animation & global side‑effects
  useEffect(() => {
    // Prevent body scroll when cart is open
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Open / close animation
    if (isCartOpen) {
      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        display: 'block',
      });
      gsap.to(drawerRef.current, {
        x: '0%',
        duration: 0.4,
        ease: 'power3.out',
      });
    } else {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        display: 'none',
      });
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
      });
    }

    // Escape key to close drawer
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  return (
    // Portal-like structure: Fixed container that sits on top of everything
    // z-[9999] ensures it is above navbar and footer
    <div className={`fixed inset-0 z-[9999] pointer-events-none ${isCartOpen ? 'pointer-events-auto' : ''}`}>

      {/* Overlay Backdrop */}
      <div
        ref={overlayRef}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 hidden"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-2xl flex flex-col translate-x-full"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="font-serif text-xl text-gray-900 flex items-center gap-2">
            Your Bag <span className="text-sm font-sans text-gray-500 font-normal">({cartItems.length} items)</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {cartItems.length > 0 && (
          <div className="px-5 py-4 bg-[#FDF2F8] shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
              {progress === 100 ? (
                <span className="flex items-center gap-1 text-green-700"><Truck size={16} /> You've unlocked <b>FREE Shipping</b>!</span>
              ) : (
                <span>Add <span className="text-[#985991]">₹{remaining}</span> for <b>Free Shipping</b></span>
              )}
            </div>
            <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-pink-100">
              <div
                className="h-full bg-[#985991] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your bag is empty.</p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 group">
                <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedShade?.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {item.selectedShade && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        Shade: <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.selectedShade.color }}></span> {item.selectedShade.name}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedShade?.name, item.quantity - 1)}
                        className="p-1 px-2 hover:bg-gray-50 text-gray-500"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedShade?.name, item.quantity + 1)}
                        className="p-1 px-2 hover:bg-gray-50 text-gray-500"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Delivery Mode & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4 shrink-0">

            {/* Delivery Toggle */}
            <div className="bg-white p-1 rounded-lg border border-gray-200 flex text-sm font-medium">
              <button
                onClick={() => setDeliveryMode('delivery')}
                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${deliveryMode === 'delivery' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Truck size={14} /> Delivery
              </button>
              <button
                onClick={() => setDeliveryMode('pickup')}
                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${deliveryMode === 'pickup' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Store size={14} /> Pick Up
              </button>
            </div>

            {deliveryMode === 'pickup' && (
              <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100 text-center">
                Available at <b>Vijay Nagar</b> & <b>Sapna Sangeeta</b> outlets in 2 hours.
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className={progress === 100 || deliveryMode === 'pickup' ? 'text-green-600 font-medium' : ''}>
                  {deliveryMode === 'pickup' ? 'FREE' : (progress === 100 ? 'FREE' : '₹99')}
                </span>
              </div>
              <div className="flex justify-between text-lg font-serif font-medium text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{cartTotal + (deliveryMode === 'pickup' || progress === 100 ? 0 : 99)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-[#985991] text-white py-3.5 rounded-lg font-medium hover:bg-[#7A4774] transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-100 group">
              Proceed to Checkout
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;