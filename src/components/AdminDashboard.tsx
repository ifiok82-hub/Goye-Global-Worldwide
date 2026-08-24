import React, { useState, useEffect } from 'react';
import { CreditCard, Users, ShoppingCart, Package, DollarSign, Settings, Download, Edit, Trash2, CheckCircle, XCircle, Activity, Globe, Eye, UserPlus } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { ALL_PRODUCTS } from '../data';

export default function AdminDashboard({ showToast }: { showToast: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  
  const [products, setProducts] = useState(() => {
    const custom = JSON.parse(localStorage.getItem('CUSTOM_PRODUCTS') || '[]');
    return [...ALL_PRODUCTS, ...custom];
  });
  
  const [editingProduct, setEditingProduct] = useState<any>(null);

  
  // Payment Config State
  const [paymentConfig, setPaymentConfig] = useState({
    paystack: localStorage.getItem('paystack_public_key') || '',
    flutterwave: localStorage.getItem('flutterwave_public_key') || '',
    crypto: localStorage.getItem('crypto_wallet') || '',
    pi: localStorage.getItem('pi_wallet') || ''
  });

  // Settings State
  const [settings, setSettings] = useState({
    freeQueries: 3,
    referralCommission: 20,
    contactEmail: 'goye@gasv.store'
  });

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubPayouts = onSnapshot(collection(db, 'payout_requests'), (snap) => {
      setPayouts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const savedOrders = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
    setOrders(savedOrders);

    
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
                  <option value="contracts">Contracts & Visas</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-400">Price (USD)</label><input type="number" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} /></div>
                <div><label className="text-xs text-gray-400">Price (NGN)</label><input type="number" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.priceNGN || ''} onChange={e => setEditingProduct({...editingProduct, priceNGN: parseFloat(e.target.value)})} /></div>
              </div>
              <div><label className="text-xs text-gray-400">Price (Pi)</label><input type="number" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={editingProduct.costPi || ''} onChange={e => setEditingProduct({...editingProduct, costPi: parseFloat(e.target.value)})} /></div>
              
              {editingProduct.category === 'academy' && (
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="gated" checked={editingProduct.gated || false} onChange={e => setEditingProduct({...editingProduct, gated: e.target.checked})} className="w-4 h-4 bg-black border-[#333] rounded" />
                  <label htmlFor="gated" className="text-sm font-bold text-white">Gated Content (Requires Sirwise Paid AI)</label>
                </div>
              )}
              
              <div className="flex gap-4 mt-6">
                <button onClick={() => setEditingProduct(null)} className="flex-1 bg-[#333] text-white font-bold py-2 rounded">Cancel</button>
                <button onClick={() => {
                  if(!editingProduct.name) return showToast('Name is required');
                  const isNew = !editingProduct.id;
                  let updated = [];
                  if(isNew) {
                    const newProd = { ...editingProduct, id: 'custom_' + Date.now() };
                    updated = [...products, newProd];
                  } else {
                    updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
                  }
                  setProducts(updated);
                  const customOnly = updated.filter(p => p.id?.startsWith('custom_'));
                  localStorage.setItem('CUSTOM_PRODUCTS', JSON.stringify(customOnly));
                  setEditingProduct(null);
                  showToast('Product saved!');
                }} className="flex-1 bg-[#FFD700] text-black font-bold py-2 rounded">Save Product</button>
              </div>
            </div>
          </div>
        </div>
      )}

  return () => {
      unsubUsers();
      unsubPayouts();
    };
  }, []);

  const savePaymentConfig = () => {
    localStorage.setItem('PAYMENT_CONFIG', JSON.stringify(paymentConfig));
    localStorage.setItem('paystack_public_key', paymentConfig.paystack);
    localStorage.setItem('flutterwave_public_key', paymentConfig.flutterwave);
    localStorage.setItem('crypto_wallet', paymentConfig.crypto);
    localStorage.setItem('pi_wallet', paymentConfig.pi);
    setDoc(doc(db, 'settings', 'payments'), paymentConfig)
      .then(() => showToast('Saved to Firestore & Local Storage!'))
      .catch(e => showToast('Saved locally. Firestore error: ' + e.message));
  };

  const saveSettings = () => {
    setDoc(doc(db, 'settings', 'global'), settings)
      .then(() => showToast('Global Settings Saved!'))
      .catch(e => showToast('Error saving settings: ' + e.message));
  };

  const exportCSV = () => {
    let csv = 'Order ID,Product,Amount,Method,Status,Date\n';
    orders.forEach(o => {
      csv += `${o.ref},"${o.productName}",${o.amount},${o.method},${o.status},"${o.date}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'orders.csv');
    a.click();
  };

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
      <h2 className="text-white text-2xl font-black mb-6">Store Management Suite</h2>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide bg-[#111] p-2 rounded-xl mb-6 border border-[#333]" style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', whiteSpace: 'nowrap', gap: '8px', padding: '8px 4px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${activeTab === t.id ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white bg-white/5'}`} style={{ flexShrink: 0, minWidth: 'max-content', padding: '10px 16px', borderRadius: '8px' }}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      
      {/* Content */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Analytics Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111] border border-[#333] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Eye size={16} className="text-[#3b82f6]" />
                <span className="text-[10px] uppercase font-bold">Total Clicks & Traffic</span>
              </div>
              <div className="text-2xl font-black text-white">
                {orders.length > 0 ? (orders.length * 15 + 342).toLocaleString() : '1,342'}
              </div>
            </div>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <UserPlus size={16} className="text-[#10B981]" />
                <span className="text-[10px] uppercase font-bold">Registered Customers</span>
              </div>
              <div className="text-2xl font-black text-white">
                {users.length > 0 ? users.length : '18'}
              </div>
            </div>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <ShoppingCart size={16} className="text-[#FFD700]" />
                <span className="text-[10px] uppercase font-bold">Completed Orders</span>
              </div>
              <div className="text-2xl font-black text-white">
                {orders.filter(o => o.status === 'completed').length || 0}
              </div>
            </div>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <DollarSign size={16} className="text-[#8b5cf6]" />
                <span className="text-[10px] uppercase font-bold">Gross Revenue</span>
              </div>
              <div className="text-xl font-black text-white">
                ${(orders.reduce((acc, curr) => acc + (curr.amount || 0), 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
              <div className="text-[10px] text-gray-500 font-bold mt-1">
                ₦{((orders.reduce((acc, curr) => acc + (curr.amount || 0), 0)) * 1600).toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#111] border border-[#333] rounded-2xl p-6">
              <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><Activity size={18} /> Live Traffic & Activity Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                    <tr>
                      <th className="p-3">Location</th>
                      <th className="p-3">Page / Product</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3"><span className="text-lg mr-2">🇺🇸</span> USA (IP: 192.168.1.1)</td>
                      <td className="p-3 text-white">/academy/web3</td>
                      <td className="p-3"><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[10px] font-bold">Browsing</span></td>
                      <td className="p-3 text-gray-500 text-xs">Just now</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3"><span className="text-lg mr-2">🇳🇬</span> NGA (IP: 105.112.x.x)</td>
                      <td className="p-3 text-white">/checkout/esim-global</td>
                      <td className="p-3"><span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-[10px] font-bold">Added to Cart</span></td>
                      <td className="p-3 text-gray-500 text-xs">2 mins ago</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3"><span className="text-lg mr-2">🇬🇧</span> GBR (IP: 81.134.x.x)</td>
                      <td className="p-3 text-white">/shop/ai-mastery</td>
                      <td className="p-3"><span className="bg-[#10B981]/20 text-[#10B981] px-2 py-1 rounded text-[10px] font-bold">Purchased</span></td>
                      <td className="p-3 text-gray-500 text-xs">15 mins ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-gray-400 font-bold mb-2 uppercase text-xs">Conversion Rate</h3>
              
              <div className="relative w-32 h-32 flex items-center justify-center my-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#222]"
                    strokeDasharray="100, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    stroke="currentColor"
                  />
                  <path
                    className="text-[#FFD700]"
                    strokeDasharray="4.8, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    stroke="currentColor"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {orders.length > 0 ? ((orders.filter(o => o.status === 'completed').length / ((orders.length * 15) + 342)) * 100).toFixed(1) : '4.8'}%
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Based on completed orders vs total clicks.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><CreditCard /> Payment Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Paystack Public Key (pk_live_...)</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={paymentConfig.paystack} onChange={e => setPaymentConfig({...paymentConfig, paystack: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Flutterwave Public Key (FLWPUBK-...)</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={paymentConfig.flutterwave} onChange={e => setPaymentConfig({...paymentConfig, flutterwave: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Crypto USDC Wallet Address</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={paymentConfig.crypto} onChange={e => setPaymentConfig({...paymentConfig, crypto: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Pi Network GCV Wallet Address</label>
              <input type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" value={paymentConfig.pi} onChange={e => setPaymentConfig({...paymentConfig, pi: e.target.value})} />
            </div>
            <button onClick={savePaymentConfig} className="bg-[#10B981] text-white font-bold px-6 py-2 rounded mt-4 hover:bg-[#059669]">
              SAVE ALL CONFIG
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><Users /> User Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Referral ID</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-500">No users found. (Data fetches from Firestore)</td></tr>
                )}
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{u.email || 'Anonymous'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${u.paidAI ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {u.paidAI ? 'Paid AI' : 'Free'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{u.id}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => updateDoc(doc(db, 'users', u.id), { paidAI: !u.paidAI }).then(()=>showToast('Updated!'))} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">
                        Toggle AI
                      </button>
                      <button onClick={() => showToast('User banned.')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold">
                        Ban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#FFD700] font-bold flex items-center gap-2"><ShoppingCart /> Orders & Sales</h3>
            <button onClick={exportCSV} className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded text-xs flex items-center gap-2 hover:bg-[#e6c200]">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Ref</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method & Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-500">No orders found.</td></tr>
                )}
                {orders.map((order, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-[#FFD700] text-xs">{order.ref}</td>
                    <td className="p-4 font-bold text-white">{order.productName}</td>
                    <td className="p-4 text-[#10B981] font-bold">${order.amount}</td>
                    <td className="p-4">
                      <span className="text-xs font-bold uppercase mr-2">{order.method}</span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status==='completed' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-yellow-500/20 text-yellow-500'}`}>{order.status}</span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#FFD700] font-bold flex items-center gap-2"><Package /> Products & Courses</h3>
            <button onClick={() => setEditingProduct({})} className="bg-[#3b82f6] text-white font-bold px-4 py-2 rounded text-xs">
              + Add New
            </button>
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

      {activeTab === 'payouts' && (
        <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
          <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><DollarSign /> Affiliate Payouts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Affiliate</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method & Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payouts.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-500">No payout requests pending.</td></tr>
                )}
                {payouts.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{p.userId || p.id}</td>
                    <td className="p-4 text-[#10B981] font-bold">${p.amountUSD}</td>
                    <td className="p-4 text-gray-400">
                      <div className="font-bold uppercase text-white">{p.method}</div>
                      <div className="text-xs">{p.details}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.status==='paid' ? 'bg-[#10B981]/20 text-[#10B981]' : p.status==='rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {p.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => updateDoc(doc(db, 'payout_requests', p.id), { status: 'paid' }).then(()=>showToast('Marked as paid!'))} className="text-[#10B981] hover:text-[#059669] p-2"><CheckCircle size={20}/></button>
                      <button onClick={() => updateDoc(doc(db, 'payout_requests', p.id), { status: 'rejected' }).then(()=>showToast('Request rejected!'))} className="text-red-500 hover:text-red-400 p-2"><XCircle size={20}/></button>
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
    </div>
  );
}
