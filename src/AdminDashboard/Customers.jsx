import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Users,
  UserCheck,
  TrendingUp,
  Globe,
  Loader2,
  User,
  X,
} from 'lucide-react';
import { getCustomers, createCustomer, updateUserStatus } from '../services/adminService';
import ProfileViewModal from './ProfileViewModal';

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
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
    return `(${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
  }
  return num;
}

const CITY_BAR_COLORS = ['#985991', '#f97316', '#3b82f6', '#10b981', '#8b5cf6'];

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [topLocations, setTopLocations] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileUserId, setProfileUserId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ mobile: '', name: '' });
  const [creating, setCreating] = useState(false);
  const [addError, setAddError] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const loadCustomers = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const data = await getCustomers();
      if (data.success) {
        setSummary(data.summary);
        setCustomers(data.customers || []);
        setTopLocations(data.topLocations || null);
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load customers.');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpenId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (customer) => {
    setTogglingId(customer._id);
    try {
      const data = await updateUserStatus(customer._id, {
        isActive: customer.status !== 'Active',
      });
      if (data.success) {
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === customer._id
              ? { ...c, status: data.user.isActive ? 'Active' : 'Inactive' }
              : c
          )
        );
        if (summary) {
          setSummary((s) => ({
            ...s,
            activeMembers: data.user.isActive
              ? (s.activeMembers ?? 0) + 1
              : Math.max(0, (s.activeMembers ?? 0) - 1),
          }));
        }
      }
      setMenuOpenId(null);
    } catch (_) {}
    finally {
      setTogglingId(null);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setAddError('');
    const mobile = addForm.mobile.replace(/\D/g, '');
    if (mobile.length < 10) {
      setAddError('Enter a valid 10-digit mobile number.');
      return;
    }
    setCreating(true);
    try {
      const data = await createCustomer({
        mobile: addForm.mobile.trim(),
        name: addForm.name.trim() || undefined,
      });
      if (data.success) {
        setShowAddModal(false);
        setAddForm({ mobile: '', name: '' });
        await loadCustomers(false);
      } else {
        setAddError(data.message || 'Failed to create.');
      }
    } catch (e) {
      setAddError(e.response?.data?.message || e.message || 'Failed to create.');
    } finally {
      setCreating(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone && c.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')))
  );

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-[#985991] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const s = summary || {};
  const top = topLocations || { country: 'India', countryPercentage: 0, cities: [] };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* --- 1. PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customer List</h2>
          <p className="text-gray-500 text-sm">Manage your user base and view activity.</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddError(''); setAddForm({ mobile: '', name: '' }); }}
          className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95"
        >
          <UserPlus size={18} /> Add Customer
        </button>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Add Customer</h3>
                <p className="text-xs text-gray-500">They will log in with OTP using this mobile number.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={addForm.mobile}
                    onChange={(e) => setAddForm((p) => ({ ...p, mobile: e.target.value }))}
                    className="w-full pl-10 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                    maxLength={15}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (optional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={addForm.name}
                    onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full pl-10 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none"
                  />
                </div>
              </div>
              {addError && <p className="text-sm text-red-500">{addError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-[#985991] text-white text-sm font-medium rounded-lg hover:bg-[#7A4774] disabled:opacity-70"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 2. KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Customers</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {(s.totalCustomers ?? 0).toLocaleString()}
            </h3>
            <span
              className={`text-xs flex items-center gap-1 mt-2 font-medium ${
                (s.trendTotal ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <TrendingUp size={12} className={(s.trendTotal ?? 0) < 0 ? 'rotate-180' : ''} />
              {(s.trendTotal ?? 0) >= 0 ? '+' : ''}
              {s.trendTotal ?? 0}% this week
            </span>
          </div>
          <div className="p-4 bg-gray-50 rounded-full text-gray-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Active Members</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {(s.activeMembers ?? 0).toLocaleString()}
            </h3>
            <span
              className={`text-xs flex items-center gap-1 mt-2 font-medium ${
                (s.trendActive ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <TrendingUp size={12} className={(s.trendActive ?? 0) < 0 ? 'rotate-180' : ''} />
              {(s.trendActive ?? 0) >= 0 ? '+' : ''}
              {s.trendActive ?? 0}% this week
            </span>
          </div>
          <div className="p-4 bg-purple-50 rounded-full text-[#985991]">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">New Joiners</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {(s.newJoiners ?? 0).toLocaleString()}
            </h3>
            <span
              className={`text-xs flex items-center gap-1 mt-2 font-medium ${
                (s.trendNew ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <TrendingUp size={12} className={(s.trendNew ?? 0) < 0 ? 'rotate-180' : ''} />
              {(s.trendNew ?? 0) >= 0 ? '+' : ''}
              {s.trendNew ?? 0}% this week
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <UserPlus size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* --- 3. MAIN CUSTOMER TABLE --- */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991]"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={16} /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      className="rounded text-[#985991] focus:ring-[#985991]"
                    />
                  </th>
                  <th className="p-4 font-semibold">Customer Name</th>
                  <th className="p-4 font-semibold">Join Date</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded text-[#985991] focus:ring-[#985991]"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              c.profileImage ||
                              `https://i.pravatar.cc/150?u=${c._id}`
                            }
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                          />
                          <div>
                            <p className="font-bold text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {c.location || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                        {formatDateTime(c.joinDate)}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="flex items-center gap-2 text-gray-600">
                            <Mail size={12} /> {c.email}
                          </span>
                          <span className="flex items-center gap-2 text-gray-500">
                            <Phone size={12} /> {formatPhone(c.phone)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            c.status === 'Active'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : c.status === 'Inactive'
                              ? 'bg-red-50 text-red-500 border-red-100'
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right relative" ref={menuOpenId === c._id ? menuRef : null}>
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === c._id ? null : c._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {menuOpenId === c._id && (
                          <div className="absolute right-4 top-12 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                            <button
                              onClick={() => {
                                setProfileUserId(c._id);
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <User size={14} /> View details
                            </button>
                            <button
                              onClick={() => handleToggleStatus(c)}
                              disabled={togglingId === c._id}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-70"
                            >
                              {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- 4. TOP LOCATIONS --- */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Top Locations</h3>
            <div className="flex items-center gap-4 mb-6 p-4 bg-purple-50 rounded-xl">
              <div className="p-3 bg-white rounded-full text-[#985991] shadow-sm">
                <Globe size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Most Clients from
                </p>
                <h4 className="text-lg font-bold text-gray-800">
                  {top.country || 'India'}
                </h4>
                <p className="text-xs text-[#985991] font-bold">
                  {top.countryPercentage ?? 0}% of total
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(top.cities || []).map((city, i) => (
                <div key={city.name || i}>
                  <div className="flex justify-between text-xs mb-1 font-medium text-gray-600">
                    <span>{city.name}</span>
                    <span>{city.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${city.percentage}%`,
                        backgroundColor: CITY_BAR_COLORS[i % CITY_BAR_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
              {(!top.cities || top.cities.length === 0) && (
                <p className="text-xs text-gray-400">No location data yet.</p>
              )}
            </div>
          </div>

          {/* Customer of Month - optional, keep as placeholder or top customer from list */}
          {filteredCustomers.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Customer of Month</h3>
              <div className="flex items-center gap-4">
                <img
                  src={
                    filteredCustomers[0].profileImage ||
                    `https://i.pravatar.cc/150?u=${filteredCustomers[0]._id}`
                  }
                  alt="Top Customer"
                  className="w-14 h-14 rounded-full border-2 border-[#985991] p-0.5 object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-800">
                    {filteredCustomers[0].name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Joined {formatDateTime(filteredCustomers[0].joinDate)}
                  </p>
                  <p className="text-xs text-[#985991] font-bold mt-1">
                    {filteredCustomers[0].status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {profileUserId && (
        <ProfileViewModal
          userId={profileUserId}
          onClose={() => setProfileUserId(null)}
        />
      )}
    </div>
  );
};

export default Customers;
