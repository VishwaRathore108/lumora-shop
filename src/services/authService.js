import api from './apiClient';

export async function sendOtp(mobile) {
  const res = await api.post('/auth/send-otp', { mobile });
  return res.data;
}

export async function verifyOtp({ mobile, otp }) {
  const res = await api.post('/auth/verify-otp', { mobile, otp });
  return res.data;
}

export async function fetchMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

