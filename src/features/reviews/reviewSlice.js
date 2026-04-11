import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';
import { logout } from '../auth/authSlice';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/me/reviews');
      return response.data?.reviews || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews.');
    }
  }
);

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ productId, rating, title, description }, { rejectWithValue }) => {
    try {
      const payload = { productId, rating, title, description };
      const response = await api.post('/users/me/reviews', payload);
      return response.data?.review || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review.');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews(state) {
      state.reviews = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.reviews = action.payload || [];
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reviews.';
      })
      .addCase(submitReview.pending, (state) => {
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        const newReview = action.payload;
        if (!newReview) return;
        state.reviews = [
          newReview,
          ...state.reviews.filter((r) => String(r.productId) !== String(newReview.productId)),
        ];
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.error = action.payload || 'Failed to submit review.';
      })
      .addCase(logout, () => initialState);
  },
});

export const { clearReviews } = reviewSlice.actions;

export const selectMyReviews = (state) => state.reviews.reviews;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;

export default reviewSlice.reducer;

