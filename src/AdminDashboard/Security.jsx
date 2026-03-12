import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Key, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  LogOut, 
  Eye, 
  EyeOff,
  History,
  Save
} from 'lucide-react';

const Security = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  // Mock Active Sessions
  const SESSIONS = [
    { id: 1, device: "Windows PC · Chrome", ip: "192.168.1.12", location: "Indore, India", active: "Current Session", icon: Globe, status: "green" },
    { id: 2, device: "iPhone 13 · Safari", ip: "45.22.19.11", location: "Mumbai, India", active: "Active 2h ago", icon: Smartphone, status: "gray" },
    { id: 3, device: "MacBook Pro · Firefox", ip: "102.33.12.05", location: "Bangalore, India", active: "Active 1d ago", icon: Globe, status: "gray" },
  ];

  // Mock Login History
  const LOGIN_HISTORY = [
    { id: 1, event: "Successful Login", date: "Oct 25, 2024, 10:30 AM", ip: "192.168.1.12", location: "Indore, IN", status: "Success" },
    { id: 2, event: "Successful Login", date: "Oct 24, 2024, 09:15 AM", ip: "45.22.19.11", location: "Mumbai, IN", status: "Success" },
    { id: 3, event: "Failed Attempt (Wrong Password)", date: "Oct 23, 2024, 04:30 AM", ip: "185.22.11.01", location: "Moscow, RU", status: "Failed" },
    { id: 4, event: "Password Changed", date: "Oct 20, 2024, 02:20 PM", ip: "192.168.1.12", location: "Indore, IN", status: "Alert" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Security Center 
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
               <Shield size={12}/> Protected
            </span>
          </h2>
          <p className="text-gray-500 text-sm">Manage password, 2FA, and monitor active sessions.</p>
        </div>
      </div>

      {/* --- SECURITY HEALTH CARD --- */}
      <div className="bg-gradient-to-r from-[#985991] to-[#7A4774] rounded-2xl p-6 text-white shadow-lg shadow-purple-200 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-400/30" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="22" className="text-white" />
               </svg>
               <span className="absolute text-xl font-bold">90%</span>
            </div>
            <div>
               <h3 className="text-xl font-bold">Security Score: Strong</h3>
               <p className="text-purple-100 text-sm opacity-90 max-w-md mt-1">
                  Your account is well protected. Enabling 2FA on all admin accounts is recommended for maximum safety.
               </p>
            </div>
         </div>
         <button className="bg-white text-[#985991] px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-gray-50 transition-colors">
            Run Security Check
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* --- 1. AUTHENTICATION SETTINGS --- */}
         <div className="space-y-6">
            
            {/* Change Password */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Key size={18} className="text-[#985991]"/> Change Password
               </h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                     <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                        <div className="relative">
                           <input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Min 8 chars" 
                              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" 
                           />
                           <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                           </button>
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New</label>
                        <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#985991] outline-none" />
                     </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                     <button className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2">
                        <Save size={16} /> Update Password
                     </button>
                  </div>
               </div>
            </div>

            {/* Two-Factor Auth */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Smartphone size={18} className="text-[#985991]"/> Two-Factor Authentication
                     </h3>
                     <p className="text-sm text-gray-500 mt-1 max-w-sm">
                        Secure your account with an extra layer of security using SMS or an Authenticator App.
                     </p>
                  </div>
                  <div 
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${twoFactor ? 'bg-[#985991]' : 'bg-gray-300'}`}
                  >
                     <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
               </div>
               
               {twoFactor && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-3">
                     <div className="bg-white p-2 rounded-lg text-[#985991] shadow-sm">
                        <CheckCircle size={20} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-gray-800">2FA is Enabled</p>
                        <p className="text-xs text-gray-500">Code sent to +91 98******10</p>
                     </div>
                     <button className="ml-auto text-xs font-bold text-[#985991] hover:underline">Configure</button>
                  </div>
               )}
            </div>

         </div>

         {/* --- 2. ACTIVITY & SESSIONS --- */}
         <div className="space-y-6">
            
            {/* Active Sessions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Where you're logged in</h3>
                  <button className="text-xs text-red-500 font-medium hover:underline border border-red-100 px-2 py-1 rounded bg-red-50">Log out all devices</button>
               </div>
               <div className="space-y-4">
                  {SESSIONS.map((session) => (
                     <div key={session.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                              <session.icon size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-800">{session.device}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                 <span>{session.location}</span>
                                 <span>•</span>
                                 <span>{session.ip}</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           {session.status === 'green' ? (
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Active
                              </span>
                           ) : (
                              <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Revoke Session">
                                 <LogOut size={16} />
                              </button>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Login History */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <History size={18} className="text-gray-400"/> Recent Login Activity
               </h3>
               <div className="space-y-0">
                  {LOGIN_HISTORY.map((log, index) => (
                     <div key={index} className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className={`mt-1 w-2 h-2 rounded-full ${
                           log.status === 'Success' ? 'bg-green-500' : 
                           log.status === 'Failed' ? 'bg-red-500' : 'bg-orange-400'
                        }`}></div>
                        <div className="flex-1">
                           <div className="flex justify-between">
                              <p className={`text-sm font-medium ${
                                 log.status === 'Failed' ? 'text-red-600' : 'text-gray-700'
                              }`}>{log.event}</p>
                              <span className="text-xs text-gray-400">{log.date}</span>
                           </div>
                           <p className="text-xs text-gray-500 mt-0.5">
                              IP: {log.ip} <span className="mx-1 text-gray-300">|</span> {log.location}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="w-full text-center text-xs text-[#985991] font-bold mt-4 hover:underline">View Full Audit Log</button>
            </div>

         </div>

      </div>
    </div>
  );
};

export default Security;