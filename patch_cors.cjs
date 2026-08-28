const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const corsSearch = `const app = express();`;
const corsReplace = `const app = express();

  // CORS and Compliance Headers
  app.use((req, res, next) => {
    const allowedOrigins = ['https://www.gasv.store', 'https://gasv.store', 'https://gas.store'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*'); // Fallback for dev/preview
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    // Secure Cookie headers implicitly if setting cookies
    next();
  });
`;

code = code.replace(corsSearch, corsReplace);
fs.writeFileSync(file, code);
console.log("Patched server.ts with CORS");
