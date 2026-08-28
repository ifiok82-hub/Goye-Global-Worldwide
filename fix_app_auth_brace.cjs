const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `</svg>
            <span className="text-[10px] font-bold">MY DOWNLOADS</span>
          </button>
        </div>
      </div>`;

const replace = `</svg>
            <span className="text-[10px] font-bold">MY DOWNLOADS</span>
          </button>
        </div>
      </div>}`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
