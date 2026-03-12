import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Star, 
  ShoppingCart, 
  Clock,
  AlertCircle 
} from 'lucide-react';

const Wishlist = () => {
  // Mock Wishlist Data
  const [wishlistItems, setWishlistItems] = useState([
    { 
      id: 1, 
      name: "Radiance Vitamin C Serum", 
      price: "₹1,299", 
      originalPrice: "₹1,599", 
      rating: 4.8, 
      reviews: 120, 
      stock: "In Stock", 
      img: "https://hyue.in/cdn/shop/files/cherri-licious_1.png?v=1756186883&width=750" 
    },
    { 
      id: 2, 
      name: "Velvet Matte Lipstick - Ruby", 
      price: "₹799", 
      originalPrice: "₹999", 
      rating: 4.5, 
      reviews: 85, 
      stock: "Low Stock", 
      img: "https://herbalplanet.in/wp-content/uploads/2025/12/VitaminC10_1200-1-min.avif" 
    },
    { 
      id: 3, 
      name: "Hydra-Gel Moisturizer", 
      price: "₹899", 
      originalPrice: "", 
      rating: 4.9, 
      reviews: 210, 
      stock: "Out of Stock", 
      img: "https://vivecosmetic.com/wp-content/uploads/2024/05/Cosmetic-Manufacturers-In-Shillong.jpg" 
    },
    { 
      id: 4, 
      name: "Gold Infused Eye Mask", 
      price: "₹1,450", 
      originalPrice: "₹1,800", 
      rating: 4.7, 
      reviews: 45, 
      stock: "In Stock", 
      img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQsRLYVo8RxFhVgDPaNfrmnLaCxz3OlWm82NcKHkh9aHe7OsPhyaBHkzGUP2uw5kH0lo9SOh-lsNaJooIHpJFKIIBHoSFOCPHzvxU09tU9ZjJXpi7vVd7kg" 
    },
  ]);

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             My Wishlist <span className="text-gray-400 text-lg font-normal">({wishlistItems.length})</span>
           </h2>
           <p className="text-gray-500 text-sm">Save your favorites now, bag them later!</p>
        </div>
        
        {wishlistItems.length > 0 && (
          <button 
            onClick={() => setWishlistItems([])}
            className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Clear All Items
          </button>
        )}
      </div>

      {/* --- WISHLIST GRID --- */}
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
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
                  {item.stock === 'Out of Stock' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                       <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-800">Out of Stock</span>
                    </div>
                  )}
               </div>

               {/* Details Section */}
               <div className="p-5 flex-1 flex flex-col">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                     <Star size={12} fill="currentColor" />
                     <span className="text-xs font-bold text-gray-700">{item.rating}</span>
                     <span className="text-xs text-gray-400">({item.reviews})</span>
                  </div>

                  {/* Name & Price */}
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-[#985991] transition-colors">
                     {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                     <span className="font-bold text-gray-900">{item.price}</span>
                     {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                     )}
                  </div>

                  {/* Actions (Footer) */}
                  <div className="mt-auto">
                     {item.stock === 'Out of Stock' ? (
                        <button disabled className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2">
                           <AlertCircle size={16} /> Notify Me
                        </button>
                     ) : (
                        <button className="w-full py-2.5 bg-[#985991] text-white rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-md shadow-purple-100 transition-transform active:scale-95 flex items-center justify-center gap-2">
                           <ShoppingBag size={16} /> Move to Bag
                        </button>
                     )}
                     
                     {item.stock === 'Low Stock' && (
                        <p className="text-[10px] text-red-500 font-medium text-center mt-2 flex items-center justify-center gap-1">
                           <Clock size={10} /> Hurry! Only a few left
                        </p>
                     )}
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
           <button className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-black transition-colors flex items-center gap-2">
              <ShoppingCart size={16} /> Start Shopping
           </button>
        </div>
      )}

    </div>
  );
};

export default Wishlist;