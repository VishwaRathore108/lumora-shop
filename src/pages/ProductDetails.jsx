import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RelatedProducts from '../components/RelatedProducts';
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, ChevronDown, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { getStorefrontProductById } from '../services/productService';
import { useCart } from '../context/CartContext';

const formatPrice = (n) =>
  n != null && !Number.isNaN(n) ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';

const isDarkHex = (hex) => {
  if (!hex || !/^#([0-9a-fA-F]{3}){1,2}$/.test(hex)) return false;
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};

const REVIEWS_PLACEHOLDER = [
  { id: 1, user: 'Aditi S.', rating: 5, title: 'Perfect product', text: 'Exactly as described. Great quality.', timeAgo: '2 weeks ago' },
  { id: 2, user: 'Neha V.', rating: 4, title: 'Very good', text: 'Happy with the purchase. Would recommend.', timeAgo: '1 month ago' },
  { id: 3, user: 'Simran K.', rating: 5, title: 'Love it', text: 'My go-to. Looks beautiful and lasts long.', timeAgo: '3 months ago' },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');
  const [openSection, setOpenSection] = useState('desc');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0.5, y: 0.5 });
  const [pauseAutoSwipe, setPauseAutoSwipe] = useState(false);
  const [zoomEnabled, setZoomEnabled] = useState(false);

  const pageRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid product.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getStorefrontProductById(id)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.product) {
          setProduct(res.product);
          setActiveImg(0);
          setSelectedVariantIndex(0);
        } else {
          setError('Product not found.');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load product.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  // Scroll to top when entering the page (e.g. after redirect)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.from('.product-animate', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, [product]);

  // Enable hover zoom only on non-touch / larger viewports.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    const apply = () => {
      const enabled = media.matches;
      setZoomEnabled(enabled);
      if (!enabled) {
        setShowZoomModal(false);
        setPauseAutoSwipe(false);
      }
    };
    apply();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
    media.addListener(apply);
    return () => media.removeListener(apply);
  }, []);

  // Auto-swipe images every 4 seconds; pause while user is hovering the image
  useEffect(() => {
    const list = product?.images;
    if (!list || list.length <= 1 || pauseAutoSwipe) return;
    const t = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % list.length);
    }, 4000);
    return () => clearInterval(t);
  }, [product, pauseAutoSwipe]);

  const checkDelivery = () => {
    if (!pincode) return;
    if (pincode.startsWith('452')) {
      setDeliveryMsg('✅ Indore Express: Delivered Today by 8 PM!');
    } else {
      setDeliveryMsg('🚚 Standard Delivery: 3-5 Business Days');
    }
  };

  // Amazon-style hover zoom: show zoomed portion in a modal; pause auto-swipe while hovering
  const handleImageMouseEnter = () => {
    if (!zoomEnabled) return;
    setShowZoomModal(true);
    setPauseAutoSwipe(true);
  };
  const handleImageMouseLeave = () => {
    if (!zoomEnabled) return;
    setShowZoomModal(false);
    setPauseAutoSwipe(false);
  };
  const handleImageMouseMove = (e) => {
    if (!zoomEnabled) return;
    const el = imageContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setZoomPosition({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    });
  };

  const handleAddToCart = () => {
    if (!product || isAddingToCart) return;
    setIsAddingToCart(true);

    const hasVariants = product.hasVariants && product.variants?.length > 0;
    const variant = hasVariants ? product.variants[selectedVariantIndex] : null;

    const effectivePrice = variant
      ? (variant.salePrice != null ? variant.salePrice : variant.price)
      : (product.salePrice != null ? product.salePrice : product.price);

    const variantLabel = variant
      ? (variant.attributes?.shadeName || variant.attributes?.sizeLabel || `Variant ${selectedVariantIndex + 1}`)
      : null;

    const images = product.images || [];
    const coverIndex = Math.min(Math.max(0, product.coverImageIndex ?? 0), (images.length || 1) - 1);
    const imageUrl = (variant?.images?.length ? variant.images[0] : null) || images[activeImg] || images[coverIndex] || images[0];

    addToCart({
      id: product._id,
      name: product.name,
      image: imageUrl,
      price: effectivePrice,
      quantity,
      ...(variantLabel && { selectedShade: { name: variantLabel } }),
    });

    setTimeout(() => setIsAddingToCart(false), 400);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pb-20 flex flex-col items-center justify-center min-h-[60vh]" style={{ paddingTop: 'var(--navbar-height, 200px)' }}>
          <Loader2 className="animate-spin text-[#985991]" size={48} />
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pb-20 flex flex-col items-center justify-center min-h-[60vh]" style={{ paddingTop: 'var(--navbar-height, 200px)' }}>
          <AlertCircle className="text-amber-500" size={48} />
          <p className="mt-4 text-gray-700 font-medium">{error || 'Product not found.'}</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-4 px-5 py-2.5 bg-[#985991] text-white rounded-xl text-sm font-medium hover:bg-[#7A4774]"
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const hasVariants = product.hasVariants && product.variants?.length > 0;
  const variant = hasVariants ? product.variants[selectedVariantIndex] : null;
  const effectivePrice = variant
    ? (variant.salePrice != null ? variant.salePrice : variant.price)
    : (product.salePrice != null ? product.salePrice : product.price);
  const originalPrice = variant ? variant.price : product.price;
  const displayPrice = effectivePrice ?? originalPrice;
  const hasDiscount = originalPrice > 0 && displayPrice < originalPrice;
  const discountPercent = hasDiscount && originalPrice
    ? Math.round((1 - displayPrice / originalPrice) * 100)
    : 0;

  const images = product.images && product.images.length ? product.images : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'];
  const stock = variant != null ? (variant.stock ?? 0) : (product.stock ?? 0);
  const rating = product.rating ?? 4.5;
  const reviewCount = product.reviewCount ?? 0;

  const accordionSections = [
    { id: 'desc', title: 'Description', content: product.description || product.shortDescription || 'No description available.' },
    { id: 'ingredients', title: 'Ingredients', content: product.meta?.ingredients || 'Ingredients not specified.' },
    { id: 'use', title: 'How to Use', content: product.meta?.howToUse || 'Usage instructions not specified.' },
  ];

  return (
    <div ref={pageRef} className="bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pb-10" style={{ paddingTop: 'var(--navbar-height, 200px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image gallery – thumbnails on left, fixed-size main image with prev/next (higher z so zoom preview stays on top) */}
          <div className="product-animate flex flex-col lg:flex-row gap-3 relative z-20">
            {/* Thumbnails: horizontal row on mobile (below main), vertical column on desktop (left of main) */}
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] py-1 order-2 lg:order-1 flex-shrink-0 lg:flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImg === idx ? 'border-[#985991] ring-2 ring-[#985991]/30' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image (fixed size) + prev/next + hover zoom */}
            <div className="relative flex-1 min-w-0 order-1 lg:order-2">
              <div
                ref={imageContainerRef}
                className="relative w-full h-[380px] sm:h-[420px] lg:h-[520px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 group cursor-crosshair"
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                onMouseMove={handleImageMouseMove}
              >
                <img
                  ref={imageRef}
                  src={images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover pointer-events-none"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-[#985991] text-white px-3 py-1 text-xs font-bold rounded-full z-10">
                    {discountPercent}% OFF
                  </div>
                )}
                {/* Hover zoom lens (follows cursor – visible at all sizes when zoom is active) */}
                {zoomEnabled && showZoomModal && (
                  <div
                    className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-[#985991] shadow-xl bg-white/30 pointer-events-none z-20 block"
                    style={{
                      left: `${zoomPosition.x * 100}%`,
                      top: `${zoomPosition.y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                {/* Prev / Next buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveImg((prev) => (prev - 1 + images.length) % images.length);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#985991] transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveImg((prev) => (prev + 1) % images.length);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#985991] transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>
              {/* Zoom preview box – shows exact area under cursor; high z-index so it stays on top of product info */}
              {zoomEnabled && showZoomModal && (
                <div
                  className="absolute z-[100] rounded-2xl border-2 border-gray-200 shadow-2xl bg-white shrink-0
                    w-[220px] h-[260px] sm:w-[260px] sm:h-[300px] md:w-[280px] md:h-[340px] lg:w-[320px] lg:h-[380px]
                    left-0 lg:left-full top-full mt-2 lg:top-0 lg:mt-0 lg:ml-3 overflow-hidden rounded-2xl"
                  style={{ maxHeight: 'min(380px, 80vh)', minWidth: '220px', minHeight: '260px' }}
                >
                  <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[14px] bg-white">
                    <img
                      src={images[activeImg]}
                      alt="Zoom preview"
                      className="absolute block select-none pointer-events-none"
                      style={{
                        width: '250%',
                        height: '250%',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        objectFit: 'cover',
                        left: `${50 - zoomPosition.x * 250}%`,
                        top: `${50 - zoomPosition.y * 250}%`,
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product info */}
          <div className="product-animate">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 uppercase tracking-wide">
              <button type="button" onClick={() => navigate('/')} className="hover:text-[#985991]">Home</button>
              <span>/</span>
              <button type="button" onClick={() => navigate('/shop')} className="hover:text-[#985991]">Shop</button>
              {product.category && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{product.category.name}</span>
                </>
              )}
            </div>

            <p className="text-[#985991] font-bold text-sm tracking-[0.2em] mb-2 uppercase">
              {product.brand || 'Lumora'}
            </p>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-gray-600 text-sm mb-4">{product.shortDescription}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              {reviewCount > 0 && (
                <span className="text-sm text-gray-500">{reviewCount} Review{reviewCount !== 1 ? 's' : ''}</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <span className="text-3xl font-medium text-gray-900">{formatPrice(displayPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold rounded">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            {stock <= 0 && (
              <p className="text-red-600 text-sm font-medium mb-4">Out of stock</p>
            )}

            {/* Variant selector (shades or sizes) */}
            {hasVariants && (
              <div className="mb-8">
                <span className="text-sm font-medium text-gray-900 mb-3 block">
                  {product.productType === 'makeup' ? 'Select Shade' : 'Select Option'}:{' '}
                  <span className="text-[#985991]">
                    {variant?.attributes?.shadeName || variant?.attributes?.sizeLabel || `Variant ${selectedVariantIndex + 1}`}
                  </span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, idx) => {
                    const label = v.attributes?.shadeName || v.attributes?.sizeLabel || `Option ${idx + 1}`;
                    const shadeCode = v.attributes?.shadeCode;
                    const isSelected = selectedVariantIndex === idx;
                    const useLightText = shadeCode && isDarkHex(shadeCode);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 ${isSelected ? 'border-[#985991] ring-2 ring-[#985991]/30' : 'border-gray-200 hover:border-gray-300'
                          } ${v.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''} ${!shadeCode ? 'bg-white text-gray-700' : ''}`}
                        disabled={v.stock <= 0}
                        title={v.stock <= 0 ? 'Out of stock' : label}
                        style={shadeCode ? { backgroundColor: shadeCode, borderColor: isSelected ? '#985991' : shadeCode, color: useLightText ? '#fff' : '#1f2937' } : {}}
                      >
                        {shadeCode && <span className="w-5 h-5 rounded-full border border-white/50 shrink-0" style={{ backgroundColor: shadeCode }} aria-hidden />}
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
                  className="p-3 hover:bg-gray-50"
                  disabled={quantity >= (stock || 0)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0 || isAddingToCart}
                className="flex-1 bg-[#985991] text-white font-medium rounded-lg hover:bg-[#7A4774] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-rose-100 py-3"
              >
                {isAddingToCart ? 'Adding...' : `Add to Cart – ${formatPrice(Number(displayPrice) * quantity)}`}
              </button>
              <button type="button" className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl mb-8 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={18} className="text-[#985991]" />
                <span className="text-sm font-semibold text-gray-900">Check Delivery</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#985991]"
                  maxLength={6}
                />
                <button type="button" onClick={checkDelivery} className="text-xs font-bold text-[#985991] uppercase hover:underline">
                  Check
                </button>
              </div>
              {deliveryMsg && (
                <p className={`text-xs mt-2 font-medium ${deliveryMsg.includes('Indore') ? 'text-green-600' : 'text-gray-600'}`}>
                  {deliveryMsg}
                </p>
              )}
            </div>

            <div className="mb-8 bg-[#FFF7FB] border border-pink-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <ShieldCheck size={16} className="text-[#985991]" />
                Available Offers
              </div>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>• Get extra 10% off on prepaid orders above ₹1499</li>
                <li>• Bank offer: 5% cashback with HDFC credit cards</li>
                <li>• Free delivery on orders above ₹499</li>
              </ul>
            </div>

            <div className="border-t border-gray-200">
              {accordionSections.map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === section.id ? '' : section.id)}
                    className="w-full py-4 flex items-center justify-between text-left hover:text-[#985991] transition-colors"
                  >
                    <span className="font-serif font-medium text-gray-900">{section.title}</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openSection === section.id ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16 space-y-16">
          <div className="product-animate border-t border-gray-100 pt-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl text-gray-900">Customer Reviews</h2>
                <p className="text-sm text-gray-500">What beauty lovers are saying</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} stroke="currentColor" />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{rating}</span>
                </div>
                {reviewCount > 0 && <span className="text-xs text-gray-500">{reviewCount}+ verified reviews</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS_PLACEHOLDER.map((review) => (
                <article key={review.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{review.title}</h3>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">{review.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">by {review.user}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{review.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="product-animate">
            <RelatedProducts currentCategory={product.category?.name || 'Shop'} categoryId={product.category?._id} />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
