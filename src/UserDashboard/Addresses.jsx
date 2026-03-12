import React, { useState } from 'react';
import { 
  MapPin, 
  Home, 
  Briefcase, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  CheckCircle,
  X 
} from 'lucide-react';

const Addresses = () => {
  const [showModal, setShowModal] = useState(false);

  // Mock Data
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "Ananya Sharma",
      phone: "+91 98765 43210",
      street: "Flat 402, Krishna Heights, Scheme 54",
      city: "Indore",
      state: "Madhya Pradesh",
      zip: "452010",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "Ananya Sharma",
      phone: "+91 98765 43210",
      street: "Tech Park, Cluster C, Ring Road",
      city: "Indore",
      state: "Madhya Pradesh",
      zip: "452001",
      isDefault: false,
    }
  ]);

  const handleDelete = (id) => {
    if(window.confirm("Delete this address?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const setDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
          <p className="text-gray-500 text-sm">Manage your shipping and billing locations.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-transform active:scale-95"
        >
          <Plus size={18} /> Add New Address
        </button>
      </div>

      {/* --- ADDRESS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Render Addresses */}
        {addresses.map((addr) => (
          <div 
            key={addr.id} 
            className={`relative p-6 rounded-3xl border transition-all duration-300 group ${
              addr.isDefault 
                ? "bg-white border-[#985991] shadow-md ring-1 ring-purple-50" 
                : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
             {/* Default Badge */}
             {addr.isDefault && (
               <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100">
                 <CheckCircle size={12} fill="currentColor" className="text-green-200" />
                 Default
               </div>
             )}

             {/* Header: Icon & Type */}
             <div className="flex items-center gap-3 mb-4">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                 addr.type === 'Home' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'
               }`}>
                 {addr.type === 'Home' ? <Home size={18}/> : <Briefcase size={18}/>}
               </div>
               <h3 className="font-bold text-gray-800">{addr.type}</h3>
             </div>

             {/* Address Details */}
             <div className="space-y-1 text-sm text-gray-600 mb-6">
               <p className="font-bold text-gray-900">{addr.name}</p>
               <p>{addr.street}</p>
               <p>{addr.city}, {addr.state} - {addr.zip}</p>
               <p className="pt-2 font-medium">Mobile: {addr.phone}</p>
             </div>

             {/* Footer Actions */}
             <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                {!addr.isDefault ? (
                  <button 
                    onClick={() => setDefault(addr.id)}
                    className="text-xs font-bold text-gray-400 hover:text-[#985991] transition-colors"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-xs font-bold text-[#985991]">Selected</span>
                )}
                
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#985991] hover:bg-purple-50 rounded-lg transition-colors">
                    <Edit size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
             </div>
          </div>
        ))}

        {/* Add New Card (Empty State / Visual Cue) */}
        <button 
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#985991] hover:text-[#985991] hover:bg-purple-50/50 transition-all min-h-[250px] group"
        >
           <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-transform">
             <Plus size={24} />
           </div>
           <span className="font-bold text-sm">Add New Address</span>
        </button>

      </div>

      {/* --- ADD ADDRESS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">Add New Address</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
               
               {/* Type Selector */}
               <div className="flex gap-4 mb-2">
                 {['Home', 'Work', 'Other'].map(type => (
                   <label key={type} className="flex-1 cursor-pointer">
                     <input type="radio" name="addrType" className="peer sr-only" defaultChecked={type === 'Home'} />
                     <div className="text-center py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold peer-checked:bg-[#985991] peer-checked:text-white peer-checked:border-[#985991] transition-all">
                       {type}
                     </div>
                   </label>
                 ))}
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                   <input type="text" placeholder="Receiver's Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                   <input type="tel" placeholder="10-digit mobile" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                 <textarea rows="2" placeholder="House No, Building, Street Area" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"></textarea>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                   <input type="text" placeholder="Indore" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pincode</label>
                   <input type="text" placeholder="452001" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]" />
                 </div>
               </div>

               <div className="flex items-center gap-3 pt-2">
                 <input type="checkbox" id="makeDefault" className="w-5 h-5 accent-[#985991] rounded" />
                 <label htmlFor="makeDefault" className="text-sm text-gray-600 font-medium select-none">Make this my default address</label>
               </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="px-8 py-2.5 bg-[#985991] text-white text-sm font-bold rounded-xl hover:bg-[#7A4774] shadow-md shadow-purple-100">
                Save Address
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Addresses;