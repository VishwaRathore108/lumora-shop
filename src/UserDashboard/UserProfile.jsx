import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Save,
  Lock,
  Sparkles,
  Smile,
  Heart,
  Loader2,
} from 'lucide-react';
import { selectUser, selectProfileCompletion, setProfile } from '../features/auth/authSlice';
import { getProfile, updateProfile, uploadProfilePhoto } from '../services/userService';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_PROFILE_IMAGE_SIZE_MB = 5;

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const profileCompletion = useSelector(selectProfileCompletion);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    pincode: '',
    skinType: '',
    mainConcern: '',
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        if (data.success) {
          const u = data.user;
          dispatch(setProfile({ user: u, profileCompletion: data.profileCompletion?.percentage }));
          setForm({
            name: u.name || '',
            email: u.email || '',
            mobile: u.mobile || '',
            city: u.defaultAddress?.city || '',
            state: u.defaultAddress?.state || '',
            pincode: u.defaultAddress?.pincode || '',
            skinType: u.skinType || '',
            mainConcern: (u.skinConcerns && u.skinConcerns[0]) || '',
          });
        }
      } catch (e) {
        // ignore for now
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch]);

  // Sync form from user only when user id changes (initial load or switch), so typing is not overwritten
  const userId = user?._id ?? user?.id;
  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      city: user.defaultAddress?.city || '',
      state: user.defaultAddress?.state || '',
      pincode: user.defaultAddress?.pincode || '',
      skinType: user.skinType || '',
      mainConcern: (user.skinConcerns && user.skinConcerns[0]) || '',
    });
  }, [userId]);

  // Revoke object URL when preview changes or component unmounts (avoid memory leaks)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        defaultAddress: {
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        skinType: form.skinType,
        skinConcerns: form.mainConcern ? [form.mainConcern] : [],
      };
      const data = await updateProfile(payload);
      if (data.success) {
        dispatch(setProfile({ user: data.user, profileCompletion: data.profileCompletion?.percentage }));
        const u = data.user;
        setForm({
          name: u.name || '',
          email: u.email || '',
          mobile: u.mobile || '',
          city: u.defaultAddress?.city || '',
          state: u.defaultAddress?.state || '',
          pincode: u.defaultAddress?.pincode || '',
          skinType: u.skinType || '',
          mainConcern: (u.skinConcerns && u.skinConcerns[0]) || '',
        });
      }
    } catch (e) {
      // optionally show toast
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Please choose a JPEG, PNG, GIF or WebP image.');
      event.target.value = '';
      return;
    }
    const maxBytes = MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`Image must be under ${MAX_PROFILE_IMAGE_SIZE_MB}MB.`);
      event.target.value = '';
      return;
    }

    setUploadError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setImageUploading(true);

    try {
      const data = await uploadProfilePhoto(file);
      if (data.success) {
        dispatch(setProfile({ user: data.user, profileCompletion: data.profileCompletion?.percentage }));
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
      }
    } catch (e) {
      const message = e.response?.data?.message || e.message || 'Upload failed. Try again.';
      setUploadError(message);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- 1. PROFILE HEADER --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -z-10 opacity-50"></div>

        {/* Avatar Section: preview (selected file) → server image → placeholder */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#985991] to-[#B87AB2] overflow-hidden ring-4 ring-white shadow-lg">
              <img
                src={previewUrl || user?.profileImage || 'https://i.pravatar.cc/150?u=user'}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              {imageUploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Loader2 size={28} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={imageUploading}
              className="absolute bottom-0 right-0 bg-white text-gray-600 p-2 rounded-full shadow-lg border border-gray-200 hover:text-[#985991] hover:bg-purple-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              title="Change photo"
            >
              {imageUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {uploadError && (
            <p className="text-xs text-red-500 text-center max-w-[200px]">{uploadError}</p>
          )}
          <p className="text-[10px] text-gray-400 text-center">JPEG, PNG, GIF or WebP · Max {MAX_PROFILE_IMAGE_SIZE_MB}MB</p>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-serif font-bold text-gray-800">
            {user?.name || 'Beauty Lover'}
          </h2>
          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
            <Mail size={14} /> {user?.email || 'Add your email'}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
            {typeof profileCompletion === 'number' && (
              <span className="px-3 py-1 bg-purple-50 text-[#985991] text-xs font-bold rounded-full border border-purple-100">
                Profile {profileCompletion}% complete
              </span>
            )}
            <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-full border border-pink-100 flex items-center gap-1">
              <Heart size={10} fill="currentColor" /> Beauty Insider
            </span>
          </div>
        </div>

        {/* Tab Switcher (Desktop) */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
           <button 
             onClick={() => setActiveTab('personal')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
               activeTab === 'personal' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             Personal Info
           </button>
           <button 
             onClick={() => setActiveTab('security')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
               activeTab === 'security' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             Security
           </button>
        </div>
      </div>

      {activeTab === 'personal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: PERSONAL DETAILS --- */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
             <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               <User size={20} className="text-[#985991]" /> Personal Details
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                   <input
                     type="text"
                     name="name"
                     value={form.name}
                     onChange={handleChange}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-purple-100 transition-all"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-purple-100 transition-all"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                   <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={form.mobile}
                        disabled
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                      />
                   </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991] focus:ring-1 focus:ring-purple-100 transition-all"
                  />
                </div>
             </div>

             <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="flex items-center gap-2 bg-[#985991] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95 disabled:opacity-70"
                >
                   <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
             </div>
          </div>

          {/* --- RIGHT: BEAUTY PROFILE (Unique Feature) --- */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 p-8 space-y-6 relative overflow-hidden">
             {/* Decor */}
             <Sparkles className="absolute top-4 right-4 text-purple-200" size={48} />
             
             <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                   <Smile size={20} className="text-[#985991]" /> My Beauty Profile
                </h3>
                <p className="text-sm text-gray-500 mt-1">Help us recommend the perfect products for you.</p>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Skin Type</label>
                   <select
                     name="skinType"
                     value={form.skinType}
                     onChange={handleChange}
                     className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#985991]"
                   >
                      <option value="">Choose Skin Type</option>
                      <option value="oily">Oily</option>
                      <option value="dry">Dry</option>
                      <option value="combination">Combination</option>
                      <option value="sensitive">Sensitive</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Main Concern</label>
                   <select
                     name="mainConcern"
                     value={form.mainConcern}
                     onChange={handleChange}
                     className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#985991]"
                   >
                      <option value="">Choose Concern</option>
                      <option value="Acne & Blemishes">Acne & Blemishes</option>
                      <option value="Anti-Aging">Anti-Aging</option>
                      <option value="Dullness">Dullness</option>
                      <option value="Dark Spots">Dark Spots</option>
                   </select>
                </div>
             </div>

             <button
               type="button"
               onClick={handleSave}
               disabled={saving || loading}
               className="w-full bg-white text-[#985991] font-bold py-3 rounded-xl shadow-sm border border-purple-100 hover:bg-purple-50 transition-colors disabled:opacity-70"
             >
                {saving || loading ? 'Updating...' : 'Update Beauty Profile'}
             </button>
          </div>

        </div>
      ) : (
        /* --- SECURITY TAB --- */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
           <div className="border-b border-gray-100 pb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 <Lock size={20} className="text-[#985991]" /> Change Password
              </h3>
              <p className="text-sm text-gray-500 mt-1">Ensure your account stays secure.</p>
           </div>

           <div className="space-y-5">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Current Password</label>
                 <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">New Password</label>
                    <input type="password" placeholder="Min 8 chars" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Confirm New</label>
                    <input type="password" placeholder="Min 8 chars" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
                 </div>
              </div>
           </div>

           <div className="pt-4 flex items-center justify-between">
              <button className="text-sm text-gray-400 font-medium hover:text-red-500 transition-colors">
                 Deactivate Account
              </button>
              <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">
                 Update Password
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;