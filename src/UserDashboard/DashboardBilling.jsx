import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, ReceiptText } from 'lucide-react';
import {
  fetchMyOrders,
  selectMyOrders,
  selectOrdersError,
  selectOrdersLoading,
} from '../features/orders/orderSlice';
import { resolveOrderPaymentBreakdown } from '../utils/orderPaymentBreakdown';

const escapeHtml = (val) =>
  String(val ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const formatRs = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `₹${x.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const DashboardBilling = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const sortedOrders = useMemo(() => {
    const arr = Array.isArray(orders) ? [...orders] : [];
    arr.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
    return arr;
  }, [orders]);

  const handleDownloadInvoice = (order) => {
    const br = resolveOrderPaymentBreakdown(order);

    const orderId = String(order?._id || order?.id || '');
    const dateStr = order?.createdAt
      ? new Date(order.createdAt).toLocaleString('en-IN')
      : '—';

    const items = Array.isArray(order?.items) ? order.items : [];

    const itemRowsHtml = items
      .map((item) => {
        const name = item?.product?.name || 'Product';
        const qty = Number(item?.quantity || 0);
        const unit = Number(item?.price || 0);
        const line = unit * qty;
        return `
          <tr>
            <td class="left">${escapeHtml(name)}</td>
            <td class="right">${qty}</td>
            <td class="right">Rs ${unit.toFixed(2)}</td>
            <td class="right">Rs ${line.toFixed(2)}</td>
          </tr>
        `;
      })
      .join('');

    const safeOrderId = escapeHtml(orderId);
    const safeDate = escapeHtml(dateStr);
    const shipLine =
      br.shippingFee === null ? '—' : `₹${Number(br.shippingFee).toFixed(2)}`;
    const couponNote = br.couponApplied
      ? escapeHtml(br.couponApplied)
      : '—';

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Invoice - ${safeOrderId}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, Helvetica, sans-serif; margin: 24px; color: #111827; }
            .brand { display:flex; align-items:center; gap: 12px; margin-bottom: 18px; }
            .logo { width: 44px; height: 44px; border-radius: 999px; background: #985991; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; }
            h1 { font-size: 20px; margin: 0; color:#111827; }
            .meta { margin-top: 8px; font-size: 13px; color:#374151; }
            .box { border: 1px solid #E5E7EB; border-radius: 10px; padding: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th { text-align: left; font-size: 12px; color:#6B7280; font-weight: 700; border-bottom: 1px solid #E5E7EB; padding: 10px 8px; }
            td { font-size: 13px; padding: 10px 8px; border-bottom: 1px solid #F3F4F6; }
            .right { text-align:right; }
            .left { text-align:left; }
            .summary { margin-top: 16px; display:flex; justify-content:flex-end; }
            .summary table { width: 380px; }
            .foot { margin-top: 18px; font-size: 12px; color:#6B7280; text-align:center; }
            .pill { display:inline-block; font-size: 12px; padding: 6px 10px; border-radius:999px; background:#ECFDF3; color:#065F46; border:1px solid #BBF7D0; font-weight:700; }
            .muted { font-size: 11px; color:#6B7280; }
            @media print {
              body { margin: 12px; }
              .pill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="brand">
            <div class="logo">TH</div>
            <div>
              <h1>The Beauty Hub</h1>
              <div class="meta">Invoice for Order <b>#${safeOrderId}</b></div>
            </div>
            <div style="margin-left:auto;">
              <span class="pill">${escapeHtml(String(order?.paymentStatus || 'paid'))}</span>
            </div>
          </div>

          <div class="box">
            <div class="meta"><b>Date:</b> ${safeDate}</div>
            ${br.isLegacy ? '<p class="muted">This order was placed before detailed payment breakdown was stored; totals are best-effort.</p>' : ''}

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="right">Qty</th>
                  <th class="right">Unit Price</th>
                  <th class="right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemRowsHtml || '<tr><td colspan="4" class="left">No items found.</td></tr>'}
              </tbody>
            </table>

            <div class="summary">
              <table>
                <tbody>
                  <tr>
                    <td class="left">Items total (subtotal)</td>
                    <td class="right"><b>₹${Number(br.subtotal).toFixed(2)}</b></td>
                  </tr>
                  <tr>
                    <td class="left">Shipping charge</td>
                    <td class="right"><b>+ ${shipLine}</b></td>
                  </tr>
                  <tr>
                    <td class="left">Coupon discount ${br.couponApplied ? `(${couponNote})` : ''}</td>
                    <td class="right"><b>- ₹${Number(br.discountAmount).toFixed(2)}</b></td>
                  </tr>
                  <tr>
                    <td class="left"><b>Total paid</b></td>
                    <td class="right"><b>₹${Number(br.grandTotal).toFixed(2)}</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="foot">
            Thank you for shopping with The Beauty Hub.
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => { window.focus(); window.print(); }, 150);
            }
          </script>
        </body>
      </html>
    `;

    const invoiceWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
    if (!invoiceWindow) {
      alert('Please allow popups to download the invoice.');
      return;
    }
    invoiceWindow.document.open();
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };

  return (
    <section className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-full bg-pink-50 text-[#985991] flex items-center justify-center">
            <ReceiptText size={18} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Billing & Invoices</h3>
            <p className="text-sm text-gray-500">
              Order totals match what was charged (including shipping and coupons).
            </p>
          </div>
        </div>

        {loading && (
          <div className="p-10 text-center text-gray-500 text-sm">Loading your invoices...</div>
        )}

        {error && <div className="p-4 text-red-600 text-sm">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-3">Order ID</th>
                  <th className="py-3 pr-3">Date</th>
                  <th className="py-3 pr-3">Items total</th>
                  <th className="py-3 pr-3">Shipping</th>
                  <th className="py-3 pr-3">Discount</th>
                  <th className="py-3 pr-3">Total paid</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.length > 0 ? (
                  sortedOrders.map((order) => {
                    const br = resolveOrderPaymentBreakdown(order);
                    const paymentStatus = order?.paymentStatus || order?.paymentMethod || 'paid';
                    return (
                      <tr key={order._id} className="border-b border-gray-50 text-sm text-gray-700">
                        <td className="py-4 pr-3 font-semibold text-gray-900">{order._id}</td>
                        <td className="py-4 pr-3">
                          {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td className="py-4 pr-3">{formatRs(br.subtotal)}</td>
                        <td className="py-4 pr-3">
                          {br.shippingFee === null ? '—' : formatRs(br.shippingFee)}
                        </td>
                        <td className="py-4 pr-3">
                          {br.discountAmount > 0 ? (
                            <span>
                              -{formatRs(br.discountAmount)}
                              {br.couponApplied ? (
                                <span className="block text-[10px] text-gray-500 font-mono mt-0.5">
                                  {br.couponApplied}
                                </span>
                              ) : null}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-4 pr-3 font-semibold text-gray-900">{formatRs(br.grandTotal)}</td>
                        <td className="py-4 pr-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-black transition-colors"
                          >
                            <Download size={14} />
                            Download Invoice
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-500">
                      No orders found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardBilling;
