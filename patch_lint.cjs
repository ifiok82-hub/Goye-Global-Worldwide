const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const email = document.getElementById('login-email-input').value;",
  "const email = (document.getElementById('login-email-input') as HTMLInputElement).value;"
);
code = code.replace(
  "const password = document.getElementById('login-password-input').value;",
  "const password = (document.getElementById('login-password-input') as HTMLInputElement).value;"
);

fs.writeFileSync('src/App.tsx', code);
