import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Phone, KeyRound } from 'lucide-react';
import heroImg from '../assets/img1.jpg';
import { authStart, authSuccess, authFailure, selectAuth } from '../features/auth/authSlice';
import { sendOtp, verifyOtp } from '../services/authService';

const sanitizeMobile = (value) => value.replace(/\D/g, '').slice(0, 15);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector(selectAuth);

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('mobile'); // 'mobile' | 'otp'
  const [info, setInfo] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleaned = sanitizeMobile(mobile);
    if (!cleaned || cleaned.length < 10) {
      setInfo('');
      dispatch(authFailure('Please enter a valid mobile number'));
      return;
    }
    setSendingOtp(true);
    setInfo('');
    try {
      const data = await sendOtp(cleaned);
      if (!data.success) {
        dispatch(authFailure(data.message || 'Failed to send OTP'));
        return;
      }
      setStep('otp');
      setInfo(
        data.isNewUser
          ? 'We created a new account for you. Enter the OTP sent to your mobile.'
          : 'Enter the OTP sent to your mobile to log in.'
      );
    } catch (err) {
      dispatch(authFailure('Connection error. Please try again.'));
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleaned = sanitizeMobile(mobile);
    if (!cleaned || !otp.trim()) {
      dispatch(authFailure('Please enter mobile and OTP'));
      return;
    }
    setVerifyingOtp(true);
    dispatch(authStart());
    try {
      const data = await verifyOtp({ mobile: cleaned, otp: otp.trim() });
      if (!data.success) {
        dispatch(authFailure(data.message || 'Invalid OTP'));
        return;
      }
      dispatch(
        authSuccess({
          user: data.user,
          token: data.token,
          profileCompletion: data.profileCompletion,
        })
      );
      const role = data.user?.role;
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'driver') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    } catch (err) {
      dispatch(authFailure('Verification failed. Please try again.'));
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <img
          src={heroImg}
          alt="Lumora Beauty"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white h-full">
          <h2 className="text-5xl font-serif mb-6 leading-tight">
            Unlock Your <br /> Inner <span className="italic text-pink-300">Glow</span>
          </h2>
          <p className="text-lg font-light opacity-90 max-w-md">
            Join the Lumora community for exclusive access to clean, vegan, and dermatologist-tested skincare.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Welcome to Lumora</h1>
            <p className="text-gray-500 text-sm">
              Sign in with your mobile number and one-time password.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          {info && !error && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
              {info}
            </div>
          )}

          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="mobile"
                  required
                  placeholder="Mobile Number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#985991] focus:ring-1 focus:ring-[#985991] outline-none transition-all"
                  value={mobile}
                  onChange={(e) => {
                    setInfo('');
                    setMobile(sanitizeMobile(e.target.value));
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full bg-[#985991] text-white py-3.5 rounded-xl font-medium hover:bg-[#7A4774] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-100 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
                {!sendingOtp && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  disabled
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                  value={mobile}
                  readOnly
                />
              </div>
              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="otp"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#985991] focus:ring-1 focus:ring-[#985991] outline-none transition-all tracking-[0.4em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
              <button
                type="submit"
                disabled={verifyingOtp}
                className="w-full bg-[#985991] text-white py-3.5 rounded-xl font-medium hover:bg-[#7A4774] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-100 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {verifyingOtp ? 'Verifying...' : 'Verify & Continue'}
                {!verifyingOtp && <ArrowRight size={18} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('mobile');
                  setOtp('');
                  setInfo('');
                  setVerifyingOtp(false);
                }}
                className="w-full text-xs text-gray-500 hover:text-[#985991] mt-1"
              >
                Change mobile number
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              &larr; Return to Lumora Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
