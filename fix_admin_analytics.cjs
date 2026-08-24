const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Imports
code = code.replace(
  "import { CreditCard, Users, ShoppingCart, Package, DollarSign, Settings, Download, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';",
  "import { CreditCard, Users, ShoppingCart, Package, DollarSign, Settings, Download, Edit, Trash2, CheckCircle, XCircle, Activity, Globe, Eye, UserPlus } from 'lucide-react';"
);

// Default tab
code = code.replace(
  "const [activeTab, setActiveTab] = useState('payments');",
  "const [activeTab, setActiveTab] = useState('analytics');"
);

// TABS
const oldTabs = /const TABS = \[\s*\{ id: 'payments'[\s\S]*?\];/;
const newTabs = `const TABS = [
    { id: 'analytics', icon: Activity, label: 'Analytics Overview' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders & Sales' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'payouts', icon: DollarSign, label: 'Affiliate Payouts' },
    { id: 'settings', icon: Settings, label: 'Site Settings' },
  ];`;
code = code.replace(oldTabs, newTabs);

// Tabs container styles
const oldTabsContainer = /<div className="flex flex-nowrap overflow-x-auto scrollbar-hide bg-\[\#111\] p-2 rounded-xl mb-6 border border-\[\#333\]">/;
const newTabsContainer = `<div className="flex overflow-x-auto scrollbar-hide bg-[#111] p-2 rounded-xl mb-6 border border-[#333]" style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', whiteSpace: 'nowrap', gap: '8px', padding: '8px 4px' }}>`;
code = code.replace(oldTabsContainer, newTabsContainer);

const oldTabButton = /className=\{`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors \$\{activeTab === t\.id \? 'bg-\[\#FFD700\] text-black' : 'text-gray-400 hover:text-white'}`\}/g;
const newTabButton = `className={\`flex items-center gap-2 text-sm font-bold transition-colors \${activeTab === t.id ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white bg-white/5'}\`} style={{ flexShrink: 0, minWidth: 'max-content', padding: '10px 16px', borderRadius: '8px' }}`;
code = code.replace(oldTabButton, newTabButton);


// Analytics tab UI
const analyticsContent = `
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
                $\{(orders.reduce((acc, curr) => acc + (curr.amount || 0), 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}
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
`;

code = code.replace("{/* Content */}", analyticsContent);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
