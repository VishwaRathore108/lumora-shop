import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, HandCoins, MapPinHouse, PlusCircle, Sparkles, Tag, Trash2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/apiClient';
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import { selectToken } from '../features/auth/authSlice';
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  selectAddress,
  selectCheckoutError,
  selectCheckoutLoading,
  selectSavedAddresses,
  selectSelectedAddress,
  selectSelectedAddressId,
  selectSelectedPaymentMethod,
  setDefaultAddress,
  selectPaymentMethod,
} from '../features/checkout/checkoutSlice';
import { createOrder } from '../features/orders/orderSlice';
import {
  clearAppliedCoupon,
  clearCouponFieldError,
  clearEligibleSuggestions,
  fetchEligibleCoupons,
  selectAppliedCoupon,
  selectCouponFieldError,
  selectCouponValidateLoading,
  selectEligibleCoupons,
  selectEligibleCouponsLoading,
  validateCoupon,
} from '../features/coupons/couponSlice';

const INITIAL_ADDRESS_FORM = {
  fullName: '',
  phone: '',
  pincode: '',
  city: '',
  state: '',
  streetAddress: '',
};

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

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const token = useSelector(selectToken);
  const savedAddresses = useSelector(selectSavedAddresses);
  const selectedAddress = useSelector(selectSelectedAddress);
  const selectedAddressId = useSelector(selectSelectedAddressId);
  const selectedPaymentMethod = useSelector(selectSelectedPaymentMethod);
  const addressLoading = useSelector(selectCheckoutLoading);
  const addressError = useSelector(selectCheckoutError);
  const eligibleCoupons = useSelector(selectEligibleCoupons);
  const eligibleLoading = useSelector(selectEligibleCouponsLoading);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const couponValidateLoading = useSelector(selectCouponValidateLoading);
  const couponFieldError = useSelector(selectCouponFieldError);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS_FORM);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const cartSignature = useMemo(
    () => cartItems.map((item) => `${item.id}:${item.quantity}`).join('|'),
    [cartItems]
  );

  const shippingCost = useMemo(() => (cartTotal >= 999 ? 0 : 99), [cartTotal]);
  const merchandiseAfterDiscount = appliedCoupon
    ? Number(appliedCoupon.merchandiseAfterDiscount ?? cartTotal)
    : cartTotal;
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const finalTotal = merchandiseAfterDiscount + shippingCost;

  useEffect(() => {
    if (!token) {
      setErrorMsg('Please login to continue checkout.');
      navigate('/login', { replace: true, state: { redirectTo: '/checkout' } });
      return;
    }
    dispatch(fetchAddresses());
  }, [dispatch, navigate, token]);

  useEffect(() => {
    dispatch(clearAppliedCoupon());
  }, [cartSignature, dispatch]);

  useEffect(() => {
    if (!token) return;
    if (!cartItems.length) {
      dispatch(clearEligibleSuggestions());
      return;
    }
    dispatch(fetchEligibleCoupons(cartItems));
  }, [dispatch, token, cartSignature, cartItems]);

  const handleAddressInputChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAddress = async (event) => {
    event.preventDefault();
    const isFormInvalid = Object.values(addressForm).some((value) => !String(value).trim());
    if (isFormInvalid) {
      setErrorMsg('Please fill all address fields before saving.');
      return;
    }

    try {
      await dispatch(
        createAddress({
          label: 'Home',
          fullName: addressForm.fullName,
          phone: addressForm.phone,
          pincode: addressForm.pincode,
          city: addressForm.city,
          state: addressForm.state,
          line1: addressForm.streetAddress,
          line2: '',
        })
      ).unwrap();
      setAddressForm(INITIAL_ADDRESS_FORM);
      setShowAddressForm(false);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg(String(error || 'Failed to save address.'));
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setErrorMsg('Please select or add a shipping address to continue.');
      return;
    }
    if (!cartItems.length) {
      setErrorMsg('Your cart is empty. Add items before placing an order.');
      return;
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price || 0),
      })),
      address: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        line1: selectedAddress.line1 || selectedAddress.streetAddress,
        line2: selectedAddress.line2 || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      },
      paymentMethod: selectedPaymentMethod,
      ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
    };

    if (selectedPaymentMethod === 'cod') {
      try {
        const created = await dispatch(createOrder(orderPayload)).unwrap();
        dispatch(clearCart());
        setErrorMsg('');
        alert('Order placed successfully.');
        navigate(`/user/orders/${created?._id || ''}`);
      } catch (error) {
        setErrorMsg(String(error || 'Failed to place order.'));
      }
      return;
    }

    try {
      setIsProcessingPayment(true);
      setErrorMsg('');

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMsg('Unable to load Razorpay checkout. Please try again.');
        return;
      }

      const [orderRes, keyRes] = await Promise.all([
        api.post('/payments/create-order', { amount: finalTotal, currency: 'INR' }),
        api.get('/payments/key'),
      ]);

      const order = orderRes.data?.order;
      const key = keyRes.data?.key;
      if (!order || !key) {
        setErrorMsg('Failed to initialize payment. Please try again.');
        return;
      }

      const razorpay = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Lumora Shop',
        description: 'Order Payment',
        order_id: order.id,
        prefill: {
          name: selectedAddress.fullName,
          contact: selectedAddress.phone,
        },
        theme: {
          color: '#985991',
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', response);
            if (verifyRes.data?.success) {
              const paidOrderPayload = {
                ...orderPayload,
                paymentMethod: 'razorpay',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
              };
              const created = await dispatch(createOrder(paidOrderPayload)).unwrap();
              dispatch(clearCart());
              alert('Payment successful and order created.');
              navigate(`/user/orders/${created?._id || ''}`);
            } else {
              setErrorMsg('Payment received but verification failed.');
            }
          } catch (error) {
            console.error('Payment verify error:', error);
            setErrorMsg('Payment verification failed. Please contact support.');
          }
        },
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment start error:', error);
      setErrorMsg('Unable to start payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen bg-gray-50 pb-16"
        style={{ paddingTop: 'var(--navbar-height, 200px)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-2 mb-8">
            Confirm delivery details and choose your payment option.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10">
            <section className="space-y-6">
              <article className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg md:text-xl font-serif text-gray-900">
                    1. Shipping Address
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm((prev) => !prev)}
                    className="inline-flex items-center gap-2 text-[#985991] text-sm font-medium hover:text-[#7A4774]"
                  >
                    <PlusCircle size={16} />
                    Add New Address
                  </button>
                </div>

                <div className="space-y-3">
                  {addressLoading && (
                    <p className="text-sm text-gray-500">Loading your saved addresses...</p>
                  )}
                  {savedAddresses.map((address) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <label
                        key={address.id}
                        className={`block rounded-xl border p-4 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-[#985991] bg-[#fbf7fb]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={isSelected}
                            onChange={() => {
                              dispatch(selectAddress(address.id));
                              dispatch(setDefaultAddress(address.id));
                            }}
                            className="mt-1 accent-[#985991]"
                          />
                          <div className="text-sm text-gray-700">
                            <p className="font-semibold text-gray-900">{address.fullName}</p>
                            <p>{address.phone}</p>
                            <p>
                              {address.streetAddress}, {address.city}, {address.state} -{' '}
                              {address.pincode}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              dispatch(deleteAddress(address.id));
                            }}
                            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Delete address"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {addressError && (
                  <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
                    {addressError}
                  </p>
                )}

                {showAddressForm && (
                  <form onSubmit={handleCreateAddress} className="mt-5 pt-5 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={addressForm.fullName}
                        onChange={handleAddressInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#985991]"
                      />
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={addressForm.phone}
                        onChange={handleAddressInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#985991]"
                      />
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#985991]"
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={handleAddressInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#985991]"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={handleAddressInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#985991]"
                      />
                      <input
                        type="text"
                        name="streetAddress"
                        placeholder="Street Address"
                        value={addressForm.streetAddress}
                        onChange={handleAddressInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#985991]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-colors"
                    >
                      Save Address
                    </button>
                  </form>
                )}
              </article>

              <article className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg md:text-xl font-serif text-gray-900 mb-4">
                  2. Payment Method
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'razorpay'
                        ? 'border-[#985991] bg-[#fbf7fb]'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod === 'razorpay'}
                      onChange={() => dispatch(selectPaymentMethod('razorpay'))}
                      className="accent-[#985991]"
                    />
                    <CreditCard size={20} className="text-[#985991]" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Razorpay</p>
                      <p className="text-gray-500">Cards, UPI, NetBanking</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'cod'
                        ? 'border-[#985991] bg-[#fbf7fb]'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod === 'cod'}
                      onChange={() => dispatch(selectPaymentMethod('cod'))}
                      className="accent-[#985991]"
                    />
                    <HandCoins size={20} className="text-[#985991]" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-gray-500">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
              </article>

              <article className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg md:text-xl font-serif text-gray-900 mb-4 flex items-center gap-2">
                  <Tag size={20} className="text-[#985991]" />
                  3. Promo code
                </h2>
                {couponFieldError && (
                  <div className="mb-3 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <span className="font-medium shrink-0">Could not apply:</span>
                    <span>{couponFieldError}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      dispatch(clearCouponFieldError());
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-mono uppercase tracking-wide focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-[#985991]/30"
                  />
                  <button
                    type="button"
                    disabled={couponValidateLoading || !couponInput.trim() || !cartItems.length}
                    onClick={() =>
                      dispatch(validateCoupon({ couponCode: couponInput.trim(), cartItems }))
                    }
                    className="sm:w-32 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponValidateLoading ? '…' : 'Apply'}
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-green-200 bg-green-50/80 px-3 py-2 text-sm text-green-900">
                    <span>
                      Applied <strong className="font-mono">{appliedCoupon.code}</strong> —{' '}
                      {appliedCoupon.discountPercentage}% off
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(clearAppliedCoupon());
                        setCouponInput('');
                      }}
                      className="p-1 rounded-lg text-green-800 hover:bg-green-100"
                      aria-label="Remove coupon"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#985991]" />
                    Suggested for you
                  </p>
                  {eligibleLoading ? (
                    <p className="text-sm text-gray-500">Finding eligible offers…</p>
                  ) : eligibleCoupons.length === 0 ? (
                    <p className="text-sm text-gray-500">No auto-suggestions for this cart. Try a code above.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {eligibleCoupons.slice(0, 4).map((c) => (
                        <li key={c._id}>
                          <button
                            type="button"
                            onClick={() => {
                              setCouponInput(c.code);
                              dispatch(clearCouponFieldError());
                              dispatch(validateCoupon({ couponCode: c.code, cartItems }));
                            }}
                            className="w-full text-left rounded-xl border border-gray-200 hover:border-[#985991]/50 hover:bg-[#fbf7fb] px-4 py-3 transition-colors group"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <p className="font-mono font-bold text-[#985991]">{c.code}</p>
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                  {c.description || c.name}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 shrink-0">
                                {c.discountPercentage}% off
                              </span>
                            </div>
                            {Number(c.discountAmount) > 0 && (
                              <p className="text-xs text-green-700 mt-2">
                                Save ₹{Number(c.discountAmount).toFixed(0)} on this order
                              </p>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </section>

            <aside className="lg:sticky lg:top-6 h-fit bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-serif text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-56 overflow-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500">No items in your cart.</p>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-start gap-3">
                      <div className="h-14 w-12 rounded-md overflow-hidden border border-gray-100 bg-gray-50">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-gray-500">
                          Qty: {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Original total (items)</span>
                  <span>₹{Number(cartTotal).toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>
                      Discount (code:{' '}
                      <span className="font-mono font-semibold">{appliedCoupon.code}</span>)
                    </span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>After discount</span>
                    <span>₹{merchandiseAfterDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Final amount</span>
                <span className="text-2xl font-serif text-gray-900">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {errorMsg && (
                <p className="mb-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!cartItems.length || !selectedAddress || isProcessingPayment}
                className="w-full bg-[#985991] text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-[#7A4774] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MapPinHouse size={16} />
                {isProcessingPayment
                  ? 'Processing...'
                  : selectedPaymentMethod === 'razorpay'
                    ? 'Proceed to Pay'
                    : 'Place Order'}
              </button>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
