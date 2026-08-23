const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(/<script src="(.*?)" crossorigin="anonymous"( async|)><\/script>/g, '<script src="$1"$2></script>');
fs.writeFileSync('index.html', code);
