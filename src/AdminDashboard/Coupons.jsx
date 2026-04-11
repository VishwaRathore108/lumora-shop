import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  TicketPercent,
  ShoppingBag,
  IndianRupee,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import {
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminCoupons,
  updateAdminCoupon,
} from '../services/adminService';

function toDateTimeLocalValue(dateLike) {
  if (!dateLike) return '';
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '';
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

const emptyForm = {
  name: '',
  code: '',
  discountPercentage: 10,
  description: '',
  expiryDate: '',
  totalUsageLimit: '',
  isActive: true,
  minPurchaseAmount: 0,
  userType: 'all',
};

const KpiSkeleton = () => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
    <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3" />
    <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
    <div className="h-8 w-20 bg-gray-200 rounded" />
  </div>
);

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({
    activeCount: 0,
    totalRedemptions: 0,
    totalDiscountGiven: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminCoupons();
      if (!res.success) throw new Error(res.message || 'Failed to load coupons.');
      setCoupons(res.coupons || []);
      if (res.stats) {
        setStats({
          activeCount: res.stats.activeCount ?? 0,
          totalRedemptions: res.stats.totalRedemptions ?? 0,
          totalDiscountGiven: res.stats.totalDiscountGiven ?? 0,
        });
      } else {
        const list = res.coupons || [];
        setStats({
          activeCount: list.filter((c) => c.isActive).length,
          totalRedemptions: list.reduce((s, c) => s + (c.currentUsageCount || 0), 0),
          totalDiscountGiven: list.reduce((s, c) => s + (c.totalDiscountGiven || 0), 0),
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load coupons.');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const filteredCoupons = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter(
      (c) =>
        String(c.code || '')
          .toLowerCase()
          .includes(q) ||
        String(c.name || '')
          .toLowerCase()
          .includes(q)
    );
  }, [coupons, searchTerm]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name || '',
      code: c.code || '',
      discountPercentage: c.discountPercentage ?? 10,
      description: c.description || '',
      expiryDate: toDateTimeLocalValue(c.expiryDate),
      totalUsageLimit: c.totalUsageLimit != null ? String(c.totalUsageLimit) : '',
      isActive: c.isActive !== false,
      minPurchaseAmount: c.conditions?.minPurchaseAmount ?? 0,
      userType: c.conditions?.userType || 'all',
    });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        discountPercentage: Number(form.discountPercentage),
        description: form.description.trim(),
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
        totalUsageLimit: form.totalUsageLimit === '' ? null : Number(form.totalUsageLimit),
        isActive: !!form.isActive,
        conditions: {
          minPurchaseAmount: Number(form.minPurchaseAmount) || 0,
          userType: form.userType,
        },
      };

      let res;
      if (editingId) {
        res = await updateAdminCoupon(editingId, payload);
      } else {
        res = await createAdminCoupon(payload);
      }
      if (!res.success) throw new Error(res.message || 'Save failed.');
      closeModal();
      await loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not save coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (c) => {
    setActionId(c._id);
    try {
      const res = await updateAdminCoupon(c._id, { isActive: !c.isActive });
      if (!res.success) throw new Error(res.message || 'Update failed.');
      await loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not update status.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete coupon ${c.code}? This cannot be undone.`)) return;
    setActionId(c._id);
    try {
      const res = await deleteAdminCoupon(c._id);
      if (!res.success) throw new Error(res.message || 'Delete failed.');
      await loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not delete coupon.');
    } finally {
      setActionId(null);
    }
  };

  const formatRupee = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      Number(n) || 0
    );

  const formatExpiry = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Coupons &amp; Offers</h2>
          <p className="text-gray-500 text-sm">Create and manage promo codes — synced with checkout in real time.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {error && !modalOpen && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <TicketPercent size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Active Coupons</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.activeCount}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-[#985991] rounded-xl">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Redemptions</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalRedemptions.toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <IndianRupee size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Discount Given</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatRupee(stats.totalDiscountGiven)}</h3>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by code or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#985991] shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">%</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <Loader2 className="inline animate-spin mr-2" size={18} />
                    Loading coupons...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No coupons match your search.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => {
                  const limit = c.totalUsageLimit;
                  const usageLabel =
                    limit != null && Number.isFinite(limit)
                      ? `${c.currentUsageCount ?? 0} / ${limit}`
                      : `${c.currentUsageCount ?? 0} / ∞`;
                  const busy = actionId === c._id;
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-[#985991]">{c.code}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{c.discountPercentage}%</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatExpiry(c.expiryDate)}</td>
                      <td className="px-4 py-3 text-gray-600">{usageLabel}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleToggleActive(c)}
                          className="inline-flex items-center gap-1 text-gray-600 hover:text-[#985991] disabled:opacity-50"
                          title={c.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {busy ? (
                            <Loader2 className="animate-spin" size={22} />
                          ) : c.isActive ? (
                            <ToggleRight size={28} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={28} className="text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="p-2 rounded-lg text-gray-500 hover:text-[#985991] hover:bg-purple-50 inline-flex"
                          aria-label="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          disabled={busy}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 inline-flex disabled:opacity-50"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Display name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                  placeholder="e.g. Welcome offer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-mono uppercase focus:border-[#985991] outline-none"
                  placeholder="WELCOME10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    step={0.5}
                    value={form.discountPercentage}
                    onChange={(e) => setForm((f) => ({ ...f, discountPercentage: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usage limit</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Unlimited"
                    value={form.totalUsageLimit}
                    onChange={(e) => setForm((f) => ({ ...f, totalUsageLimit: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                  placeholder="Shown to customers at checkout"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                <input
                  type="datetime-local"
                  value={form.expiryDate}
                  onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:border-[#985991] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. purchase (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.minPurchaseAmount}
                    onChange={(e) => setForm((f) => ({ ...f, minPurchaseAmount: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer type</label>
                  <select
                    value={form.userType}
                    onChange={(e) => setForm((f) => ({ ...f, userType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none bg-white"
                  >
                    <option value="all">All customers</option>
                    <option value="new">New only</option>
                    <option value="existing">Returning only</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-gray-300 accent-[#985991]"
                />
                Coupon is active
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#985991] text-white text-sm font-medium rounded-lg hover:bg-[#7A4774] shadow-md shadow-purple-100 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {editingId ? 'Save changes' : 'Publish coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
