const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
code = code.replace("import LanguageModal from './components/LanguageModal';", "import LanguageModal from './components/LanguageModal';\nimport AdminDashboard from './components/AdminDashboard';");

// Replace the old admin block
const oldAdminBlock = /\{isAdminAuth && tab === 'admin' && \([\s\S]*?\{showEsimVideoModal && <EsimVideoModal/;
const newAdminBlock = `
        {isAdminAuth && tab === 'admin' && (
          <AdminDashboard showToast={showToast} />
        )}
      </main>

      {selectedProduct && (
        <UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => setSelectedProduct(null)} onToast={showToast} />
      )}

      {showEsimVideoModal && <EsimVideoModal
`;
code = code.replace(oldAdminBlock, newAdminBlock.trim());

fs.writeFileSync('src/App.tsx', code);
