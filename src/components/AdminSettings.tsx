import React, { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [piApiKey, setPiApiKey] = useState('');
  const [piWalletAddress, setPiWalletAddress] = useState('');
  const [piSandbox, setPiSandbox] = useState('true');
  const [paystackKey, setPaystackKey] = useState('');
  const [flutterwaveKey, setFlutterwaveKey] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96');
  const [usdcAddress, setUsdcAddress] = useState('0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96');
  const [opayAccount, setOpayAccount] = useState('6113541882');
  const [opayName, setOpayName] = useState('GOYE STORE GLOBAL / GOYEDAGOSMESS ENTERPRISE');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    // Load local storage keys
    const piKey = localStorage.getItem('PI_API_KEY') || '';
    const piWallet = localStorage.getItem('PI_WALLET_ADDRESS') || '';
    const sandbox = localStorage.getItem('PI_SANDBOX') || 'true';
    const paystack = localStorage.getItem('PAYSTACK_KEY') || localStorage.getItem('PAYSTACK_PUBLIC_KEY') || '';
    const flutterwave = localStorage.getItem('FLUTTERWAVE_KEY') || localStorage.getItem('FLUTTERWAVE_PUBLIC_KEY') || '';
    const usdt = localStorage.getItem('USDT_ADDRESS') || '0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96';
    const usdc = localStorage.getItem('USDC_ADDRESS') || '0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96';
    const opayAcc = localStorage.getItem('OPAY_ACCOUNT') || '6113541882';
    const opayNm = localStorage.getItem('OPAY_NAME') || 'GOYE STORE GLOBAL / GOYEDAGOSMESS ENTERPRISE';

    setPiApiKey(piKey);
    setPiWalletAddress(piWallet);
    setPiSandbox(sandbox);
    setPaystackKey(paystack);
    setFlutterwaveKey(flutterwave);
    setUsdtAddress(usdt);
    setUsdcAddress(usdc);
    setOpayAccount(opayAcc);
    setOpayName(opayNm);

    // Also try fetching keys from server
    fetch('/api/admin/keys')
      .then(r => r.json())
      .then(d => {
        if (d) {
          if (d.pi_api_key) setPiApiKey(d.pi_api_key);
          if (d.pi_wallet) setPiWalletAddress(d.pi_wallet);
          if (d.pi_sandbox) setPiSandbox(d.pi_sandbox);
          if (d.paystack) setPaystackKey(d.paystack);
          if (d.flutterwave) setFlutterwaveKey(d.flutterwave);
          if (d.usdt) setUsdtAddress(d.usdt);
          if (d.usdc) setUsdcAddress(d.usdc);
          if (d.opay) setOpayAccount(d.opay);
          if (d.opay_name) setOpayName(d.opay_name);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAllKeys = async () => {
    localStorage.setItem('PI_API_KEY', piApiKey);
    localStorage.setItem('PI_WALLET_ADDRESS', piWalletAddress);
    localStorage.setItem('PI_SANDBOX', piSandbox);
    localStorage.setItem('PAYSTACK_KEY', paystackKey);
    localStorage.setItem('PAYSTACK_PUBLIC_KEY', paystackKey);
    localStorage.setItem('FLUTTERWAVE_KEY', flutterwaveKey);
    localStorage.setItem('FLUTTERWAVE_PUBLIC_KEY', flutterwaveKey);
    localStorage.setItem('USDT_ADDRESS', usdtAddress);
    localStorage.setItem('USDC_ADDRESS', usdcAddress);
    localStorage.setItem('OPAY_ACCOUNT', opayAccount);
    localStorage.setItem('OPAY_NAME', opayName);

    const payload = {
      pi_api_key: piApiKey,
      pi_wallet: piWalletAddress,
      pi_sandbox: piSandbox,
      paystack: paystackKey,
      flutterwave: flutterwaveKey,
      usdt: usdtAddress,
      usdc: usdcAddress,
      opay: opayAccount,
      opay_name: opayName
    };

    try {
      await fetch('/api/admin/save-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const msg = `✅ Keys Saved! PI_API_KEY saved: ${piApiKey ? 'YES - Now test Pi Testnet 10/10' : 'Empty - Paste Pi API Key'} - RC BN3583773`;
      setSavedStatus(msg);
      alert(msg);
    } catch (e) {
      const msg = `✅ Keys Saved Locally! Now test Pi - RC BN3583773`;
      setSavedStatus(msg);
      alert(msg);
    }
  };

  return (
    <div style={{ background: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#FFD700', fontWeight: 900, fontSize: '24px', marginBottom: '8px' }}>
          🔧 Admin Settings - Paste Your Keys - RC BN3583773
        </h1>
        <p style={{ color: '#888', fontSize: '12px', marginBottom: '20px' }}>
          Paste keys here, click Save, then test Pi Testnet 10/10. Keys saved to browser + server.
        </p>

        {savedStatus && (
          <div style={{ background: '#10B981', color: 'black', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', marginBottom: '16px' }}>
            {savedStatus}
          </div>
        )}

        {/* PI NETWORK SECTION */}
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '16px', marginTop: '20px' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            🟣 Pi Network - For Testnet 10/10 GREEN
          </h3>
          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>
            PI_API_KEY (From develop.pi -&gt; Your App -&gt; API Keys - Starts with letters) - REQUIRED FOR GREEN CHECK
          </label>
          <input
            id="pi_api_key"
            value={piApiKey}
            onChange={(e) => setPiApiKey(e.target.value)}
            placeholder="Paste PI_API_KEY from develop.pi here"
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #FFD700', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />
          <p style={{ color: '#888', fontSize: '10px', marginTop: '4px' }}>
            Get it: https://develop.pi -&gt; Click gasv.store app -&gt; API Keys -&gt; Copy Key -&gt; Paste here
          </p>

          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', marginTop: '12px', display: 'block' }}>
            Pi Mainnet Wallet Address (For manual Pi payments - Starts with G...)
          </label>
          <input
            id="pi_wallet_address"
            value={piWalletAddress}
            onChange={(e) => setPiWalletAddress(e.target.value)}
            placeholder="GXXXXXXXXXXXXXXXXXXXXXXX - Your Pi Mainnet wallet"
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />

          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', marginTop: '12px', display: 'block' }}>
            Pi App Sandbox Mode (For Testnet 10/10)
          </label>
          <select
            id="pi_sandbox"
            value={piSandbox}
            onChange={(e) => setPiSandbox(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', marginTop: '8px', fontSize: '13px' }}
          >
            <option value="true">true - Testnet (For 10/10 green checklist)</option>
            <option value="false">false - Mainnet (After approval)</option>
          </select>
        </div>

        {/* PAYSTACK & FLUTTERWAVE */}
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '16px', marginTop: '16px' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            💳 Paystack &amp; Flutterwave - For $1 / $49.99 Cards
          </h3>
          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>
            Paystack Public Key (pk_live_... or pk_test_...)
          </label>
          <input
            id="paystack_key"
            value={paystackKey}
            onChange={(e) => setPaystackKey(e.target.value)}
            placeholder="pk_live_... from paystack.com dashboard"
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />

          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', marginTop: '8px', display: 'block' }}>
            Flutterwave Public Key (FLWPUBK_...)
          </label>
          <input
            id="flutterwave_key"
            value={flutterwaveKey}
            onChange={(e) => setFlutterwaveKey(e.target.value)}
            placeholder="FLWPUBK_... from flutterwave.com dashboard"
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />
        </div>

        {/* CRYPTO & BANK */}
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '16px', marginTop: '16px' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            🪙 Crypto &amp; Bank - For Auto Confirmation
          </h3>
          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>
            USDT BEP20 BSC Address (0x...)
          </label>
          <input
            id="usdt_address"
            value={usdtAddress}
            onChange={(e) => setUsdtAddress(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />

          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', marginTop: '8px', display: 'block' }}>
            USDC Base/BSC Address (0x...)
          </label>
          <input
            id="usdc_address"
            value={usdcAddress}
            onChange={(e) => setUsdcAddress(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />

          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', marginTop: '8px', display: 'block' }}>
            OPay Account Number - GOYE STORE GLOBAL
          </label>
          <input
            id="opay_account"
            value={opayAccount}
            onChange={(e) => setOpayAccount(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />

          <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', marginTop: '8px', display: 'block' }}>
            OPay Account Name
          </label>
          <input
            id="opay_name"
            value={opayName}
            onChange={(e) => setOpayName(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333', borderRadius: '8px', margin: '8px 0', fontSize: '13px' }}
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSaveAllKeys}
          style={{
            background: '#FFD700',
            color: 'black',
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 900,
            marginTop: '20px',
            cursor: 'pointer',
            border: 'none',
            fontSize: '15px'
          }}
        >
          💾 SAVE ALL KEYS - THEN TEST PI TESTNET
        </button>

        {/* INSTRUCTIONS */}
        <div style={{ background: '#1a1a00', borderRadius: '12px', padding: '14px', marginTop: '16px', border: '1px solid #FFD700' }}>
          <p style={{ color: '#FFD700', fontWeight: 800, fontSize: '12px', margin: 0 }}>
            HOW TO GET PI_API_KEY FOR 10/10 GREEN:
          </p>
          <p style={{ color: 'white', fontSize: '11px', marginTop: '6px', lineHeight: '1.5' }}>
            1. Go to https://develop.pi -&gt; Login with Pi account that owns gasv.store app<br />
            2. Click your App (gasv.store)<br />
            3. Left menu -&gt; API Keys -&gt; Copy the long key<br />
            4. Paste in box above -&gt; Click SAVE<br />
            5. Go to Pi Browser -&gt; gasv.store -&gt; Shop -&gt; Pi Testnet Payment Test (0.01 Pi) -&gt; BUY &amp; UNLOCK -&gt; Should NOT expire now!
          </p>
          <p style={{ color: '#10B981', fontSize: '11px', marginTop: '8px', fontWeight: 'bold' }}>
            Current Saved PI_API_KEY:{' '}
            <span id="current_pi_key">
              {piApiKey ? `${piApiKey.substring(0, 15)}... SAVED ✅` : 'NOT SAVED ❌ - Paste now'}
            </span>
          </p>
        </div>

        <button
          onClick={() => { window.location.hash = 'shop'; }}
          style={{
            background: 'white',
            color: 'black',
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 800,
            marginTop: '12px',
            cursor: 'pointer',
            border: 'none',
            fontSize: '14px'
          }}
        >
          🛒 Go Test Pi Payment Now - Shop
        </button>
      </div>
    </div>
  );
}
