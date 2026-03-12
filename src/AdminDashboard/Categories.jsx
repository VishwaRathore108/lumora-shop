import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Grid,
  List,
  X,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Package,
  TrendingUp,
  ShoppingBag,
  Layers,
  FolderTree,
  Info,
  Loader2,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  getCategoriesSummary,
  getCategoriesTree,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  toggleCategoryStatus as toggleCategoryStatusApi,
} from '../services/adminService';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop';

const formatCurrency = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

const defaultSummary = {
  totalCategories: 0,
  totalProducts: 0,
  totalRevenue: 0,
  totalOrders: 0,
  revenueThisMonth: 0,
  ordersThisMonth: 0,
};

const Categories = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(defaultSummary);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: '', description: '', isActive: true });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const menuRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, treeRes] = await Promise.all([
        getCategoriesSummary(),
        getCategoriesTree(),
      ]);
      if (summaryRes.success && summaryRes.summary) setSummary(summaryRes.summary);
      if (treeRes.success && Array.isArray(treeRes.categories)) {
        setCategories(treeRes.categories);
        setExpandedIds(new Set(treeRes.categories.map((c) => c.id)));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpenId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const flattenForSearch = (cats) => {
    const out = [];
    cats.forEach((c) => {
      out.push(c);
      (c.subcategories || []).forEach((s) => out.push({ ...s, parentName: c.name }));
    });
    return out;
  };

  const filteredList = flattenForSearch(categories).filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.parentName && c.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredParents = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.subcategories || []).some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openEditModal = (item, isSub) => {
    setEditModal({ id: item.id, isSub });
    setEditDraft({ name: item.name, description: item.description || '', isActive: item.isActive });
  };

  const updateCategory = async () => {
    if (!editModal) return;
    setActionLoading(true);
    try {
      await updateCategoryApi(editModal.id, {
        name: editDraft.name,
        description: editModal.isSub ? undefined : editDraft.description,
        isActive: editDraft.isActive,
      });
      setEditModal(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update category.');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id, isSub = false) => {
    setActionLoading(true);
    try {
      await deleteCategoryApi(id);
      setDeleteConfirm(null);
      setMenuOpenId(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete category.');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    setActionLoading(true);
    try {
      await toggleCategoryStatusApi(id);
      setMenuOpenId(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to toggle status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-[#985991]" size={40} />
        <p className="mt-4 text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(null); fetchData(); }} className="text-sm font-medium underline">Retry</button>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <p className="text-gray-500 text-sm">Manage categories, subcategories, and view sales by section.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NavLink to="/admin/categories/add-categories">
            <button className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95">
              <Layers size={18} /> Add parent category
            </button>
          </NavLink>
          <button
            onClick={() => navigate('/admin/categories/add-categories', { state: { subcategoryMode: true } })}
            className="flex items-center gap-2 border border-[#985991] text-[#985991] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 transition-all active:scale-95"
          >
            <FolderTree size={18} /> Add subcategory
          </button>
        </div>
      </div>

      {/* How categories work (cosmetics / like other sites) */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 flex gap-4 items-start">
        <Info className="text-[#985991] flex-shrink-0 mt-0.5" size={22} />
        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-1">How we manage categories (like other cosmetic sites)</h4>
          <p className="text-sm text-gray-600">
            <strong>Parent categories</strong> are main sections (e.g. Skincare, Makeup, Hair Care) — they appear in shop navigation and every product belongs to one. <strong>Subcategories</strong> sit under a parent and help customers filter (e.g. Serums, Lipstick, Sunscreen). You can manage or hide any category; products stay assigned until you move or remove them.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-[#985991] rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Total Categories</p>
            <p className="text-2xl font-bold text-gray-800">{summary.totalCategories}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">{summary.totalProducts}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Revenue</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalRevenue)}</p>
            <p className="text-xs text-green-600 font-medium">This month: {formatCurrency(summary.revenueThisMonth)}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Orders</p>
            <p className="text-2xl font-bold text-gray-800">{summary.totalOrders.toLocaleString()}</p>
            <p className="text-xs text-orange-600 font-medium">This month: {summary.ordersThisMonth}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories or subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991]"
          />
        </div>
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#985991]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#985991]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      {!loading && filteredParents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Layers className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-500">No categories yet. Add a parent category to get started.</p>
          <NavLink to="/admin/categories/add-categories" className="inline-flex items-center gap-2 mt-4 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774]">
            <Layers size={18} /> Add parent category
          </NavLink>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParents.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                  <img src={cat.image || PLACEHOLDER_IMG} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="relative" ref={menuOpenId === cat.id ? menuRef : null}>
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === cat.id ? null : cat.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {menuOpenId === cat.id && (
                    <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                      <button
                        onClick={() => { navigate('/admin/categories/add-categories', { state: { parentId: cat.id, parentName: cat.name } }); setMenuOpenId(null); }}
                        className="w-full text-left px-4 py-2 text-sm text-[#985991] hover:bg-purple-50 flex items-center gap-2 font-medium"
                      >
                        <FolderTree size={14} /> Add subcategory
                      </button>
                      <button
                        onClick={() => { openEditModal(cat, false); setMenuOpenId(null); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(cat.id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {cat.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => { setDeleteConfirm({ id: cat.id, name: cat.name, isSub: false }); setMenuOpenId(null); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-[#985991]/10 text-[#985991] text-xs font-medium">Parent</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{cat.productCount} products</p>
              {(cat.subcategories || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {cat.subcategories.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-xs font-medium border-t border-gray-50 pt-4">
                <span className={`px-2 py-1 rounded-full ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-[#985991]">{formatCurrency(cat.revenue)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{cat.orderCount} orders</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="p-4">Name</th>
                <th className="p-4 w-20">Type</th>
                <th className="p-4">Products</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredParents.map((cat) => (
                <React.Fragment key={cat.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4">
                      {(cat.subcategories || []).length > 0 && (
                        <button onClick={() => toggleExpand(cat.id)} className="text-gray-400 hover:text-[#985991]">
                          {expandedIds.has(cat.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={cat.image || PLACEHOLDER_IMG} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <span className="font-bold text-gray-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#985991]/10 text-[#985991] text-xs font-medium">Parent</span>
                    </td>
                    <td className="p-4 text-gray-600">{cat.productCount}</td>
                    <td className="p-4 font-medium text-[#985991]">{formatCurrency(cat.revenue)}</td>
                    <td className="p-4 text-gray-600">{cat.orderCount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right relative" ref={menuOpenId === `list-${cat.id}` ? menuRef : null}>
                      <button onClick={() => setMenuOpenId(menuOpenId === `list-${cat.id}` ? null : `list-${cat.id}`)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreVertical size={18} />
                      </button>
                      {menuOpenId === `list-${cat.id}` && (
                        <div className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                          <button onClick={() => { navigate('/admin/categories/add-categories', { state: { parentId: cat.id, parentName: cat.name } }); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#985991] hover:bg-purple-50 flex items-center gap-2 font-medium"><FolderTree size={14} /> Add subcategory</button>
                          <button onClick={() => { openEditModal(cat, false); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit2 size={14} /> Edit</button>
                          <button onClick={() => toggleStatus(cat.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{cat.isActive ? 'Deactivate' : 'Activate'}</button>
                          <button onClick={() => { setDeleteConfirm({ id: cat.id, name: cat.name, isSub: false }); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedIds.has(cat.id) && (cat.subcategories || []).map((s) => (
                    <tr key={s.id} className="bg-gray-50/50 hover:bg-gray-50">
                      <td className="p-4"></td>
                      <td className="p-4 pl-12 text-gray-700">{s.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-600 text-xs font-medium">Sub</span>
                      </td>
                      <td className="p-4 text-gray-600">{s.productCount}</td>
                      <td className="p-4 text-[#985991]">{formatCurrency(s.revenue)}</td>
                      <td className="p-4 text-gray-600">{s.orderCount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="p-4 text-right relative" ref={menuOpenId === s.id ? menuRef : null}>
                        <button onClick={() => setMenuOpenId(menuOpenId === s.id ? null : s.id)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><MoreVertical size={18} /></button>
                        {menuOpenId === s.id && (
                          <div className="absolute right-4 top-12 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                            <button onClick={() => { openEditModal(s, true); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit2 size={14} /> Edit</button>
                            <button onClick={() => toggleStatus(s.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{s.isActive ? 'Deactivate' : 'Activate'}</button>
                            <button onClick={() => { setDeleteConfirm({ id: s.id, name: s.name, isSub: true }); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">{editModal.isSub ? 'Edit Subcategory' : 'Edit Category'}</h3>
              <button onClick={() => setEditModal(null)} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                <input
                  type="text"
                  value={editDraft.name}
                  onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                />
              </div>
              {!editModal.isSub && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editDraft.description}
                    onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={editDraft.isActive}
                  onChange={(e) => setEditDraft((d) => ({ ...d, isActive: e.target.checked }))}
                  className="accent-[#985991] w-4 h-4"
                />
                <label htmlFor="edit-active" className="text-sm text-gray-600">Active</label>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2">
              <button onClick={() => setEditModal(null)} disabled={actionLoading} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={updateCategory} disabled={actionLoading} className="px-6 py-2 bg-[#985991] text-white text-sm font-medium rounded-lg hover:bg-[#7A4774] flex items-center gap-2 disabled:opacity-50">
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : null} Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete category?</h3>
            <p className="text-sm text-gray-600 mb-4">“{deleteConfirm.name}” will be removed. This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} disabled={actionLoading} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={() => deleteCategory(deleteConfirm.id, deleteConfirm.isSub)} disabled={actionLoading} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 disabled:opacity-50">
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : null} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
