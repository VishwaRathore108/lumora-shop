import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Save,
  DollarSign,
  Package,
  Tag,
  Loader2,
  AlertCircle,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';
import { getProductById, getCategoriesTree, updateProduct } from '../services/adminService';
import { uploadMedia } from '../services/userService';
import {
  PRODUCT_TYPES,
  PRODUCT_SUB_TYPE_EXAMPLES,
  PRODUCT_STATUSES,
  SIZE_UNITS,
} from '../constants/productTypes';

const UPLOAD_FOLDER = 'products';
const MIN_IMAGES = 3;

const isImageFile = (f) => f?.type?.startsWith('image/');
const isVideoFile = (f) => f?.type?.startsWith('video/');

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newVideoFiles, setNewVideoFiles] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ current: 0, total: 0, phase: '' });
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    subcategory: '',
    productType: 'makeup',
    productSubType: '',
    price: '',
    discount: '',
    discountType: 'percentage',
    discountFixedAmount: '',
    brand: '',
    stock: '0',
    lowStockThreshold: '5',
    status: 'draft',
    isFeatured: false,
    hasVariants: false,
  });
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getProductById(id);
        if (res.success && res.product) {
          const p = res.product;
          setProduct(p);
          const catId = (p.category && (p.category._id || p.category))?.toString?.() || (p.category && typeof p.category === 'string' ? p.category : '') || '';
          const subId = (p.subcategory && (p.subcategory._id || p.subcategory))?.toString?.() || (p.subcategory && typeof p.subcategory === 'string' ? p.subcategory : '') || '';
          const hasVariants = !!p.hasVariants;
          const variantList = Array.isArray(p.variants) && p.variants.length
            ? p.variants.map((v) => ({
                price: v.price != null ? String(v.price) : '',
                stock: v.stock != null ? String(v.stock) : '0',
                isDefault: !!v.isDefault,
                attributes: {
                  shadeName: v.attributes?.shadeName ?? '',
                  shadeCode: v.attributes?.shadeCode ?? '',
                  sizeLabel: v.attributes?.sizeLabel ?? '',
                  sizeValue: v.attributes?.sizeValue != null ? v.attributes.sizeValue : '',
                  sizeUnit: v.attributes?.sizeUnit ?? 'ml',
                  spf: v.attributes?.spf != null ? v.attributes.spf : '',
                  paRating: v.attributes?.paRating ?? '',
                  finish: v.attributes?.finish ?? 'other',
                  coverage: v.attributes?.coverage ?? 'other',
                  undertone: v.attributes?.undertone ?? 'other',
                },
              }))
            : [{ price: '', stock: '0', isDefault: true, attributes: { shadeName: '', sizeLabel: '', sizeUnit: 'ml', finish: 'other', coverage: 'other', undertone: 'other' } }];

          setFormData({
            name: p.name || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            category: catId,
            subcategory: subId,
            productType: p.productType || 'makeup',
            productSubType: p.productSubType || '',
            price: p.price != null ? String(p.price) : '',
            discount: p.discount != null ? String(p.discount) : '',
            discountType: p.discountType === 'fixed' ? 'fixed' : 'percentage',
            discountFixedAmount: p.discountFixedAmount != null ? String(p.discountFixedAmount) : '',
            brand: p.brand || '',
            stock: p.stock != null ? String(p.stock) : '0',
            lowStockThreshold: p.lowStockThreshold != null ? String(p.lowStockThreshold) : '5',
            status: p.status || 'draft',
            isFeatured: !!p.isFeatured,
            hasVariants,
          });
          setVariants(variantList);
          setImageUrls(Array.isArray(p.images) ? p.images : []);
          setVideoUrls(Array.isArray(p.videos) ? p.videos : []);
          setCoverImageIndex(Math.min(Math.max(0, p.coverImageIndex ?? 0), (p.images?.length || 1) - 1));
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      setLoadingCategories(true);
      try {
        const res = await getCategoriesTree();
        if (res.success && Array.isArray(res.categories)) setCategories(res.categories || []);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  const subcategoryOptions = formData.category
    ? (categories.find((c) => c.id === formData.category)?.subcategories || [])
    : [];
  const subTypeSuggestions = PRODUCT_SUB_TYPE_EXAMPLES[formData.productType] || [];

  const addVariant = () => setVariants((v) => [...v, { price: '', stock: '0', isDefault: false, attributes: { shadeName: '', sizeLabel: '', sizeUnit: 'ml', finish: 'other', coverage: 'other', undertone: 'other' } }]);
  const removeVariant = (index) => { if (variants.length <= 1) return; setVariants((v) => v.filter((_, i) => i !== index)); };
  const updateVariant = (index, field, value) => {
    setVariants((v) => {
      const next = [...v];
      if (field.startsWith('attributes.')) {
        const key = field.replace('attributes.', '');
        next[index] = { ...next[index], attributes: { ...next[index].attributes, [key]: value } };
      } else next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const setDefaultVariant = (index) => setVariants((v) => v.map((x, i) => ({ ...x, isDefault: i === index })));

  const totalImageCount = imageUrls.length + newImageFiles.length;
  const price = parseFloat(formData.price);
  const discountVal = formData.discount !== '' && !Number.isNaN(parseFloat(formData.discount)) ? parseFloat(formData.discount) : null;
  const discountFixed = formData.discountFixedAmount !== '' && !Number.isNaN(parseFloat(formData.discountFixedAmount)) ? parseFloat(formData.discountFixedAmount) : null;
  const computedSalePrice = useMemo(() => {
    if (Number.isNaN(price) || price <= 0) return null;
    if (formData.discountType === 'fixed' && discountFixed != null && discountFixed > 0) {
      return Math.max(0, price - discountFixed);
    }
    if (discountVal != null && discountVal > 0 && discountVal <= 100) {
      return Math.round(price * (1 - discountVal / 100) * 100) / 100;
    }
    return null;
  }, [price, formData.discountType, discountVal, discountFixed]);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f && f instanceof File);
    const images = files.filter(isImageFile);
    const videos = files.filter(isVideoFile);
    if (images.length) setNewImageFiles((prev) => [...prev, ...images]);
    if (videos.length) setNewVideoFiles((prev) => [...prev, ...videos]);
  };

  const removeImageUrl = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    if (coverImageIndex === index) setCoverImageIndex(0);
    else if (coverImageIndex > index) setCoverImageIndex((c) => c - 1);
  };
  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    const newIndex = imageUrls.length + index;
    if (coverImageIndex === newIndex) setCoverImageIndex(0);
    else if (coverImageIndex > newIndex) setCoverImageIndex((c) => c - 1);
  };
  const removeVideoUrl = (index) => setVideoUrls((prev) => prev.filter((_, i) => i !== index));
  const removeNewVideo = (index) => setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));

  const handleFileInput = (e) => {
    addFiles(e.target.files);
    e.target.value = '';
  };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const setCover = (index) => setCoverImageIndex(index);

  const validate = () => {
    if (!formData.name.trim()) {
      setError('Product name is required.');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category.');
      return false;
    }
    if (!formData.hasVariants) {
      const p = parseFloat(formData.price);
      if (Number.isNaN(p) || p < 0) {
        setError('Please enter a valid price.');
        return false;
      }
    } else {
      if (!variants.length || variants.some((v) => Number.isNaN(parseFloat(v.price)) || parseFloat(v.price) <= 0)) {
        setError('At least one variant with valid price is required.');
        return false;
      }
    }
    if (totalImageCount < MIN_IMAGES) {
      setError(`At least ${MIN_IMAGES} product images are required.`);
      return false;
    }
    setError(null);
    return true;
  };

  const buildUpdatePayload = (finalImages, finalVideos, finalCoverIndex) => {
    const discountType = formData.discountType === 'fixed' ? 'fixed' : 'percentage';
    const discount = discountType === 'percentage' && formData.discount !== '' && !Number.isNaN(parseFloat(formData.discount))
      ? Math.min(100, Math.max(0, parseFloat(formData.discount)))
      : undefined;
    const discountFixedAmount = discountType === 'fixed' && formData.discountFixedAmount !== '' && !Number.isNaN(parseFloat(formData.discountFixedAmount))
      ? parseFloat(formData.discountFixedAmount)
      : undefined;

    const base = {
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      productType: formData.productType,
      productSubType: formData.productSubType.trim() || undefined,
      brand: formData.brand.trim() || undefined,
      status: formData.status,
      isFeatured: formData.isFeatured,
      discountType,
      discount,
      discountFixedAmount,
      images: finalImages,
      videos: finalVideos,
      coverImageIndex: finalCoverIndex,
      lowStockThreshold: Math.max(0, parseInt(formData.lowStockThreshold, 10) || 5),
    };

    if (formData.hasVariants && variants.length > 0) {
      return {
        ...base,
        hasVariants: true,
        variants: variants.map((v) => ({
          price: Math.max(0, parseFloat(v.price) || 0),
          stock: Math.max(0, parseInt(v.stock, 10) || 0),
          isDefault: !!v.isDefault,
          attributes: {
            shadeName: (v.attributes?.shadeName || '').trim(),
            shadeCode: (v.attributes?.shadeCode || '').trim(),
            sizeLabel: (v.attributes?.sizeLabel || '').trim(),
            sizeValue: v.attributes?.sizeValue != null && v.attributes.sizeValue !== '' ? Number(v.attributes.sizeValue) : undefined,
            sizeUnit: v.attributes?.sizeUnit || 'ml',
            spf: v.attributes?.spf != null && v.attributes.spf !== '' ? Number(v.attributes.spf) : undefined,
            paRating: (v.attributes?.paRating || '').trim(),
            finish: v.attributes?.finish || 'other',
            coverage: v.attributes?.coverage || 'other',
            undertone: v.attributes?.undertone || 'other',
          },
        })),
      };
    }

    return {
      ...base,
      hasVariants: false,
      variants: [],
      price: Math.max(0, parseFloat(formData.price) || 0),
      stock: Math.max(0, parseInt(formData.stock, 10) || 0),
    };
  };

  const uploadNewFilesThenSave = async () => {
    const total = newImageFiles.length + newVideoFiles.length;
    setUploadModalOpen(true);
    setUploadStatus({ current: 0, total, phase: 'Uploading new media...' });

    const uploadedImageUrls = [];
    const uploadedVideoUrls = [];
    let done = 0;

    try {
      for (let i = 0; i < newImageFiles.length; i++) {
        setUploadStatus((s) => ({ ...s, current: done, phase: 'Uploading images...' }));
        const data = await uploadMedia([newImageFiles[i]], UPLOAD_FOLDER);
        const url = data?.url ?? data?.urls?.[0];
        if (url) uploadedImageUrls.push(url);
        done += 1;
        setUploadStatus((s) => ({ ...s, current: done }));
      }
      for (let i = 0; i < newVideoFiles.length; i++) {
        setUploadStatus((s) => ({ ...s, current: done, phase: 'Uploading videos...' }));
        const data = await uploadMedia([newVideoFiles[i]], UPLOAD_FOLDER);
        const url = data?.url ?? data?.urls?.[0];
        if (url) uploadedVideoUrls.push(url);
        done += 1;
        setUploadStatus((s) => ({ ...s, current: done }));
      }

      setUploadStatus((s) => ({ ...s, phase: 'Saving product...' }));

      const finalImageUrls = [...imageUrls, ...uploadedImageUrls];
      const finalCoverIndex = Math.min(coverImageIndex, finalImageUrls.length - 1);
      const finalVideoUrls = [...videoUrls, ...uploadedVideoUrls];

      await updateProduct(id, buildUpdatePayload(finalImageUrls, finalVideoUrls, finalCoverIndex));

      setUploadModalOpen(false);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload or update product.');
      setUploadModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate() || !id) return;

    const hasNewFiles = newImageFiles.length > 0 || newVideoFiles.length > 0;
    if (hasNewFiles) {
      uploadNewFilesThenSave();
      return;
    }

    setUploadModalOpen(true);
    setUploadStatus({ current: 1, total: 1, phase: 'Saving product...' });
    try {
      const finalCoverIndex = Math.min(coverImageIndex, imageUrls.length - 1);
      await updateProduct(id, buildUpdatePayload(imageUrls, videoUrls, finalCoverIndex));
      setUploadModalOpen(false);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update product.');
      setUploadModalOpen(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-[#985991]" size={40} />
        <p className="mt-4 text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product && !loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">{error || 'Product not found.'}</div>
        <button type="button" onClick={() => navigate('/admin/products')} className="text-[#985991] font-medium">← Back to products</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/admin/products')} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-[#985991] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
            <p className="text-gray-500 text-sm">Update details. New images/videos upload when you click Save.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={uploadModalOpen} className="px-6 py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-lg shadow-purple-100 flex items-center gap-2 disabled:opacity-50">
            <Save size={18} />
            Save changes
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            <button type="button" onClick={() => setError(null)} className="text-sm font-medium underline mt-1">Dismiss</button>
          </div>
        </div>
      )}

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <Loader2 size={40} className="text-[#985991] animate-spin mx-auto mb-4" />
            <p className="font-semibold text-gray-800">{uploadStatus.phase}</p>
            {uploadStatus.total > 0 && (
              <p className="text-lg text-[#985991] mt-2">{uploadStatus.current} / {uploadStatus.total} uploaded</p>
            )}
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#985991] transition-all duration-300"
                style={{ width: uploadStatus.total ? `${(100 * uploadStatus.current) / uploadStatus.total}%` : '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">Product Images (min {MIN_IMAGES})</h3>
            <p className="text-xs text-gray-500 mb-4">New files upload when you click Save.</p>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all min-h-[120px] flex flex-col items-center justify-center relative ${isDragging ? 'border-[#985991] bg-purple-50' : 'border-gray-200 hover:border-[#985991] hover:bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadCloud size={28} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Click or drag to add more</p>
              <input type="file" multiple className="hidden" id="editProductImg" accept="image/*,video/mp4,video/webm,video/quicktime" onChange={handleFileInput} />
              <label htmlFor="editProductImg" className="absolute inset-0 cursor-pointer" />
            </div>
            <div className="mt-4 space-y-3">
              {imageUrls.length > 0 && (
                <>
                  <p className="text-xs font-bold text-gray-500 uppercase">Current images</p>
                  <div className="grid grid-cols-3 gap-2">
                    {imageUrls.map((url, i) => (
                      <div key={`url-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImageUrl(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100"><X size={14} /></button>
                        {coverImageIndex === i ? (
                          <span className="absolute bottom-0 left-0 w-full bg-[#985991] text-white text-[10px] text-center py-0.5 font-bold">Cover</span>
                        ) : (
                          <button type="button" onClick={() => setCover(i)} className="absolute bottom-0 left-0 right-0 w-full bg-black/60 text-white text-[10px] py-0.5 font-medium opacity-0 group-hover:opacity-100">Set as cover</button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {newImageFiles.length > 0 && (
                <>
                  <p className="text-xs font-bold text-gray-500 uppercase">New (upload on Save)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {newImageFiles.map((file, i) => {
                      const idx = imageUrls.length + i;
                      return (
                        <div key={`new-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100"><X size={14} /></button>
                          {coverImageIndex === idx ? (
                            <span className="absolute bottom-0 left-0 w-full bg-[#985991] text-white text-[10px] text-center py-0.5 font-bold">Cover</span>
                          ) : (
                            <button type="button" onClick={() => setCover(idx)} className="absolute bottom-0 left-0 right-0 w-full bg-black/60 text-white text-[10px] py-0.5 font-medium opacity-0 group-hover:opacity-100">Set as cover</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {videoUrls.length > 0 && (
                <>
                  <p className="text-xs font-bold text-gray-500 uppercase">Videos</p>
                  <div className="grid grid-cols-2 gap-2">
                    {videoUrls.map((url, i) => (
                      <div key={`v-${i}`} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <video src={url} className="w-full h-full object-cover" muted playsInline />
                        <button type="button" onClick={() => removeVideoUrl(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {newVideoFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {newVideoFiles.map((file, i) => (
                    <div key={`nv-${i}`} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" muted playsInline />
                      <button type="button" onClick={() => removeNewVideo(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {totalImageCount > 0 && totalImageCount < MIN_IMAGES && (
              <p className="text-amber-600 text-sm mt-2">Add at least {MIN_IMAGES - totalImageCount} more image(s).</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-4">General Information</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product name *</label>
              <input type="text" placeholder="Product name" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Short description</label>
              <textarea rows={2} placeholder="Brief tagline" value={formData.shortDescription} onChange={(e) => setFormData((f) => ({ ...f, shortDescription: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full description</label>
              <textarea rows={4} placeholder="Full description" value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><DollarSign size={18} className="text-[#985991]" /> Pricing</h3>
              {!formData.hasVariants && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹) *</label>
                <input type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none" />
              </div>
              )}
              {formData.hasVariants && <p className="text-sm text-gray-500">Price is set per variant in the Variants section below.</p>}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount type</label>
                <select value={formData.discountType} onChange={(e) => setFormData((f) => ({ ...f, discountType: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount (₹)</option>
                </select>
              </div>
              {formData.discountType === 'percentage' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount %</label>
                  <input type="number" min="0" max="100" value={formData.discount} onChange={(e) => setFormData((f) => ({ ...f, discount: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount amount (₹)</label>
                  <input type="number" min="0" step="0.01" value={formData.discountFixedAmount} onChange={(e) => setFormData((f) => ({ ...f, discountFixedAmount: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none" />
                </div>
              )}
              {computedSalePrice != null && (
                <p className="text-sm text-gray-600">Sale price (auto): <span className="font-bold text-[#985991]">₹{computedSalePrice.toFixed(2)}</span></p>
              )}
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Package size={18} className="text-blue-500" /> Inventory</h3>
              {!formData.hasVariants && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData((f) => ({ ...f, stock: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none" />
              </div>
              )}
              {formData.hasVariants && <p className="text-sm text-gray-500">Stock is set per variant in the Variants section below.</p>}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Low stock at</label>
                <input type="number" min="0" value={formData.lowStockThreshold} onChange={(e) => setFormData((f) => ({ ...f, lowStockThreshold: e.target.value }))} className="w-full max-w-[120px] bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU</label>
                <input type="text" value={product?.sku ?? ''} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Tag size={18} className="text-orange-500" /> Organization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category *</label>
                <select value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value, subcategory: '' }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" disabled={loadingCategories}>
                  <option value="">{loadingCategories ? 'Loading...' : 'Select category'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subcategory</label>
                <select value={formData.subcategory} onChange={(e) => setFormData((f) => ({ ...f, subcategory: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" disabled={!formData.category}>
                  <option value="">None</option>
                  {subcategoryOptions.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product type</label>
                <select value={formData.productType} onChange={(e) => setFormData((f) => ({ ...f, productType: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]">
                  {PRODUCT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sub-type</label>
                <input type="text" list="edit-subtypes" placeholder={subTypeSuggestions[0] || 'e.g. lipstick'} value={formData.productSubType} onChange={(e) => setFormData((f) => ({ ...f, productSubType: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
                <datalist id="edit-subtypes">{subTypeSuggestions.map((s) => <option key={s} value={s} />)}</datalist>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label>
                <input type="text" value={formData.brand} onChange={(e) => setFormData((f) => ({ ...f, brand: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]">
                  {PRODUCT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.hasVariants} onChange={(e) => setFormData((f) => ({ ...f, hasVariants: e.target.checked }))} className="accent-[#985991]" />
              <span className="text-sm text-gray-600">This product has variants (shades / sizes)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData((f) => ({ ...f, isFeatured: e.target.checked }))} className="accent-[#985991]" />
              <span className="text-sm text-gray-600">Feature on homepage</span>
            </label>
          </div>

          {formData.hasVariants && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Layers size={18} className="text-[#985991]" /> Variants</h3>
              <p className="text-sm text-gray-500">Edit price and stock per variant. Use shade name (makeup) or size (skincare).</p>
              {variants.map((v, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Variant {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox" checked={!!v.isDefault} onChange={() => setDefaultVariant(i)} className="accent-[#985991]" />
                        Default
                      </label>
                      <button type="button" onClick={() => removeVariant(i)} disabled={variants.length <= 1} className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-40"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price (₹) *</label>
                      <input type="number" min="0" step="0.01" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Stock</label>
                      <input type="number" min="0" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  {(formData.productType === 'makeup' || formData.productType === 'other') && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Shade name</label>
                      <input type="text" placeholder="e.g. Warm Nude" value={v.attributes?.shadeName || ''} onChange={(e) => updateVariant(i, 'attributes.shadeName', e.target.value)} className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  )}
                  {(formData.productType === 'skincare' || formData.productType === 'bodycare') && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Size label</label>
                        <input type="text" placeholder="50 ml" value={v.attributes?.sizeLabel || ''} onChange={(e) => updateVariant(i, 'attributes.sizeLabel', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Unit</label>
                        <select value={v.attributes?.sizeUnit || 'ml'} onChange={(e) => updateVariant(i, 'attributes.sizeUnit', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                          {SIZE_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addVariant} className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-[#985991] hover:text-[#985991]">+ Add variant</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
