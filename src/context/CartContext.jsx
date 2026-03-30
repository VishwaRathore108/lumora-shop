import React, { createContext, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart as addToCartAction,
  closeCart as closeCartAction,
  removeFromCart as removeFromCartAction,
  selectCartItems,
  selectCartOpen,
  selectCartTotal,
  setCartOpen as setCartOpenAction,
  updateQuantity as updateQuantityAction,
} from '../features/cart/cartSlice';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isCartOpen = useSelector(selectCartOpen);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const addToCart = (item) => {
    dispatch(addToCartAction(item));
  };

  const removeFromCart = (id, shadeName) => {
    dispatch(removeFromCartAction({ id, shadeName }));
  };

  const updateQuantity = (id, shadeName, quantity) => {
    dispatch(updateQuantityAction({ id, shadeName, quantity }));
  };

  const closeCart = useCallback(() => dispatch(closeCartAction()), [dispatch]);
  const setIsCartOpen = useCallback((open) => dispatch(setCartOpenAction(open)), [dispatch]);

  const value = {
    isCartOpen,
    setIsCartOpen,
    closeCart,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

export default CartContext;

