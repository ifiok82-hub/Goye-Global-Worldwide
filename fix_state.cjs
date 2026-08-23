const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

code = code.replace("const [email: validEmail, setEmail]", "const [email, setEmail]");

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
