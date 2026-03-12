import { useState, useEffect } from 'react';
import { getCategoriesTree, getStorefrontBrands } from '../services/productService';

/**
 * Fetches categories tree and brands for dynamic nav.
 * Returns { categories, brands, loading } - categories/brands are empty arrays until loaded.
 */
export function useNavData() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getCategoriesTree(), getStorefrontBrands()])
      .then(([catRes, brandRes]) => {
        if (cancelled) return;
        if (catRes?.success && Array.isArray(catRes.categories)) {
          setCategories(catRes.categories);
        }
        if (brandRes?.success && Array.isArray(brandRes.brands)) {
          setBrands(brandRes.brands);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
          setBrands([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { categories, brands, loading };
}
