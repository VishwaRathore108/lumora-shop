import React, { useMemo, useState } from 'react';
import { Check, Heart, Minus, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUser } from '../features/auth/authSlice';
import { selectWishlistProductIds, toggleWishlist } from '../features/wishlist/wishlistSlice';

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
  const dispatch = useDispatch();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const wishlistProductIds = useSelector(selectWishlistProductIds);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const isWishlisted = wishlistProductIds.includes(String(id));
  const cartItem = useMemo(
    () => cartItems.find((item) => item.id === id && !item.selectedShade?.name),
    [cartItems, id]
  );
  const quantityInCart = cartItem?.quantity || 0;

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

  const handleDecreaseQuantity = (e) => {
    e.stopPropagation();
    if (!cartItem) return;
    const nextQty = (cartItem.quantity || 1) - 1;
    if (nextQty <= 0) {
      removeFromCart(cartItem.id);
      return;
    }
    updateQuantity(cartItem.id, undefined, nextQty);
  };

  const handleIncreaseQuantity = (e) => {
    e.stopPropagation();
    if (!cartItem) {
      handleAddToCart(e);
      return;
    }
    updateQuantity(cartItem.id, undefined, (cartItem.quantity || 0) + 1);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!token || !user) {
      navigate('/login');
      return;
    }
    const productId = String(id);
    if (!/^[a-fA-F0-9]{24}$/.test(productId)) return;
    dispatch(toggleWishlist({ productId }));
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-2xl p-3 sm:p-4 border border-pink-100/60 hover:border-[#985991]/50 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
    >
      {badge && (
        <div className="absolute z-10 top-4 left-4">
          <span className="bg-[#985991] text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-[4/5] flex items-center justify-center mb-3 sm:mb-4 relative bg-gray-50 rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Wishlist button on image */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
        >
          <Heart
            size={18}
            className={isWishlisted ? 'text-[#985991] fill-[#985991]' : 'text-gray-400'}
          />
        </button>
      </div>

      <h3 className="font-serif text-sm sm:text-base md:text-lg text-gray-900 leading-tight line-clamp-2">
        {name}
      </h3>

      {subtitle && (
        <p className="text-xs text-gray-500 mt-1 mb-1.5 line-clamp-2">
          {subtitle}
        </p>
      )}

      {/* Rating row */}
      <div className="flex items-center gap-1 mb-2 text-[11px] sm:text-xs text-gray-500">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>
        <span>({reviews}+)</span>
      </div>

      <p className="text-[#985991] font-bold mb-3 sm:mb-4 text-sm sm:text-base">{price}</p>

      <div className="flex items-center space-x-2">
        {quantityInCart > 0 ? (
          <div className="flex-1 flex items-center justify-between bg-[#985991] text-white py-1.5 px-2 rounded-full text-xs sm:text-sm font-medium shadow-md">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <div className="flex items-center gap-2">
              <Check size={14} />
              <span>Added ({quantityInCart})</span>
            </div>
            <button
              type="button"
              onClick={handleIncreaseQuantity}
              className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 bg-[#2D2D2D] text-white py-2 rounded-full text-xs sm:text-sm font-medium shadow-md transition-colors ${isAdding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#985991]'}`}
          >
            {isAdding ? 'Adding...' : 'Add to Bag'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;