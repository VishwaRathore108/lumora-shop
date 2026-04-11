import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';
import { logout } from '../auth/authSlice';

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchUserStats = createAsyncThunk(
  'userStats/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      // userRoutes is mounted at both `/api/user` and `/api/users`
      const response = await api.get('/users/me/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stats.');
    }
  }
);

const userStatsSlice = createSlice({
  name: 'userStats',
  initialState,
  reducers: {
    clearUserStats(state) {
      state.stats = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user stats.';
      })
      .addCase(logout, () => initialState);
  },
});

export const { clearUserStats } = userStatsSlice.actions;

export const selectUserStats = (state) => state.userStats.stats;
export const selectUserStatsLoading = (state) => state.userStats.loading;
export const selectUserStatsError = (state) => state.userStats.error;

export default userStatsSlice.reducer;

