import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  driverRespondToOrderRequest,
  fetchDriverAcceptedOrders,
  fetchDriverCompletedOrders,
  fetchDriverRequestedOrders,
  driverUpdateAcceptedOrderStatus,
  selectDriverAcceptedOrders,
  selectDriverCompletedOrders,
  selectDriverRequestedOrders,
  selectOrdersError,
  selectOrdersLoading,
} from '../features/orders/orderSlice';

const REJECTION_OPTIONS = [
  { value: 'vehicle_issue', label: 'Vehicle issue' },
  { value: 'out_of_zone', label: 'Out of zone' },
  { value: 'high_load', label: 'High load' },
  { value: 'customer_unreachable', label: 'Customer unreachable' },
  { value: 'other', label: 'Other' },
];

const DriverOrders = () => {
  const dispatch = useDispatch();
  const requestedOrders = useSelector(selectDriverRequestedOrders);
  const acceptedOrders = useSelector(selectDriverAcceptedOrders);
  const completedOrders = useSelector(selectDriverCompletedOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const [reasonByOrder, setReasonByOrder] = useState({});
  const [noteByOrder, setNoteByOrder] = useState({});
  const [statusByOrder, setStatusByOrder] = useState({});
  const [rejectingOrderId, setRejectingOrderId] = useState('');

  useEffect(() => {
    dispatch(fetchDriverRequestedOrders());
    dispatch(fetchDriverAcceptedOrders());
    dispatch(fetchDriverCompletedOrders());
  }, [dispatch]);

  const handleRespond = async (orderId, action) => {
    const reason = reasonByOrder[orderId] || 'other';
    const note = noteByOrder[orderId] || '';
    if (action === 'reject' && !String(note).trim()) return;
    await dispatch(driverRespondToOrderRequest({ orderId, action, reason, note }));
    setRejectingOrderId('');
    dispatch(fetchDriverRequestedOrders());
    dispatch(fetchDriverAcceptedOrders());
    dispatch(fetchDriverCompletedOrders());
  };
  const handleStatusUpdate = async (orderId) => {
    const status = statusByOrder[orderId] || 'delivered';
    const note = noteByOrder[orderId] || '';
    await dispatch(driverUpdateAcceptedOrderStatus({ orderId, status, note }));
    dispatch(fetchDriverAcceptedOrders());
    dispatch(fetchDriverCompletedOrders());
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Driver Orders</h2>
        <p className="text-sm text-gray-500">Respond to assigned requests and track accepted deliveries.</p>
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Requested Orders ({requestedOrders.length})</h3>
        {requestedOrders.length ? (
          <div className="space-y-4">
            {requestedOrders.map((order) => (
              <div key={order._id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-800 font-semibold">
                      Customer: {order.user?.name || 'N/A'} | {order.user?.mobile || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Expires: {order.delivery?.assignmentExpiresAt ? new Date(order.delivery.assignmentExpiresAt).toLocaleString('en-IN') : 'N/A'}
                    </p>
                  </div>
                  <p className="font-semibold text-[#985991]">Rs {Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    Payment: {String(order.paymentMethod || 'cod').toUpperCase()} / {String(order.paymentStatus || 'pending').toUpperCase()}
                  </span>
                  {String(order.paymentMethod || '').toLowerCase() === 'cod' &&
                  String(order.paymentStatus || '').toLowerCase() !== 'paid' ? (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                      COD pending - cannot deliver until paid
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 text-xs text-gray-600">
                  {(order.items || []).slice(0, 3).map((item, idx) => (
                    <p key={`${order._id}-${idx}`}>
                      - {item.product?.name || 'Product'} x {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRespond(order._id, 'accept')}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      rejectingOrderId === order._id
                        ? handleRespond(order._id, 'reject')
                        : setRejectingOrderId(order._id)
                    }
                    disabled={rejectingOrderId === order._id && !String(noteByOrder[order._id] || '').trim()}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-60"
                  >
                    {rejectingOrderId === order._id ? 'Confirm Reject' : 'Reject'}
                  </button>
                </div>
                {rejectingOrderId === order._id ? (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select
                      value={reasonByOrder[order._id] || 'other'}
                      onChange={(e) => setReasonByOrder((prev) => ({ ...prev, [order._id]: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      {REJECTION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Rejection note (required)"
                      value={noteByOrder[order._id] || ''}
                      onChange={(e) => setNoteByOrder((prev) => ({ ...prev, [order._id]: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No pending requests.</p>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Accepted Orders ({acceptedOrders.length})</h3>
        {acceptedOrders.length ? (
          <div className="space-y-3">
            {acceptedOrders.map((order) => (
              <div key={order._id} className="border border-gray-100 rounded-xl p-4">
                <p className="font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-500">
                  Customer: {order.user?.name || 'N/A'} | {order.user?.mobile || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  Address: {order.shippingAddress?.line1 || ''}, {order.shippingAddress?.city || ''}, {order.shippingAddress?.state || ''} - {order.shippingAddress?.pincode || ''}
                </p>
                <div className="mt-2 text-xs text-gray-600">
                  {(order.items || []).map((item, idx) => (
                    <p key={`${order._id}-accepted-${idx}`}>
                      - {item.product?.name || 'Product'} x {item.quantity}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-[#985991] font-semibold mt-1">Total: Rs {Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-1">Current order status: {(order.orderStatus || 'pending').toUpperCase()}</p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select
                    value={statusByOrder[order._id] || 'delivered'}
                    onChange={(e) => setStatusByOrder((prev) => ({ ...prev, [order._id]: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="delivered">Delivered</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Optional status note"
                    value={noteByOrder[order._id] || ''}
                    onChange={(e) => setNoteByOrder((prev) => ({ ...prev, [order._id]: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm md:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(order._id)}
                  className="mt-2 bg-[#985991] text-white px-3 py-2 rounded-lg text-sm"
                >
                  Update Order Status
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No accepted orders right now.</p>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Completed Orders ({completedOrders.length})</h3>
        {completedOrders.length ? (
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <div key={order._id} className="border border-gray-100 rounded-xl p-4">
                <p className="font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-500">
                  Customer: {order.user?.name || 'N/A'} | {order.user?.mobile || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  Delivered on: {order.updatedAt ? new Date(order.updatedAt).toLocaleString('en-IN') : 'N/A'}
                </p>
                <p className="text-sm text-[#985991] font-semibold mt-1">
                  Total: Rs {Number(order.totalAmount || 0).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No completed orders yet.</p>
        )}
      </section>
    </div>
  );
};

export default DriverOrders;
