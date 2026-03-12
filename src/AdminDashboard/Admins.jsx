import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  UserCog,
  Plus,
  Search,
  MoreVertical,
  Mail,
  X,
  Activity,
  Loader2,
  User,
  Phone,
} from 'lucide-react';
import {
  getTeam,
  createTeamMember,
  updateUserStatus,
} from '../services/adminService';
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

const Admins = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const menuRef = useRef(null);

  const [addForm, setAddForm] = useState({ mobile: '', name: '', role: 'admin' });
  const [addError, setAddError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTeam();
        if (data.success) setTeam(data.team || []);
      } catch (e) {
        setError(e.response?.data?.message || e.message || 'Failed to load team.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpenId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTeam = team.filter(
    (a) =>
      (a.name && a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.email && a.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.mobile && a.mobile.includes(searchTerm.replace(/\D/g, '')))
  );

  const totalAdmins = team.filter((t) => t.role === 'admin').length;
  const activeCount = team.filter((t) => t.isActive).length;

  const handleCreate = async (e) => {
    e.preventDefault();
    setAddError('');
    const mobile = addForm.mobile.replace(/\D/g, '');
    if (mobile.length < 10) {
      setAddError('Enter a valid 10-digit mobile number.');
      return;
    }
    setCreating(true);
    try {
      const data = await createTeamMember({
        mobile: addForm.mobile.trim(),
        name: addForm.name.trim() || undefined,
        role: addForm.role,
      });
      if (data.success) {
        setTeam((prev) => [data.user, ...prev]);
        setShowAddModal(false);
        setAddForm({ mobile: '', name: '', role: 'admin' });
      } else {
        setAddError(data.message || 'Failed to create.');
      }
    } catch (e) {
      setAddError(e.response?.data?.message || e.message || 'Failed to create.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (member) => {
    setTogglingId(member._id);
    try {
      const data = await updateUserStatus(member._id, { isActive: !member.isActive });
      if (data.success) {
        setTeam((prev) =>
          prev.map((t) => (t._id === member._id ? { ...t, isActive: data.user.isActive } : t))
        );
      }
      setMenuOpenId(null);
    } catch (_) {}
    finally {
      setTogglingId(null);
    }
  };

  const openProfile = (id) => {
    setProfileUserId(id);
    setShowProfileModal(true);
    setMenuOpenId(null);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-[#985991] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
          <p className="text-gray-500 text-sm">Control access and roles for your store staff (Admin & Driver).</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddError(''); setAddForm({ mobile: '', name: '', role: 'admin' }); }}
          className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Member
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-[#985991] rounded-xl">
            <UserCog size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Total Team</p>
            <h3 className="text-2xl font-bold text-gray-800">{team.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Admins</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalAdmins}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Active</p>
            <h3 className="text-2xl font-bold text-gray-800">{activeCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No team members found.
                  </td>
                </tr>
              ) : (
                filteredTeam.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 group transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.profileImage || `https://i.pravatar.cc/150?u=${member._id}`}
                          alt={member.name}
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-800">{member.name || '—'}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={10} /> {member.email || member.mobile || '—'}
                          </p>
                          {member.mobile && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone size={10} /> {member.mobile}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          member.role === 'admin'
                            ? 'bg-purple-100 text-[#985991] border-purple-200'
                            : 'bg-blue-50 text-blue-600 border-blue-200'
                        }`}
                      >
                        {member.role === 'admin' ? 'Admin' : 'Driver'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(member)}
                          disabled={togglingId === member._id}
                          className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors shrink-0 ${
                            member.isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${
                              member.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-xs text-gray-600">
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                      {formatDateTime(member.createdAt)}
                    </td>
                    <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                      {member.lastLoginAt ? formatDateTime(member.lastLoginAt) : 'Never'}
                    </td>
                    <td className="p-4 text-right relative" ref={menuOpenId === member._id ? menuRef : null}>
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === member._id ? null : member._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {menuOpenId === member._id && (
                        <div className="absolute right-4 top-12 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                          <button
                            onClick={() => openProfile(member._id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <User size={14} /> View profile
                          </button>
                          <button
                            onClick={() => handleToggleStatus(member)}
                            disabled={togglingId === member._id}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            {member.isActive ? 'Deactivate' : 'Activate'}
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

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Add Team Member</h3>
                <p className="text-xs text-gray-500">They will log in with OTP using this mobile number.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
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
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none bg-white"
                >
                  <option value="admin">Admin</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              {addError && (
                <p className="text-sm text-red-500">{addError}</p>
              )}
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

      {showProfileModal && (
        <ProfileViewModal
          userId={profileUserId}
          onClose={() => { setShowProfileModal(false); setProfileUserId(null); }}
        />
      )}
    </div>
  );
};

export default Admins;
