const fs = require('fs');
let code = fs.readFileSync('src/components/CertificateGenerator.tsx', 'utf8');

// Remove instructorName
code = code.replace('const instructorName = "Ifiok Enyiema";', '');

// Update Footer / Signatures
const oldFooter = /\{\/\* Footer \/ Signatures \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>/s;
const newFooter = `{/* Footer / Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', marginTop: 'auto', alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '10px', marginBottom: '5px' }}>
                  {issueDate}
                </div>
                <div style={{ color: '#888', fontSize: '14px' }}>Date of Issuance</div>
              </div>
              <div style={{ textAlign: 'center', width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ padding: '8px', background: '#fff', borderRadius: '8px', marginBottom: '8px' }}>
                  <img src={"https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.gasv.store/verify"} alt="QR" style={{width:'80px', height:'80px', display:'block'}} />
                </div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: '2px' }}>ID: {certId}</div>
                <div style={{ color: '#eab308', fontSize: '12px', fontWeight: 'bold' }}>gasv.store/verify</div>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '10px', marginBottom: '5px', lineHeight: '1.2' }}>
                  Sirwise AI Web3 Academy<br/>GOYE Global Worldwide RC BN3583773
                </div>
                <div style={{ color: '#888', fontSize: '14px' }}>Verified by Blockchain</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

code = code.replace(oldFooter, newFooter);

fs.writeFileSync('src/components/CertificateGenerator.tsx', code);
