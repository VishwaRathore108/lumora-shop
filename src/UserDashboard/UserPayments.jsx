import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Smartphone, 
  CheckCircle, 
  Shield, 
  MoreVertical,
  X,
  Wallet
} from 'lucide-react';

const UserPayments = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('card'); // 'card' or 'upi'

  // Mock Saved Cards
  const [cards, setCards] = useState([
    {
      id: 1,
      type: "Visa",
      number: "•••• •••• •••• 4242",
      holder: "ANANYA SHARMA",
      expiry: "12/26",
      gradient: "from-[#985991] to-[#B87AB2]", // Brand Gradient
      isDefault: true
    },
    {
      id: 2,
      type: "Mastercard",
      number: "•••• •••• •••• 8890",
      holder: "ANANYA SHARMA",
      expiry: "09/25",
      gradient: "from-gray-700 to-gray-900", // Black/Dark Gradient
      isDefault: false
    }
  ]);

  // Mock UPI IDs
  const [upis, setUpis] = useState([
    { id: 1, provider: "Google Pay", vpa: "ananya@oksbi", isDefault: true },
    { id: 2, provider: "PhonePe", vpa: "ananya@ybl", isDefault: false }
  ]);

  const removeCard = (id) => {
    if(window.confirm("Remove this card?")) setCards(cards.filter(c => c.id !== id));
  };

  const removeUpi = (id) => {
    if(window.confirm("Remove this UPI ID?")) setUpis(upis.filter(u => u.id !== id));
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Payment Methods
            <span className="bg-green-50 text-green-600 text-[10px] px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
               <Shield size={10}/> Secure 256-bit SSL
            </span>
          </h2>
          <p className="text-gray-500 text-sm">Manage your saved cards and UPI IDs for faster checkout.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-transform active:scale-95"
        >
          <Plus size={18} /> Add New Method
        </button>
      </div>

      {/* --- SAVED CARDS SECTION --- */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
           <CreditCard size={20} className="text-[#985991]"/> Credit & Debit Cards
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {cards.map((card) => (
             <div key={card.id} className={`relative rounded-3xl p-6 text-white shadow-xl overflow-hidden bg-gradient-to-br ${card.gradient} transition-transform hover:-translate-y-1`}>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="flex flex-col">
                      <span className="text-xs opacity-80 font-medium">Current Balance</span>
                      <span className="text-lg font-bold">****</span> 
                   </div>
                   <span className="font-serif italic text-xl font-bold opacity-90">{card.type}</span>
                </div>

                <div className="space-y-4 relative z-10">
                   <p className="text-2xl font-mono tracking-widest drop-shadow-md">{card.number}</p>
                   
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] opacity-70 uppercase tracking-wider">Card Holder</p>
                         <p className="text-sm font-bold tracking-wide">{card.holder}</p>
                      </div>
                      <div>
                         <p className="text-[10px] opacity-70 uppercase tracking-wider">Expires</p>
                         <p className="text-sm font-bold tracking-wide">{card.expiry}</p>
                      </div>
                   </div>
                </div>

                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                   {card.isDefault && (
                      <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold border border-white/20 flex items-center gap-1">
                         <CheckCircle size={10}/> Primary
                      </div>
                   )}
                   <button onClick={() => removeCard(card.id)} className="p-1.5 bg-white/10 hover:bg-white/30 rounded-lg text-white transition-colors">
                      <Trash2 size={14}/>
                   </button>
                </div>
             </div>
           ))}

           {/* Add New Card Slot */}
           <button 
             onClick={() => { setActiveTab('card'); setShowModal(true); }}
             className="rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 min-h-[220px] text-gray-400 hover:border-[#985991] hover:text-[#985991] hover:bg-purple-50/30 transition-all group"
           >
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                 <Plus size={24}/>
              </div>
              <span className="font-bold text-sm">Add New Card</span>
           </button>
        </div>
      </div>

      {/* --- UPI SECTION --- */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
           <Smartphone size={20} className="text-[#985991]"/> UPI & Wallets
        </h3>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           {upis.map((upi, index) => (
              <div key={upi.id} className={`p-6 flex items-center justify-between ${index !== upis.length -1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                       <Wallet size={24}/>
                    </div>
                    <div>
                       <p className="font-bold text-gray-800">{upi.provider}</p>
                       <p className="text-sm text-gray-500">{upi.vpa}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    {upi.isDefault ? (
                       <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Default</span>
                    ) : (
                       <button className="text-xs font-bold text-gray-400 hover:text-[#985991]">Set Default</button>
                    )}
                    <button onClick={() => removeUpi(upi.id)} className="text-gray-400 hover:text-red-500">
                       <Trash2 size={18}/>
                    </button>
                 </div>
              </div>
           ))}
           <div 
             onClick={() => { setActiveTab('upi'); setShowModal(true); }}
             className="p-4 bg-gray-50 text-center text-sm font-bold text-[#985991] cursor-pointer hover:bg-purple-50 transition-colors"
           >
              + Link New UPI ID
           </div>
        </div>
      </div>

      {/* --- ADD METHOD MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">Add Payment Method</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 bg-gray-50 m-6 mb-2 rounded-xl border border-gray-200">
               <button 
                 onClick={() => setActiveTab('card')}
                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'card' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
               >
                 Card
               </button>
               <button 
                 onClick={() => setActiveTab('upi')}
                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'upi' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
               >
                 UPI
               </button>
            </div>

            {/* Form Body */}
            <div className="px-8 pb-8 pt-4 space-y-4">
               {activeTab === 'card' ? (
                 <>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                       <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:border-[#985991]"/>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"/>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                          <input type="password" placeholder="123" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"/>
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Holder Name</label>
                       <input type="text" placeholder="Name on card" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"/>
                    </div>
                 </>
               ) : (
                 <>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">UPI ID / VPA</label>
                       <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                          <input type="text" placeholder="username@upi" className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:border-[#985991]"/>
                       </div>
                       <p className="text-[10px] text-gray-400 mt-2">We will verify this UPI ID by sending a small request.</p>
                    </div>
                 </>
               )}

               <button className="w-full bg-[#985991] text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-[#7A4774] transition-all mt-4">
                  Save Payment Method
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UserPayments;