const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\(tab === 'auth'\) \? \([\s\S]*?<div className="px-4 mt-8 animate-in fade-in duration-500 pb-\[100px\]">/;
const replacement = `{(tab === 'auth') ? (
           <AuthScreen 
             onAuthenticated={(user, profile) => {
               setIsAuthenticated(true);
               setCurrentUser(user);
               setUserProfile(profile);
               setTab('home');
             }} 
             onClose={() => setTab('home')}
           />
        ) : null}
        
        {(tab !== 'downloads' && tab !== 'admin' && tab !== 'support') && (
          <div className="px-4 mt-8 animate-in fade-in duration-500 pb-[100px]">
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
