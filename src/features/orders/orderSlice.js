import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';

const initialState = {
  myOrders: [],
  myOrderDetails: null,
  adminOrders: [],
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/orders', payload);
      return response.data?.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order.');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/orders');
      return response.data?.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders.');
    }
  }
);

export const fetchMyOrderById = createAsyncThunk(
  'orders/fetchMyOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/orders/${orderId}`);
      return response.data?.order || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details.');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async (status = '', { rejectWithValue }) => {
    try {
      const params = status && status !== 'all' ? { status } : undefined;
      const response = await api.get('/admin/orders', { params });
      return response.data?.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin orders.');
    }
  }
);

export const updateAdminOrderStatus = createAsyncThunk(
  'orders/updateAdminOrderStatus',
  async ({ orderId, status, note = '' }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status, note });
      return response.data?.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status.');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.myOrders.unshift(action.payload);
          state.myOrderDetails = action.payload;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order.';
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders.';
      })
      .addCase(fetchMyOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.myOrderDetails = action.payload;
      })
      .addCase(fetchMyOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order details.';
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch admin orders.';
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.error = null;
        const updated = action.payload;
        if (!updated) return;
        state.adminOrders = state.adminOrders.map((order) =>
          order._id === updated._id ? updated : order
        );
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update order status.';
      });
  },
});

export const selectMyOrders = (state) => state.orders.myOrders;
export const selectMyOrderDetails = (state) => state.orders.myOrderDetails;
export const selectAdminOrders = (state) => state.orders.adminOrders;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
