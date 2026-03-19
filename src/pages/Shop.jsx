import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import { getStorefrontProducts, getStorefrontFilterOptions } from '../services/productService';
import { SKINCARE_BRANDS, HAIRCARE_BRANDS } from '../data/brands';

const formatPrice = (n) =>
  n != null && !Number.isNaN(n) ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const filter = searchParams.get('filter') || '';
  const brandParam = searchParams.get('brand') || searchParams.get('brands') || '';
  const productTypeParam = searchParams.get('productType') || searchParams.get('productTypes') || '';
  const variantParam = searchParams.get('variant') || searchParams.get('variants') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';
  const searchFromState = location.state?.searchQuery || '';
  const searchFromUrl = searchParams.get('search') || searchParams.get('q') || '';

  // Stable array refs so useCallback/useEffect don't re-run every render
  const brands = useMemo(
    () => (brandParam ? brandParam.split(',').map((b) => b.trim()).filter(Boolean) : []),
    [brandParam]
  );
  const productTypes = useMemo(
    () => (productTypeParam ? productTypeParam.split(',').map((t) => t.trim()).filter(Boolean) : []),
    [productTypeParam]
  );
  const variants = useMemo(
    () => (variantParam ? variantParam.split(',').map((v) => v.trim()).filter(Boolean) : []),
    [variantParam]
  );

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, totalPages: 0 });
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchTerm = searchFromState || searchFromUrl;
  const hasFilters = !!(category || subcategory || filter || brands.length || searchTerm || minPrice || maxPrice || productTypes.length || variants.length);

  const fetchFilterOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;
      const data = await getStorefrontFilterOptions(params);
      if (data.success) setFilterOptions(data);
      else setFilterOptions(null);
    } catch {
      setFilterOptions(null);
    } finally {
      setOptionsLoading(false);
    }
  }, [category, subcategory]);

  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      const params = { page, limit: 24 };
      if (searchTerm) params.search = params.q = searchTerm;
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;
      if (filter) params.filter = filter;
      if (brands.length) params.brands = brands.join(',');
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;
      if (productTypes.length) params.productTypes = productTypes.join(',');
      if (variants.length) params.variants = variants.join(',');
      if (sort) params.sort = sort;

      try {
        const data = await getStorefrontProducts(params);
        if (data.success) {
          setProducts(data.products || []);
          setPagination(data.pagination || { page: 1, limit: 24, total: 0, totalPages: 0 });
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [category, subcategory, filter, brands, searchTerm, minPrice, maxPrice, productTypes, variants, sort]
  );

  // Fetch products when filter params change (stable deps via useMemo above = one call per param change)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      const params = { page: 1, limit: 24 };
      if (searchTerm) params.search = params.q = searchTerm;
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;
      if (filter) params.filter = filter;
      if (brands.length) params.brands = brands.join(',');
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;
      if (productTypes.length) params.productTypes = productTypes.join(',');
      if (variants.length) params.variants = variants.join(',');
      if (sort) params.sort = sort;
      try {
        const data = await getStorefrontProducts(params);
        if (cancelled) return;
        if (data.success) {
          setProducts(data.products || []);
          setPagination(data.pagination || { page: 1, limit: 24, total: 0, totalPages: 0 });
        } else setProducts([]);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to load products.');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [category, subcategory, filter, brands, searchTerm, minPrice, maxPrice, productTypes, variants, sort]);

  // Fetch filter options when category/subcategory change
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setOptionsLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        if (subcategory) params.subcategory = subcategory;
        const data = await getStorefrontFilterOptions(params);
        if (cancelled) return;
        if (data.success) setFilterOptions(data);
        else setFilterOptions(null);
      } catch {
        if (!cancelled) setFilterOptions(null);
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [category, subcategory]);

  // Sync search from navbar state to URL so it's shareable and used in fetch
  useEffect(() => {
    if (searchFromState && !searchFromUrl) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('search', searchFromState);
        return next;
      }, { replace: true });
    }
  }, [searchFromState, searchFromUrl, setSearchParams]);

  const applyFilters = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const keys = ['category', 'subcategory', 'brands', 'minPrice', 'maxPrice', 'productTypes', 'variants'];
      keys.forEach((key) => {
        const val = updates[key];
        if (val !== undefined && val != null) {
          if (Array.isArray(val)) {
            if (val.length) next.set(key, val.join(','));
            else next.delete(key);
          } else if (val !== '') {
            next.set(key, String(val));
          } else next.delete(key);
        } else next.delete(key);
      });
      next.delete('page');
      return next;
    });
  };

  const clearFilters = () => {
    navigate('/shop', { replace: true });
  };

  const mapProductToCard = (p) => {
    const effectivePrice = p.salePrice != null ? p.salePrice : p.price;
    let badge = null;
    if (p.isFeatured) badge = 'Best Seller';
    else if (p.discount > 0) badge = `${p.discount}% Off`;
    return {
      id: p._id,
      name: p.name,
      subtitle: p.shortDescription || '',
      price: formatPrice(effectivePrice),
      image: p.coverImage || (Array.isArray(p.images) && p.images[0]) || '',
      badge,
      rating: p.rating ?? 4.5,
      reviews: p.reviewCount ?? 0,
    };
  };

  const filterLabel =
    (filter && { new: "What's New", bestsellers: 'Bestsellers', minis: 'Minis', bundles: 'Sets & Bundles', homegrown: 'Homegrown', budget: 'Budget Buys' }[filter]) ||
    '';

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen pb-12" style={{ paddingTop: 'var(--navbar-height, 200px)' }}>
        <div className="max-w-7xl mx-auto px-4">

          {/* <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-[#985991] mb-4">
              {searchTerm && `Results for "${searchTerm}"`}
              {!searchTerm && brands.length > 0 && `Brand${brands.length > 1 ? 's' : ''}: ${brands.map((b) => decodeURIComponent(b)).join(', ')}`}
              {!searchTerm && !brands.length && category && `Category: ${decodeURIComponent(category).replace(/-/g, ' ')}`}
              {!searchTerm && !brand && !category && filterLabel && filterLabel}
              {!searchTerm && !brand && !category && !filterLabel && 'Shop All Products'}
            </h1>
            <p className="text-gray-500">
              {loading ? 'Loading...' : error ? error : hasFilters ? `Found ${pagination.total} products` : 'Discover the perfect glow for your skin type.'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-[#985991] underline hover:text-gray-600"
              >
                Clear filters & show all adf
              </button>
            )}
          </div> */}

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <ShopFilters
              filterOptions={filterOptions}
              loading={optionsLoading}
              category={category}
              subcategory={subcategory}
              categoryName={filterOptions?.categories?.find((c) => c.slug === category)?.name}
              subcategoryName={filterOptions?.subcategories?.find((c) => c.slug === subcategory)?.name}
              brands={brands}
              minPrice={minPrice === '' ? undefined : parseFloat(minPrice)}
              maxPrice={maxPrice === '' ? undefined : parseFloat(maxPrice)}
              productTypes={productTypes}
              variants={variants}
              onApply={applyFilters}
              onClear={clearFilters}
              hasActiveFilters={hasFilters}
              sort={sort}
              onSortChange={(v) => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  if (v) next.set('sort', v);
                  else next.delete('sort');
                  next.delete('page');
                  return next;
                });
              }}
              totalCount={pagination.total}
            />

            <main className="flex-1 min-w-0 w-full">
              {/* Desktop toolbar: count + sort */}
              <div className="hidden lg:flex items-center justify-between gap-3 mb-4 lg:mb-6">
                <p className="text-sm text-gray-500">
                  {!loading && !error && `${pagination.total} product${pagination.total !== 1 ? 's' : ''}`}
                </p>
                <select
                  value={sort}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      if (v) next.set('sort', v);
                      else next.delete('sort');
                      next.delete('page');
                      return next;
                    });
                  }}
                  className="w-56 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#985991]"
                >
                  <option value="">Sort: Newest</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Popular</option>
                  <option value="discount">Discount</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl bg-gray-100 aspect-[4/5]" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProducts(1)}
                    className="bg-[#985991] text-white px-6 py-2 rounded-full hover:bg-[#7A4774] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} {...mapProductToCard(product)} />
                    ))}
                  </div>
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      <button
                        type="button"
                        disabled={pagination.page <= 1}
                        onClick={() => fetchProducts(pagination.page - 1)}
                        className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 text-sm font-medium text-gray-700"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-600 text-sm">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchProducts(pagination.page + 1)}
                        className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 text-sm font-medium text-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xl text-gray-500 mb-4">No products found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#985991] text-white px-6 py-2.5 rounded-full hover:bg-[#7A4774] transition-colors text-sm font-medium"
                  >
                    View All Products
                  </button>
                </div>
              )}
            </main>
          </div>

          {/* Shop by Brand – professional section */}
          <section className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="text-xl font-serif text-gray-900 mb-1">Shop by Brand</h2>
            <p className="text-sm text-gray-500 mb-8">Browse our curated skincare & haircare brands</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50/60 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-sm font-semibold text-[#985991] uppercase tracking-wider mb-4">Skincare</h3>
                <div className="flex flex-wrap gap-2">
                  {SKINCARE_BRANDS.map((b) => (
                    <Link
                      key={b.name}
                      to={`/shop?brand=${encodeURIComponent(b.name)}`}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#985991] hover:text-[#985991] transition-colors"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50/60 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-sm font-semibold text-[#985991] uppercase tracking-wider mb-4">Haircare</h3>
                <div className="flex flex-wrap gap-2">
                  {HAIRCARE_BRANDS.map((b) => (
                    <Link
                      key={b.name}
                      to={`/shop?brand=${encodeURIComponent(b.name)}`}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#985991] hover:text-[#985991] transition-colors"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
