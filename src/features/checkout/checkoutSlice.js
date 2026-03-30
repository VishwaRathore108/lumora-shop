import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';
import { logout } from '../auth/authSlice';

const initialState = {
  savedAddresses: [],
  selectedAddressId: null,
  selectedPaymentMethod: 'razorpay',
  loading: false,
  error: null,
};

const mapAddress = (address) => ({
  id: address._id,
  label: address.label || 'Home',
  fullName: address.fullName || '',
  phone: address.phone || '',
  pincode: address.pincode || '',
  city: address.city || '',
  state: address.state || '',
  streetAddress: [address.line1, address.line2].filter(Boolean).join(', '),
  line1: address.line1 || '',
  line2: address.line2 || '',
  isDefault: !!address.isDefault,
});

const getDefaultAddressId = (addresses = []) =>
  addresses.find((address) => address.isDefault)?.id || addresses[0]?.id || null;

export const fetchAddresses = createAsyncThunk(
  'checkout/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/addresses');
      return response.data?.addresses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses.');
    }
  }
);

export const createAddress = createAsyncThunk(
  'checkout/createAddress',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/addresses', payload);
      return response.data?.addresses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add address.');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'checkout/updateAddress',
  async ({ addressId, payload }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/addresses/${addressId}`, payload);
      return response.data?.addresses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address.');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'checkout/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return response.data?.addresses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address.');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'checkout/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/user/addresses/${addressId}/default`);
      return response.data?.addresses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default address.');
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
    selectPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.savedAddresses = (action.payload || []).map(mapAddress);
        state.selectedAddressId = getDefaultAddressId(state.savedAddresses);
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch addresses.';
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.error = null;
        state.savedAddresses = (action.payload || []).map(mapAddress);
        state.selectedAddressId = getDefaultAddressId(state.savedAddresses);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add address.';
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.error = null;
        state.savedAddresses = (action.payload || []).map(mapAddress);
        state.selectedAddressId = getDefaultAddressId(state.savedAddresses);
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update address.';
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.error = null;
        state.savedAddresses = (action.payload || []).map(mapAddress);
        state.selectedAddressId = getDefaultAddressId(state.savedAddresses);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete address.';
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.error = null;
        state.savedAddresses = (action.payload || []).map(mapAddress);
        state.selectedAddressId = getDefaultAddressId(state.savedAddresses);
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.error = action.payload || 'Failed to set default address.';
      })
      .addCase(logout, () => initialState);
  },
});

export const selectCheckout = (state) => state.checkout;
export const selectSavedAddresses = (state) => state.checkout.savedAddresses;
export const selectSelectedAddressId = (state) => state.checkout.selectedAddressId;
export const selectSelectedAddress = (state) =>
  state.checkout.savedAddresses.find((address) => address.id === state.checkout.selectedAddressId) ||
  null;
export const selectSelectedPaymentMethod = (state) => state.checkout.selectedPaymentMethod;
export const selectCheckoutLoading = (state) => state.checkout.loading;
export const selectCheckoutError = (state) => state.checkout.error;

export const { selectAddress, selectPaymentMethod } = checkoutSlice.actions;
export default checkoutSlice.reducer;
