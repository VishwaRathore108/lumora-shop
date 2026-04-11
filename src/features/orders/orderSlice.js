import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';

const initialState = {
  myOrders: [],
  myOrderDetails: null,
  adminOrders: [],
  adminOrderDetails: null,
  driverOverview: [],
  driverRequestedOrders: [],
  driverAcceptedOrders: [],
  driverCompletedOrders: [],
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

export const fetchAdminOrderById = createAsyncThunk(
  'orders/fetchAdminOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data?.order || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin order details.');
    }
  }
);

export const fetchDriverAssignmentOverview = createAsyncThunk(
  'orders/fetchDriverAssignmentOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/drivers/assignment-overview');
      return response.data?.drivers || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch driver overview.');
    }
  }
);

export const assignOrderToDriver = createAsyncThunk(
  'orders/assignOrderToDriver',
  async ({ orderId, driverId, note = '' }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/assign-driver`, { driverId, note });
      return response.data?.order || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign order to driver.');
    }
  }
);

export const fetchDriverRequestedOrders = createAsyncThunk(
  'orders/fetchDriverRequestedOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/driver/orders/requested');
      return response.data?.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch requested orders.');
    }
  }
);

export const fetchDriverAcceptedOrders = createAsyncThunk(
  'orders/fetchDriverAcceptedOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/driver/orders/accepted');
      return response.data?.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch accepted orders.');
    }
  }
);

export const fetchDriverCompletedOrders = createAsyncThunk(
  'orders/fetchDriverCompletedOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/driver/orders/completed');
      return response.data?.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed orders.');
    }
  }
);

export const driverRespondToOrderRequest = createAsyncThunk(
  'orders/driverRespondToOrderRequest',
  async ({ orderId, action, reason = '', note = '' }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/driver/orders/${orderId}/respond`, { action, reason, note });
      return response.data?.order || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond to order request.');
    }
  }
);

export const driverUpdateAcceptedOrderStatus = createAsyncThunk(
  'orders/driverUpdateAcceptedOrderStatus',
  async ({ orderId, status, note = '' }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/driver/orders/${orderId}/status`, { status, note });
      return response.data?.order || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status.');
    }
  }
);

export const payNowForCodOrder = createAsyncThunk(
  'orders/payNowForCodOrder',
  async ({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/user/orders/${orderId}/pay-now`, {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });
      return response.data?.order || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete COD payment.');
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
      })
      .addCase(fetchAdminOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.adminOrderDetails = action.payload;
      })
      .addCase(fetchAdminOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch admin order details.';
      })
      .addCase(fetchDriverAssignmentOverview.fulfilled, (state, action) => {
        state.error = null;
        state.driverOverview = action.payload || [];
      })
      .addCase(fetchDriverAssignmentOverview.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch driver overview.';
      })
      .addCase(assignOrderToDriver.fulfilled, (state, action) => {
        state.error = null;
        const updated = action.payload;
        if (!updated) return;
        state.adminOrderDetails = updated;
        state.adminOrders = state.adminOrders.map((order) => (order._id === updated._id ? updated : order));
      })
      .addCase(assignOrderToDriver.rejected, (state, action) => {
        state.error = action.payload || 'Failed to assign order.';
      })
      .addCase(fetchDriverRequestedOrders.fulfilled, (state, action) => {
        state.error = null;
        state.driverRequestedOrders = action.payload || [];
      })
      .addCase(fetchDriverRequestedOrders.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch requested orders.';
      })
      .addCase(fetchDriverAcceptedOrders.fulfilled, (state, action) => {
        state.error = null;
        state.driverAcceptedOrders = action.payload || [];
      })
      .addCase(fetchDriverAcceptedOrders.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch accepted orders.';
      })
      .addCase(fetchDriverCompletedOrders.fulfilled, (state, action) => {
        state.error = null;
        state.driverCompletedOrders = action.payload || [];
      })
      .addCase(fetchDriverCompletedOrders.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch completed orders.';
      })
      .addCase(driverRespondToOrderRequest.fulfilled, (state, action) => {
        state.error = null;
        const updated = action.payload;
        if (!updated) return;
        state.driverRequestedOrders = state.driverRequestedOrders.filter((order) => order._id !== updated._id);
        state.driverAcceptedOrders = updated.delivery?.assignmentStatus === 'accepted'
          ? [updated, ...state.driverAcceptedOrders.filter((order) => order._id !== updated._id)]
          : state.driverAcceptedOrders.filter((order) => order._id !== updated._id);
      })
      .addCase(driverRespondToOrderRequest.rejected, (state, action) => {
        state.error = action.payload || 'Failed to respond to order request.';
      })
      .addCase(driverUpdateAcceptedOrderStatus.fulfilled, (state, action) => {
        state.error = null;
        const updated = action.payload;
        if (!updated) return;
        state.driverAcceptedOrders = state.driverAcceptedOrders.map((order) =>
          order._id === updated._id ? updated : order
        );
        state.driverCompletedOrders = updated.orderStatus === 'delivered'
          ? [updated, ...state.driverCompletedOrders.filter((order) => order._id !== updated._id)]
          : state.driverCompletedOrders.filter((order) => order._id !== updated._id);
        state.adminOrders = state.adminOrders.map((order) => (order._id === updated._id ? updated : order));
        if (state.adminOrderDetails?._id === updated._id) {
          state.adminOrderDetails = updated;
        }
      })
      .addCase(driverUpdateAcceptedOrderStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update order status.';
      })
      .addCase(payNowForCodOrder.fulfilled, (state, action) => {
        state.error = null;
        const updated = action.payload;
        if (!updated) return;
        state.myOrderDetails = updated;
        state.myOrders = state.myOrders.map((order) => (order._id === updated._id ? updated : order));
      })
      .addCase(payNowForCodOrder.rejected, (state, action) => {
        state.error = action.payload || 'Failed to complete COD payment.';
      });
  },
});

export const selectMyOrders = (state) => state.orders.myOrders;
export const selectMyOrderDetails = (state) => state.orders.myOrderDetails;
export const selectAdminOrders = (state) => state.orders.adminOrders;
export const selectAdminOrderDetails = (state) => state.orders.adminOrderDetails;
export const selectDriverOverview = (state) => state.orders.driverOverview;
export const selectDriverRequestedOrders = (state) => state.orders.driverRequestedOrders;
export const selectDriverAcceptedOrders = (state) => state.orders.driverAcceptedOrders;
export const selectDriverCompletedOrders = (state) => state.orders.driverCompletedOrders;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
