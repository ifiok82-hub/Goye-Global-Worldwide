const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const badgeHTML = `
            <div className="mt-8 pt-6 border-t border-[#333] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-[#10B981] font-bold">
                <Lock size={14} /> 256-Bit SSL Encrypted & PCI-DSS Compliant
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck size={12} /> Verified Business: RC BN3583773
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <Zap size={12} /> Instant Automated Delivery
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck size={12} /> Scam-Proof Direct Gateway Integration
              </div>
            </div>
          </div>
`;
code = code.replace("        </div>\n      </div>\n    </div>\n  );", badgeHTML + "      </div>\n    </div>\n  );");

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
