/**
 * Normalizes order totals for invoices and UI.
 * New orders include `paymentBreakdown` from the API; older orders fall back to coupon + line items.
 */
export function resolveOrderPaymentBreakdown(order) {
  const pb = order?.paymentBreakdown;
  if (pb && Number.isFinite(Number(pb.grandTotal))) {
    return {
      subtotal: Number(pb.subtotal) || 0,
      shippingFee: Number(pb.shippingFee) || 0,
      discountAmount: Number(pb.discountAmount) || 0,
      couponApplied: String(pb.couponApplied || order?.coupon?.code || '').trim(),
      grandTotal: Number(pb.grandTotal) || Number(order.totalAmount) || 0,
      isLegacy: false,
    };
  }

  const lineSum = (order?.items || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const subtotal =
    Number(order?.coupon?.subtotalBeforeDiscount) > 0
      ? Number(order.coupon.subtotalBeforeDiscount)
      : lineSum || Number(order?.totalAmount) || 0;
  const discountAmount = Number(order?.coupon?.discountAmount) || 0;
  const grandTotal = Number(order?.totalAmount) || 0;

  return {
    subtotal,
    shippingFee: null,
    discountAmount,
    couponApplied: String(order?.coupon?.code || '').trim(),
    grandTotal,
    isLegacy: true,
  };
}
