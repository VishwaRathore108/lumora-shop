import React, { useState } from 'react';
import { 
  Bell, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Settings, 
  Trash2, 
  Check, 
  Clock,
  ShoppingBag
} from 'lucide-react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  // Mock Notification Data
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: "order", 
      title: "New Order #ORD-7782", 
      message: "Ananya Sharma placed an order for ₹2,598.", 
      time: "2 mins ago", 
      read: false, 
      priority: "high",
      action: "View Order"
    },
    { 
      id: 2, 
      type: "alert", 
      title: "Low Stock Alert: Radiant Serum", 
      message: "Inventory is below 10 units. Restock immediately.", 
      time: "1 hour ago", 
      read: false, 
      priority: "critical",
      action: "Restock"
    },
    { 
      id: 3, 
      type: "customer", 
      title: "New Customer Registered", 
      message: "Rahul Verma created an account.", 
      time: "3 hours ago", 
      read: true, 
      priority: "normal",
      action: null
    },
    { 
      id: 4, 
      type: "system", 
      title: "System Update Successful", 
      message: "The dashboard was updated to v2.4.0 successfully.", 
      time: "Yesterday", 
      read: true, 
      priority: "low",
      action: "View Changelog"
    },
    { 
      id: 5, 
      type: "order", 
      title: "Order Delivered", 
      message: "Order #ORD-7720 has been delivered to Mumbai.", 
      time: "Yesterday", 
      read: true, 
      priority: "normal",
      action: null
    },
    { 
      id: 6, 
      type: "alert", 
      title: "Payment Failed", 
      message: "Transaction for Order #ORD-7785 failed via UPI.", 
      time: "2 days ago", 
      read: true, 
      priority: "high",
      action: "Check Logs"
    },
  ]);

  // Helper: Get Icon based on type
  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBag size={20} className="text-blue-600" />;
      case 'alert': return <AlertTriangle size={20} className="text-red-500" />;
      case 'customer': return <User size={20} className="text-[#985991]" />;
      case 'system': return <Settings size={20} className="text-gray-600" />;
      default: return <Bell size={20} className="text-gray-600" />;
    }
  };

  // Helper: Get Background Color for Icon
  const getBgColor = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-50';
      case 'alert': return 'bg-red-50';
      case 'customer': return 'bg-purple-50';
      case 'system': return 'bg-gray-100';
      default: return 'bg-gray-50';
    }
  };

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return n.type === activeTab.toLowerCase(); // 'Order', 'Alert', etc.
  });

  // Handlers
  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleReadStatus = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Notifications 
            <span className="bg-[#985991] text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
               {notifications.filter(n => !n.read).length} New
            </span>
          </h2>
          <p className="text-gray-500 text-sm">Stay updated with orders, alerts, and system messages.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#985991] transition-colors"
          >
            <CheckCircle size={16} /> Mark all as read
          </button>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* --- LEFT SIDEBAR (Filters) --- */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-4">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Filters</h3>
           <div className="space-y-1">
              {['All', 'Unread', 'Order', 'Alert', 'System'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab 
                      ? 'bg-white shadow-sm text-[#985991]' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                   }`}
                 >
                    <span>{tab}</span>
                    {tab === 'Unread' && (
                       <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                          {notifications.filter(n => !n.read).length}
                       </span>
                    )}
                 </button>
              ))}
           </div>
        </div>

        {/* --- RIGHT CONTENT (List) --- */}
        <div className="flex-1 flex flex-col">
           
           {/* List Header */}
           <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <span className="text-sm font-bold text-gray-700">{activeTab} Notifications</span>
              <button className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                 <Trash2 size={12}/> Clear History
              </button>
           </div>

           {/* Notification Items */}
           <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {filteredNotifications.length > 0 ? (
                 filteredNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${
                         notif.read ? 'bg-white border-transparent' : 'bg-purple-50/30 border-purple-100'
                      }`}
                    >
                       {/* Icon */}
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                          {getIcon(notif.type)}
                       </div>

                       {/* Content */}
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className={`text-sm ${notif.read ? 'font-semibold text-gray-700' : 'font-bold text-gray-900'}`}>
                                {notif.title}
                                {!notif.read && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>}
                             </h4>
                             <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                                <Clock size={10}/> {notif.time}
                             </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                             {notif.message}
                          </p>

                          {/* Action Buttons */}
                          {notif.action && (
                             <div className="mt-3">
                                <button className="text-xs font-bold text-[#985991] bg-purple-50 hover:bg-[#985991] hover:text-white px-3 py-1.5 rounded-md transition-colors">
                                   {notif.action}
                                </button>
                             </div>
                          )}
                       </div>

                       {/* Hover Actions */}
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                          <button 
                            onClick={() => toggleReadStatus(notif.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" 
                            title={notif.read ? "Mark unread" : "Mark read"}
                          >
                             <Check size={16}/>
                          </button>
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" 
                            title="Delete"
                          >
                             <Trash2 size={16}/>
                          </button>
                       </div>

                    </div>
                 ))
              ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                       <Bell size={24} className="text-gray-300"/>
                    </div>
                    <h3 className="text-gray-800 font-bold">All caught up!</h3>
                    <p className="text-gray-500 text-sm mt-1">No new notifications in this folder.</p>
                 </div>
              )}
           </div>

        </div>

      </div>
    </div>
  );
};

export default Notifications;