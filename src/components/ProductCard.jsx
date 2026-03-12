import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({
  id,
  name,
  subtitle,
  price,
  image,
  badge,
  rating = 4.6,
  reviews = 128,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleCardClick = () => {
    if (!id) return;
    navigate(`/product-details/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    const numericPrice = Number(String(price).replace(/[^\d.]/g, '')) || 0;

    addToCart({
      id,
      name,
      image,
      price: numericPrice,
      quantity: 1,
    });

    // Lightweight debounce to avoid accidental double‑clicks
    setTimeout(() => setIsAdding(false), 400);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-2xl p-4 border border-pink-100/60 hover:border-[#985991]/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
    >
      {badge && (
        <div className="absolute z-10 top-4 left-4">
          <span className="bg-[#985991] text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-[4/5] flex items-center justify-center mb-4 relative bg-gray-50 rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Wishlist button on image */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
        >
          <Heart
            size={18}
            className={wishlisted ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}
          />
        </button>
      </div>

      <h3 className="font-serif text-base md:text-lg text-gray-900 leading-tight line-clamp-2">
        {name}
      </h3>

      {subtitle && (
        <p className="text-xs text-gray-500 mt-1 mb-1.5 line-clamp-2">
          {subtitle}
        </p>
      )}

      {/* Rating row */}
      <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>
        <span>({reviews}+)</span>
      </div>

      <p className="text-[#985991] font-bold mb-4">{price}</p>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex-1 bg-[#2D2D2D] text-white py-2.5 rounded-full text-sm font-medium shadow-md transition-colors ${isAdding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#985991]'}`}
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductCard;