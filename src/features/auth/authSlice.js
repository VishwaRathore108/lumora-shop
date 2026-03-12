import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = (() => {
  if (typeof window === 'undefined') return { user: null, token: null, profileCompletion: null };
  try {
    const raw = window.localStorage.getItem('auth');
    if (!raw) return { user: null, token: null, profileCompletion: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null,
      profileCompletion: parsed.profileCompletion ?? null,
    };
  } catch {
    return { user: null, token: null, profileCompletion: null };
  }
})();

const initialState = {
  user: userFromStorage.user,
  token: userFromStorage.token,
  profileCompletion: userFromStorage.profileCompletion,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      const { user, token, profileCompletion } = action.payload;
      state.user = user;
      state.token = token;
      state.profileCompletion = profileCompletion ?? null;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'auth',
          JSON.stringify({ user, token, profileCompletion: state.profileCompletion })
        );
      }
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload || 'Something went wrong';
    },
    setProfile(state, action) {
      const { user, profileCompletion } = action.payload;
      state.user = user;
      state.profileCompletion = profileCompletion ?? state.profileCompletion;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'auth',
          JSON.stringify({ user, token: state.token, profileCompletion: state.profileCompletion })
        );
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.profileCompletion = null;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth');
      }
    },
  },
});

export const { authStart, authSuccess, authFailure, setProfile, logout } = slice.actions;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectProfileCompletion = (state) => state.auth.profileCompletion;

export default slice.reducer;

