const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEsimModal = `<div onClick={(e) => { e.preventDefault(); e.stopPropagation(); const m = document.getElementById("videoModal"); if(m) { m.style.display="flex"; m.innerHTML=\`<div style="background:#000; border:2px solid #FFD700; border-radius:16px; padding:20px; max-width:400px; width:95%; max-height:80vh; overflow-y:auto; text-align:left;"><h2 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">GOYE Academy - eSIM Tutorial</h2><div style="background:#111; padding:15px; border-radius:10px; margin:10px 0; border-left:4px solid #FFD700;"><p style="color:white; font-weight:bold; font-size:14px;">🎓 Sirwise AI WEB3 Academy - Internal Lesson</p><p style="color:#aaa; font-size:11px;">RC BN3583773 - Goye Store Global</p></div><div style="background:#000; padding:15px; border-radius:10px;"><p style="color:white; font-size:14px; margin-bottom:8px;">📱 Step 1: Buy eSIM on GOYE Store Global shop</p><p style="color:white; font-size:14px; margin-bottom:8px;">📧 Step 2: QR code sent to your email within 2 minutes - GOYE internal system</p><p style="color:white; font-size:14px; margin-bottom:8px;">⚙️ Step 3: Phone Settings > Cellular > Add eSIM > Scan QR - No external app needed</p><p style="color:white; font-size:14px; margin-bottom:8px;">🌍 Step 4: Instant internet 190+ countries - Powered by Goye Global</p><div style="background:#FFD700; color:#000; padding:10px; border-radius:8px; margin:10px 0; text-align:center; font-weight:bold;">GOYE eSIM Demo QR<br/>[Internal Academy Content]</div><p style="color:#FFD700; font-size:12px; font-weight:bold;">✅ Works on iPhone XS+, Samsung S20+, Pixel - Sirwise AI verified</p></div><p style="color:#666; font-size:10px; text-align:center; margin-top:10px;">This lesson stays inside GOYE Academy - No external YouTube</p><button onclick="document.getElementById('videoModal').style.display='none'; document.getElementById('esim')?.scrollIntoView({behavior:'smooth'});" style="background:#FFD700; color:#000; width:100%; padding:12px; border:none; border-radius:8px; margin-top:10px; font-weight:bold; cursor:pointer;">Close &amp; Buy eSIM $9.99 - GOYE Store</button><button onclick="document.getElementById('videoModal').style.display='none'" style="background:transparent; color:#aaa; border:1px solid #444; width:100%; padding:8px; border-radius:8px; margin-top:8px; cursor:pointer;">Close</button></div>\`; } }} className="mt-6 aspect-video bg-black rounded-xl border-2 border-[#333] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer hover:border-[#FFD700]/50 transition-colors shadow-2xl">`;

const newEsimModal = `<div onClick={(e) => { e.preventDefault(); e.stopPropagation(); const m = document.getElementById("videoModal"); if(m) { m.style.display="flex"; m.innerHTML=\`
<div style="background:#000; border:2px solid #FFD700; border-radius:16px; padding:20px; max-width:400px; width:95%; max-height:80vh; overflow-y:auto; text-align:left; position:relative; padding-bottom:120px;">
  <button onclick="document.getElementById('videoModal').style.display='none'" style="position:absolute; top:15px; right:15px; background:transparent; border:none; color:#aaa; font-size:24px; cursor:pointer;">×</button>
  <h2 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">GOYE Academy - eSIM Tutorial</h2>
  <div style="background:#111; padding:15px; border-radius:10px; margin:10px 0; border-left:4px solid #FFD700;">
    <p style="color:white; font-weight:bold; font-size:14px;">🎓 Sirwise AI WEB3 Academy - Internal Lesson</p>
    <p style="color:#aaa; font-size:11px;">RC BN3583773 - Goye Store Global - Sirwise AI verified</p>
  </div>
  
  <div style="background:linear-gradient(to bottom, #000, #222); width:100%; height:200px; display:flex; flex-direction:column; justify-content:center; align-items:center; border:2px solid #FFD700; border-radius:12px; margin:15px 0;">
    <div style="font-size:36px; animation: pulse 2s infinite;">📱 ➡️ 📧 ➡️ ⚙️ ➡️ 🌍</div>
    <p style="color:#FFD700; margin-top:10px; font-weight:bold;">GOYE eSIM Installation - Internal Demo</p>
    <p style="color:white; font-size:11px; text-align:center; max-width:80%; margin-top:5px;">Step 1 Shop &gt; Step 2 Email QR &gt; Step 3 Scan &gt; Step 4 Internet</p>
    <div style="background:#FFD700; color:#000; width:100%; padding:5px; text-align:center; font-size:10px; font-weight:bold; margin-top:auto; border-bottom-left-radius:10px; border-bottom-right-radius:10px;">Internal Academy Content - GOYE Store Global</div>
  </div>

  <div style="background:#000; padding:15px; border-radius:10px;">
    <p style="color:white; font-size:14px; margin-bottom:8px;">📱 Step 1: Buy eSIM on GOYE Store Global shop</p>
    <p style="color:white; font-size:14px; margin-bottom:8px;">📧 Step 2: QR code sent to your email within 2 minutes - GOYE internal system</p>
    <p style="color:white; font-size:14px; margin-bottom:8px;">⚙️ Step 3: Phone Settings &gt; Cellular &gt; Add eSIM &gt; Scan QR - No external app needed</p>
    <p style="color:white; font-size:14px; margin-bottom:8px;">🌍 Step 4: Instant internet 190+ countries - Powered by Goye Global</p>
    
    <div style="text-align:center; margin:15px 0;">
      <div style="background:#fff; padding:10px; display:inline-block; border-radius:8px;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GOYE-eSIM-BN3583773-Gasv.Store-Internal" alt="QR Demo" style="display:block;"/>
      </div>
      <p style="color:#FFD700; font-size:12px; margin-top:5px; font-weight:bold;">GOYE eSIM Demo QR</p>
    </div>

    <p style="color:#FFD700; font-size:12px; font-weight:bold; text-align:center;">✅ Works on iPhone XS+, Samsung S20+, Google Pixel - Sirwise AI verified</p>
  </div>
  
  <p style="color:#666; font-size:10px; text-align:center; margin-top:10px; margin-bottom:20px;">This lesson stays inside GOYE Academy - No external YouTube - https://www.gasv.store</p>

  <div style="position:absolute; bottom:0; left:0; right:0; background:#111; padding:15px; border-top:1px solid #333; border-bottom-left-radius:16px; border-bottom-right-radius:16px; display:flex; flex-direction:column; gap:8px;">
    <button onclick="document.getElementById('videoModal').style.display='none'; window.location.hash='#esim';" style="background:#FFD700; color:#000; width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Close &amp; Buy eSIM $9.99 - GOYE Store</button>
    <button onclick="document.getElementById('videoModal').style.display='none'; window.location.hash='#academy';" style="background:transparent; color:#aaa; border:1px solid #444; width:100%; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Close &amp; Explore Academy</button>
  </div>
</div>
\`; } }} className="mt-6 aspect-video bg-black rounded-xl border-2 border-[#333] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer hover:border-[#FFD700]/50 transition-colors shadow-2xl">`;

if(code.includes(oldEsimModal)) {
  code = code.replace(oldEsimModal, newEsimModal);
  console.log("ESIM modal replaced.");
} else {
  console.log("ESIM modal not found!");
}

const oldCourseModal = `<button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); const m = document.getElementById("videoModal"); if(m) { m.style.display="flex"; m.innerHTML=\`<div style="background:#000; border:2px solid #FFD700; border-radius:16px; padding:20px; max-width:400px; width:95%; max-height:80vh; overflow-y:auto; text-align:left;"><h2 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">GOYE Academy - AI Course</h2><div style="background:#111; padding:15px; border-radius:10px; margin:10px 0; border-left:4px solid #FFD700;"><p style="color:white; font-weight:bold; font-size:14px;">🎓 Sirwise AI WEB3 Academy - Internal Lesson</p><p style="color:#aaa; font-size:11px;">RC BN3583773 - Goye Store Global</p></div><div style="background:#000; padding:15px; border-radius:10px;"><h3 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">Module 1: What is AI - By Sirwise AI WEB3 Academy</h3><p style="color:white; font-size:14px; margin-bottom:10px; line-height:1.5;">Artificial Intelligence (AI) is the simulation of human intelligence by software-coded heuristics. In this era, AI is not just a tool; it's a workforce.</p><p style="color:white; font-size:14px; margin-bottom:10px; line-height:1.5;"><strong>Prompt Engineering 101:</strong><br/>Instead of asking "Write a blog", ask "Act as an expert copywriter. Write a 500-word blog about eSIMs focusing on travelers, using an engaging tone."</p><p style="color:#FFD700; font-size:14px; margin-bottom:10px; line-height:1.5; font-style:italic;">Exercise: Open ChatGPT and try the prompt above. Notice the difference in quality!</p></div><p style="color:#666; font-size:10px; text-align:center; margin-top:10px;">This lesson stays inside GOYE Academy - No external YouTube</p><button onclick="document.getElementById('videoModal').style.display='none'; document.getElementById('academy')?.scrollIntoView({behavior:'smooth'});" style="background:#FFD700; color:#000; width:100%; padding:12px; border:none; border-radius:8px; margin-top:15px; font-weight:bold; cursor:pointer;">Next Module - Unlock 26 Courses</button><button onclick="document.getElementById('videoModal').style.display='none'" style="background:transparent; color:#aaa; border:1px solid #444; width:100%; padding:8px; border-radius:8px; margin-top:8px; cursor:pointer;">Close</button></div>\`; } }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition flex justify-center items-center gap-1 cursor-pointer">Watch Free Lesson</button>`;

const newCourseModal = `<button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); const m = document.getElementById("videoModal"); if(m) { m.style.display="flex"; m.innerHTML=\`
<div style="background:#000; border:2px solid #FFD700; border-radius:16px; padding:20px; max-width:400px; width:95%; max-height:80vh; overflow-y:auto; text-align:left; position:relative; padding-bottom:120px;">
  <button onclick="document.getElementById('videoModal').style.display='none'" style="position:absolute; top:15px; right:15px; background:transparent; border:none; color:#aaa; font-size:24px; cursor:pointer;">×</button>
  <h2 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">GOYE Academy - AI Course</h2>
  <div style="background:#111; padding:15px; border-radius:10px; margin:10px 0; border-left:4px solid #FFD700;">
    <p style="color:white; font-weight:bold; font-size:14px;">🎓 Sirwise AI WEB3 Academy - Internal Lesson</p>
    <p style="color:#aaa; font-size:11px;">RC BN3583773 - Goye Store Global - Sirwise AI verified</p>
  </div>
  
  <div style="background:linear-gradient(to bottom, #000, #222); width:100%; height:200px; display:flex; flex-direction:column; justify-content:center; align-items:center; border:2px solid #FFD700; border-radius:12px; margin:15px 0;">
    <div style="font-size:36px; animation: pulse 2s infinite;">🤖 🧠 📈</div>
    <p style="color:#FFD700; margin-top:10px; font-weight:bold;">AI Mastery Course - Internal Demo</p>
    <div style="background:#FFD700; color:#000; width:100%; padding:5px; text-align:center; font-size:10px; font-weight:bold; margin-top:auto; border-bottom-left-radius:10px; border-bottom-right-radius:10px;">Internal Academy Content - GOYE Store Global</div>
  </div>

  <div style="background:#000; padding:15px; border-radius:10px;">
    <h3 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">Module 1: What is AI - By Sirwise AI WEB3 Academy</h3>
    <p style="color:white; font-size:14px; margin-bottom:10px; line-height:1.5;">Artificial Intelligence (AI) is the simulation of human intelligence by software-coded heuristics. In this era, AI is not just a tool; it's a workforce.</p>
    <p style="color:white; font-size:14px; margin-bottom:10px; line-height:1.5;"><strong>Prompt Engineering 101:</strong><br/>Instead of asking "Write a blog", ask "Act as an expert copywriter. Write a 500-word blog about eSIMs focusing on travelers, using an engaging tone."</p>
    <p style="color:#FFD700; font-size:14px; margin-bottom:10px; line-height:1.5; font-style:italic;">Exercise: Open ChatGPT and try the prompt above. Notice the difference in quality!</p>
  </div>
  <p style="color:#666; font-size:10px; text-align:center; margin-top:10px; margin-bottom:20px;">This lesson stays inside GOYE Academy - No external YouTube - https://www.gasv.store</p>

  <div style="position:absolute; bottom:0; left:0; right:0; background:#111; padding:15px; border-top:1px solid #333; border-bottom-left-radius:16px; border-bottom-right-radius:16px; display:flex; flex-direction:column; gap:8px;">
    <button onclick="document.getElementById('videoModal').style.display='none'; window.location.hash='#academy';" style="background:#FFD700; color:#000; width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Next Module - Unlock 26 Courses</button>
    <button onclick="document.getElementById('videoModal').style.display='none'" style="background:transparent; color:#aaa; border:1px solid #444; width:100%; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Close</button>
  </div>
</div>
\`; } }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition flex justify-center items-center gap-1 cursor-pointer">Watch Free Lesson</button>`;

if(code.includes(oldCourseModal)) {
  code = code.replace(oldCourseModal, newCourseModal);
  console.log("Course modal replaced.");
} else {
  console.log("Course modal not found!");
}

// Add CSS pulse animation
const globalStyleOld = `@keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }`;
const globalStyleNew = `@keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }`;

let indexHtml = fs.readFileSync('index.html', 'utf8');
if(indexHtml.includes(globalStyleOld)) {
  indexHtml = indexHtml.replace(globalStyleOld, globalStyleNew);
  fs.writeFileSync('index.html', indexHtml);
}

fs.writeFileSync('src/App.tsx', code);
