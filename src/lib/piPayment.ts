// src/lib/piPayment.ts - Pi Payment with Server Approval
export async function payWithPi(piPrice: number, productName: string, productId: string): Promise<boolean> {
  if (!(window as any).Pi) { alert('Open in Pi Browser'); return false; }
  try {
    await (window as any).Pi.init({ version: '2.0' });
    await (window as any).Pi.createPayment(
      { amount: piPrice, memo: productName, metadata: { productId, productName, piPrice } },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          // MUST call backend, backend MUST call Pi Platform approve in <10 sec
          const res = await fetch('/api/pi/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          });
          if (!res.ok) throw new Error('Approve failed');
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          const res = await fetch('/api/pi/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid, productId })
          });
          if (res.ok) {
            localStorage.setItem(`paid_${productId}`, 'true');
            return true;
          }
          return false;
        },
        onCancel: () => { console.log('Cancelled'); },
        onError: (e: any) => { console.error(e); alert('Pi Payment failed: ' + (e?.message || 'Try again')); }
      }
    );
    return true;
  } catch (e) { console.error(e); return false; }
}
