const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const ogTags = `
    <meta property="og:title" content="GOYE Store Global - eSIM, Travel Guides & AI Business Packs" />
    <meta property="og:description" content="190+ Countries Instant Delivery. Get eSIMs, AI Academy Toolkits & Digital Nomad Suites." />
    <meta property="og:image" content="https://www.gasv.store/goye-logo.svg" />
    <meta property="og:url" content="https://www.gasv.store" />
    <meta property="og:type" content="website" />
    <title>GOYE Store Global - eSIM $4, Travel Guides & AI Business Packs | 190+ Countries Instant Delivery</title>
`;
content = content.replace('<title>GOYE Store Global - eSIM $4, Travel Guides &amp; AI Business Packs | 190+ Countries Instant Delivery</title>', ogTags);
fs.writeFileSync('index.html', content);
