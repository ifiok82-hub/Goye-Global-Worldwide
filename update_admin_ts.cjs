const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const paystack = document.getElementById('paystack_key').value;",
  "const paystack = (document.getElementById('paystack_key') as HTMLInputElement).value;"
);
code = code.replace(
  "const flutterwave = document.getElementById('flutterwave_key').value;",
  "const flutterwave = (document.getElementById('flutterwave_key') as HTMLInputElement).value;"
);
code = code.replace(
  "const crypto = document.getElementById('crypto_wallet').value;",
  "const crypto = (document.getElementById('crypto_wallet') as HTMLInputElement).value;"
);
code = code.replace(
  "const pi = document.getElementById('pi_wallet').value;",
  "const pi = (document.getElementById('pi_wallet') as HTMLInputElement).value;"
);

fs.writeFileSync('src/App.tsx', code);
