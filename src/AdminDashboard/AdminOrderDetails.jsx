import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Calendar, CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import {
  fetchAdminOrderById,
  fetchDriverAssignmentOverview,
  assignOrderToDriver,
  selectAdminOrderDetails,
  selectDriverOverview,
  selectOrdersError,
  selectOrdersLoading,
} from '../features/orders/orderSlice';
import { resolveOrderPaymentBreakdown } from '../utils/orderPaymentBreakdown';

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const order = useSelector(selectAdminOrderDetails);
  const drivers = useSelector(selectDriverOverview);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const [driverId, setDriverId] = useState('');
  const [assignNote, setAssignNote] = useState('');
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  useEffect(() => {
    if (orderId) {
      dispatch(fetchAdminOrderById(orderId));
      dispatch(fetchDriverAssignmentOverview());
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order?.delivery?.assignedDriver?._id) {
      setDriverId(order.delivery.assignedDriver._id);
    }
  }, [order]);

  const selectedDriver = useMemo(
    () => drivers.find((driver) => driver._id === driverId) || null,
    [drivers, driverId]
  );
  const assignmentStatus = order?.delivery?.assignmentStatus || 'unassigned';
  const currentlyAssignedDriverId = order?.delivery?.assignedDriver?._id || '';
  const isSameActiveAssignment =
    ['requested', 'accepted'].includes(assignmentStatus) && currentlyAssignedDriverId && currentlyAssignedDriverId === driverId;

  const handleAssign = async () => {
    if (!driverId || !order?._id) return;
    setAssignError('');
    setAssignSuccess('');
    if (!['confirmed', 'assigned'].includes(String(order.orderStatus || '').toLowerCase())) {
      setAssignError('Please move order status to confirmed before assigning a driver.');
      return;
    }
    try {
      await dispatch(assignOrderToDriver({ orderId: order._id, driverId, note: assignNote })).unwrap();
      setAssignSuccess('Driver assigned successfully.');
      dispatch(fetchAdminOrderById(order._id));
      dispatch(fetchDriverAssignmentOverview());
    } catch (assignApiError) {
      setAssignError(String(assignApiError || 'Failed to assign driver.'));
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading order details...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="p-8 text-gray-500">Order not found.</div>;
  }

  const shippingAddress = order.shippingAddress || {};
  const timeline = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  const deliveryTimeline = Array.isArray(order.delivery?.history) ? order.delivery.history : [];
  const pay = resolveOrderPaymentBreakdown(order);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/orders')}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-[#985991] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 capitalize">
                {order.orderStatus || order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-600 capitalize">
          Payment: {order.paymentMethod} ({order.paymentStatus})
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Order Timeline</h3>
            <div className="space-y-3">
              {timeline.map((step, idx) => (
                <div key={`${step.status}-${idx}`} className="text-sm">
                  <p className="font-semibold text-gray-800 capitalize">{step.status}</p>
                  <p className="text-xs text-gray-500">{new Date(step.changedAt).toLocaleString('en-IN')}</p>
                  {step.note ? <p className="text-xs text-gray-500">{step.note}</p> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Driver Assignment Timeline</h3>
            {deliveryTimeline.length ? (
              <div className="space-y-3">
                {deliveryTimeline.map((entry, idx) => (
                  <div key={`${entry.event}-${idx}`} className="text-sm">
                    <p className="font-semibold text-gray-800 capitalize">{entry.event}</p>
                    <p className="text-xs text-gray-500">{new Date(entry.at).toLocaleString('en-IN')}</p>
                    {entry.reason ? <p className="text-xs text-red-600">Reason: {entry.reason}</p> : null}
                    {entry.note ? <p className="text-xs text-gray-500">{entry.note}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No driver history yet.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#985991]" /> Items ({(order.items || []).length})
            </h3>
            <div className="divide-y divide-gray-50">
              {(order.items || []).map((item, idx) => (
                <div key={`${item.product?._id || idx}`} className="flex items-center gap-4 py-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={item.product?.images?.[0] || 'https://placehold.co/80x80?text=Item'}
                      alt={item.product?.name || 'Item'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.product?.name || 'Product'}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-[#985991]">Rs {Number(item.price || 0).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Payment Summary</h3>
            <p className="text-xs text-gray-500 mb-3">
              Amounts below match what the customer was charged (Razorpay / COD), including shipping and coupons.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Items total (subtotal)</span>
                <span className="font-semibold text-gray-900">
                  ₹{Number(pay.subtotal).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping charge</span>
                <span className="font-semibold text-gray-900">
                  {pay.shippingFee === null
                    ? '—'
                    : pay.shippingFee === 0
                      ? 'FREE'
                      : `+₹${Number(pay.shippingFee).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>
                  Coupon discount
                  {pay.couponApplied ? (
                    <span className="ml-1 font-mono text-xs text-gray-600">({pay.couponApplied})</span>
                  ) : null}
                </span>
                <span className="font-semibold">
                  −₹{Number(pay.discountAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-base">
                <span className="font-bold text-gray-900">Total collected</span>
                <span className="font-bold text-[#985991]">
                  ₹{Number(pay.grandTotal).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {pay.isLegacy ? (
              <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
                Legacy order: breakdown may be incomplete; stored order total is ₹
                {Number(order.totalAmount || 0).toLocaleString('en-IN')}.
              </p>
            ) : null}
            <div className="mt-4 bg-gray-50 p-3 rounded-xl flex items-center gap-2 text-xs text-gray-600">
              <CreditCard size={14} />
              {String(order.paymentMethod || 'cod').toUpperCase()} / {String(order.paymentStatus || 'pending').toUpperCase()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800">Assign Driver</h3>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select driver</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name || 'Driver'} | P:{driver.pendingRequests} A:{driver.acceptedOrders} D:{driver.deliveredOrders}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={assignNote}
              onChange={(e) => setAssignNote(e.target.value)}
              placeholder="Optional assignment note"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAssign}
              disabled={!driverId || isSameActiveAssignment}
              className="w-full bg-[#985991] text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {isSameActiveAssignment ? 'Already Assigned' : 'Assign / Reassign Driver'}
            </button>
            <p className="text-xs text-gray-500">
              Current assignment: <span className="font-semibold uppercase">{assignmentStatus}</span>
            </p>
            {selectedDriver ? (
              <p className="text-xs text-gray-600">
                Selected: {selectedDriver.name || 'Driver'} ({selectedDriver.mobile || 'no mobile'}) | Pending {selectedDriver.pendingRequests}, Accepted {selectedDriver.acceptedOrders}, Delivered {selectedDriver.deliveredOrders}
              </p>
            ) : null}
            {order.delivery?.rejectionReason ? (
              <p className="text-xs text-red-600">
                Last rejection reason: {order.delivery.rejectionReason}
                {order.delivery?.rejectionNote ? ` (${order.delivery.rejectionNote})` : ''}
              </p>
            ) : null}
            {assignmentStatus === 'rejected' || assignmentStatus === 'expired' ? (
              <p className="text-xs text-amber-600">Driver did not accept this assignment. Please reassign another driver.</p>
            ) : null}
            {assignError ? <p className="text-xs text-red-600">{assignError}</p> : null}
            {assignSuccess ? <p className="text-xs text-green-600">{assignSuccess}</p> : null}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Shipping Details</h3>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MapPin size={18} className="text-[#985991] mt-1" />
              <div>
                <p className="font-semibold text-gray-900">{shippingAddress.fullName || 'N/A'}</p>
                <p>{shippingAddress.line1 || ''}</p>
                {shippingAddress.line2 ? <p>{shippingAddress.line2}</p> : null}
                <p>
                  {shippingAddress.city || ''}, {shippingAddress.state || ''} - {shippingAddress.pincode || ''}
                </p>
                <p className="mt-2">{shippingAddress.phone || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
