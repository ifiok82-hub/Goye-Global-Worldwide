const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Replace imports
code = code.replace(
  "import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';",
  "import { collection, onSnapshot, doc, setDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';"
);

const oldUseEffect = /useEffect\(\(\) => \{\n    const unsubUsers = onSnapshot\(collection\(db, 'users'\), \(snap\) => \{\n      setUsers\(snap.docs.map\(d => \(\{ id: d.id, \.\.\.d.data\(\) \}\)\)\);\n    \}\);\n    const unsubPayouts = onSnapshot\(collection\(db, 'payout_requests'\), \(snap\) => \{\n      setPayouts\(snap.docs.map\(d => \(\{ id: d.id, \.\.\.d.data\(\) \}\)\)\);\n    \}\);\n    const savedOrders = JSON.parse\(localStorage.getItem\('goye_digital_products_orders'\) \|\| '\[\]'\);\n    setOrders\(savedOrders\);\n\n    return \(\) => \{\n      unsubUsers\(\);\n      unsubPayouts\(\);\n    \};\n  \}, \[\]\);/;

const newUseEffect = `
  const [pageViews, setPageViews] = useState<any[]>([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubPayouts = onSnapshot(collection(db, 'payout_requests'), (snap) => {
      setPayouts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
    
    const qViews = query(collection(db, 'page_views'), orderBy('timestamp', 'desc'), limit(100));
    const unsubViews = onSnapshot(qViews, (snap) => {
      setPageViews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUsers();
      unsubPayouts();
      unsubOrders();
      unsubViews();
    };
  }, []);
`;

code = code.replace(oldUseEffect, newUseEffect);

// Replace page views in analytics
code = code.replace(
  "{orders.length > 0 ? (orders.length * 15 + 342).toLocaleString() : '1,342'}",
  "{pageViews.length > 0 ? (pageViews.length + 342).toLocaleString() : '342'}"
);

// Fix conversion rate logic
code = code.replace(
  "{orders.length > 0 ? ((orders.filter(o => o.status === 'completed').length / ((orders.length * 15) + 342)) * 100).toFixed(1) : '4.8'}%",
  "{pageViews.length > 0 ? ((orders.filter(o => o.status === 'completed').length / (pageViews.length + 342)) * 100).toFixed(1) : '0.0'}%"
);

// Replace live traffic table
const oldTableBody = /<tbody className="divide-y divide-white\/5">[\s\S]*?<\/tbody>/;
const newTableBody = `
                  <tbody className="divide-y divide-white/5">
                    {pageViews.length === 0 && (
                      <tr><td colSpan={4} className="p-3 text-center text-gray-500">No recent traffic recorded.</td></tr>
                    )}
                    {pageViews.slice(0, 10).map((pv: any, i: number) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="p-3"><span className="text-lg mr-2">🌐</span> {pv.country} (IP: {pv.ip})</td>
                        <td className="p-3 text-white">{pv.path}</td>
                        <td className="p-3">
                          <span className={\`px-2 py-1 rounded text-[10px] font-bold \${pv.path.includes('checkout') ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-400'}\`}>
                            {pv.path.includes('checkout') ? 'Added to Cart' : 'Browsing'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500 text-xs">
                          {new Date(pv.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
`;
code = code.replace(oldTableBody, newTableBody.trim());

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
