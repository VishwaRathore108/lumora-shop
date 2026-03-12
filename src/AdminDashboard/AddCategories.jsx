import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Save,
  AlertCircle,
  Layers,
  FolderTree,
  Loader2,
} from 'lucide-react';
import { getCategoriesTree, createCategory as createCategoryApi } from '../services/adminService';

const TYPE_PARENT = 'parent';
const TYPE_SUB = 'subcategory';

const AddCategories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [parentOptions, setParentOptions] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [categoryType, setCategoryType] = useState(TYPE_PARENT);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoadingParents(true);
      try {
        const res = await getCategoriesTree();
        if (res.success && Array.isArray(res.categories)) setParentOptions(res.categories);
      } catch {
        setParentOptions([]);
      } finally {
        setLoadingParents(false);
      }
    })();
  }, []);

  // When opened via "Add subcategory" (or from a parent row with parentId), pre-set type and optional parent
  useEffect(() => {
    const state = location.state || {};
    if (state.parentId) {
      setCategoryType(TYPE_SUB);
      setFormData((d) => ({ ...d, parentId: state.parentId }));
    } else if (state.subcategoryMode) {
      setCategoryType(TYPE_SUB);
    }
  }, [location.state]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const name = formData.name.trim();
    if (!name) return;

    const isSub = categoryType === TYPE_SUB;
    const parentId = isSub ? (formData.parentId || '') : null;
    if (isSub && !parentId) return;

    setSaving(true);
    setSaveError(null);
    try {
      await createCategoryApi({
        name,
        description: categoryType === TYPE_PARENT ? formData.description.trim() : undefined,
        image: image || undefined,
        parentId: parentId || undefined,
        isActive: formData.isActive,
      });
      navigate('/admin/categories');
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || 'Failed to create category.');
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => navigate('/admin/categories');
  const isSub = categoryType === TYPE_SUB;
  const canSaveSub = isSub ? !!formData.parentId && !!formData.name.trim() : !!formData.name.trim();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-[#985991] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isSub ? 'Add Subcategory' : 'Add Parent Category'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isSub
                ? 'Create a subcategory under an existing parent (e.g. Serums under Skincare).'
                : 'Create a main section for your shop (e.g. Skincare, Makeup, Hair Care).'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={goBack}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSaveSub || saving}
            className="px-6 py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-lg shadow-purple-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSub ? 'Save Subcategory' : 'Save Parent Category'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Category type: Parent vs Subcategory */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Category type</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCategoryType(TYPE_PARENT)}
                className={`flex-1 flex items-center gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                  categoryType === TYPE_PARENT
                    ? 'border-[#985991] bg-purple-50 text-[#985991]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Layers size={20} />
                <div>
                  <span className="block font-semibold text-sm">Parent category</span>
                  <span className="block text-xs opacity-80">Main section (Skincare, Makeup)</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setCategoryType(TYPE_SUB)}
                className={`flex-1 flex items-center gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                  categoryType === TYPE_SUB
                    ? 'border-[#985991] bg-purple-50 text-[#985991]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <FolderTree size={20} />
                <div>
                  <span className="block font-semibold text-sm">Subcategory</span>
                  <span className="block text-xs opacity-80">Under a parent (Serums, Lipstick)</span>
                </div>
              </button>
            </div>
            {categoryType === TYPE_PARENT && (
              <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                Parent categories appear as main sections in your shop. Every cosmetic product should belong to one parent (and optionally a subcategory).
              </p>
            )}
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">{isSub ? 'Subcategory image (optional)' : 'Category Image'}</h3>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all relative ${
                isDragging ? 'border-[#985991] bg-purple-50' : 'border-gray-200 hover:border-[#985991] hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {image ? (
                <div className="relative">
                  <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white text-red-500 rounded-full shadow-md border border-gray-100 hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center relative">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
                  <p className="text-[10px] text-gray-400 mt-4">SVG, PNG, JPG (max. 800x800px)</p>
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="imgUpload" className="absolute inset-0 cursor-pointer" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
            <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-700">Pro Tip</h4>
              <p className="text-xs text-blue-600 mt-1">
                Use a square image (1:1 ratio) for best results on the mobile app grid.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                {isSub ? 'Subcategory name' : 'Parent category name'}
              </label>
              <input
                type="text"
                placeholder={isSub ? 'e.g. Serums, Lipstick, Sunscreen' : 'e.g. Skincare, Makeup, Hair Care'}
                value={formData.name}
                onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-purple-100 transition-all"
              />
            </div>
            {!isSub && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Add a short description for this category..."
                  value={formData.description}
                  onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-purple-100 transition-all"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              {isSub && (
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Under parent category</label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData((d) => ({ ...d, parentId: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
                    disabled={loadingParents}
                  >
                    <option value="">{loadingParents ? 'Loading...' : 'Select parent...'}</option>
                    {parentOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Products in this subcategory will appear under the chosen parent in the shop.</p>
                </div>
              )}
              <div className={isSub ? 'col-span-2' : ''}>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Visibility</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isActive}
                      onChange={() => setFormData((d) => ({ ...d, isActive: true }))}
                      className="accent-[#985991] w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 font-medium">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!formData.isActive}
                      onChange={() => setFormData((d) => ({ ...d, isActive: false }))}
                      className="accent-[#985991] w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 font-medium">Hidden</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
