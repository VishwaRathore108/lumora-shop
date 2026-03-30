import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import orderReducer from '../features/orders/orderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
  },
});

export default store;

