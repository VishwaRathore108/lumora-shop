import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Store,
  User,
  UserCircle,
  Bell,
  Lock,
  Shield,
  Save,
  Camera,
  Mail,
  MapPin,
  Phone,
  Users,
  Plus,
  Loader2,
} from 'lucide-react';
import { selectUser, setProfile } from '../features/auth/authSlice';
import { getProfile, updateProfile, uploadProfilePhoto } from '../services/userService';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_PROFILE_IMAGE_SIZE_MB = 5;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // --- PROFILE TAB STATE ---
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const profileFileInputRef = useRef(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Load profile only when opening Profile tab; sync form from API response (not from user on every change, to avoid overwriting while typing)
  useEffect(() => {
    if (activeTab !== 'profile') return;
    const load = async () => {
      try {
        setProfileLoading(true);
        const data = await getProfile();
        if (data.success) {
          const u = data.user;
          dispatch(setProfile({ user: u, profileCompletion: data.profileCompletion?.percentage }));
          setProfileForm({
            name: u.name || '',
            email: u.email || '',
            mobile: u.mobile || '',
            city: u.defaultAddress?.city || '',
            state: u.defaultAddress?.state || '',
            pincode: u.defaultAddress?.pincode || '',
          });
        }
      } catch (_) {}
      finally {
        setProfileLoading(false);
      }
    };
    load();
  }, [activeTab, dispatch]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        defaultAddress: {
          city: profileForm.city,
          state: profileForm.state,
          pincode: profileForm.pincode,
        },
      };
      const data = await updateProfile(payload);
      if (data.success) {
        dispatch(setProfile({ user: data.user, profileCompletion: data.profileCompletion?.percentage }));
      }
    } catch (_) {}
    finally {
      setProfileSaving(false);
    }
  };

  const handleProfilePhotoClick = () => {
    setUploadError(null);
    if (profileFileInputRef.current) profileFileInputRef.current.click();
  };

  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Use JPEG, PNG, GIF or WebP.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024) {
      setUploadError(`Max ${MAX_PROFILE_IMAGE_SIZE_MB}MB.`);
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
      setUploadError(e.response?.data?.message || 'Upload failed.');
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } finally {
      setImageUploading(false);
      if (profileFileInputRef.current) profileFileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-500 text-sm">Manage your store preferences and security.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#985991] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR NAVIGATION --- */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-2 space-y-1">
            {[
              { id: 'general', label: 'General', icon: Store },
              { id: 'profile', label: 'Profile', icon: UserCircle },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'team', label: 'Team Members', icon: Users },
              { id: 'security', label: 'Security', icon: Shield },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? "bg-purple-50 text-[#985991]" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- RIGHT CONTENT AREA (inline to avoid remount / focus loss on input) --- */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-purple-50 flex items-center justify-center text-gray-400">
                  <Store size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Store Logo</h3>
                  <p className="text-sm text-gray-500">Configure store branding in Profile tab.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Name</label>
                    <input type="text" defaultValue="Lumora" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Support Email</label>
                    <input type="email" defaultValue="help@lumora.com" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                    <input type="text" defaultValue="+91 98765 43210" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Currency</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none bg-white">
                      <option>Indian Rupee (INR ₹)</option>
                      <option>US Dollar (USD $)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (profileLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
              <Loader2 size={32} className="text-[#985991] animate-spin" />
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Admin Profile Photo</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#985991] to-[#B87AB2] overflow-hidden ring-2 ring-gray-100">
                        <img
                          src={previewUrl || user?.profileImage || 'https://i.pravatar.cc/150?u=admin'}
                          alt="Admin"
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
                        onClick={handleProfilePhotoClick}
                        disabled={imageUploading}
                        className="absolute bottom-0 right-0 p-1.5 bg-[#985991] text-white rounded-full hover:bg-[#7A4774] border-2 border-white shadow disabled:opacity-70"
                        title="Change photo"
                      >
                        {imageUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                      </button>
                      <input
                        ref={profileFileInputRef}
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        className="hidden"
                        onChange={handleProfilePhotoChange}
                      />
                    </div>
                    {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                    <p className="text-[10px] text-gray-400">JPEG, PNG, GIF, WebP · Max {MAX_PROFILE_IMAGE_SIZE_MB}MB</p>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-gray-600">This photo appears in the dashboard header and identifies you as the store admin.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Name, Email & Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        placeholder="Your name"
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="admin@example.com"
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone (login)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={profileForm.mobile || ''}
                        disabled
                        placeholder="Logged-in mobile"
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="city"
                        value={profileForm.city}
                        onChange={handleProfileChange}
                        placeholder="City"
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={profileForm.state}
                      onChange={handleProfileChange}
                      placeholder="State"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={profileForm.pincode}
                      onChange={handleProfileChange}
                      placeholder="Pincode"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#985991] outline-none"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleProfileSave}
                    disabled={profileLoading || profileSaving}
                    className="flex items-center gap-2 bg-[#985991] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95 disabled:opacity-70"
                  >
                    <Save size={18} />
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Email Alerts</h3>
              {[
                { title: "New Order Received", desc: "Get notified when a customer places an order.", checked: true },
                { title: "Low Stock Alert", desc: "Notify when product stock goes below 10 units.", checked: true },
                { title: "New Customer Review", desc: "Get notified when a product gets a review.", checked: false },
                { title: "Daily Sales Report", desc: "Receive a summary of daily sales at 9 PM.", checked: false },
              ].map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" defaultChecked={item.checked} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-[#985991]" style={{ right: item.checked ? '0' : 'auto', left: item.checked ? 'auto' : '0' }} />
                    <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${item.checked ? 'bg-[#985991]' : 'bg-gray-300'}`}></label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Team Members</h3>
                <button className="text-xs flex items-center gap-1 bg-purple-50 text-[#985991] px-3 py-1.5 rounded-lg hover:bg-purple-100 font-medium">
                  <Plus size={14} /> Add Member
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {[
                  { name: "Vishvajeet Admin", role: "Super Admin", email: "admin@youvana.com", status: "Active" },
                  { name: "Sarah Khan", role: "Inventory Manager", email: "sarah@youvana.com", status: "Active" },
                  { name: "Rahul Roy", role: "Support Agent", email: "rahul@youvana.com", status: "Offline" },
                ].map((member, i) => (
                  <div key={i} className="p-4 border-b border-gray-50 flex items-center justify-between last:border-0 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-md text-gray-600 block mb-1">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-800">Change Password</h3>
                  <p className="text-xs text-gray-500">Update your password periodically for safety.</p>
                </div>
                <Lock size={20} className="text-gray-400" />
              </div>
              <div className="grid gap-4">
                <input type="password" placeholder="Current Password" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#985991]" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="password" placeholder="New Password" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#985991]" />
                  <input type="password" placeholder="Confirm Password" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#985991]" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-500">Add an extra layer of security.</p>
                </div>
                <button className="text-[#985991] text-sm font-bold hover:underline">Enable 2FA</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;