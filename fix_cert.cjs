const fs = require('fs');
let code = fs.readFileSync('src/components/CertificateGenerator.tsx', 'utf8');

const lastPart = `          </div>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const correctLastPart = `          </div>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(lastPart, correctLastPart);
fs.writeFileSync('src/components/CertificateGenerator.tsx', code);
