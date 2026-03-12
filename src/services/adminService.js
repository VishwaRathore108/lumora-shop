import api from './apiClient';

export async function getCustomers() {
  const res = await api.get('/admin/customers');
  return res.data;
}

/**
 * POST /api/admin/customers - create customer. Body: { mobile, name? }.
 */
export async function createCustomer(payload) {
  const res = await api.post('/admin/customers', payload);
  return res.data;
}

/**
 * GET /api/admin/team - list admin & driver users.
 */
export async function getTeam() {
  const res = await api.get('/admin/team');
  return res.data;
}

/**
 * GET /api/admin/users/:id - get any user's full profile.
 */
export async function getUserProfile(userId) {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
}

/**
 * POST /api/admin/team - create admin/driver. Body: { mobile, name?, role: 'admin'|'driver' }.
 */
export async function createTeamMember(payload) {
  const res = await api.post('/admin/team', payload);
  return res.data;
}

/**
 * PATCH /api/admin/users/:id - update user e.g. isActive. Body: { isActive: boolean }.
 */
export async function updateUserStatus(userId, payload) {
  const res = await api.patch(`/admin/users/${userId}`, payload);
  return res.data;
}

// ——— Categories ———

/** GET /api/admin/categories/summary */
export async function getCategoriesSummary() {
  const res = await api.get('/admin/categories/summary');
  return res.data;
}

/** GET /api/admin/categories/tree */
export async function getCategoriesTree() {
  const res = await api.get('/admin/categories/tree');
  return res.data;
}

/** POST /api/admin/categories - body: { name, description?, image?, parentId?, isActive?, order? } */
export async function createCategory(payload) {
  const res = await api.post('/admin/categories', payload);
  return res.data;
}

/** PATCH /api/admin/categories/:id - body: { name?, description?, image?, isActive?, order? } */
export async function updateCategory(categoryId, payload) {
  const res = await api.patch(`/admin/categories/${categoryId}`, payload);
  return res.data;
}

/** DELETE /api/admin/categories/:id */
export async function deleteCategory(categoryId) {
  const res = await api.delete(`/admin/categories/${categoryId}`);
  return res.data;
}

/** PATCH /api/admin/categories/:id/toggle - toggles isActive */
export async function toggleCategoryStatus(categoryId) {
  const res = await api.patch(`/admin/categories/${categoryId}/toggle`);
  return res.data;
}

// ——— Products (admin) ———

/** GET /api/admin/products - list with filters & pagination. Query: page, limit, search, categoryId, subcategoryId, brand, status, inStock, hasDiscount, isFeatured, sort */
export async function getProducts(params = {}) {
  const res = await api.get('/admin/products', { params });
  return res.data;
}

/** GET /api/admin/products/:id */
export async function getProductById(id) {
  const res = await api.get(`/admin/products/${id}`);
  return res.data;
}

/** POST /api/admin/products */
export async function createProduct(payload) {
  const res = await api.post('/admin/products', payload);
  return res.data;
}

/** PATCH /api/admin/products/:id */
export async function updateProduct(id, payload) {
  const res = await api.patch(`/admin/products/${id}`, payload);
  return res.data;
}

/** DELETE /api/admin/products/:id */
export async function deleteProduct(id) {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
}

/** PATCH /api/admin/products/:id/stock - body: { stock: number } */
export async function updateProductStock(id, stock) {
  const res = await api.patch(`/admin/products/${id}/stock`, { stock });
  return res.data;
}

/** PATCH /api/admin/products/:id/discount - body: discount, discountType?, salePrice?, etc. */
export async function updateProductDiscount(id, payload) {
  const res = await api.patch(`/admin/products/${id}/discount`, payload);
  return res.data;
}
