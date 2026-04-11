import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import {
  fetchDriverAcceptedOrders,
  fetchDriverCompletedOrders,
  fetchDriverRequestedOrders,
  selectDriverAcceptedOrders,
  selectDriverCompletedOrders,
  selectDriverRequestedOrders,
} from '../features/orders/orderSlice';

const DriverHome = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const requestedOrders = useSelector(selectDriverRequestedOrders);
  const acceptedOrders = useSelector(selectDriverAcceptedOrders);
  const completedOrders = useSelector(selectDriverCompletedOrders);

  useEffect(() => {
    dispatch(fetchDriverRequestedOrders());
    dispatch(fetchDriverAcceptedOrders());
    dispatch(fetchDriverCompletedOrders());
  }, [dispatch]);

  const recentActivity = useMemo(() => {
    const activity = [
      ...(requestedOrders || []).map((order) => ({
        type: 'request',
        id: order._id,
        message: `New assignment request for order #${String(order._id).slice(-8).toUpperCase()}`,
        at: order.delivery?.assignmentRequestedAt || order.updatedAt || order.createdAt,
      })),
      ...(acceptedOrders || []).map((order) => ({
        type: 'accepted',
        id: order._id,
        message: `Accepted and active delivery for order #${String(order._id).slice(-8).toUpperCase()}`,
        at: order.delivery?.assignmentRespondedAt || order.updatedAt || order.createdAt,
      })),
      ...(completedOrders || []).map((order) => ({
        type: 'completed',
        id: order._id,
        message: `Completed delivery for order #${String(order._id).slice(-8).toUpperCase()}`,
        at: order.updatedAt || order.createdAt,
      })),
    ];
    return activity
      .sort((a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime())
      .slice(0, 8);
  }, [requestedOrders, acceptedOrders, completedOrders]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Driver Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back. Here are your profile details and order summary.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Driver Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <p><span className="text-gray-500">Name:</span> {user?.name || 'N/A'}</p>
          <p><span className="text-gray-500">Email:</span> {user?.email || 'N/A'}</p>
          <p><span className="text-gray-500">Mobile:</span> {user?.mobile || 'N/A'}</p>
          <p><span className="text-gray-500">Role:</span> {String(user?.role || '').toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-500">Pending Requests</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{requestedOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-500">Accepted Active Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{acceptedOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-500">Completed Deliveries</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{completedOrders.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
        {recentActivity.length ? (
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={`${item.id}-${item.type}-${idx}`} className="border border-gray-100 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-800">{item.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.at ? new Date(item.at).toLocaleString('en-IN') : 'No date'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        )}
      </div>
    </div>
  );
};

export default DriverHome;
