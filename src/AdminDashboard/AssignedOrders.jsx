import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminOrders, selectAdminOrders, selectOrdersError, selectOrdersLoading } from '../features/orders/orderSlice';

const AssignedOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectAdminOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const [activeFilter, setActiveFilter] = useState('all'); // all | accepted | rejected | delivered

  useEffect(() => {
    dispatch(fetchAdminOrders('all'));
  }, [dispatch]);

  const assignedOrders = useMemo(
    () =>
      (orders || []).filter(
        (order) =>
          order.delivery?.assignedDriver &&
          ['requested', 'accepted', 'rejected', 'expired'].includes(order.delivery?.assignmentStatus)
      ),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return assignedOrders;
    if (activeFilter === 'accepted') {
      return assignedOrders.filter((o) => o.delivery?.assignmentStatus === 'accepted');
    }
    if (activeFilter === 'rejected') {
      return assignedOrders.filter((o) => o.delivery?.assignmentStatus === 'rejected');
    }
    if (activeFilter === 'delivered') {
      return assignedOrders.filter((o) => o.orderStatus === 'delivered');
    }
    return assignedOrders;
  }, [assignedOrders, activeFilter]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Assigned Orders</h2>
        <p className="text-sm text-gray-500">
          Track all assigned orders and see which are accepted, rejected, or delivered.
        </p>
      </div>
      <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'rejected', label: 'Rejected' },
          { key: 'delivered', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all ${
              activeFilter === tab.key
                ? 'text-[#985991] bg-white border border-b-0 border-gray-100'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? <p className="text-sm text-gray-500">Loading assigned orders...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="p-4 font-semibold">Order</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Driver</th>
                <th className="p-4 font-semibold">Assignment Status</th>
                <th className="p-4 font-semibold">Response</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-4 font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-4 text-gray-600">
                      {order.user?.name || 'Customer'}
                      <div className="text-xs text-gray-400">{order.user?.mobile || order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {order.delivery?.assignedDriver?.name || 'N/A'}
                      <div className="text-xs text-gray-400">
                        {order.delivery?.assignedDriver?.mobile || order.delivery?.assignedDriver?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 uppercase">
                        {order.delivery?.assignmentStatus || 'unassigned'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-red-600">
                      {order.delivery?.rejectionReason
                        ? `${order.delivery.rejectionReason}${order.delivery?.rejectionNote ? ` - ${order.delivery.rejectionNote}` : ''}`
                        : 'Pending / Accepted'}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="text-xs bg-[#985991] text-white px-3 py-2 rounded-lg"
                      >
                        View & Reassign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-6 text-center text-gray-400" colSpan={6}>
                    No assigned orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedOrders;
