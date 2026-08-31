import React, { useState, useEffect } from 'react';
import { CreditCard, Users, ShoppingCart, Package, DollarSign, Settings, Download, Edit, Trash2, CheckCircle, XCircle, Activity, Globe, Eye, UserPlus, RefreshCw, Mail } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { ALL_PRODUCTS } from '../data';

export default function AdminDashboard({ showToast }: { showToast: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // LocalStorage Data
  const [users, setUsers] = useState<any[]>([]); // Customers list
  const [orders, setOrders] = useState<any[]>([]); // Orders list
  const [pageViews, setPageViews] = useState<any[]>([]); // Traffic log
  const [totalClicks, setTotalClicks] = useState(0);
  
  const [payouts, setPayouts] = useState<any[]>([]);
  
  const [products, setProducts] = useState(() => {
    const custom = JSON.parse(localStorage.getItem('CUSTOM_PRODUCTS') || '[]');
    return [...ALL_PRODUCTS, ...custom];
  });
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [paymentConfig, setPaymentConfig] = useState({
    paystack: localStorage.getItem('paystack_public_key') || '',
    flutterwave: localStorage.getItem('flutterwave_public_key') || '',
    crypto: localStorage.getItem('crypto_wallet') || '',
    pi: localStorage.getItem('pi_wallet') || ''
  });
  
  const [settings, setSettings] = useState({
    freeQueries: 3,
    referralCommission: 20,
    contactEmail: 'goyedagosmess@gmail.com'
  });

  const [excludeMyClicks, setExcludeMyClicks] = useState(localStorage.getItem('exclude_my_clicks') === 'true');

  // Modals for full CRM
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const loadLocalData = () => {
    const localUsers = JSON.parse(localStorage.getItem('customers_list') || '[]');
    setUsers(localUsers);
    
    const localOrders = JSON.parse(localStorage.getItem('orders_list') || '[]');
    setOrders(localOrders);
    
    let localTraffic = JSON.parse(localStorage.getItem('global_traffic') || localStorage.getItem('traffic_log') || '[]');
    const exclude = localStorage.getItem('exclude_my_clicks') === 'true';
    if (exclude) {
      localTraffic = localTraffic.filter((entry: any) => 
        entry.is_admin !== true && 
        entry.isAdmin !== true && 
        !String(entry.customerName || entry.customer_name).includes('Admin')
      );
    }
    setPageViews(localTraffic);
    const savedClicks = parseInt(localStorage.getItem('total_clicks_global') || localStorage.getItem('total_clicks') || '0');
    setTotalClicks(Math.max(savedClicks, localTraffic.length));
  };

  useEffect(() => {
    loadLocalData();
    
    // Real-time Firestore stats listener
    const unsubStats = onSnapshot(doc(db, 'stats_global', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.total_clicks !== undefined && data.total_clicks > 0) {
          setTotalClicks(data.total_clicks);
        }
      }
    }, (e) => console.warn('Firestore stats snapshot warning:', e));

    // Real-time Firestore global traffic log listener across 190+ countries
    const unsubTraffic = onSnapshot(collection(db, 'traffic_log_global'), (snapshot) => {
      const logs: any[] = [];
      snapshot.forEach(docSnap => {
        logs.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort descending by timestamp / createdAt
      logs.sort((a, b) => new Date(b.timestamp || b.createdAt || 0).getTime() - new Date(a.timestamp || a.createdAt || 0).getTime());
      
      const exclude = localStorage.getItem('exclude_my_clicks') === 'true';
      const filtered = exclude
        ? logs.filter((entry: any) => !entry.is_admin && !entry.isAdmin && !String(entry.customerName || entry.customer_name).includes('Admin'))
        : logs;

      if (filtered.length > 0) {
        setPageViews(filtered);
        setTotalClicks(prev => Math.max(prev, filtered.length));
      } else {
        loadLocalData();
      }
    }, (e) => console.warn('Firestore global traffic log snapshot warning:', e));

    const unsubPayouts = onSnapshot(collection(db, 'payout_requests'), (snap) => {
      setPayouts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    return () => {
      unsubStats();
      unsubTraffic();
      unsubPayouts();
    };
  }, [excludeMyClicks]);

  const handleToggleExclude = () => {
    const newVal = !excludeMyClicks;
    setExcludeMyClicks(newVal);
    localStorage.setItem('exclude_my_clicks', newVal.toString());
    if (newVal) {
      // When turning ON, remove admin clicks from count - Recalculate
      const trafficLog = JSON.parse(localStorage.getItem('traffic_log') || '[]');
      const filtered = trafficLog.filter((entry: any) => 
        entry.is_admin !== true && 
        entry.isAdmin !== true && 
        entry.customerName !== 'Admin (Owner)' &&
        entry.customer_name !== 'Admin (Owner)' &&
        entry.location !== 'Admin'
      );
      localStorage.setItem('traffic_log', JSON.stringify(filtered));
      localStorage.setItem('total_clicks', filtered.length.toString());
      setTotalClicks(filtered.length);
      setPageViews(filtered);
      showToast('Admin clicks excluded! Count recalculated!');
    } else {
      showToast('Exclude My Clicks is now OFF');
    }
  };

  const handleResetClicks = async () => {
    localStorage.setItem('total_clicks', '0');
    localStorage.setItem('traffic_log', '[]');
    setTotalClicks(0);
    setPageViews([]);
    try {
      await setDoc(doc(db, 'stats_global', 'global'), { total_clicks: 0 }, { merge: true });
    } catch (e) {}
    showToast('✅ Clicks reset to 0 - Admin clicks excluded - True location will show Lagos for you when exclude OFF');
  };

  const handleAdminTestingUnlock = () => {
    localStorage.setItem('sirwise_paid', 'true');
    localStorage.setItem('payment_verified', 'true');
    localStorage.setItem('academy_unlocked', 'true');
    localStorage.setItem('is_admin', 'true');
    localStorage.setItem('goye_academy_progress_guest', JSON.stringify({ isEnrolled: true, progress: [1, 2, 3, 4] }));
    alert('🔓 Admin unlocked 100% testing - customers still need $49.99');
    console.log('Admin unlocked 100% testing mode');
    window.location.hash = '#academy';
  };

  const handleResetRegistered = () => {
    localStorage.setItem('registered_customers', '0');
    localStorage.setItem('customers_list', '[]');
    setUsers([]);
    showToast('Registered customers cleared');
  };

  const handleClearTraffic = () => {
    localStorage.setItem('traffic_log', '[]');
    setPageViews([]);
    showToast('Traffic log cleared');
  };

  const saveSettings = () => {
    setDoc(doc(db, 'settings', 'global'), settings).then(() => showToast('Settings saved!'));
  };

  const savePaymentConfig = () => {
    setDoc(doc(db, 'settings', 'payments'), paymentConfig).then(() => {
      localStorage.setItem('PAYMENT_CONFIG', JSON.stringify(paymentConfig));
      localStorage.setItem('paystack_public_key', paymentConfig.paystack);
      localStorage.setItem('flutterwave_public_key', paymentConfig.flutterwave);
      localStorage.setItem('crypto_wallet', paymentConfig.crypto);
      localStorage.setItem('pi_wallet', paymentConfig.pi);
      showToast('Payment config saved & broadcasted!');
    });
  };

  const saveProduct = () => {
    if (!editingProduct.name || !editingProduct.price) return showToast('Name and price required');
    const newProduct = { ...editingProduct, id: editingProduct.id || 'custom_' + Date.now() };
    
    const updated = products.map(p => p.id === newProduct.id ? newProduct : p);
    if (!products.find(p => p.id === newProduct.id)) updated.push(newProduct);
    
    setProducts(updated);
    
    const customOnly = updated.filter(x => x.id.startsWith('custom_'));
    localStorage.setItem('CUSTOM_PRODUCTS', JSON.stringify(customOnly));
    setDoc(doc(db, 'all_products', newProduct.id), newProduct);
    
    setEditingProduct(null);
    showToast('Product saved globally!');
  };

  const exportOrders = () => {
    let csv = 'ID,Customer,Country,Product,Amount,Currency,Method,Status,Date\n';
    orders.forEach(o => {
      csv += `${o.id},${o.customerName},${o.country?.name},${o.productName},${o.amount},${o.currency},${o.method},${o.status},${o.date}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'orders.csv');
    a.click();
  };

  const exportCustomers = () => {
    let csv = 'ID,Pupil,Parent,Country,Age,Email,WhatsApp,Date,Status\n';
    users.forEach(u => {
      csv += `${u.id},${u.pupilName},${u.parentName},${u.country?.name},${u.age},${u.email},${u.whatsapp},${u.date},${u.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'customers.csv');
    a.click();
  };

  const totalGross = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (Number(o.amountUSD || o.amount) || 0), 0);
  
  // Breakdown by Product
  const breakdownByProduct = orders.reduce((acc, o) => {
      if(o.status === 'paid') {
          acc[o.productName] = (acc[o.productName] || 0) + (Number(o.amountUSD || o.amount) || 0);
      }
      return acc;
  }, {} as Record<string, number>);

  const breakdownByCountry = orders.reduce((acc, o) => {
      if(o.status === 'paid' && o.country) {
          const key = `${o.country.flag} ${o.country.name}`;
          acc[key] = (acc[key] || 0) + (Number(o.amountUSD || o.amount) || 0);
      }
      return acc;
  }, {} as Record<string, number>);

  const maskEmail = (email: string) => email ? email.substring(0,3) + '***@' + email.split('@')[1] : '';
  const maskPhone = (phone: string) => phone ? phone.substring(0, phone.length - 4) + '***' + phone.substring(phone.length - 1) : ''; // Just simple masking

  const TABS = [
    { id: 'analytics', icon: Activity, label: 'Analytics Overview' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders & Sales' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'payouts', icon: DollarSign, label: 'Affiliate Payouts' },
    { id: 'settings', icon: Settings, label: 'Site Settings' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 animate-in fade-in duration-500 pb-20">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white">Store Management Suite</h2>
        <p className="text-gray-400">Manage all aspects of your store, access control, and revenue.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 hide-scrollbar">
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition whitespace-nowrap ${isActive ? 'bg-[#FFD700] text-black' : 'bg-[#111] text-gray-400 border border-[#333] hover:text-white'}`}
            >
              <Icon size={18} /> {t.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111] border border-[#333] rounded-2xl p-4 cursor-pointer hover:border-[#FFD700] transition" >
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Eye size={16} className="text-[#3b82f6]" />
                <span className="text-[10px] uppercase font-bold">Total Clicks & Traffic</span>
              </div>
              <div className="text-2xl font-black text-white">
                {totalClicks.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-4 cursor-pointer hover:border-[#FFD700] transition" onClick={() => setShowCustomersModal(true)}>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <UserPlus size={16} className="text-[#10B981]" />
                <span className="text-[10px] uppercase font-bold">Registered Customers</span>
              </div>
              <div className="text-2xl font-black text-white">
                {users.length.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-2xl p-4 cursor-pointer hover:border-[#FFD700] transition" onClick={() => setShowOrdersModal(true)}>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <ShoppingCart size={16} className="text-[#FFD700]" />
                <span className="text-[10px] uppercase font-bold">Completed Orders</span>
              </div>
              <div className="text-2xl font-black text-white">
                {orders.filter(o => o.status === 'paid').length.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#10B981]/10 rounded-full blur-xl"></div>
              <div className="flex items-center gap-2 text-gray-400 mb-2 relative z-10">
                <DollarSign size={16} className="text-[#10B981]" />
                <span className="text-[10px] uppercase font-bold">Gross Revenue</span>
              </div>
              <div className="text-2xl font-black text-[#10B981] relative z-10">
                ${totalGross.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap mb-4 z-5 relative">
              <button onClick={handleAdminTestingUnlock} className="h-[40px] rounded-[8px] border border-[#FFD700] bg-[#FFD700] text-black px-4 flex items-center gap-2 pointer-events-auto cursor-pointer hover:bg-yellow-400 text-xs font-black transition shadow-lg">
                 🔓 Admin Testing Unlock (100%)
              </button>
              <button onClick={handleResetClicks} className="h-[40px] rounded-[8px] border border-red-500 bg-[#111] text-white px-4 flex items-center gap-2 pointer-events-auto cursor-pointer hover:bg-red-500/20 text-xs font-bold transition">
                 🗑️ Reset Clicks to 0
              </button>
              <button onClick={handleResetRegistered} className="h-[40px] rounded-[8px] border border-red-500 bg-[#111] text-white px-4 flex items-center gap-2 pointer-events-auto cursor-pointer hover:bg-red-500/20 text-xs font-bold transition">
                 🗑️ Reset Registered to 0
              </button>
              <button onClick={handleClearTraffic} className="h-[40px] rounded-[8px] border border-red-500 bg-[#111] text-white px-4 flex items-center gap-2 pointer-events-auto cursor-pointer hover:bg-red-500/20 text-xs font-bold transition">
                 🗑️ Clear Live Traffic Log
              </button>
              
              <div className="flex items-center gap-2 ml-auto">
                 <span className="text-gray-400 text-xs font-bold uppercase">Exclude My Clicks:</span>
                 <button onClick={handleToggleExclude} className={`w-12 h-6 rounded-full p-1 transition-colors ${excludeMyClicks ? 'bg-[#FFD700]' : 'bg-gray-600'}`}>
                    <div className={`w-4 h-4 bg-black rounded-full transition-transform ${excludeMyClicks ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Revenue Breakdown by Product</h3>
              <div className="space-y-3">
                 {Object.entries(breakdownByProduct).map(([name, val]: [string, any]) => (
                     <div key={name} className="flex justify-between items-center text-sm">
                         <span className="text-gray-400">{name}</span>
                         <span className="text-[#10B981] font-bold">${(val || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                     </div>
                 ))}
                 {Object.keys(breakdownByProduct).length === 0 && <div className="text-gray-500 text-sm">No revenue yet.</div>}
              </div>
            </div>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Revenue Breakdown by Country</h3>
              <div className="space-y-3">
                 {Object.entries(breakdownByCountry).map(([name, val]: [string, any]) => (
                     <div key={name} className="flex justify-between items-center text-sm">
                         <span className="text-gray-400">{name}</span>
                         <span className="text-[#10B981] font-bold">${(val || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                     </div>
                 ))}
                 {Object.keys(breakdownByCountry).length === 0 && <div className="text-gray-500 text-sm">No revenue yet.</div>}
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe /> Live Traffic Activity Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-3 rounded-tl-lg">Location</th>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Page / Product</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Device</th>
                    <th className="p-3 rounded-tr-lg">Excluded?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pageViews.map((v: any, idx: number) => {
                    const isAdminClick = v.is_admin || v.isAdmin || v.customerName === 'Admin (Owner)' || v.customer_name === 'Admin (Owner)' || String(v.customerName || v.customer_name).includes('Admin');
                    const loc = v.location || `${v.flag || '🇳🇬'} ${v.country || 'NG'} (${v.city && v.city !== 'Unknown' && v.city !== 'Ado-Odo' && v.city !== 'Ilare' ? v.city : 'Lagos'})`;
                    return (
                      <tr key={v.id || idx} className="hover:bg-white/[0.02] transition">
                        <td className="p-3 text-white font-bold">{loc}</td>
                        <td className="p-3 text-gray-300 font-medium">{v.customerName || v.customer_name || (isAdminClick ? 'Admin (Owner)' : 'Guest Customer')}</td>
                        <td className="p-3 text-[#3b82f6] font-mono text-xs">{v.path || v.page || '/'}</td>
                        <td className="p-3"><span className="text-yellow-500 text-[10px] border border-yellow-500/50 px-2 py-1 rounded font-bold">Browsing</span></td>
                        <td className="p-3 text-gray-500 text-xs">{v.time || (v.timestamp ? new Date(v.timestamp).toLocaleTimeString() : 'Just now')}</td>
                        <td className="p-3 text-gray-400 text-xs">{v.device || 'Desktop'}</td>
                        <td className="p-3 text-xs">
                          {isAdminClick ? (
                            <span className="text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">Excluded Admin</span>
                          ) : (
                            <span className="text-green-400 font-bold bg-green-950/40 px-2 py-0.5 rounded border border-green-500/30">Customer</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {pageViews.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-500">No traffic data yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><CreditCard /> Payment Gateways Configuration</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Paystack Public Key</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none transition" value={paymentConfig.paystack} onChange={e => setPaymentConfig({...paymentConfig, paystack: e.target.value})} placeholder="pk_live_..." />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Flutterwave Public Key</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none transition" value={paymentConfig.flutterwave} onChange={e => setPaymentConfig({...paymentConfig, flutterwave: e.target.value})} placeholder="FLWPUBK_..." />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">USDC Crypto Wallet Address (TRC20/ERC20)</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none transition" value={paymentConfig.crypto} onChange={e => setPaymentConfig({...paymentConfig, crypto: e.target.value})} placeholder="0x..." />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Pi Network Wallet</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none transition" value={paymentConfig.pi} onChange={e => setPaymentConfig({...paymentConfig, pi: e.target.value})} placeholder="GA..." />
            </div>
          </div>
          <button onClick={savePaymentConfig} className="bg-[#FFD700] hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl mt-6 w-full max-w-xs transition">
            Save Gateways
          </button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-[#FFD700] font-bold flex items-center gap-2"><Users /> Registered Customers</h3>
             <button onClick={exportCustomers} className="flex items-center gap-2 text-sm text-white bg-black border border-[#333] px-3 py-1 rounded hover:border-[#FFD700]">
                 <Download size={14}/> Export CSV
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4 rounded-tl-lg">Pupil Name</th>
                  <th className="p-4">Parent Name</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Contact (Masked)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 text-white font-bold">{u.pupilName || u.name || u.email}</td>
                    <td className="p-4 text-gray-300">{u.parentName || '-'}</td>
                    <td className="p-4">{u.country?.flag || '🌍'} {u.country?.name || 'Unknown'}</td>
                    <td className="p-4 text-gray-400">
                      <div>{maskEmail(u.email)}</div>
                      <div className="text-xs">{maskPhone(u.whatsapp || u.phone)}</div>
                    </td>
                    <td className="p-4">
                      {u.is_verified ? 
                        <span className="px-2 py-1 bg-[#10B981]/20 text-[#10B981] rounded text-[10px] font-bold">Verified</span> : 
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-[10px] font-bold">Pending</span>}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(u.date || u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-gray-500">No customers yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-[#FFD700] font-bold flex items-center gap-2"><ShoppingCart /> Completed Orders</h3>
             <button onClick={exportOrders} className="flex items-center gap-2 text-sm text-white bg-black border border-[#333] px-3 py-1 rounded hover:border-[#FFD700]">
                 <Download size={14}/> Export CSV
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4 rounded-tl-lg">Order ID / Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-xs text-gray-400">{o.ref || o.id}</td>
                    <td className="p-4 text-white font-bold">{o.customerName || maskEmail(o.customerEmail)}</td>
                    <td className="p-4">{o.country?.flag} {o.country?.name}</td>
                    <td className="p-4 text-[#FFD700] font-bold">{o.productName}</td>
                    <td className="p-4 text-[#10B981] font-bold">{o.currency} {o.amount}</td>
                    <td className="p-4 text-gray-400 uppercase text-xs">{o.method}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${o.status==='paid' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(o.date).toLocaleString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={8} className="p-4 text-center text-gray-500">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#FFD700] font-bold flex items-center gap-2"><Package /> Digital Products</h3>
            <button onClick={() => setEditingProduct({})} className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded text-sm">Add Custom Product</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Icon</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 text-2xl">{p.icon}</td>
                    <td className="p-4 text-white font-bold">{p.name}</td>
                    <td className="p-4 text-gray-400 uppercase text-xs">{p.category}</td>
                    <td className="p-4 text-[#10B981] font-bold">${p.price}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => setEditingProduct(p)} className="text-blue-400 hover:text-blue-300 p-2"><Edit size={16}/></button>
                      <button onClick={() => {
                        const updated = products.filter(x => x.id !== p.id);
                        setProducts(updated);
                        const customOnly = updated.filter(x => x.id?.startsWith('custom_'));
                        localStorage.setItem('CUSTOM_PRODUCTS', JSON.stringify(customOnly));
                        showToast('Product deleted!');
                      }} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><Settings /> Site & Access Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Free AI Queries Limit</label>
              <input type="number" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={settings.freeQueries} onChange={e => setSettings({...settings, freeQueries: parseInt(e.target.value) || 0})} />
              <p className="text-[10px] text-gray-500 mt-1">Number of free interactions before requiring paid access.</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Global Referral Commission (%)</label>
              <input type="number" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={settings.referralCommission} onChange={e => setSettings({...settings, referralCommission: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Contact/Support Email</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
            </div>
            <button onClick={saveSettings} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold px-6 py-2 rounded mt-4">
              SAVE SETTINGS
            </button>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#FFD700] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-[#FFD700] font-bold mb-4">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="space-y-4">
              <div><label className="text-xs text-gray-400">Name</label><input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
              <div><label className="text-xs text-gray-400">Icon (Emoji/SVG)</label><input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.icon || ''} onChange={e => setEditingProduct({...editingProduct, icon: e.target.value})} /></div>
              <div>
                <label className="text-xs text-gray-400">Category</label>
                <select className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.category || 'esim'} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                  <option value="esim">eSIM</option>
                  <option value="academy">Academy Course</option>
                  <option value="prompts">AI Prompts</option>
                  <option value="guide">Guide/E-book</option>
                </select>
              </div>
              <div><label className="text-xs text-gray-400">Price (USD)</label><input type="number" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.price || 0} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} /></div>
              <div><label className="text-xs text-gray-400">Description</label><textarea className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}></textarea></div>
              <div><label className="text-xs text-gray-400">Download/Access URL</label><input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.downloadUrl || ''} onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} /></div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-800 text-white py-2 rounded font-bold">Cancel</button>
                <button onClick={saveProduct} className="flex-1 bg-[#FFD700] text-black py-2 rounded font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRM Customer Modal */}
      {showCustomersModal && (
          <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
              <div className="bg-[#111] border border-[#FFD700] rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#FFD700] font-bold flex items-center gap-2"><Users /> Full CRM: Customers</h3>
                    <div className="flex gap-2">
                        <button onClick={exportCustomers} className="text-sm bg-black border border-[#333] px-3 py-1 rounded text-white flex items-center gap-1"><Download size={14}/> Export</button>
                        <button onClick={() => setShowCustomersModal(false)} className="text-gray-400 font-bold ml-2">X</button>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-3">S/N</th>
                                <th className="p-3">Pupil Name</th>
                                <th className="p-3">Parent Name</th>
                                <th className="p-3">Country</th>
                                <th className="p-3">Age</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">WhatsApp</th>
                                <th className="p-3">Slot</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u, i) => (
                                <tr key={u.id} className="hover:bg-white/[0.02]">
                                    <td className="p-3 text-gray-500">{i+1}</td>
                                    <td className="p-3 text-white font-bold">{u.pupilName}</td>
                                    <td className="p-3 text-gray-300">{u.parentName}</td>
                                    <td className="p-3">{u.country?.flag} {u.country?.name}</td>
                                    <td className="p-3">{u.age}</td>
                                    <td className="p-3 text-gray-400">{maskEmail(u.email)}</td>
                                    <td className="p-3 text-gray-400">{maskPhone(u.whatsapp)}</td>
                                    <td className="p-3">{u.slot}</td>
                                    <td className="p-3 text-xs">{new Date(u.date).toLocaleString()}</td>
                                    <td className="p-3"><span className="text-green-500 text-xs">{u.status || 'Registered'}</span></td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan={10} className="p-4 text-center">No customers found.</td></tr>}
                        </tbody>
                    </table>
                 </div>
              </div>
          </div>
      )}

      {/* CRM Orders Modal */}
      {showOrdersModal && (
          <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
              <div className="bg-[#111] border border-[#FFD700] rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#FFD700] font-bold flex items-center gap-2"><ShoppingCart /> Full CRM: Orders</h3>
                    <div className="flex gap-2">
                        <button onClick={exportOrders} className="text-sm bg-black border border-[#333] px-3 py-1 rounded text-white flex items-center gap-1"><Download size={14}/> Export</button>
                        <button onClick={() => setShowOrdersModal(false)} className="text-gray-400 font-bold ml-2">X</button>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Country</th>
                                <th className="p-3">Product</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Currency</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((o) => (
                                <tr key={o.id} className="hover:bg-white/[0.02]">
                                    <td className="p-3 text-gray-500 text-xs font-mono">{o.ref || o.id}</td>
                                    <td className="p-3 text-white font-bold">{o.customerName}</td>
                                    <td className="p-3">{o.country?.flag} {o.country?.name}</td>
                                    <td className="p-3 text-[#FFD700]">{o.productName}</td>
                                    <td className="p-3 text-green-500 font-bold">{o.amount}</td>
                                    <td className="p-3">{o.currency}</td>
                                    <td className="p-3 uppercase text-xs">{o.method}</td>
                                    <td className="p-3"><span className="text-green-500 text-xs">{o.status}</span></td>
                                    <td className="p-3 text-xs text-gray-400">{new Date(o.date).toLocaleString()}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && <tr><td colSpan={9} className="p-4 text-center">No orders found.</td></tr>}
                        </tbody>
                    </table>
                 </div>
              </div>
          </div>
      )}

    </div>
  );
}
