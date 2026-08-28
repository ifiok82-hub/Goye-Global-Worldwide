const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('User, ') && code.includes('lucide-react')) {
  code = code.replace(/} from 'lucide-react';/, ', User } from "lucide-react";');
}

fs.writeFileSync(file, code);
console.log("Fixed User import correctly");
