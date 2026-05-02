export const SHIPPING_RULES = Object.freeze({
  lowTierMax: 499.99,
  midTierMax: 998.99,
  lowTierFee: 70,
  midTierFee: 30,
  freeShippingMin: 999,
});

export const calculateShippingPrice = (subtotal = 0) => {
  const amount = Number(subtotal);
  if (!Number.isFinite(amount) || amount <= 0) return SHIPPING_RULES.lowTierFee;
  if (amount < 500) return SHIPPING_RULES.lowTierFee;
  if (amount < SHIPPING_RULES.freeShippingMin) return SHIPPING_RULES.midTierFee;
  return 0;
};

export const calculateCartSubtotal = (cartItems = []) =>
  cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

export const calculateCartPricing = ({ cartItems = [], discount = 0 } = {}) => {
  const subtotal = calculateCartSubtotal(cartItems);
  const shippingPrice = calculateShippingPrice(subtotal);
  const discountAmount = Number(discount) || 0;
  const totalPrice = Math.max(0, subtotal + shippingPrice - discountAmount);

  return {
    subtotal,
    shippingPrice,
    discountAmount,
    totalPrice,
  };
};
