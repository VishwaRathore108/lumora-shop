import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/apiClient';

const AdminWishlistInsights = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/admin/wishlist-insights');
        setProducts(Array.isArray(response.data?.products) ? response.data.products : []);
      } catch (err) {
        console.error('Failed to fetch wishlist insights:', err);
        setError('Unable to load wishlist insights.');
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Top Wishlisted Products</h3>
          <p className="text-sm text-gray-500">Most saved products by users.</p>
        </div>
        <Heart size={18} className="text-[#985991]" />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading insights...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : !products.length ? (
        <p className="text-sm text-gray-500">No wishlist data available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 pr-3">Product</th>
                <th className="py-3 pr-3">Name</th>
                <th className="py-3 pr-3">Price</th>
                <th className="py-3 text-right">Times Wishlisted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="py-3 pr-3">
                    <img
                      src={product.image || 'https://placehold.co/64x64?text=No+Image'}
                      alt={product.name}
                      className="w-11 h-11 rounded-lg object-cover border border-gray-100"
                    />
                  </td>
                  <td className="py-3 pr-3 font-medium text-gray-800">{product.name}</td>
                  <td className="py-3 pr-3 text-gray-700">Rs {Number(product.price || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#985991]/10 text-[#985991]">
                      {product.timesWishlisted}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminWishlistInsights;
