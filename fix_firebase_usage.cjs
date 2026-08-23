const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The script will completely remove loadSettings, fetchStats, and Firebase hooks.
code = code.replace(/const loadSettings = async \(\) => \{[\s\S]*?\};/g, 'const loadSettings = () => {};');
code = code.replace(/const fetchStats = async \(\) => \{[\s\S]*?\};/g, 'const fetchStats = () => {};');

code = code.replace(/getDocs/g, '(() => [])');
code = code.replace(/collection/g, '(() => ({}))');
code = code.replace(/getDoc/g, '(() => ({ exists: () => false, data: () => ({}) }))');
code = code.replace(/setDoc/g, '(() => {})');
code = code.replace(/doc/g, '(() => ({}))');
code = code.replace(/query/g, '(() => ({}))');
code = code.replace(/where/g, '(() => ({}))');
code = code.replace(/db/g, '({})');

fs.writeFileSync('src/App.tsx', code);
