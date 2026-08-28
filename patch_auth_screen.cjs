const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

code = code.replace(/export default function AuthScreen\(\{ onAuthenticated \}: \{ onAuthenticated: \(user: any, profile: any\) => void \}\) \{/, 'export default function AuthScreen({ onAuthenticated, onClose }: { onAuthenticated: (user: any, profile: any) => void, onClose?: () => void }) {');
code = code.replace(/<button onClick=\{[^}]+\} className="absolute top-4 right-4 text-gray-500 font-bold hover:text-white cursor-pointer z-20">X<\/button>/, `<button onClick={() => { if(onClose) onClose(); else window.location.hash='home'; }} className="absolute top-4 right-4 text-gray-500 font-bold hover:text-white cursor-pointer z-20 pointer-events-auto touch-manipulation">X</button>`);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
