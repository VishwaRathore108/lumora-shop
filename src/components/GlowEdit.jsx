import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getStorefrontProducts } from '../services/productService';

const BRAND_COLOR = '#985991';

const GlowEdit = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGlowEditProducts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getStorefrontProducts({
          page: 1,
          limit: 5,
          featured: true,
          inStock: true,
          sort: 'discount',
        });

        if (!isMounted) return;

        const apiProducts = Array.isArray(data?.products) ? data.products : [];

        const mapped = apiProducts.map((p) => {
          const images = Array.isArray(p.images) ? p.images : [];
          const image = p.coverImage || images[0] || '';
          const effectivePrice = p.salePrice != null ? p.salePrice : p.price;
          const priceLabel =
            effectivePrice != null
              ? `₹${Number(effectivePrice).toLocaleString('en-IN')}`
              : '₹0';

          let badge = '';
          if (p.discount && p.discount > 0) {
            badge = `${p.discount}% OFF`;
          } else if (p.isFeatured) {
            badge = 'Glow Pick';
          } else if (p.meta?.tags?.length) {
            badge = p.meta.tags[0];
          }

          return {
            id: p._id,
            name: p.name,
            subtitle: p.shortDescription || p.brand || '',
            price: priceLabel,
            image,
            badge,
            rating: p.rating ?? 4.6,
            reviews: p.reviewCount ?? 128,
          };
        });

        setProducts(mapped);
      } catch (err) {
        if (!isMounted) return;
        console.error('GlowEdit products fetch error:', err);
        setError('Unable to load glow edit products right now.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGlowEditProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasProducts = products.length > 0;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
              The <span className="text-[#985991]">Glow</span> Edit
            </h2>
            <p className="text-gray-500 mt-2 text-sm tracking-wide">
              Handpicked essentials live from your store catalogue.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="hidden md:flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-[#985991] hover:text-[#985991] transition-all group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white rounded-2xl p-4 border border-pink-50"
              >
                <div className="aspect-[4/5] rounded-2xl bg-gray-100 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-100 rounded-full w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && hasProducts && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {!loading && !error && !hasProducts && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            No glow edit products are active yet. Mark a few products as featured and active in your
            admin to showcase them here.
          </div>
        )}

        <div className="mt-8 flex justify-center md:hidden">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-sm font-bold text-[#985991] uppercase tracking-wider"
          >
            View All Collection
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GlowEdit;