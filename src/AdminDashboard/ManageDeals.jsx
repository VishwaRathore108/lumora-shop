import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Clock3, Tag } from 'lucide-react';
import { createDeal, getActiveDeal, getProducts, updateDeal } from '../services/adminService';
import { formatPrice } from '../constants/productTypes';

function toDateTimeLocalValue(dateLike) {
  if (!dateLike) return '';
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '';
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

const ManageDeals = () => {
  const [products, setProducts] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    product: '',
    dealEndTime: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, dealRes] = await Promise.allSettled([
        getProducts({ limit: 100, page: 1, status: 'active', sort: 'name' }),
        getActiveDeal(),
      ]);

      if (productsRes.status === 'fulfilled' && productsRes.value.success) {
        setProducts(productsRes.value.products || []);
      } else {
        setProducts([]);
      }

      if (dealRes.status === 'fulfilled' && dealRes.value.success && dealRes.value.deal) {
        const deal = dealRes.value.deal;
        setActiveDeal(deal);
        setForm({
          product: deal.product?._id || '',
          dealEndTime: toDateTimeLocalValue(deal.dealEndTime),
          isActive: deal.isActive !== false,
        });
      } else {
        setActiveDeal(null);
        setForm((prev) => ({ ...prev, isActive: true }));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load deal management data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) =>
      `${p.name || ''} ${p.brand || ''} ${p.productSubType || ''}`.toLowerCase().includes(query)
    );
  }, [products, search]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.product) {
      setError('Please select a product for the deal.');
      return;
    }
    if (!form.dealEndTime) {
      setError('Please select an end date and time.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        product: form.product,
        dealEndTime: new Date(form.dealEndTime).toISOString(),
        isActive: form.isActive,
      };

      let res;
      if (activeDeal?._id) {
        res = await updateDeal(activeDeal._id, payload);
      } else {
        res = await createDeal(payload);
      }

      if (!res.success) {
        throw new Error(res.message || 'Failed to save deal.');
      }

      setSuccess(activeDeal?._id ? 'Deal updated successfully.' : 'Deal created successfully.');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save deal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manage Deals</h2>
        <p className="text-sm text-gray-500">Control the storefront "Deal of the Hour" from admin.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center gap-3 text-gray-600">
          <Loader2 size={20} className="animate-spin text-[#985991]" />
          Loading deal settings...
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {activeDeal ? 'Update Active Deal' : 'Create New Deal'}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Product</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, brand or type..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#985991]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#985991]"
                  required
                >
                  <option value="">Choose a product</option>
                  {filteredProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} {p.brand ? `(${p.brand})` : ''} - {formatPrice(p.salePrice ?? p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.dealEndTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, dealEndTime: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#985991]"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-[#985991] focus:ring-[#985991]"
                />
                Keep this deal active
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#985991] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#7A4774] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {activeDeal ? 'Update Deal' : 'Create Deal'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Active Deal</h3>
            {!activeDeal?.product ? (
              <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6">
                No active deal is set right now.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {activeDeal.product.image ? (
                      <img src={activeDeal.product.image} alt={activeDeal.product.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{activeDeal.product.name}</p>
                    <p className="text-sm text-gray-500">{activeDeal.product.subtitle || 'Limited-time offer'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold text-gray-900">{formatPrice(activeDeal.product.price)}</span>
                  <span className="line-through text-gray-400">{formatPrice(activeDeal.product.originalPrice)}</span>
                  {activeDeal.product.discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      {activeDeal.product.discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Clock3 size={16} className="text-[#985991]" />
                    Ends at: {new Date(activeDeal.dealEndTime).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Tag size={16} className="text-[#985991]" />
                    Status: {activeDeal.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDeals;
