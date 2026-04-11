import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import orderReducer from '../features/orders/orderSlice';
import userStatsReducer from '../features/userStats/userStatsSlice';
import reviewsReducer from '../features/reviews/reviewSlice';
import couponReducer from '../features/coupons/couponSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    userStats: userStatsReducer,
    reviews: reviewsReducer,
    coupons: couponReducer,
  },
});

export default store;

