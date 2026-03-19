import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  X,
  Check,
  Loader2,
  AlertCircle,
  Package,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Layers,
  ClipboardList,
  ChevronRight,
} from 'lucide-react';
import { getCategoriesTree, createProduct } from '../services/adminService';
import { uploadMedia } from '../services/userService';
import {
  PRODUCT_TYPES,
  PRODUCT_SUB_TYPE_EXAMPLES,
  PRODUCT_STATUSES,
  VARIANT_FINISH,
  VARIANT_COVERAGE,
  VARIANT_UNDERTONE,
  SIZE_UNITS,
  formatPrice,
} from '../constants/productTypes';

const UPLOAD_FOLDER = 'products';
const MIN_IMAGES = 3;
const STEPS = [
  { id: 1, label: 'Basic info', icon: FileText },
  { id: 2, label: 'Media', icon: ImageIcon },
  { id: 3, label: 'Pricing & discount', icon: DollarSign },
  { id: 4, label: 'Variants', icon: Layers },
  { id: 5, label: 'Review & submit', icon: ClipboardList },
];

const isImageFile = (f) => f?.type?.startsWith('image/');
const isVideoFile = (f) => f?.type?.startsWith('video/');

const defaultVariant = (productType) => ({
  price: '',
  stock: '0',
  isDefault: false,
  attributes: {
    shadeName: '',
    shadeCode: '',
    sizeLabel: '',
    sizeValue: '',
    sizeUnit: 'ml',
    spf: '',
    paRating: '',
    finish: 'other',
    coverage: 'other',
    undertone: 'other',
  },
});

export default function AddNewProducts() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ current: 0, total: 0, phase: '' });

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    ingredients: '',
    howToUse: '',
    category: '',
    subcategory: '',
    productType: 'makeup',
    productSubType: '',
    brand: '',
    status: 'draft',
    isFeatured: false,
    discountType: 'percentage',
    discount: '',
    discountFixedAmount: '',
    price: '',
    stock: '0',
    lowStockThreshold: '5',
    hasVariants: false,
  });
  const [variants, setVariants] = useState([defaultVariant('makeup')]);

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

  const canProceedStep1 = () =>
    formData.name.trim() &&
    formData.category &&
    formData.productType;

  const canProceedStep2 = () => imageFiles.length >= MIN_IMAGES;

  const canProceedStep3 = () => {
    if (formData.hasVariants) return true;
    const p = parseFloat(formData.price);
    return !Number.isNaN(p) && p > 0;
  };

  const canProceedStep4 = () => {
    if (!formData.hasVariants) return true;
    return variants.length > 0 && variants.every((v) => {
      const p = parseFloat(v.price);
      return !Number.isNaN(p) && p > 0;
    });
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f && f instanceof File);
    const images = files.filter(isImageFile);
    const videos = files.filter(isVideoFile);
    if (images.length) setImageFiles((prev) => [...prev, ...images]);
    if (videos.length) setVideoFiles((prev) => [...prev, ...videos]);
  };
  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (coverImageIndex >= index && coverImageIndex > 0) setCoverImageIndex((c) => c - 1);
    else if (coverImageIndex >= index) setCoverImageIndex(0);
  };
  const removeVideo = (index) => setVideoFiles((prev) => prev.filter((_, i) => i !== index));

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear when actually leaving the drop zone (not when entering a child)
    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX <= rect.left || clientX >= rect.right || clientY <= rect.top || clientY >= rect.bottom) {
      setIsDragging(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e) => {
    addFiles(e.target.files);
    e.target.value = '';
    setIsDragging(false); // Clear drag state after file dialog closes
  };

  const addVariant = () => setVariants((v) => [...v, defaultVariant(formData.productType)]);
  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants((v) => v.filter((_, i) => i !== index));
  };
  const updateVariant = (index, field, value) => {
    setVariants((v) => {
      const next = [...v];
      if (field.startsWith('attributes.')) {
        const key = field.replace('attributes.', '');
        next[index] = {
          ...next[index],
          attributes: { ...next[index].attributes, [key]: value },
        };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };
  const setDefaultVariant = (index) => {
    setVariants((v) => v.map((x, i) => ({ ...x, isDefault: i === index })));
  };

  const nextStep = () => {
    setError(null);
    if (step === 4 && !formData.hasVariants) {
      setStep(5);
      return;
    }
    if (step < 5) setStep((s) => s + 1);
  };
  const prevStep = () => {
    setError(null);
    if (step === 5 && formData.hasVariants) {
      setStep(4);
      return;
    }
    if (step === 5 && !formData.hasVariants) {
      setStep(3);
      return;
    }
    if (step > 1) setStep((s) => s - 1);
  };

  const computedSalePrice = useMemo(() => {
    const price = formData.hasVariants
      ? (variants.length && parseFloat(variants[0].price))
      : parseFloat(formData.price);
    if (Number.isNaN(price) || price <= 0) return null;
    if (formData.discountType === 'fixed') {
      const fixed = parseFloat(formData.discountFixedAmount);
      if (!Number.isNaN(fixed) && fixed > 0) return Math.max(0, price - fixed);
    } else {
      const d = parseFloat(formData.discount);
      if (!Number.isNaN(d) && d > 0 && d <= 100) return Math.round(price * (1 - d / 100) * 100) / 100;
    }
    return null;
  }, [formData.hasVariants, formData.price, formData.discountType, formData.discount, formData.discountFixedAmount, variants]);

  const buildPayload = () => {
    const discountType = formData.discountType === 'fixed' ? 'fixed' : 'percentage';
    const discount =
      discountType === 'percentage' && formData.discount !== '' && !Number.isNaN(parseFloat(formData.discount))
        ? Math.min(100, Math.max(0, parseFloat(formData.discount)))
        : null;
    const discountFixedAmount =
      discountType === 'fixed' && formData.discountFixedAmount !== '' && !Number.isNaN(parseFloat(formData.discountFixedAmount))
        ? Math.max(0, parseFloat(formData.discountFixedAmount))
        : null;

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
      lowStockThreshold: Math.max(0, parseInt(formData.lowStockThreshold, 10) || 5),
      meta: {
        ingredients: (formData.ingredients || '').trim(),
        howToUse: (formData.howToUse || '').trim(),
      },
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
            shadeImage: (v.attributes?.shadeImage || '').trim(),
            finish: v.attributes?.finish || 'other',
            coverage: v.attributes?.coverage || 'other',
            undertone: v.attributes?.undertone || 'other',
            sizeLabel: (v.attributes?.sizeLabel || '').trim(),
            sizeValue: v.attributes?.sizeValue != null ? Number(v.attributes.sizeValue) : undefined,
            sizeUnit: v.attributes?.sizeUnit || 'ml',
            spf: v.attributes?.spf != null && v.attributes.spf !== '' ? Number(v.attributes.spf) : undefined,
            paRating: (v.attributes?.paRating || '').trim(),
            skinType: Array.isArray(v.attributes?.skinType) ? v.attributes.skinType : [],
            concern: Array.isArray(v.attributes?.concern) ? v.attributes.concern : [],
            shadeGroup: (v.attributes?.shadeGroup || '').trim(),
          },
        })),
      };
    }

    return {
      ...base,
      hasVariants: false,
      price: Math.max(0, parseFloat(formData.price) || 0),
      stock: Math.max(0, parseInt(formData.stock, 10) || 0),
    };
  };

  const handleSubmit = async () => {
    setError(null);
    if (!canProceedStep1() || !canProceedStep2()) {
      setError('Please complete Basic info and add at least 3 images.');
      return;
    }
    if (!formData.hasVariants && (Number.isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)) {
      setError('Please enter a valid price for simple product.');
      return;
    }
    if (formData.hasVariants && (!variants.length || variants.some((v) => Number.isNaN(parseFloat(v.price)) || parseFloat(v.price) <= 0))) {
      setError('Each variant must have a valid price.');
      return;
    }

    setSubmitting(true);
    const total = imageFiles.length + videoFiles.length;
    setUploadStatus({ current: 0, total, phase: 'Uploading media...' });

    const imageUrls = [];
    const videoUrls = [];
    let done = 0;

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadStatus({ current: done, total, phase: 'Uploading images...' });
        const data = await uploadMedia([imageFiles[i]], UPLOAD_FOLDER);
        const url = data?.url ?? data?.urls?.[0];
        if (url) imageUrls.push(url);
        done += 1;
        setUploadStatus((s) => ({ ...s, current: done }));
      }
      for (let i = 0; i < videoFiles.length; i++) {
        setUploadStatus({ current: done, total, phase: 'Uploading videos...' });
        const data = await uploadMedia([videoFiles[i]], UPLOAD_FOLDER);
        const url = data?.url ?? data?.urls?.[0];
        if (url) videoUrls.push(url);
        done += 1;
        setUploadStatus((s) => ({ ...s, current: done }));
      }

      setUploadStatus((s) => ({ ...s, phase: 'Creating product...' }));

      const payload = {
        ...buildPayload(),
        images: imageUrls,
        videos: videoUrls,
        coverImageIndex: Math.min(coverImageIndex, imageUrls.length - 1),
      };

      await createProduct(payload);
      setSubmitting(false);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload or create product.');
      setSubmitting(false);
    }
  };

  const showVariantsStep = formData.hasVariants && step === 4;
  const showReviewStep = step === 5;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => (step === 1 ? navigate('/admin/products') : prevStep())}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-[#985991] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add new product</h2>
            <p className="text-gray-500 text-sm">Complete each step. You’ll review everything before submitting.</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.filter((s) => s.id !== 4 || formData.hasVariants).map((s, i, arr) => {
          const isActive = step === s.id;
          const isPast = step > s.id;
          const Icon = s.icon;
          return (
            <React.Fragment key={s.id}>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-[#985991] text-white' : isPast ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isPast ? <Check size={16} /> : <Icon size={16} />}
                {s.label}
              </div>
              {i < arr.length - 1 && <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />}
            </React.Fragment>
          );
        })}
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

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <Loader2 size={40} className="text-[#985991] animate-spin mx-auto mb-4" />
            <p className="font-semibold text-gray-800">{uploadStatus.phase}</p>
            <p className="text-[#985991] mt-2">{uploadStatus.total ? `${uploadStatus.current} / ${uploadStatus.total}` : 'Please wait...'}</p>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#985991] transition-all" style={{ width: uploadStatus.total ? `${(100 * uploadStatus.current) / uploadStatus.total}%` : '0%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Basic info */}
      {step === 1 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><FileText size={20} className="text-[#985991]" /> Basic information</h3>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product name *</label>
            <input
              type="text"
              placeholder="e.g. Radiance Vitamin C Serum"
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value, subcategory: '' }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? 'Loading...' : 'Select category'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subcategory</label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData((f) => ({ ...f, subcategory: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
                disabled={!formData.category}
              >
                <option value="">None</option>
                {subcategoryOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product type *</label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData((f) => ({ ...f, productType: e.target.value, productSubType: '' }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sub-type (e.g. lipstick, sunscreen)</label>
              <input
                type="text"
                placeholder={subTypeSuggestions[0] || 'e.g. lipstick'}
                list="subtypes"
                value={formData.productSubType}
                onChange={(e) => setFormData((f) => ({ ...f, productSubType: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
              />
              <datalist id="subtypes">
                {subTypeSuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label>
            <input
              type="text"
              placeholder="e.g. Lumora"
              value={formData.brand}
              onChange={(e) => setFormData((f) => ({ ...f, brand: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Short description</label>
            <textarea
              rows={2}
              placeholder="Brief tagline for listings..."
              value={formData.shortDescription}
              onChange={(e) => setFormData((f) => ({ ...f, shortDescription: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Full product description, benefits, key features..."
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ingredients</label>
            <textarea
              rows={3}
              placeholder="List ingredients (e.g. Aqua, Glycerin, Vitamin E...)"
              value={formData.ingredients}
              onChange={(e) => setFormData((f) => ({ ...f, ingredients: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">How to use</label>
            <textarea
              rows={3}
              placeholder="Application steps and usage instructions..."
              value={formData.howToUse}
              onChange={(e) => setFormData((f) => ({ ...f, howToUse: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceedStep1()}
              className="px-6 py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] disabled:opacity-50 flex items-center gap-2"
            >
              Next: Media <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Media */}
      {step === 2 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><ImageIcon size={20} className="text-[#985991]" /> Product images & videos</h3>
          <p className="text-sm text-gray-500">Add at least {MIN_IMAGES} images. First image can be set as cover for listing cards.</p>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all min-h-[160px] flex flex-col items-center justify-center ${
              isDragging ? 'border-[#985991] bg-purple-50' : 'border-gray-200 hover:border-[#985991] hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadCloud size={32} className="text-gray-400 mb-2 pointer-events-none" />
            <p className="text-sm font-medium text-gray-600 pointer-events-none">Click or drag images and videos here</p>
            <input
              type="file"
              multiple
              className="hidden"
              id="productImgUpload"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={handleFileSelect}
            />
            <label htmlFor="productImgUpload" className="absolute inset-0 cursor-pointer rounded-xl z-[0]" aria-label="Upload images or videos" />
          </div>
          {imageFiles.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Images ({imageFiles.length}) – set cover for listing</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imageFiles.map((file, i) => (
                  <div key={`img-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100"><X size={14} /></button>
                    {coverImageIndex === i ? (
                      <span className="absolute bottom-0 left-0 w-full bg-[#985991] text-white text-[10px] text-center py-0.5 font-bold">Cover</span>
                    ) : (
                      <button type="button" onClick={() => setCoverImageIndex(i)} className="absolute bottom-0 left-0 right-0 w-full bg-black/60 text-white text-[10px] py-0.5 font-medium opacity-0 group-hover:opacity-100">Set as cover</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {videoFiles.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Videos (optional)</p>
              <div className="grid grid-cols-2 gap-2">
                {videoFiles.map((file, i) => (
                  <div key={`vid-${i}`} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" muted playsInline />
                    <button type="button" onClick={() => removeVideo(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {imageFiles.length > 0 && imageFiles.length < MIN_IMAGES && <p className="text-amber-600 text-sm">Add at least {MIN_IMAGES - imageFiles.length} more image(s).</p>}
          <div className="flex justify-between pt-4">
            <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Back</button>
            <button type="button" onClick={nextStep} disabled={!canProceedStep2()} className="px-6 py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] disabled:opacity-50 flex items-center gap-2">Next: Pricing <ArrowRight size={18} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Pricing & discount */}
      {step === 3 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><DollarSign size={20} className="text-[#985991]" /> Pricing & discount</h3>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasVariants}
                onChange={(e) => setFormData((f) => ({ ...f, hasVariants: e.target.checked }))}
                className="accent-[#985991]"
              />
              <span className="text-sm font-medium text-gray-700">This product has variants (e.g. shades, sizes)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">If checked, you’ll add variant-wise price and stock in the next step.</p>
          </div>
          {!formData.hasVariants && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="999"
                    value={formData.price}
                    onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stock quantity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData((f) => ({ ...f, stock: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Low stock alert at</label>
                <input
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData((f) => ({ ...f, lowStockThreshold: e.target.value }))}
                  className="w-full max-w-[120px] bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none"
                />
              </div>
            </>
          )}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Discount (applies to all / each variant)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData((f) => ({ ...f, discountType: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount (₹)</option>
                </select>
              </div>
              {formData.discountType === 'percentage' ? (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Discount % (0–100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="20"
                    value={formData.discount}
                    onChange={(e) => setFormData((f) => ({ ...f, discount: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Discount amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="100"
                    value={formData.discountFixedAmount}
                    onChange={(e) => setFormData((f) => ({ ...f, discountFixedAmount: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
              )}
            </div>
            {computedSalePrice != null && <p className="text-sm text-gray-600 mt-2">Sale price (auto): <span className="font-bold text-[#985991]">{formatPrice(computedSalePrice)}</span></p>}
          </div>
          <div className="flex justify-between pt-4">
            <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Back</button>
            <button type="button" onClick={nextStep} disabled={!canProceedStep3()} className="px-6 py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] disabled:opacity-50 flex items-center gap-2">
              {formData.hasVariants ? 'Next: Variants' : 'Next: Review'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Variants (only when hasVariants) */}
      {showVariantsStep && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><Layers size={20} className="text-[#985991]" /> Variants (shades / sizes)</h3>
          <p className="text-sm text-gray-500">Add at least one variant. Each has its own price and stock. Use shade name for makeup or size for skincare (e.g. 50 ml).</p>
          {variants.map((v, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Variant {i + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={!!v.isDefault} onChange={() => setDefaultVariant(i)} className="accent-[#985991]" />
                    Default
                  </label>
                  <button type="button" onClick={() => removeVariant(i)} disabled={variants.length <= 1} className="text-red-500 hover:bg-red-50 p-1 rounded disabled:opacity-40">Remove</button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Shade name</label>
                    <input type="text" placeholder="e.g. Warm Nude" value={v.attributes?.shadeName || ''} onChange={(e) => updateVariant(i, 'attributes.shadeName', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Finish</label>
                    <select value={v.attributes?.finish || 'other'} onChange={(e) => updateVariant(i, 'attributes.finish', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      {VARIANT_FINISH.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {(formData.productType === 'skincare' || formData.productType === 'bodycare' || formData.productType === 'haircare') && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Size label</label>
                    <input type="text" placeholder={formData.productType === 'haircare' ? 'e.g. 200 ml, 500 ml' : 'e.g. 50 ml'} value={v.attributes?.sizeLabel || ''} onChange={(e) => updateVariant(i, 'attributes.sizeLabel', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Size value</label>
                    <input type="number" min="0" step="0.01" placeholder="50" value={v.attributes?.sizeValue ?? ''} onChange={(e) => updateVariant(i, 'attributes.sizeValue', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Unit</label>
                    <select value={v.attributes?.sizeUnit || 'ml'} onChange={(e) => updateVariant(i, 'attributes.sizeUnit', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      {SIZE_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">SPF (optional)</label>
                    <input type="number" min="0" placeholder="50" value={v.attributes?.spf ?? ''} onChange={(e) => updateVariant(i, 'attributes.spf', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              )}
              {(formData.productType === 'fragrance' || formData.productType === 'tool' || formData.productType === 'accessory') && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Size / variant label</label>
                    <input type="text" placeholder="e.g. 50 ml, 100 ml" value={v.attributes?.sizeLabel || ''} onChange={(e) => updateVariant(i, 'attributes.sizeLabel', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Size value</label>
                    <input type="number" min="0" step="0.01" placeholder="50" value={v.attributes?.sizeValue ?? ''} onChange={(e) => updateVariant(i, 'attributes.sizeValue', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
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
          <button type="button" onClick={addVariant} className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-[#985991] hover:text-[#985991]">
            + Add another variant
          </button>
          <div className="flex justify-between pt-4">
            <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Back</button>
            <button type="button" onClick={nextStep} disabled={!canProceedStep4()} className="px-6 py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] disabled:opacity-50 flex items-center gap-2">Next: Review <ArrowRight size={18} /></button>
          </div>
        </div>
      )}

      {/* Step 5: Review & submit */}
      {step === 5 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><ClipboardList size={20} className="text-[#985991]" /> Review & submit</h3>
          <p className="text-sm text-gray-500">Confirm details below, then click Submit to create the product.</p>

          <div className="space-y-4 text-sm">
            <section className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Basic info</h4>
              <p><span className="text-gray-500">Name:</span> {formData.name || '–'}</p>
              <p><span className="text-gray-500">Category:</span> {categories.find((c) => c.id === formData.category)?.name || formData.category || '–'}</p>
              <p><span className="text-gray-500">Type:</span> {formData.productType} {formData.productSubType && `· ${formData.productSubType}`}</p>
              {formData.brand && <p><span className="text-gray-500">Brand:</span> {formData.brand}</p>}
              {formData.description && <p><span className="text-gray-500">Description:</span> {formData.description.slice(0, 80)}{formData.description.length > 80 ? '…' : ''}</p>}
              {formData.ingredients && <p><span className="text-gray-500">Ingredients:</span> {formData.ingredients.slice(0, 60)}{formData.ingredients.length > 60 ? '…' : ''}</p>}
              {formData.howToUse && <p><span className="text-gray-500">How to use:</span> {formData.howToUse.slice(0, 60)}{formData.howToUse.length > 60 ? '…' : ''}</p>}
            </section>
            <section className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Media</h4>
              <p>{imageFiles.length} image(s), {videoFiles.length} video(s). Cover: image #{coverImageIndex + 1}</p>
            </section>
            <section className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Pricing & discount</h4>
              <p>Discount: {formData.discountType === 'fixed' ? `₹${formData.discountFixedAmount}` : `${formData.discount}%`}</p>
              {formData.hasVariants ? (
                <p>{variants.length} variant(s). Prices: {variants.map((v) => formatPrice(parseFloat(v.price))).join(', ')}</p>
              ) : (
                <p>Price: {formatPrice(parseFloat(formData.price))}, Stock: {formData.stock}. Sale: {computedSalePrice != null ? formatPrice(computedSalePrice) : '–'}</p>
              )}
            </section>
            {formData.hasVariants && variants.length > 0 && (
              <section className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Variants summary</h4>
                <ul className="list-disc list-inside space-y-1">
                  {variants.map((v, i) => (
                    <li key={i}>
                      {v.attributes?.shadeName || v.attributes?.sizeLabel || `Variant ${i + 1}`} – {formatPrice(parseFloat(v.price))}, stock: {v.stock}
                      {v.isDefault && ' (default)'}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Publish</h4>
              <p>Status: {PRODUCT_STATUSES.find((s) => s.value === formData.status)?.label || formData.status}. Featured: {formData.isFeatured ? 'Yes' : 'No'}</p>
            </section>
          </div>

          <div className="flex justify-between pt-4">
            <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Back</button>
            <button type="button" onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Submit product
            </button>
          </div>
        </div>
      )}

    </div>
  );
}