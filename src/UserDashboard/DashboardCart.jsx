import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { selectCartItems, selectCartTotal } from '../features/cart/cartSlice';

const DashboardCart = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  if (!cartItems.length) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 md:p-12 text-center shadow-sm">
          <div className="mx-auto h-14 w-14 rounded-full bg-pink-50 text-[#985991] flex items-center justify-center mb-4">
            <ShoppingCart size={24} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Your cart is empty</h3>
          <p className="text-gray-500 mt-2">Looks like you have not added anything yet. Explore products and add your favorites.</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#985991] text-white font-medium hover:bg-[#7A4774] transition-colors"
          >
            <ShoppingBag size={18} />
            Go to Shop
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-6">
        <article className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">My Cart Items</h3>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.selectedShade?.name || 'default'}-${index}`}
                className="flex items-start gap-4 p-3 rounded-2xl border border-gray-100"
              >
                <div className="h-20 w-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  {item.selectedShade?.name && (
                    <p className="text-xs text-gray-500 mt-1">Shade: {item.selectedShade.name}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Rs {(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <aside className="h-fit bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Cart Summary</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>Rs {Number(cartTotal).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-medium text-gray-900">Total</span>
            <span className="text-xl font-semibold text-gray-900">Rs {Number(cartTotal).toFixed(2)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-5 w-full px-4 py-3 rounded-xl bg-[#985991] text-white font-semibold hover:bg-[#7A4774] transition-colors"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </section>
  );
};

export default DashboardCart;
