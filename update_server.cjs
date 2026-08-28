const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const whatsappProxy = `
// 11. API: WhatsApp Support Redirection
app.get('/api/support-chat', (req, res) => {
  const phone = process.env.WHATSAPP_PHONE_NUMBER;
  if (!phone) {
    return res.status(500).send('Support offline.');
  }
  const text = req.query.text || 'Hello GOYE Support, I need assistance.';
  const encodedMessage = encodeURIComponent(text.toString());
  res.redirect(302, \`https://wa.me/\${phone}?text=\${encodedMessage}\`);
});

// Legal & Compliance Static Routes for Pi Core Team Approval`;

code = code.replace('// Legal & Compliance Static Routes for Pi Core Team Approval', whatsappProxy);
fs.writeFileSync(file, code);
console.log("Updated server.ts with WhatsApp proxy");
