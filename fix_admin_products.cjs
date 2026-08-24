const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const productsInit = `
  const [products, setProducts] = useState(() => {
    const custom = JSON.parse(localStorage.getItem('CUSTOM_PRODUCTS') || '[]');
    return [...ALL_PRODUCTS, ...custom];
  });
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
`;
code = code.replace("const [products, setProducts] = useState(ALL_PRODUCTS);", productsInit);

const addEditModal = `
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
`;

code = code.replace("return (", addEditModal + "\n  return (");

const addBtnOld = /<button onClick=\{\(\) => showToast\('Product addition interface opening\.\.\.'\)\} className="bg-\[\#3b82f6\] text-white font-bold px-4 py-2 rounded text-xs">[\s\S]*?\+ Add New[\s\S]*?<\/button>/;
const addBtnNew = `<button onClick={() => setEditingProduct({})} className="bg-[#3b82f6] text-white font-bold px-4 py-2 rounded text-xs">\n              + Add New\n            </button>`;

code = code.replace(addBtnOld, addBtnNew);

const editBtnOld = /<button className="text-blue-400 hover:text-blue-300 p-2"><Edit size=\{16\}\/><\/button>/g;
const editBtnNew = `<button onClick={() => setEditingProduct(p)} className="text-blue-400 hover:text-blue-300 p-2"><Edit size={16}/></button>`;
code = code.replace(editBtnOld, editBtnNew);

const delBtnOld = /<button className="text-red-400 hover:text-red-300 p-2"><Trash2 size=\{16\}\/><\/button>/g;
const delBtnNew = `<button onClick={() => {
                        const updated = products.filter(x => x.id !== p.id);
                        setProducts(updated);
                        const customOnly = updated.filter(x => x.id?.startsWith('custom_'));
                        localStorage.setItem('CUSTOM_PRODUCTS', JSON.stringify(customOnly));
                        showToast('Product deleted!');
                      }} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16}/></button>`;
code = code.replace(delBtnOld, delBtnNew);


fs.writeFileSync('src/components/AdminDashboard.tsx', code);
