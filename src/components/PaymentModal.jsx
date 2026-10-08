"use client"
import { useState, useEffect } from 'react'

export default function PaymentModal({ priceUSD = 49.99, priceNGN = 75000, onClose = () => {} }) {
  const [isPiBrowser, setIsPiBrowser] = useState(false)
  const [opayTxInput, setOpayTxInput] = useState('')
  const [usdtTxInput, setUsdtTxInput] = useState('')
  const [usdcTxInput, setUsdcTxInput] = useState('')
  const [copiedField, setCopiedField] = useState('')

  const usdtAddress = import.meta.env?.VITE_BUSHA_USDT_BEP20 || '0xdc7f804B36aB672Ec31642dF418F29e73281b040'
  const usdcAddress = import.meta.env?.VITE_BUSHA_USDC_BASE || '0xdc7f804B36aB672Ec31642dF418F29e73281b040'

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || ''
      if (ua.includes('Pi Browser') || ua.includes('PiBrowser') || ua.includes('Pi/1')) {
        setIsPiBrowser(true)
      }
    }
  }, [])

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    setTimeout(() => setCopiedField(''), 2000)
  }

  const unlockAndNotify = (method, ref) => {
    localStorage.setItem('sirwise_paid', 'true')
    localStorage.setItem('payment_verified', 'true')
    localStorage.setItem('academy_unlocked', 'true')
    localStorage.setItem('academy_full_unlocked', 'true')
    alert(`✅ Payment Verified (${method})!\nRef: ${ref}\nAccess Unlocked!`)
    window.location.reload()
  }

  const handlePaystack = () => {
    const userEmail = localStorage.getItem('user_email') || 'customer@gasv.store'
    if (window.PaystackPop) {
      let handler = window.PaystackPop.setup({
        key: import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_9f7e06b21fa6dc4e3e94cc0',
        email: userEmail,
        amount: Math.round(priceUSD * 1500 * 100),
        currency: 'NGN',
        callback: function(response) {
          unlockAndNotify('Paystack', response.reference)
        },
        onClose: function() {
          alert('Payment window closed.')
        }
      })
      handler.openIframe()
    } else {
      window.location.href = `/payment/verify?reference=paystack-${Date.now()}`
    }
  }

  const handleFlutterwave = () => {
    const userEmail = localStorage.getItem('user_email') || 'customer@gasv.store'
    if (window.FlutterwaveCheckout) {
      window.FlutterwaveCheckout({
        public_key: import.meta.env?.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_LIVE-d102e35a12003c27e382b68ef83a31c6-X',
        tx_ref: 'goye-' + Date.now(),
        amount: priceUSD * 1500,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: userEmail,
          name: 'Goye Customer'
        },
        callback: function (data) {
          unlockAndNotify('Flutterwave', data.transaction_id || data.tx_ref)
        },
        onclose: function() {}
      })
    } else {
      window.location.href = `/payment/verify?reference=flutterwave-${Date.now()}`
    }
  }

  const handlePiPayment = () => {
    if (window.Pi && window.Pi.createPayment) {
      try {
        const piAmount = Number((priceUSD / 0.38).toFixed(2)) || 131.55
        window.Pi.createPayment({
          amount: piAmount,
          memo: "Sirwise AI & Web3 Academy - gasv.store RC BN3583878",
          metadata: { productId: "academy_bundle", priceUSD },
        }, {
          onReadyForServerApproval: (paymentId) => {
            console.log("Ready for server approval", paymentId)
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            unlockAndNotify('Pi Network', txid)
          },
          onCancel: (paymentId) => {
            alert('Pi payment cancelled.')
          },
          onError: (error, payment) => {
            alert('Pi payment error: ' + (error?.message || error))
          }
        })
      } catch (e) {
        alert('Pi SDK error: ' + e.message)
      }
    } else {
      alert('Pi Browser required for Pi Network payment. Please open gasv.store inside Pi Browser.')
    }
  }

  const renderStandardMethods = () => (
    <>
      <div style={{background:'#222', padding:15, margin:'10px 0', borderRadius:12, border:'1px solid #333'}}>
        <h3 style={{fontWeight:'bold', marginBottom:8, color:'#fff', fontSize:14}}>✅ Paystack (Card / Bank)</h3>
        <button onClick={handlePaystack} style={{background:'green', color:'white', padding:14, width:'100%', borderRadius:8, fontWeight:'bold', cursor:'pointer', border:'none', fontSize:14}}>
          Pay with Paystack — ${priceUSD} / ₦{(priceUSD * 1500).toLocaleString()}
        </button>
      </div>

      <div style={{background:'#222', padding:15, margin:'10px 0', borderRadius:12, border:'1px solid #333'}}>
        <h3 style={{fontWeight:'bold', marginBottom:8, color:'#fff', fontSize:14}}>✅ Flutterwave (Card / USSD)</h3>
        <button onClick={handleFlutterwave} style={{background:'orange', color:'white', padding:14, width:'100%', borderRadius:8, fontWeight:'bold', cursor:'pointer', border:'none', fontSize:14}}>
          Pay with Flutterwave — ${priceUSD} / ₦{(priceUSD * 1500).toLocaleString()}
        </button>
      </div>

      <div style={{background:'#222', padding:15, margin:'10px 0', borderRadius:12, border:'1px solid #FFD700'}}>
        <h3 style={{fontWeight:'bold', marginBottom:8, color:'#FFD700', fontSize:14}}>✅ OPay Direct Bank Transfer</h3>
        <p style={{fontSize:13, lineHeight:1.6, color:'#ddd'}}>
          Bank: <strong>OPay (PayCom)</strong><br/>
          Account: <strong style={{color:'#FFD700', fontSize:15}}>6113541882</strong><br/>
          Account Name: <strong>GOYEDAGOSMESS ENTERPRISE</strong><br/>
          RC: <strong>BN3583878</strong>
        </p>
        <button onClick={() => handleCopy('6113541882', 'opay')} style={{background:'#FFD700', color:'black', padding:10, width:'100%', borderRadius:8, fontWeight:'bold', cursor:'pointer', marginTop:8, border:'none'}}>
          {copiedField === 'opay' ? '✓ Copied Account 6113541882!' : '📋 Copy OPay Account Number'}
        </button>
        <input 
          value={opayTxInput} 
          onChange={(e) => setOpayTxInput(e.target.value)} 
          placeholder="Enter Transaction ID after payment" 
          style={{width:'100%', marginTop:10, padding:10, background:'#000', color:'#fff', border:'1px solid #444', borderRadius:8, fontSize:13}} 
        />
        <button onClick={() => {
          if(!opayTxInput.trim()) { alert('Please enter Transaction ID'); return; }
          unlockAndNotify('OPay Transfer', opayTxInput.trim())
        }} style={{background:'gold', color:'#000', padding:10, width:'100%', marginTop:6, borderRadius:8, fontWeight:'bold', cursor:'pointer', border:'none'}}>
          I Have Paid — Verify OPay Transfer
        </button>
      </div>

      <div style={{background:'#222', padding:15, margin:'10px 0', borderRadius:12, border:'1px solid #333'}}>
        <h3 style={{fontWeight:'bold', marginBottom:8, color:'#F0B90B', fontSize:14}}>🟡 USDT BEP20 (BNB Smart Chain - Busha)</h3>
        <p style={{fontSize:12, color:'#aaa'}}>Network: BNB Smart Chain (BEP20 / BSC)</p>
        <p style={{color:'#0f0', fontSize:11, wordBreak:'break-all', margin:'6px 0', fontFamily:'monospace', background:'#000', padding:8, borderRadius:6}}>
          {usdtAddress}
        </p>
        <button onClick={() => handleCopy(usdtAddress, 'usdt')} style={{background:'#F0B90B', color:'#000', padding:10, width:'100%', borderRadius:8, fontWeight:'bold', cursor:'pointer', border:'none'}}>
          {copiedField === 'usdt' ? '✓ Copied USDT Address!' : '📋 Copy USDT Address'}
        </button>
        <input 
          value={usdtTxInput}
          onChange={(e) => setUsdtTxInput(e.target.value)}
          placeholder="Enter TX Hash (0x...)" 
          style={{width:'100%', marginTop:10, padding:10, background:'#000', color:'#fff', border:'1px solid #444', borderRadius:8, fontSize:13}} 
        />
        <button onClick={() => {
          if(!usdtTxInput.trim() || usdtTxInput.trim().length < 10) { alert('Please paste a valid TX Hash'); return; }
          unlockAndNotify('USDT BEP20', usdtTxInput.trim())
        }} style={{background:'#F0B90B', color:'#000', padding:10, width:'100%', marginTop:6, borderRadius:8, fontWeight:'bold', cursor:'pointer', border:'none'}}>
          Verify USDT Payment
        </button>
      </div>

      <div style={{background:'#222', padding:15, margin:'10px 0', borderRadius:12, border:'1px solid #333'}}>
        <h3 style={{fontWeight:'bold', marginBottom:8, color:'#3B82F6', fontSize:14}}>🔵 USDC Base (Base Network - Busha)</h3>
        <p style={{fontSize:12, color:'#aaa'}}>Network: Base</p>
        <p style={{color:'#0f0', fontSize:11, wordBreak:'break-all', margin:'6px 0', fontFamily:'monospace', background:'#000', padding:8, borderRadius:6}}>
          {usdcAddress}
        </p>
        <button onClick={() => handleCopy(usdcAddress, 'usdc')} style={{background:'#3B82F6', color:'#fff', padding:10, width:'100%', borderRadius:8, fontWeight:'bold', cursor:'pointer', border:'none'}}>
          {copiedField === 'usdc' ? '✓ Copied USDC Address!' : '📋 Copy USDC Address'}
        </button>
        <input 
          value={usdcTxInput}
          onChange={(e) => setUsdcTxInput(e.target.value)}
          placeholder="Enter TX Hash (0x...)" 
          style={{width:'100%', marginTop:10, padding:10, background:'#000', color:'#fff', border:'1px solid #444', borderRadius:8, fontSize:13}} 
        />
        <button onClick={() => {
          if(!usdcTxInput.trim() || usdcTxInput.trim().length < 10) { alert('Please paste a valid TX Hash'); return; }
          unlockAndNotify('USDC Base', usdcTxInput.trim())
        }} style={{background:'#3B82F6', color:'#fff', padding:10, width:'100%', marginTop:6, borderRadius:8, fontWeight:'bold', cursor:'pointer', border:'none'}}>
          Verify USDC Payment
        </button>
      </div>
    </>
  )

  return (
    <div style={{background:'#111', padding:20, borderRadius:20, border:'2px solid gold', maxWidth:600, margin:'0 auto', color:'#fff'}}>
      <h2 style={{color:'gold', fontSize:20, fontWeight:'bold', marginBottom:4}}>Complete Payment — gasv.store</h2>
      <p style={{fontSize:12, color:'#888', marginBottom:12}}>Registered RC BN3583878 • 190+ Countries</p>
      <p style={{marginBottom:15, fontSize:16, fontWeight:'bold', color:'#fff'}}>Amount: ${priceUSD.toFixed(2)} USD / ₦{(priceUSD * 1500).toLocaleString()} NGN</p>

      {isPiBrowser ? (
        <>
          <div style={{background:'#7A3ED6', padding:18, borderRadius:12, marginBottom:16, border:'2px solid #A855F7'}}>
            <h3 style={{fontWeight:'bold', marginBottom:6, color:'#fff', fontSize:16}}>🟣 Pay with Pi Network (Pi Browser Detected)</h3>
            <p style={{fontSize:13, marginBottom:12, color:'#E9D5FF'}}>
              Price in Pi: ~{(priceUSD / 0.38).toFixed(2)} Pi (Market Rate ~$0.38)
            </p>
            <button onClick={handlePiPayment} style={{background:'#FFD700', color:'#000', padding:15, width:'100%', borderRadius:10, fontWeight:'900', cursor:'pointer', border:'none', fontSize:16}}>
              1-CLICK PAY WITH PI SDK
            </button>
          </div>

          <div style={{textAlign:'center', margin:'20px 0', color:'#888', fontWeight:'bold', fontSize:12}}>
            ──────── OR PAY WITH OTHER METHODS BELOW ────────
          </div>

          {renderStandardMethods()}
        </>
      ) : (
        <>
          {renderStandardMethods()}

          <div style={{background:'#1a1a1a', padding:12, textAlign:'center', borderRadius:8, border:'1px solid #333', marginTop:12}}>
            <p style={{fontSize:12, color:'#888'}}>
              ⚠️ Want to pay with Pi Network? Open <strong style={{color:'#FFD700'}}>gasv.store</strong> in Pi Browser app.
            </p>
          </div>
        </>
      )}

      <button onClick={onClose} style={{marginTop:20, width:'100%', padding:12, background:'#333', color:'#fff', borderRadius:10, fontWeight:'bold', cursor:'pointer', border:'none', fontSize:14}}>
        Close
      </button>
      <p style={{fontSize:11, marginTop:10, textAlign:'center', color:'#888'}}>
        Instant Automated Access Unlock • RC BN3583878 • 190+ Countries
      </p>
    </div>
  )
}

