const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const securityHeadersMiddleware = `
// --- Security & Anti-Tampering Middleware ---
app.use((req, res, next) => {
  // 1. Strict HTTPS Redirection
  if (req.headers['x-forwarded-proto'] === 'http' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, \`https://\${req.hostname}\${req.url}\`);
  }

  // 2. Strict Security Headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
});

// JSON Body Parser for Webhooks
`;

code = code.replace("app.use(express.json());", securityHeadersMiddleware + "app.use(express.json());");

fs.writeFileSync('server.ts', code);
