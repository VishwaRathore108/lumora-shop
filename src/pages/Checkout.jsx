import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, HandCoins, MapPinHouse, PlusCircle, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/apiClient';
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
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
  const savedAddresses = useSelector(selectSavedAddresses);
  const selectedAddress = useSelector(selectSelectedAddress);
  const selectedAddressId = useSelector(selectSelectedAddressId);
  const selectedPaymentMethod = useSelector(selectSelectedPaymentMethod);
  const addressLoading = useSelector(selectCheckoutLoading);
  const addressError = useSelector(selectCheckoutError);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS_FORM);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const shippingCost = useMemo(() => (cartTotal >= 999 ? 0 : 99), [cartTotal]);
  const finalTotal = cartTotal + shippingCost;

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

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
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-serif text-gray-900">₹{finalTotal}</span>
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
