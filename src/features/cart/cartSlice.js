import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../auth/authSlice';
import { calculateCartPricing } from '../../utils/cartUtils';

const CART_STORAGE_KEY = 'cart';

const getStoredCartState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      isCartOpen: false,
      cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
    };
  } catch {
    return null;
  }
};

const persistCartState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        cartItems: state.cartItems,
      })
    );
  } catch {
    // Ignore localStorage write failures (private mode / quota).
  }
};

const storedState = getStoredCartState();
const initialPricing = calculateCartPricing({
  cartItems: storedState?.cartItems ?? [],
  discount: 0,
});
const initialState = {
  isCartOpen: storedState?.isCartOpen ?? false,
  cartItems: storedState?.cartItems ?? [],
  discountPrice: 0,
  shippingPrice: initialPricing.shippingPrice,
  totalPrice: initialPricing.totalPrice,
};

const matchesCartItem = (cartItem, id, shadeName) =>
  cartItem.id === id && (shadeName ? cartItem.selectedShade?.name === shadeName : true);

const recomputeCartPricing = (state) => {
  const pricing = calculateCartPricing({
    cartItems: state.cartItems,
    discount: state.discountPrice,
  });
  state.shippingPrice = pricing.shippingPrice;
  state.totalPrice = pricing.totalPrice;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const shadeName = item.selectedShade?.name;
      const existing = state.cartItems.find((cartItem) =>
        matchesCartItem(cartItem, item.id, shadeName)
      );

      state.isCartOpen = true;

      if (existing) {
        existing.quantity += item.quantity || 1;
        recomputeCartPricing(state);
        persistCartState(state);
        return;
      }

      state.cartItems.push({
        ...item,
        quantity: item.quantity || 1,
      });
      recomputeCartPricing(state);
      persistCartState(state);
    },
    removeFromCart: (state, action) => {
      const { id, shadeName } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== id || (shadeName && item.selectedShade?.name !== shadeName)
      );
      recomputeCartPricing(state);
      persistCartState(state);
    },
    updateQuantity: (state, action) => {
      const { id, shadeName, quantity } = action.payload;
      state.cartItems = state.cartItems
        .map((item) => {
          if (matchesCartItem(item, id, shadeName)) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      recomputeCartPricing(state);
      persistCartState(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.isCartOpen = false;
      recomputeCartPricing(state);
      persistCartState(state);
    },
    replaceCartItems: (state, action) => {
      state.cartItems = Array.isArray(action.payload) ? action.payload : [];
      recomputeCartPricing(state);
      persistCartState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.cartItems = [];
      state.isCartOpen = false;
      recomputeCartPricing(state);
      persistCartState(state);
    });
  },
});

export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartOpen = (state) => state.cart.isCartOpen;
export const selectCartTotal = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);
export const selectCartShippingPrice = (state) => state.cart.shippingPrice || 0;
export const selectCartGrandTotal = (state) => state.cart.totalPrice || 0;

export const {
  openCart,
  closeCart,
  setCartOpen,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  replaceCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
