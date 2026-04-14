import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { Star, Zap, Clock, ArrowRight } from 'lucide-react';
import { addToCart } from '../features/cart/cartSlice';
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from '../features/products/productsSlice';

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const getProductBadge = (product) => {
  if ((product.stock || 0) > 0 && product.stock < 10) return 'SELLING FAST';
  if (product.isFeatured) return 'BEST SELLER';
  if (product.discount > 0) return `${product.discount}% OFF`;
  return '';
};

const mapProductToCard = (product) => {
  const effectivePrice = product.salePrice != null ? product.salePrice : product.price;
  return {
    id: product._id,
    name: product.name || 'Untitled Product',
    subtitle: product.shortDescription || '',
    price: formatPrice(effectivePrice),
    image: product.images?.[0] || product.coverImage || '',
    badge: getProductBadge(product),
    rating: product.averageRating ?? product.rating ?? 0,
    reviews: product.numOfReviews ?? product.reviewCount ?? 0,
  };
};

const ProductSkeleton = () => (
  <div className="rounded-2xl border border-pink-100/60 bg-white p-4 animate-pulse">
    <div className="aspect-[4/5] rounded-2xl bg-gray-100 mb-4" />
    <div className="h-5 bg-gray-100 rounded mb-2" />
    <div className="h-4 w-3/4 bg-gray-100 rounded mb-3" />
    <div className="h-4 w-1/2 bg-gray-100 rounded mb-4" />
    <div className="h-10 rounded-full bg-gray-100" />
  </div>
);

const ProductGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Best Sellers');
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const isError = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const tabs = [
    { id: 'Best Sellers', icon: <Star size={16} /> },
    { id: 'New Arrivals', icon: <Zap size={16} /> },
    { id: 'On Sale', icon: <Clock size={16} /> },
  ];

  const productsByTab = useMemo(() => {
    const topProducts = products.slice(0, 12);
    const bestSellers = topProducts.slice(0, 4);
    const newArrivals = topProducts.slice(4, 8);
    const onSale = topProducts.slice(8, 12);

    return {
      'Best Sellers': bestSellers.length ? bestSellers : topProducts.slice(0, 4),
      'New Arrivals': newArrivals.length ? newArrivals : topProducts.slice(0, 4),
      'On Sale': onSale.length ? onSale : topProducts.slice(0, 4),
    };
  }, [products]);

  const activeProducts = productsByTab[activeTab] || [];

  const handleAddToBag = (product) => {
    if (!product?._id) return;
    const price = Number(product.salePrice ?? product.price ?? 0);
    dispatch(
      addToCart({
        id: product._id,
        name: product.name || '',
        image: product.images?.[0] || product.coverImage || '',
        price,
        quantity: 1,
      })
    );
  };

  // Navigate to shop with the active filter
  const handleViewAll = () => {
    navigate('/shop', { state: { filter: activeTab } });
  };

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">

        {/* --- PROFESSIONAL HEADER WITH TABS --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif text-gray-900 mb-2">
              Shop Our <span className="text-[#985991] italic">Heroes</span>
            </h2>
            <p className="text-gray-500 text-sm tracking-wide">
              Curated collections just for you.
            </p>
          </div>

          {/* Animated Tabs */}
          <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-100 self-start md:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-[#985991] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.id}</span>
                <span className="md:hidden">{tab.id.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div key={activeTab} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fadeIn">
          {isLoading &&
            [...Array(4)].map((_, index) => <ProductSkeleton key={`product-skeleton-${index}`} />)}

          {!isLoading &&
            !isError &&
            activeProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToBag={handleAddToBag}
                {...mapProductToCard(product)}
              />
            ))}
        </div>

        {!isLoading && isError && (
          <div className="text-center text-sm text-red-500">Unable to load products right now.</div>
        )}

        {!isLoading && !isError && activeProducts.length === 0 && (
          <div className="text-center text-sm text-gray-500">No featured products available yet.</div>
        )}

        {/* --- CENTERED VIEW ALL BUTTON --- */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleViewAll}
            className="group relative px-8 py-3 bg-white text-gray-900 font-semibold rounded-full border border-gray-200 shadow-sm hover:border-[#985991] hover:text-[#985991] transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">View All {activeTab}</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />

            {/* Hover Fill Effect */}
            <div className="absolute inset-0 bg-pink-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 -z-0"></div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ProductGrid;