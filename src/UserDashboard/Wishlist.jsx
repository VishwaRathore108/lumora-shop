import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ShoppingCart, 
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  selectWishlistItems,
  selectWishlistLoading,
  toggleWishlist,
} from '../features/wishlist/wishlistSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const wishlistItems = useSelector(selectWishlistItems);
  const loading = useSelector(selectWishlistLoading);

  const normalizedItems = useMemo(
    () =>
      wishlistItems.map((item) => ({
        id: item._id,
        name: item.name,
        price: Number(item.price || 0),
        stock: Number(item.stock || 0),
        img: item.image || item.images?.[0] || 'https://placehold.co/400x400?text=Product',
      })),
    [wishlistItems]
  );

  const removeItem = (productId) => {
    dispatch(toggleWishlist({ productId }));
  };

  const handleMoveToBag = (item) => {
    if (item.stock <= 0) return;
    addToCart({
      id: item.id,
      name: item.name,
      image: item.img,
      price: item.price,
      quantity: 1,
    });
    dispatch(toggleWishlist({ productId: item.id }));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             My Wishlist <span className="text-gray-400 text-lg font-normal">({normalizedItems.length})</span>
           </h2>
           <p className="text-gray-500 text-sm">Save your favorites now, bag them later!</p>
        </div>
        
        {loading && <p className="text-xs text-gray-500">Loading wishlist...</p>}
      </div>

      {/* --- WISHLIST GRID --- */}
      {normalizedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {normalizedItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
               
               {/* Image Section */}
               <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Remove Button (Top Right) */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Stock Badge */}
                  {item.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                       <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-800">Out of Stock</span>
                    </div>
                  )}
               </div>

               {/* Details Section */}
               <div className="p-5 flex-1 flex flex-col">
                  {/* Name & Price */}
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-[#985991] transition-colors">
                     {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                     <span className="font-bold text-gray-900">Rs {item.price.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Actions (Footer) */}
                  <div className="mt-auto space-y-2">
                     {item.stock <= 0 ? (
                        <button disabled className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2">
                           <AlertCircle size={16} /> Notify Me
                        </button>
                     ) : (
                        <button
                          onClick={() => handleMoveToBag(item)}
                          className="w-full py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-md shadow-purple-100 transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                           <ShoppingBag size={16} /> Move to Bag
                        </button>
                     )}
                     <button
                       onClick={() => removeItem(item.id)}
                       className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                     >
                       <Trash2 size={16} /> Remove
                     </button>
                  </div>
               </div>

            </div>
          ))}
        </div>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <Heart size={32} className="text-pink-400" fill="currentColor" />
           </div>
           <h3 className="text-xl font-bold text-gray-800">Your wishlist is empty</h3>
           <p className="text-gray-500 max-w-sm mt-2">
              Looks like you haven't fallen in love with any products yet. Explore our bestsellers and find your match!
           </p>
           <button
             onClick={() => navigate('/shop')}
             className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-black transition-colors flex items-center gap-2"
           >
              <ShoppingCart size={16} /> Start Shopping
           </button>
        </div>
      )}

    </div>
  );
};

export default Wishlist;