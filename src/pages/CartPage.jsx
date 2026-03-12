import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

    const handleDecrease = (item) => {
        updateQuantity(item.id, item.selectedShade?.name, item.quantity - 1);
    };

    const handleIncrease = (item) => {
        updateQuantity(item.id, item.selectedShade?.name, item.quantity + 1);
    };

    const itemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pb-16" style={{ paddingTop: 'var(--navbar-height, 200px)' }}>
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
                        Your Bag
                    </h1>
                    <p className="text-sm text-gray-500 mb-10">
                        {itemsCount === 0
                            ? 'Your bag is currently empty.'
                            : `${itemsCount} item${itemsCount > 1 ? 's' : ''} in your bag.`}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-10">
                        {/* Items list */}
                        <section className="space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
                                    Add something from the shop to see it here.
                                </div>
                            ) : (
                                cartItems.map((item, idx) => (
                                    <article
                                        key={`${item.id}-${idx}`}
                                        className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm"
                                    >
                                        <div className="w-24 h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h2 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2">
                                                            {item.name}
                                                        </h2>
                                                        {item.selectedShade && (
                                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                Shade:
                                                                <span
                                                                    className="w-2 h-2 rounded-full inline-block"
                                                                    style={{ backgroundColor: item.selectedShade.color }}
                                                                />
                                                                {item.selectedShade.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(item.id, item.selectedShade?.name)
                                                        }
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="mt-2 text-sm font-semibold text-gray-900">
                                                    ₹{item.price}
                                                </p>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center border border-gray-200 rounded-md">
                                                    <button
                                                        onClick={() => handleDecrease(item)}
                                                        className="p-1.5 px-2 hover:bg-gray-50 text-gray-500"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleIncrease(item)}
                                                        className="p-1.5 px-2 hover:bg-gray-50 text-gray-500"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </section>

                        {/* Summary */}
                        <aside className="bg-white rounded-2xl border border-gray-100 p-6 h-fit shadow-sm">
                            <h2 className="text-lg font-serif text-gray-900 mb-4">
                                Order Summary
                            </h2>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-gray-800">Calculated at checkout</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mb-4 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-800">Total</span>
                                <span className="text-xl font-serif font-semibold text-gray-900">
                                    ₹{cartTotal}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-[#985991] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#7A4774] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CartPage;

