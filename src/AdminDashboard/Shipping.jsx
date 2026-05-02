import React, { useEffect, useMemo, useState } from 'react';
import {
  Truck,
  MapPin,
  Search,
  Printer,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle,
  Box,
} from 'lucide-react';
import api from '../services/apiClient';

const Shipping = () => {
  const [activeTab, setActiveTab] = useState('inTransit');
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({
    inTransit: 0,
    pendingPickup: 0,
    delivered: { week: 0, month: 0 },
    exceptions: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [calculatorForm, setCalculatorForm] = useState({
    pincodeFrom: '460001',
    pincodeTo: '',
    weight: '',
  });
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState('');
  const [rateResult, setRateResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchShipments = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/admin/shipments');
        if (!mounted) return;
        setMetrics(res.data?.metrics || {
          inTransit: 0,
          pendingPickup: 0,
          delivered: { week: 0, month: 0 },
          exceptions: 0,
        });
        setOrders(Array.isArray(res.data?.orders) ? res.data.orders : []);
      } catch (fetchErr) {
        if (!mounted) return;
        setError(fetchErr?.response?.data?.message || 'Failed to load shipment data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchShipments();
    return () => {
      mounted = false;
    };
  }, []);

  const getShipmentBucket = (order) => {
    const status = String(order.orderStatus || '').toLowerCase();
    const paymentStatus = String(order.paymentStatus || '').toLowerCase();
    if (status === 'cancelled' || paymentStatus === 'failed') return 'exception';
    if (status === 'delivered') return 'delivered';
    if (['shipped', 'dispatched'].includes(status)) return 'inTransit';
    if (['pending', 'confirmed', 'assigned', 'processing'].includes(status)) return 'pending';
    return 'other';
  };

  const getStatusMeta = (order) => {
    const bucket = getShipmentBucket(order);
    if (bucket === 'delivered') {
      return { label: 'Delivered', progress: 100, color: 'green' };
    }
    if (bucket === 'inTransit') {
      return { label: 'In Transit', progress: 70, color: 'blue' };
    }
    if (bucket === 'pending') {
      return { label: 'Processing', progress: 25, color: 'orange' };
    }
    if (bucket === 'exception') {
      return { label: 'Exception', progress: 35, color: 'red' };
    }
    return { label: String(order.orderStatus || 'Unknown'), progress: 20, color: 'gray' };
  };

  const filteredShipments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const bucket = getShipmentBucket(order);
      const matchesTab = activeTab === 'all' || bucket === activeTab;
      const orderId = String(order.orderId || order._id || '').toLowerCase();
      const customer = String(order.customer?.name || '').toLowerCase();
      const destination = String(order.destination || '').toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        orderId.includes(normalizedSearch) ||
        customer.includes(normalizedSearch) ||
        destination.includes(normalizedSearch);
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchTerm]);

  const handleCalculatorChange = (event) => {
    const { name, value } = event.target;
    setCalculatorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckRates = async (event) => {
    event.preventDefault();
    try {
      setRateLoading(true);
      setRateError('');
      setRateResult(null);
      const payload = {
        pincodeFrom: calculatorForm.pincodeFrom.trim(),
        pincodeTo: calculatorForm.pincodeTo.trim(),
        weight: Number(calculatorForm.weight),
      };
      const res = await api.post('/admin/shipping/calculate-rate', payload);
      setRateResult(res.data?.result || null);
    } catch (rateErr) {
      setRateError(rateErr?.response?.data?.message || 'Failed to fetch shipping rate.');
    } finally {
      setRateLoading(false);
    }
  };

  const tabs = [
    { key: 'inTransit', label: 'In Transit' },
    { key: 'pending', label: 'Pending' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'exception', label: 'Exception' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Shipping & Logistics</h2>
          <p className="text-gray-500 text-sm">Track shipments and manage courier partners.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#985991] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#7A4774] shadow-lg shadow-purple-100 transition-all active:scale-95">
          <Printer size={18} /> Print Manifest
        </button>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Truck size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">In Transit</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.inTransit}</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Clock size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Pending Pickup</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.pendingPickup}</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Delivered (Wk)</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.delivered?.week || 0}</h3>
              <p className="text-[11px] text-gray-400">Month: {metrics.delivered?.month || 0}</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-red-50 text-red-500 rounded-xl"><AlertTriangle size={24}/></div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Exceptions</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.exceptions}</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: SHIPMENT TABLE (Wider) --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
           
           {/* Tabs & Search */}
           <div className="p-5 border-b border-gray-100 space-y-4">
              <div className="flex gap-4 border-b border-gray-100">
                {tabs.map((tab) => (
                   <button 
                     key={tab.key}
                     onClick={() => setActiveTab(tab.key)}
                     className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-[#985991] text-[#985991]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                   >
                     {tab.label}
                   </button>
                ))}
              </div>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search by Order ID, Customer..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#985991]"
                 />
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                    <tr>
                       <th className="p-4">Shipment Details</th>
                       <th className="p-4">Carrier</th>
                       <th className="p-4">Status & ETA</th>
                       <th className="p-4 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {loading && (
                      <tr>
                        <td className="p-4 text-sm text-gray-500" colSpan={4}>Loading shipments...</td>
                      </tr>
                    )}
                    {!loading && error && (
                      <tr>
                        <td className="p-4 text-sm text-red-600" colSpan={4}>{error}</td>
                      </tr>
                    )}
                    {!loading && !error && filteredShipments.length === 0 && (
                      <tr>
                        <td className="p-4 text-sm text-gray-500" colSpan={4}>No shipments found for current filters.</td>
                      </tr>
                    )}
                    {!loading && !error && filteredShipments.map((ship) => {
                       const statusMeta = getStatusMeta(ship);
                       const etaText = ship.eta
                         ? new Date(ship.eta).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                         : statusMeta.label === 'Delivered'
                           ? 'Delivered'
                           : 'N/A';
                       return (
                       <tr key={ship._id} className="hover:bg-gray-50 group">
                          <td className="p-4">
                             <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 text-[#985991] rounded-lg"><Box size={20}/></div>
                                <div>
                                   <p className="font-bold text-gray-800">#{ship.orderId}</p>
                                   <p className="text-xs text-gray-500">{ship.customer?.name || 'Unknown'}</p>
                                   <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {ship.destination}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-4">
                             <p className="font-medium text-gray-700">Assigned Courier</p>
                             <p className="text-xs text-[#985991] font-mono">TBD</p>
                          </td>
                          <td className="p-4 min-w-[150px]">
                             <div className="flex justify-between text-xs mb-1">
                                <span className={`font-bold ${
                                  statusMeta.color === 'red'
                                    ? 'text-red-500'
                                    : statusMeta.color === 'green'
                                      ? 'text-green-600'
                                      : statusMeta.color === 'orange'
                                        ? 'text-orange-500'
                                        : 'text-blue-600'
                                }`}>{statusMeta.label}</span>
                                <span className="text-gray-500">{etaText}</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    statusMeta.color === 'red'
                                      ? 'bg-red-500'
                                      : statusMeta.color === 'green'
                                        ? 'bg-green-500'
                                        : statusMeta.color === 'orange'
                                          ? 'bg-orange-500'
                                          : 'bg-blue-500'
                                  }`}
                                  style={{width: `${statusMeta.progress}%`}}
                                ></div>
                             </div>
                          </td>
                          <td className="p-4 text-right">
                             <button className="p-2 text-gray-400 hover:text-[#985991] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                                <ExternalLink size={16}/>
                             </button>
                          </td>
                       </tr>
                    )})}
                 </tbody>
              </table>
           </div>
        </div>

        {/* --- RIGHT: SIDEBAR INFO --- */}
        <div className="space-y-6">
           
           {/* Shipping Calculator */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Truck size={18} className="text-[#985991]"/> Rate Calculator
              </h3>
              <form className="space-y-3" onSubmit={handleCheckRates}>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode (From)</label>
                    <input
                      type="text"
                      name="pincodeFrom"
                      value={calculatorForm.pincodeFrom}
                      onChange={handleCalculatorChange}
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-[#985991] outline-none"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode (To)</label>
                    <input
                      type="text"
                      name="pincodeTo"
                      value={calculatorForm.pincodeTo}
                      onChange={handleCalculatorChange}
                      placeholder="e.g. 400001"
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-[#985991] outline-none"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="weight"
                      value={calculatorForm.weight}
                      onChange={handleCalculatorChange}
                      placeholder="0.5"
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-[#985991] outline-none"
                    />
                 </div>
                 <button
                   type="submit"
                   disabled={rateLoading}
                   className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-black mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                    {rateLoading ? 'Checking...' : 'Check Rates'}
                 </button>
                 {rateError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">{rateError}</p>
                 )}
                 {rateResult && (
                  <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-900">
                    <p><span className="font-semibold">Courier:</span> {rateResult.courier}</p>
                    <p><span className="font-semibold">Rate:</span> ₹{rateResult.rate}</p>
                    <p><span className="font-semibold">Estimated Days:</span> {rateResult.estimatedDays}</p>
                  </div>
                 )}
              </form>
           </div>

           {/* Carrier Performance */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Carrier Performance</h3>
              <div className="space-y-4">
                 {[
                    { name: "BlueDart", rating: "4.8", color: "bg-blue-600", speed: "Fast" },
                    { name: "Delhivery", rating: "4.5", color: "bg-red-500", speed: "Avg" },
                    { name: "FedEx", rating: "4.9", color: "bg-purple-600", speed: "Fast" }
                 ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${c.color} text-white flex items-center justify-center text-xs font-bold`}>
                             {c.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{c.name}</p>
                             <p className="text-xs text-gray-500">{c.rating} ★ Rating</p>
                          </div>
                       </div>
                       <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{c.speed}</span>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default Shipping;