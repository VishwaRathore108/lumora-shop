import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Package,
  Layers,
  AlertTriangle,
  Loader2,
  Percent,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  getProducts,
  getCategoriesTree,
  getProductById,
  deleteProduct,
  updateProductStock,
  updateProductDiscount,
} from '../services/adminService';
import { PRODUCT_TYPES, formatPrice } from '../constants/productTypes';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    subcategoryId: '',
    brand: '',
    productType: '',
    productSubType: '',
    status: '',
    inStock: '',
    hasDiscount: '',
    sort: '-createdAt',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stockModal, setStockModal] = useState(null);
  const [discountModal, setDiscountModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategoriesTree();
      if (res.success && Array.isArray(res.categories)) setCategories(res.categories || []);
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
        subcategoryId: filters.subcategoryId || undefined,
        brand: filters.brand || undefined,
        productType: filters.productType || undefined,
        productSubType: filters.productSubType || undefined,
        status: filters.status || undefined,
        inStock: filters.inStock || undefined,
        hasDiscount: filters.hasDiscount || undefined,
        sort: filters.sort || undefined,
      };
      const res = await getProducts(params);
      if (res.success) {
        setProducts(res.products || []);
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.categoryId, filters.subcategoryId, filters.brand, filters.productType, filters.productSubType, filters.status, filters.inStock, filters.hasDiscount, filters.sort]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading(true);
    setError(null);
    try {
      await deleteProduct(deleteConfirm.id);
      setSuccessMessage('Product deleted successfully.');
      setDeleteConfirm(null);
      fetchProducts(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStockSave = async () => {
    if (!stockModal) return;
    const stock = parseInt(stockModal.stock, 10);
    if (Number.isNaN(stock) || stock < 0) {
      setError('Please enter a valid stock quantity.');
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      await updateProductStock(stockModal.id, stock);
      setSuccessMessage('Stock updated successfully.');
      setStockModal(null);
      fetchProducts(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update stock.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDiscountSave = async () => {
    if (!discountModal) return;
    setActionLoading(true);
    setError(null);
    try {
      const payload = { discountType: discountModal.discountType };
      if (discountModal.discountType === 'fixed') {
        if (discountModal.discountFixedAmount !== '' && !Number.isNaN(Number(discountModal.discountFixedAmount))) {
          payload.discountFixedAmount = Math.max(0, Number(discountModal.discountFixedAmount));
        }
      } else {
        if (discountModal.discount != null && discountModal.discount !== '' && !Number.isNaN(Number(discountModal.discount))) {
          payload.discount = Math.min(100, Math.max(0, Number(discountModal.discount)));
        }
      }
      await updateProductDiscount(discountModal.id, payload);
      setSuccessMessage('Discount updated. Sale price is set automatically.');
      setDiscountModal(null);
      fetchProducts(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update discount.');
    } finally {
      setActionLoading(false);
    }
  };

  const subcategoryOptions = filters.categoryId
    ? (categories.find((c) => c.id === filters.categoryId)?.subcategories || [])
    : [];

  const lowStockCount = products.filter((p) => p.lowStockThreshold != null && p.stock <= p.lowStockThreshold && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => !p.stock || p.stock === 0).length;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
          <p className="text-gray-500 text-sm">Manage inventory, prices, discounts, and categories.</p>
        </div>
        <NavLink to="/admin/products/add-products">
          <button className="bg-[#985991] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#7A4774] transition-all shadow-lg shadow-purple-100 active:scale-95">
            <Plus size={18} /> Add New Product
          </button>
        </NavLink>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-sm font-medium underline">Dismiss</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage(null)} className="text-sm font-medium underline">Dismiss</button>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-[#985991] rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-800">{pagination.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Layers size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">On This Page</p>
            <h3 className="text-2xl font-bold text-gray-800">{products.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-500 rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low / Out of Stock</p>
            <h3 className="text-2xl font-bold text-gray-800">{lowStockCount + outOfStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters & search</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, brand, SKU..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value, subcategoryId: '' }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filters.subcategoryId}
            onChange={(e) => setFilters((f) => ({ ...f, subcategoryId: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
          >
            <option value="">All subcategories</option>
            {subcategoryOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={filters.productType}
            onChange={(e) => setFilters((f) => ({ ...f, productType: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
          >
            <option value="">All types</option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Sub-type (e.g. lipstick)"
            value={filters.productSubType}
            onChange={(e) => setFilters((f) => ({ ...f, productSubType: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <select
            value={filters.inStock}
            onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
          >
            <option value="">Any stock</option>
            <option value="true">In stock</option>
            <option value="false">Out of stock</option>
          </select>
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
          >
            <option value="-createdAt">Newest first</option>
            <option value="createdAt">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="-name">Name Z–A</option>
            <option value="price">Price low to high</option>
            <option value="-price">Price high to low</option>
            <option value="-stock">Stock high to low</option>
            <option value="stock">Stock low to high</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => fetchProducts(1)}
          className="self-start px-4 py-2 bg-[#985991] text-white text-sm font-medium rounded-lg hover:bg-[#7A4774]"
        >
          Apply filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#985991]" size={40} />
            <p className="mt-4 text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">No products found. Add your first product or adjust filters.</p>
            <NavLink to="/admin/products/add-products" className="inline-flex items-center gap-2 mt-4 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774]">
              <Plus size={18} /> Add product
            </NavLink>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-5 font-semibold">Product</th>
                    <th className="p-5 font-semibold">Type</th>
                    <th className="p-5 font-semibold">Category</th>
                    <th className="p-5 font-semibold">Price</th>
                    <th className="p-5 font-semibold">Stock</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => {
                    const img = p.coverImage || (p.images && p.images[p.coverImageIndex ?? 0]) || (p.images && p.images[0]) || PLACEHOLDER_IMG;
                    const effectivePrice = p.salePrice != null ? p.salePrice : p.price;
                    const isLow = p.lowStockThreshold != null && p.stock <= p.lowStockThreshold && p.stock > 0;
                    const isOut = !p.stock || p.stock === 0;
                    return (
                      <tr key={p._id} className="hover:bg-gray-50/80">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                              <img src={img} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{p.name}</p>
                              {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
                              {p.sku && <p className="text-xs text-gray-400">SKU: {p.sku}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="px-2 py-1 rounded-md bg-purple-50 text-[#985991] text-xs font-medium capitalize">
                            {p.productType || '–'}
                          </span>
                          {p.productSubType && <span className="block text-xs text-gray-500 mt-0.5">{p.productSubType}</span>}
                          {p.hasVariants && (p.variants?.length > 0) && (
                            <span className="block text-xs text-gray-400 mt-0.5">{p.variants.length} variant(s)</span>
                          )}
                        </td>
                        <td className="p-5">
                          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs">
                            {p.category?.name || '–'}
                          </span>
                          {p.subcategory?.name && <span className="text-xs text-gray-400 block mt-1">{p.subcategory.name}</span>}
                        </td>
                        <td className="p-5">
                          <div>
                            {p.salePrice != null && p.salePrice < p.price && (
                              <span className="text-gray-400 line-through text-xs">{formatPrice(p.price)}</span>
                            )}
                            <span className="font-semibold text-gray-800">{formatPrice(effectivePrice)}</span>
                            {p.discount > 0 && <span className="ml-1 text-xs text-green-600">{p.discount}% off</span>}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`font-medium ${isOut ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-green-600'}`}>
                            {p.stock ?? 0} units
                          </span>
                          {(isLow || isOut) && <span className="block text-xs text-gray-500">{isOut ? 'Out of stock' : 'Low stock'}</span>}
                        </td>
                        <td className="p-5">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.status === 'active' ? 'bg-green-50 text-green-600' :
                            p.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                            p.status === 'out_of_stock' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {p.status?.replace('_', ' ') || '–'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setDetailModal({ id: p._id, loading: true, product: null, error: null });
                                getProductById(p._id)
                                  .then((res) => {
                                    if (res.success && res.product) setDetailModal((m) => ({ ...m, loading: false, product: res.product, error: null }));
                                    else setDetailModal((m) => ({ ...m, loading: false, error: 'Product not found.' }));
                                  })
                                  .catch((err) => setDetailModal((m) => ({ ...m, loading: false, error: err.response?.data?.message || err.message || 'Failed to load product.' })));
                              }}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="View details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                              className="p-2 text-gray-400 hover:text-[#985991] hover:bg-purple-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            {!p.hasVariants && (
                              <button
                                type="button"
                                onClick={() => setStockModal({ id: p._id, name: p.name, stock: p.stock ?? 0 })}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Update stock"
                              >
                                <Package size={18} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDiscountModal({
                id: p._id,
                name: p.name,
                discount: p.discount ?? '',
                discountType: p.discountType || 'percentage',
                discountFixedAmount: p.discountFixedAmount != null ? String(p.discountFixedAmount) : '',
                price: p.price,
              })}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="Update discount"
                            >
                              <Percent size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm({ id: p._id, name: p.name })}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchProducts(pagination.page - 1)}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchProducts(pagination.page + 1)}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete product?</h3>
            <p className="text-sm text-gray-600 mb-4">“{deleteConfirm.name}” will be removed. This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setDeleteConfirm(null)} disabled={actionLoading} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={actionLoading} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 disabled:opacity-50">
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : null} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock modal */}
      {stockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Update stock</h3>
            <p className="text-sm text-gray-500 mb-4">{stockModal.name}</p>
            <input
              type="number"
              min="0"
              value={stockModal.stock}
              onChange={(e) => setStockModal((m) => ({ ...m, stock: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none mb-4"
              placeholder="Quantity"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setStockModal(null)} disabled={actionLoading} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="button" onClick={handleStockSave} disabled={actionLoading} className="px-4 py-2 text-sm bg-[#985991] text-white rounded-lg hover:bg-[#7A4774] flex items-center gap-2 disabled:opacity-50">
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : null} Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discount modal – sale price is computed by backend from discount */}
      {discountModal && (() => {
        const price = Number(discountModal.price);
        const discountNum = discountModal.discount !== '' && !Number.isNaN(Number(discountModal.discount)) ? Number(discountModal.discount) : null;
        const fixedNum = discountModal.discountFixedAmount !== '' && !Number.isNaN(Number(discountModal.discountFixedAmount)) ? Number(discountModal.discountFixedAmount) : null;
        let displaySale = null;
        if (price > 0 && discountModal.discountType === 'percentage' && discountNum != null && discountNum > 0) {
          displaySale = (price * (1 - discountNum / 100)).toFixed(2);
        } else if (price > 0 && discountModal.discountType === 'fixed' && fixedNum != null && fixedNum > 0) {
          displaySale = Math.max(0, price - fixedNum).toFixed(2);
        }
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Update discount</h3>
              <p className="text-sm text-gray-500 mb-4">{discountModal.name}</p>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Discount type</label>
                  <select
                    value={discountModal.discountType}
                    onChange={(e) => setDiscountModal((m) => ({ ...m, discountType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed amount (₹)</option>
                  </select>
                </div>
                {discountModal.discountType === 'percentage' ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Discount % (0–100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountModal.discount}
                      onChange={(e) => setDiscountModal((m) => ({ ...m, discount: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                      placeholder="e.g. 20"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Discount amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountModal.discountFixedAmount}
                      onChange={(e) => setDiscountModal((m) => ({ ...m, discountFixedAmount: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                      placeholder="e.g. 100"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">Price: ₹{discountModal.price}. {displaySale != null && <span className="font-medium text-[#985991]">Sale price (auto): ₹{displaySale}</span>}</p>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setDiscountModal(null)} disabled={actionLoading} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="button" onClick={handleDiscountSave} disabled={actionLoading} className="px-4 py-2 text-sm bg-[#985991] text-white rounded-lg hover:bg-[#7A4774] flex items-center gap-2 disabled:opacity-50">
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : null} Save
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Product details modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Product details</h3>
              <button type="button" onClick={() => setDetailModal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {detailModal.loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 size={40} className="text-[#985991] animate-spin mb-4" />
                  <p className="text-gray-500">Loading product...</p>
                </div>
              ) : detailModal.error ? (
                <div className="py-8 text-center">
                  <AlertTriangle size={40} className="text-amber-500 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">{detailModal.error}</p>
                  <button type="button" onClick={() => setDetailModal(null)} className="mt-4 text-sm text-[#985991] font-medium hover:underline">Close</button>
                </div>
              ) : detailModal.product ? (
                <div className="space-y-6">
                  {/* Product details – dynamic */}
                  <section>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Package size={16} className="text-[#985991]" /> Product information
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img
                            src={detailModal.product.coverImage || detailModal.product.images?.[0] || PLACEHOLDER_IMG}
                            alt={detailModal.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-lg">{detailModal.product.name}</p>
                          {detailModal.product.brand && <p className="text-sm text-gray-500">{detailModal.product.brand}</p>}
                          <p className="text-xs text-gray-400 mt-1">SKU: {detailModal.product.sku || '–'}</p>
                          <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                            detailModal.product.status === 'active' ? 'bg-green-50 text-green-600' :
                            detailModal.product.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                            detailModal.product.status === 'out_of_stock' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {detailModal.product.status?.replace('_', ' ') || '–'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase">Price</p>
                          <p className="font-semibold text-gray-800">{formatPrice(detailModal.product.price)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase">Sale price</p>
                          <p className="font-semibold text-gray-800">{detailModal.product.salePrice != null ? formatPrice(detailModal.product.salePrice) : '–'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase">Discount</p>
                          <p className="font-semibold text-gray-800">
                            {detailModal.product.discountType === 'fixed' && detailModal.product.discountFixedAmount != null
                              ? formatPrice(detailModal.product.discountFixedAmount) + ' off'
                              : detailModal.product.discount != null ? `${detailModal.product.discount}%` : '–'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase">Stock</p>
                          <p className="font-semibold text-gray-800">{detailModal.product.stock ?? 0} units</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase">Category</p>
                          <p className="font-medium text-gray-800">{detailModal.product.category?.name || '–'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase">Subcategory</p>
                          <p className="font-medium text-gray-800">{detailModal.product.subcategory?.name || '–'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase">Product type</p>
                          <p className="font-medium text-gray-800 capitalize">{detailModal.product.productType || '–'}</p>
                          {detailModal.product.productSubType && <p className="text-xs text-gray-500">{detailModal.product.productSubType}</p>}
                        </div>
                      </div>
                      {detailModal.product.hasVariants && Array.isArray(detailModal.product.variants) && detailModal.product.variants.length > 0 && (
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Variants ({detailModal.product.variants.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {detailModal.product.variants.slice(0, 12).map((v, i) => (
                              <div key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs">
                                <span className="font-medium text-gray-800">{v.attributes?.shadeName || v.attributes?.sizeLabel || `Variant ${i + 1}`}</span>
                                <span className="text-gray-500 ml-1">{formatPrice(v.price)}</span>
                                <span className="text-gray-400 ml-1">· {v.stock ?? 0} in stock</span>
                              </div>
                            ))}
                            {detailModal.product.variants.length > 12 && <span className="text-xs text-gray-400 self-center">+{detailModal.product.variants.length - 12} more</span>}
                          </div>
                        </div>
                      )}
                      {detailModal.product.shortDescription && (
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase mb-1">Short description</p>
                          <p className="text-sm text-gray-700">{detailModal.product.shortDescription}</p>
                        </div>
                      )}
                      {detailModal.product.description && (
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase mb-1">Description</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{detailModal.product.description}</p>
                        </div>
                      )}
                      {detailModal.product.images?.length > 0 && (
                        <div>
                          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Images ({detailModal.product.images.length})</p>
                          <div className="flex gap-2 flex-wrap">
                            {detailModal.product.images.slice(0, 6).map((url, i) => (
                              <div key={i} className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {detailModal.product.images.length > 6 && <span className="text-xs text-gray-400 self-center">+{detailModal.product.images.length - 6} more</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Sales – static placeholder */}
                  <section>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" /> Sales overview
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                        <p className="text-2xl font-bold text-gray-800">–</p>
                        <p className="text-xs text-gray-500 mt-1">Total revenue</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                        <p className="text-2xl font-bold text-gray-800">–</p>
                        <p className="text-xs text-gray-500 mt-1">Units sold</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                        <p className="text-2xl font-bold text-gray-800">–</p>
                        <p className="text-xs text-gray-500 mt-1">Avg. order value</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                        <p className="text-2xl font-bold text-gray-800">–</p>
                        <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Sales data will appear here when orders are integrated.</p>
                  </section>

                  {/* Orders – static placeholder */}
                  <section>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-blue-600" /> Order activity
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Orders containing this product will be listed here.</p>
                      <div className="mt-3 flex items-center gap-2 text-gray-400 text-sm">
                        <Package size={16} />
                        <span>No orders linked yet. Connect orders API to see real data.</span>
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}
            </div>
            {detailModal.product && (
              <div className="p-5 border-t border-gray-100 flex-shrink-0 flex justify-end">
                <button type="button" onClick={() => setDetailModal(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Close</button>
                <button type="button" onClick={() => { setDetailModal(null); navigate(`/admin/products/edit/${detailModal.id}`); }} className="px-4 py-2 text-sm bg-[#985991] text-white rounded-lg hover:bg-[#7A4774] flex items-center gap-2">
                  <Edit size={16} /> Edit product
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
