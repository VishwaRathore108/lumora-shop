import React, { useEffect, useMemo, useState } from 'react';
import { BellRing, ChevronDown, ChevronUp, MailCheck, ShoppingCart } from 'lucide-react';
import api from '../services/apiClient';

const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const getCartStatus = (updatedAt) => {
  const idleMs = Date.now() - new Date(updatedAt).getTime();
  return idleMs > 24 * 60 * 60 * 1000 ? 'Abandoned' : 'Active';
};

const AdminLiveCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchLiveCarts = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await api.get('/admin/carts/live');
        const payload = Array.isArray(response.data?.carts) ? response.data.carts : [];
        setCarts(payload);
      } catch (error) {
        console.error('Failed to fetch live carts:', error);
        setErrorMessage('Unable to load live carts right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveCarts();
  }, []);

  const cartRows = useMemo(
    () =>
      carts.map((cart) => {
        const totalItems = (cart.items || []).reduce((sum, item) => sum + (item.qty || 0), 0);
        return {
          userId: cart.user?._id || cart.userId || cart._id,
          userName: cart.user?.name || 'Unknown User',
          email: cart.user?.email || 'No email',
          cartTotal: Number(cart.cartTotal || 0),
          lastUpdated: cart.updatedAt,
          status: getCartStatus(cart.updatedAt),
          items: (cart.items || []).map((item) => ({
            prodName: item.product?.name || item.prodName || 'Product',
            qty: item.qty || 1,
            price: Number(item.price || 0),
            img: item.product?.images?.[0] || item.img || '',
          })),
          totalItems,
        };
      }),
    [carts]
  );

  const handleReminder = (userName) => {
    const message = `Reminder email triggered for ${userName}`;
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2200);
  };

  const getStatusBadgeClasses = (status) =>
    status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-orange-50 text-orange-700 border-orange-100';

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Live Carts</h2>
          <p className="text-gray-500 text-sm">Track active and abandoned carts for faster sales retargeting.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-sm text-gray-600">
          <ShoppingCart size={16} className="text-[#985991]" />
          {cartRows.length} carts being tracked
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading live carts...</div>
        ) : errorMessage ? (
          <div className="p-8 text-sm text-red-600">{errorMessage}</div>
        ) : !cartRows.length ? (
          <div className="p-8 text-sm text-gray-500">No live carts found yet.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Total Items</th>
                <th className="p-4 font-semibold">Cart Value</th>
                <th className="p-4 font-semibold">Last Updated</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cartRows.map((cart) => {
                const isExpanded = expandedUserId === cart.userId;
                return (
                  <React.Fragment key={cart.userId}>
                    <tr className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{cart.userName}</p>
                        <p className="text-xs text-gray-500">{cart.email}</p>
                      </td>
                      <td className="p-4 text-gray-700">{cart.totalItems}</td>
                      <td className="p-4 font-semibold text-gray-800">Rs {cart.cartTotal.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-gray-600">{formatDateTime(cart.lastUpdated)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClasses(cart.status)}`}>
                          {cart.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedUserId(isExpanded ? null : cart.userId)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            View Items
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          {cart.status === 'Abandoned' && (
                            <button
                              type="button"
                              onClick={() => handleReminder(cart.userName)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#985991] text-white text-xs font-semibold hover:bg-[#7A4774]"
                            >
                              <BellRing size={14} />
                              Send Reminder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-4 pb-4">
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">Cart Items</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {cart.items.map((item, index) => (
                                <div
                                  key={`${cart.userId}-${index}`}
                                  className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg"
                                >
                                  <img src={item.img || 'https://placehold.co/80x80?text=No+Image'} alt={item.prodName} className="w-12 h-12 rounded-md object-cover bg-gray-100" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-800 truncate">{item.prodName}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-800">Rs {item.price.toLocaleString('en-IN')}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-3 shadow-xl border border-gray-700 text-sm">
            <MailCheck size={16} className="text-emerald-300" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveCarts;
