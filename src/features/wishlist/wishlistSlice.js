import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';
import { logout } from '../auth/authSlice';

const initialState = {
  wishlistProductIds: [],
  wishlistItems: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist.');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist/toggle', { productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist.');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.wishlistItems = action.payload?.wishlistItems || [];
        state.wishlistProductIds = action.payload?.wishlistProductIds || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wishlist.';
      })
      .addCase(toggleWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.error = null;
        state.wishlistItems = action.payload?.wishlistItems || [];
        state.wishlistProductIds = action.payload?.wishlistProductIds || [];
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update wishlist.';
      })
      .addCase(logout, () => initialState);
  },
});

export const selectWishlistProductIds = (state) => state.wishlist.wishlistProductIds;
export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
