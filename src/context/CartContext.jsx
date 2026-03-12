import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setIsCartOpen(true);
    setCartItems((prev) => {
      // Match on id + optional shade name
      const shadeName = item.selectedShade?.name;
      const index = prev.findIndex(
        (p) => p.id === item.id && (shadeName ? p.selectedShade?.name === shadeName : true)
      );

      if (index === -1) {
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + (item.quantity || 1),
      };
      return updated;
    });
  };

  const removeFromCart = (id, shadeName) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== id ||
          (shadeName && item.selectedShade?.name !== shadeName)
      )
    );
  };

  const updateQuantity = (id, shadeName, quantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (
            item.id === id &&
            (shadeName ? item.selectedShade?.name === shadeName : true)
          ) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const value = {
    isCartOpen,
    setIsCartOpen,
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

