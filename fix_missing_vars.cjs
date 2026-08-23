const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace totalSales and orders with combinedOrders
code = code.replace('{totalSales.toLocaleString()}', '{combinedOrders.reduce((acc, curr) => acc + (parseFloat(curr.amount || curr.price || 0)), 0).toLocaleString()}');
code = code.replace('{orders.length}', '{combinedOrders.length}');

// Fix ShoppingCart import
if (!code.includes('ShoppingCart')) {
  code = code.replace(
    "import { Home, ShoppingBag, Globe, GraduationCap, FileText, MessageCircle, Activity, Users, Settings, Plus, Edit, Trash2, UserCircle, Download, CheckCircle, RefreshCw } from 'lucide-react';",
    "import { Home, ShoppingBag, Globe, GraduationCap, FileText, MessageCircle, Activity, Users, Settings, Plus, Edit, Trash2, UserCircle, Download, CheckCircle, RefreshCw, ShoppingCart } from 'lucide-react';"
  );
}

fs.writeFileSync('src/App.tsx', code);

let checkout = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');
if (!checkout.includes('import RealQRCode')) {
  checkout = checkout.replace(
    "import { X, ShieldCheck, Lock, Upload, Copy, CheckCircle, RefreshCw } from 'lucide-react';",
    "import { X, ShieldCheck, Lock, Upload, Copy, CheckCircle, RefreshCw } from 'lucide-react';\nimport RealQRCode from './RealQRCode';"
  );
}
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', checkout);
