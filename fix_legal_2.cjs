const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `               </div>
            </div>

          </div>
        )}

        </main>`;

const replacementStr = `               </div>
            </div>

          </div>
        )}

        {tab === 'legal-tos' && (
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] animate-in fade-in max-w-4xl mx-auto mb-10">
            <h2 className="text-[#FFD700] text-2xl font-bold mb-4 border-b border-[#333] pb-2">Terms of Service</h2>
            <div className="text-gray-300 text-sm space-y-4">
              <p><strong>1. Digital Product Delivery</strong><br/>All products purchased on GOYE Store Global (including eSIMs, Academy Courses, and Digital Toolkits) are 100% digital. Upon successful payment verification (via Paystack, Flutterwave, Crypto, or Pi GCV), you will receive instant access to your product. For eSIMs, a QR code will be emailed to you securely.</p>
              <p><strong>2. Access & Usage</strong><br/>Purchased courses and downloads are tied to the email used during checkout. You may not distribute, resell, or share access links to premium content. Doing so will result in immediate revocation of your access without refund.</p>
              <p><strong>3. Payment Verification</strong><br/>Instant gateways (Paystack, Flutterwave) provide immediate access. Manual verification methods (Crypto USDC, Pi GCV, Bank Transfer) require on-chain or manual confirmation by our administration team before access is granted. This process is usually completed within 24 hours.</p>
            </div>
          </div>
        )}

        {tab === 'legal-privacy' && (
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] animate-in fade-in max-w-4xl mx-auto mb-10">
            <h2 className="text-[#FFD700] text-2xl font-bold mb-4 border-b border-[#333] pb-2">Privacy Policy</h2>
            <div className="text-gray-300 text-sm space-y-4">
              <p><strong>1. Data Collection</strong><br/>We only collect information necessary to process your orders and deliver digital goods. This includes your name, email address, and order history.</p>
              <p><strong>2. Payment Security</strong><br/>All payments are processed securely through certified gateways (Paystack, Flutterwave). We do not store or process your credit card details on our servers.</p>
              <p><strong>3. Data Protection</strong><br/>Your data is strictly protected and never sold to third-party marketers. We may use your email to send updates related to your purchases or important security notices regarding your account.</p>
            </div>
          </div>
        )}

        {tab === 'legal-refund' && (
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] animate-in fade-in max-w-4xl mx-auto mb-10">
            <h2 className="text-[#FFD700] text-2xl font-bold mb-4 border-b border-[#333] pb-2">Refund Policy</h2>
            <div className="text-gray-300 text-sm space-y-4">
              <p><strong>1. Digital Goods Non-Refundable</strong><br/>Due to the nature of digital goods (eSIMs, PDF guides, courses, prompts), all sales are strictly final. Once an access link, course login, or eSIM QR code has been generated and delivered, the product cannot be returned.</p>
              <p><strong>2. Failed Delivery Exceptions</strong><br/>In the rare event of a system failure where your payment is confirmed but you do not receive the product within 48 hours, please contact our support team. We will verify the transaction and manually issue your product.</p>
              <p><strong>3. Unauthorized Purchases</strong><br/>If you suspect an unauthorized purchase was made using your payment method, please contact your bank or payment provider immediately. We cooperate fully with fraud investigations.</p>
            </div>
          </div>
        )}

        </main>`;

if(code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  console.log("Legal tabs added successfully.");
} else {
  console.log("Could not find insertion point again!");
}
fs.writeFileSync('src/App.tsx', code);
