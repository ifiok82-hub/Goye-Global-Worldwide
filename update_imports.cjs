const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "import { Globe, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, RefreshCw, Users, Activity, UserCircle , Scan, QrCode, Smartphone, MoreVertical, Bot, LayoutDashboard} from 'lucide-react';",
  "import { Globe, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, RefreshCw, Users, Activity, UserCircle , Scan, QrCode, Smartphone, MoreVertical, Bot, LayoutDashboard, Camera, Mic, MoreHorizontal} from 'lucide-react';"
);
fs.writeFileSync('src/App.tsx', code);
