import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';

export default function EsimVideoModal({ onClose }: { onClose: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: "📱", text: "Step 1: Buy eSIM on GOYE Store Global Shop - $9.99" },
    { icon: "📧", text: "Step 2: QR code sent to your email in 2 mins - GOYE system" },
    { icon: "⚙️", text: "Step 3: Settings > Cellular > Add eSIM > Scan QR" },
    { icon: "🌍", text: "Step 4: Instant internet 190+ countries! GOYE Global!" }
  ];

  useEffect(() => {
    let timer: any;
    if (playing) {
      timer = setInterval(() => {
        setStep(s => (s + 1) % steps.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [playing]);

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#000', border: '2px solid #FFD700', borderRadius: '16px', padding: '20px', maxWidth: '400px', width: '95%', maxHeight: '80vh', overflowY: 'auto', textAlign: 'left', position: 'relative', paddingBottom: '120px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer' }}>×</button>
        <h2 style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '10px' }}>GOYE Academy - eSIM Tutorial</h2>
        
        <div style={{ background: '#111', padding: '15px', borderRadius: '10px', margin: '10px 0', borderLeft: '4px solid #FFD700' }}>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>🎓 Sirwise AI WEB3 Academy - Internal Lesson</p>
          <p style={{ color: '#aaa', fontSize: '11px' }}>RC BN3583773 - Goye Store Global - Sirwise AI verified</p>
        </div>
        
        <div id="goyeVideoPlayer" style={{ background: '#000', width: '100%', height: '220px', borderRadius: '10px', border: '2px solid #FFD700', position: 'relative', overflow: 'hidden', margin: '15px 0' }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,215,0,0.9)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', zIndex: 10 }}>● REC - GOYE Academy Internal</div>
          
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transition: 'all 0.5s', padding: '0 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', animation: 'pulse 1s infinite' }}>{steps[step].icon}</div>
            <p style={{ color: '#FFD700', marginTop: '10px', fontWeight: 'bold' }}>{steps[step].text}</p>
          </div>
          
          <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
             <button onClick={() => setPlaying(!playing)} style={{ background: '#111', color: '#FFD700', border: '1px solid #FFD700', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
               {playing ? <Pause size={14}/> : <Play size={14}/>} {playing ? 'Playing' : 'Paused'} - GOYE Internal Academy
             </button>
          </div>

          <div style={{ position: 'absolute', bottom: '15px', right: '15px', color: 'white', fontSize: '10px', fontWeight: 'bold', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
            0:0{step + 1} / 0:04 - Internal Demo Loop
          </div>
          
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#333' }}>
            <div style={{ width: progress + '%', height: '100%', background: '#FFD700', transition: 'width 0.3s' }}></div>
          </div>
        </div>
        
        <p style={{ color: '#10B981', fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}>This is GOYE Internal Video Player - No YouTube needed - Plays inside your store - Saves customer from leaving to watch Lagbaja!</p>

        <div style={{ background: '#000', padding: '15px', borderRadius: '10px', marginTop: '15px' }}>
          <p style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>📱 Step 1: Buy eSIM on GOYE Store Global shop</p>
          <p style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>📧 Step 2: QR code sent to your email within 2 minutes - GOYE internal system</p>
          <p style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>⚙️ Step 3: Phone Settings &gt; Cellular &gt; Add eSIM &gt; Scan QR - No external app needed</p>
          <p style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>🌍 Step 4: Instant internet 190+ countries - Powered by Goye Global</p>
          

          <p style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>✅ Works on iPhone XS+, Samsung S20+, Google Pixel - Sirwise AI verified</p>
        </div>
        
        <p style={{ color: '#666', fontSize: '10px', textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>This lesson stays inside GOYE Academy - No external YouTube - https://www.gasv.store</p>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#111', padding: '15px', borderTop: '1px solid #333', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => { onClose(); window.location.hash='#esim'; }} style={{ background: '#FFD700', color: '#000', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Close &amp; Buy eSIM $9.99 - GOYE Store</button>
          <button onClick={() => { onClose(); window.location.hash='#academy'; }} style={{ background: 'transparent', color: '#aaa', border: '1px solid #444', width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Close &amp; Explore Academy</button>
        </div>
      </div>
    </div>
  );
}
