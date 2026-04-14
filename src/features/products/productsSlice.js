import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';

const initialState = {
  products: [],
  isLoading: false,
  isError: false,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return Array.isArray(response.data?.products) ? response.data.products : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products.');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.products = [];
      });
  },
});

export const selectProducts = (state) => state.products.products;
export const selectProductsLoading = (state) => state.products.isLoading;
export const selectProductsError = (state) => state.products.isError;

export default productsSlice.reducer;
