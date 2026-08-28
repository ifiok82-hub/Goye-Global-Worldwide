const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('User, ')) {
  code = code.replace("import { GraduationCap", "import { User, GraduationCap");
}
fs.writeFileSync(file, code);
console.log("Fixed User import");
