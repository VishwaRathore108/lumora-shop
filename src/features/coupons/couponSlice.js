import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/apiClient';
import { logout } from '../auth/authSlice';

const initialState = {
  eligibleCoupons: [],
  eligibleUserType: null,
  eligibleSubtotal: 0,
  eligibleLoading: false,
  eligibleError: null,
  appliedCoupon: null,
  validateLoading: false,
  couponFieldError: null,
};

const buildCartDetailsPayload = (cartItems) => ({
  items: (cartItems || []).map((item) => ({
    id: item.id,
    quantity: item.quantity,
  })),
});

export const fetchEligibleCoupons = createAsyncThunk(
  'coupons/fetchEligibleCoupons',
  async (cartItems, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/eligible-coupons', {
        cartDetails: buildCartDetailsPayload(cartItems),
      });
      if (!response.data?.success) {
        return rejectWithValue(response.data?.message || 'Failed to load coupon suggestions.');
      }
      return {
        coupons: response.data.coupons || [],
        userType: response.data.userType || null,
        subtotal: response.data.subtotal ?? 0,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load coupon suggestions.');
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'coupons/validateCoupon',
  async ({ couponCode, cartItems }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/validate-coupon', {
        couponCode: String(couponCode || '').trim(),
        cartDetails: buildCartDetailsPayload(cartItems),
      });
      if (!response.data?.success) {
        return rejectWithValue({
          message: response.data?.message || 'Invalid coupon.',
          errorCode: response.data?.errorCode,
        });
      }
      return {
        code: response.data.coupon?.code,
        name: response.data.coupon?.name,
        description: response.data.coupon?.description,
        discountPercentage: response.data.coupon?.discountPercentage,
        subtotal: response.data.subtotal,
        discountAmount: response.data.discountAmount,
        merchandiseAfterDiscount: response.data.merchandiseAfterDiscount,
        userType: response.data.userType,
      };
    } catch (error) {
      const data = error.response?.data;
      return rejectWithValue({
        message: data?.message || 'Failed to apply coupon.',
        errorCode: data?.errorCode,
      });
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearEligibleSuggestions: (state) => {
      state.eligibleCoupons = [];
      state.eligibleSubtotal = 0;
      state.eligibleUserType = null;
      state.eligibleError = null;
    },
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponFieldError = null;
    },
    clearCouponFieldError: (state) => {
      state.couponFieldError = null;
    },
    setCouponFieldError: (state, action) => {
      state.couponFieldError = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEligibleCoupons.pending, (state) => {
        state.eligibleLoading = true;
        state.eligibleError = null;
      })
      .addCase(fetchEligibleCoupons.fulfilled, (state, action) => {
        state.eligibleLoading = false;
        state.eligibleError = null;
        state.eligibleCoupons = action.payload.coupons;
        state.eligibleUserType = action.payload.userType;
        state.eligibleSubtotal = action.payload.subtotal;
      })
      .addCase(fetchEligibleCoupons.rejected, (state, action) => {
        state.eligibleLoading = false;
        state.eligibleError = action.payload || 'Failed to load coupons.';
        state.eligibleCoupons = [];
      })
      .addCase(validateCoupon.pending, (state) => {
        state.validateLoading = true;
        state.couponFieldError = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validateLoading = false;
        state.couponFieldError = null;
        state.appliedCoupon = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.validateLoading = false;
        const payload = action.payload;
        state.couponFieldError =
          typeof payload === 'string' ? payload : payload?.message || 'Could not apply coupon.';
        state.appliedCoupon = null;
      })
      .addCase(logout, () => initialState);
  },
});

export const { clearEligibleSuggestions, clearAppliedCoupon, clearCouponFieldError, setCouponFieldError } =
  couponSlice.actions;

export const selectEligibleCoupons = (state) => state.coupons.eligibleCoupons;
export const selectEligibleCouponsLoading = (state) => state.coupons.eligibleLoading;
export const selectEligibleUserType = (state) => state.coupons.eligibleUserType;
export const selectAppliedCoupon = (state) => state.coupons.appliedCoupon;
export const selectCouponValidateLoading = (state) => state.coupons.validateLoading;
export const selectCouponFieldError = (state) => state.coupons.couponFieldError;

export default couponSlice.reducer;
