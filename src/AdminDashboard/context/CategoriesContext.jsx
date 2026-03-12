import React, { createContext, useContext, useState } from 'react';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop';

const INITIAL_SUMMARY = {
  totalCategories: 14,
  totalProducts: 342,
  totalRevenue: 1245000,
  totalOrders: 4280,
  revenueThisMonth: 278000,
  ordersThisMonth: 762,
};

const INITIAL_CATEGORIES = [
  {
    id: '1',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Cleansers, serums, moisturizers',
    image: PLACEHOLDER_IMG,
    parentId: null,
    isActive: true,
    productCount: 120,
    revenue: 420000,
    orderCount: 1240,
    subcategories: [
      { id: '1-1', name: 'Serums', slug: 'serums', productCount: 42, revenue: 180000, orderCount: 520, isActive: true },
      { id: '1-2', name: 'Moisturizers', slug: 'moisturizers', productCount: 38, revenue: 120000, orderCount: 380, isActive: true },
      { id: '1-3', name: 'Cleansers', slug: 'cleansers', productCount: 40, revenue: 80000, orderCount: 340, isActive: true },
    ],
  },
  {
    id: '2',
    name: 'Makeup',
    slug: 'makeup',
    description: 'Lipstick, foundation, eyeshadow',
    image: PLACEHOLDER_IMG,
    parentId: null,
    isActive: true,
    productCount: 85,
    revenue: 280000,
    orderCount: 890,
    subcategories: [
      { id: '2-1', name: 'Lipstick', slug: 'lipstick', productCount: 28, revenue: 95000, orderCount: 310, isActive: true },
      { id: '2-2', name: 'Foundation', slug: 'foundation', productCount: 22, revenue: 110000, orderCount: 280, isActive: true },
      { id: '2-3', name: 'Eyeshadow', slug: 'eyeshadow', productCount: 35, revenue: 75000, orderCount: 300, isActive: true },
    ],
  },
  {
    id: '3',
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Shampoos, conditioners, treatments',
    image: PLACEHOLDER_IMG,
    parentId: null,
    isActive: true,
    productCount: 45,
    revenue: 150000,
    orderCount: 456,
    subcategories: [
      { id: '3-1', name: 'Shampoos', slug: 'shampoos', productCount: 18, revenue: 60000, orderCount: 180, isActive: true },
      { id: '3-2', name: 'Hair Oils', slug: 'hair-oils', productCount: 27, revenue: 90000, orderCount: 276, isActive: true },
    ],
  },
  {
    id: '4',
    name: 'Body Care',
    slug: 'body-care',
    description: 'Lotions, body wash',
    image: PLACEHOLDER_IMG,
    parentId: null,
    isActive: false,
    productCount: 32,
    revenue: 90000,
    orderCount: 320,
    subcategories: [],
  },
  {
    id: '5',
    name: 'Sun Protection',
    slug: 'sun-protection',
    description: 'Sunscreens, SPF',
    image: PLACEHOLDER_IMG,
    parentId: null,
    isActive: true,
    productCount: 18,
    revenue: 110000,
    orderCount: 280,
    subcategories: [],
  },
];

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  return (
    <CategoriesContext.Provider value={{ summary, setSummary, categories, setCategories, PLACEHOLDER_IMG }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
}
