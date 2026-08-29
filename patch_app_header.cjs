const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// EXPLORE THE PROGRAMS
code = code.replace(/<div className="bg-\[#FFD700\] text-black font-black text-\[10px\] px-4 py-1 rounded-full cursor-pointer pointer-events-auto shadow-md">/g, 
  '<button onClick={() => { const el = document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }} className="bg-[#FFD700] text-black font-black text-[10px] px-4 py-1 rounded-full cursor-pointer pointer-events-auto shadow-md">');
code = code.replace(/EXPLORE THE PROGRAMS →\n\s*<\/div>/g, 'EXPLORE THE PROGRAMS →\n        </button>');

// Programs
code = code.replace(/>Programs<\/a>/g, ' onClick={(e) => { e.preventDefault(); const el = document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }}>Programs</a>');

// Our method
code = code.replace(/>Our method<\/a>/g, ' onClick={(e) => { e.preventDefault(); const el = document.getElementById("our-method"); if(el) el.scrollIntoView({behavior: "smooth"}); }}>Our method</a>');

// Community
code = code.replace(/>Community<\/a>/g, ' onClick={(e) => { e.preventDefault(); const el = document.getElementById("community"); if(el) el.scrollIntoView({behavior: "smooth"}); }}>Community</a>');

// Start learning -> Open checkout if not paid
code = code.replace(/<button className="bg-\[#3b82f6\] text-white px-4 py-1 rounded-full text-\[11px\] font-black uppercase tracking-wider hidden md:block">/g, 
  `<button onClick={() => { 
    if (localStorage.getItem('sirwise_paid') === 'true') {
      setTab('academy');
    } else {
      setSelectedProduct({ id: 'academy', name: 'Sirwise AI Web3 Academy 4-Week', price: 49.99, category: 'academy' });
    }
  }} className="bg-[#3b82f6] text-white px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider hidden md:block cursor-pointer pointer-events-auto z-10">`);

fs.writeFileSync('src/App.tsx', code);
