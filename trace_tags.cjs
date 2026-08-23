const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find all `{isAdmin && (` or similar in the code
let regex = /\{[a-zA-Z0-9_\. ==='"\|&]+\&\& \(/g;
let match;
while ((match = regex.exec(code)) !== null) {
  let ctx = code.substring(match.index - 50, match.index + 100);
  console.log('Found:', match[0], 'at', match.index, '\n', ctx, '\n---');
}
