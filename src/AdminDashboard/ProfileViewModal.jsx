import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, MapPin, Loader2, Calendar } from 'lucide-react';
import { getUserProfile } from '../services/adminService';

function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatPhone(num) {
  if (!num || typeof num !== 'string') return '—';
  const digits = num.replace(/\D/g, '');
  if (digits.length >= 10) {
    return `+${digits.slice(0, -10) || ''} (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
  }
  return num;
}

const ProfileViewModal = ({ userId, onClose }) => {
  const [loading, setLoading] = useState(!!userId);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getUserProfile(userId)
      .then((data) => {
        if (!cancelled && data.success) setUser(data.user);
        if (!cancelled && !data.success) setError(data.message || 'Failed to load.');
      })
      .catch((e) => {
        if (!cancelled) setError(e.response?.data?.message || e.message || 'Failed to load.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const addr = user?.defaultAddress;
  const location = [addr?.city, addr?.state, addr?.pincode].filter(Boolean).join(', ') || '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <h3 className="text-lg font-bold text-gray-800">Profile Details</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="text-[#985991] animate-spin" />
            </div>
          )}
          {error && (
            <p className="text-sm text-red-500 py-4">{error}</p>
          )}
          {!loading && user && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={user.profileImage || `https://i.pravatar.cc/150?u=${user._id}`}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <p className="font-bold text-gray-800 text-lg">{user.name || '—'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role || 'user'}</p>
                  <p className="text-xs text-gray-500">{user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-gray-400 shrink-0" />
                  <span>{user.email || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-gray-400 shrink-0" />
                  <span>{formatPhone(user.mobile)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={18} className="text-gray-400 shrink-0" />
                  <span>{location}</span>
                </div>
                {addr?.line1 && (
                  <div className="flex items-center gap-3 text-gray-600 text-xs pl-9">
                    {addr.line1}
                    {addr.line2 && `, ${addr.line2}`}
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar size={18} className="text-gray-400 shrink-0" />
                  <span>Joined {formatDateTime(user.createdAt)}</span>
                </div>
                {user.lastLoginAt && (
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <span>Last login: {formatDateTime(user.lastLoginAt)}</span>
                  </div>
                )}
              </div>
              {(user.skinType || (user.skinConcerns && user.skinConcerns.length)) && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Beauty profile</p>
                  <p className="text-sm text-gray-600">
                    {user.skinType && <span>Skin: {user.skinType}</span>}
                    {user.skinConcerns?.length ? ` · Concerns: ${user.skinConcerns.join(', ')}` : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewModal;
