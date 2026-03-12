import api from './apiClient';

/**
 * Storefront products list
 * GET /api/products
 * Query: page, limit, search, category (slug or id), filter (new|bestsellers|minis|bundles|homegrown|budget), brand, minPrice, maxPrice, discount, inStock, featured, sort
 */
export async function getStorefrontProducts(params = {}) {
  const res = await api.get('/products', { params });
  return res.data;
}

/**
 * Public categories tree for nav
 * GET /api/categories
 */
export async function getCategoriesTree() {
  const res = await api.get('/categories');
  return res.data;
}

/**
 * Distinct brands for nav
 * GET /api/products/brands
 */
export async function getStorefrontBrands() {
  const res = await api.get('/products/brands');
  return res.data;
}

/**
 * Storefront single product by id
 * GET /api/products/:id
 */
export async function getStorefrontProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

/**
 * Storefront single product by slug
 * GET /api/products/by-slug/:slug
 */
export async function getStorefrontProductBySlug(slug) {
  const res = await api.get(`/products/by-slug/${slug}`);
  return res.data;
}

/**
 * Storefront filter options
 * GET /api/products/filter-options
 */
export async function getStorefrontFilterOptions(params = {}) {
  const res = await api.get('/products/filter-options', { params });
  return res.data;
}

