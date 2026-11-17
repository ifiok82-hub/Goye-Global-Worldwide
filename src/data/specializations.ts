export interface Specialization {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  category: 'WEB3' | 'AI' | 'Design & Branding' | 'Marketing' | 'Digital Operations' | 'Academy';
  icon?: string;
  image: string;
  imageAlt: string;
  turnaround: string;
  piPrice: number;
  deliverables: string[];
  fullOverview: string;
  whoIsItFor: string;
}

export const SPECIALIZATIONS: Specialization[] = [
  {
    id: 'uiux-web-dev-training',
    number: 1,
    title: 'UI/UX Design & Web Development Training',
    shortDesc: 'Design responsive UI/UX design systems in Figma and build production web apps with React & Tailwind CSS.',
    category: 'Academy',
    image: '/images/specializations/uiux_design_laptop_1791357324507.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy UI/UX Design & Web Development Training',
    turnaround: 'Self-paced modules + Weekly live mentorship',
    piPrice: 1,
    deliverables: [
      'Figma Component Architecture & Design System Mastery Lessons',
      'Modern Web Stack Tutorials (HTML5, Tailwind CSS, React, Next.js)',
      '5 Real-World Portfolio Project Source Codes',
      'Verifiable Sirwise AI Academy Certificate with QR Code'
    ],
    fullOverview: 'Learn how to design sleek, user-centered digital interfaces in Figma and translate them into responsive, production-ready web applications with practical hands-on projects.',
    whoIsItFor: 'Aspiring product designers, frontend web builders, and freelancers looking for global client contracts.'
  },
  {
    id: 'digital-recharge-voucher-systems',
    number: 2,
    title: 'Digital Recharge & Voucher Systems',
    shortDesc: 'Instant telecom E-PINs, airtime, and global data bundles delivered electronically 24/7.',
    category: 'Digital Operations',
    image: '/images/specializations/digital_recharge_voucher_1791357335034.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital Recharge & Voucher Systems',
    turnaround: 'Instant / 5-15 minutes digital delivery via WhatsApp',
    piPrice: 0.5,
    deliverables: [
      'Electronic E-PIN Vouchers sent via WhatsApp (+2348033584736) & Email',
      'Automated Virtual Top-Up & Data Bundle Confirmation Slip',
      'Encrypted Transaction Reference & Downloadable Receipt',
      '24/7 Global Telecom Carrier Support via WhatsApp'
    ],
    fullOverview: 'Instant digital delivery of telecom airtime, high-speed data bundles, and digital utility vouchers. Sent securely in electronic format via WhatsApp (+2348033584736) and email across 200+ telecom networks.',
    whoIsItFor: 'Remote workers, international travelers, digital agencies, and individuals needing fast telecom digital connectivity.'
  },
  {
    id: 'digital-documentation-archiving',
    number: 3,
    title: 'Digital Documentation & Archiving',
    shortDesc: 'OCR text recognition, encrypted cloud archives, and ISO 15489 compliant document management.',
    category: 'Digital Operations',
    image: '/images/specializations/documentation_archiving_scanner_1791357344446.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital Documentation & Archiving',
    turnaround: '24-48 hours soft copy digital delivery',
    piPrice: 0.5,
    deliverables: [
      'OCR-Searchable High-Compression PDF Archives',
      'Encrypted Cloud Folder Link (Secure Zip Download)',
      'Digital Document Index Spreadsheet & Metadata Cataloging',
      'Strict Privacy & 30-Day Auto File Purging Protocol'
    ],
    fullOverview: 'Convert document scans and unstructured files into searchable, encrypted, and neatly organized electronic archives under ISO 15489 records management standards.',
    whoIsItFor: 'Legal firms, medical clinics, schools, businesses, and professionals migrating to paperless digital operations.'
  },
  {
    id: 'sirwise-certification-programs',
    number: 4,
    title: 'Sirwise AI WEB3 Academy Certification Programs',
    shortDesc: 'Accredited e-learning courses with tamper-proof blockchain hash and publicly verifiable QR code credential.',
    category: 'Academy',
    image: '/images/specializations/sirwise_certification_credential_1791357353279.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Certification Programs',
    turnaround: 'Self-paced curriculum + Instant certificate upon assessment pass',
    piPrice: 2,
    deliverables: [
      'All 8 Master Modules in Applied AI, Web3 & Digital Systems',
      'Verifiable Digital Certificate with Unique Credential ID & QR Code',
      'Cryptographically Signed Blockchain Hash Verification',
      'Lifetime Access to the Sirwise Student Portal & Career Community'
    ],
    fullOverview: 'The flagship academic program by Goyedagosmess Enterprise. Comprehensive mastery of applied artificial intelligence, Web3 protocols, decentralized commerce, and digital entrepreneurship.',
    whoIsItFor: 'Serious pioneers, career switchers, and professionals building verifiable credentials for international opportunities.'
  },
  {
    id: 'defi-yield-farming',
    number: 5,
    title: 'DeFi Yield Farming',
    shortDesc: 'Automated market makers, liquidity pool provisioning, staking protocols, and non-custodial APY.',
    category: 'WEB3',
    image: '/images/specializations/defi_yield_farming_1791357364300.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy DeFi Yield Farming',
    turnaround: 'Instant digital curriculum / 1-on-1 scheduled sessions',
    piPrice: 1,
    deliverables: [
      'DeFi Yield Farming & Liquidity Provision Playbook',
      'Impermanent Loss Mitigation & Risk Management Framework',
      'Cross-Chain Bridge Security & Staking Strategy Guides',
      '1-on-1 Live Portfolio Walkthrough via WhatsApp or Google Meet'
    ],
    fullOverview: 'Demystify decentralized finance safely. Learn liquidity pools, automated market makers (AMMs), staking mechanisms, and non-custodial wallet security.',
    whoIsItFor: 'Beginners and intermediate learners seeking structured Web3 & DeFi education.'
  },
  {
    id: 'risk-management-cold-storage',
    number: 6,
    title: 'Risk Management & Cold Storage',
    shortDesc: 'Hardware wallet custody, air-gapped multisig security, seed backup protocols, and asset protection.',
    category: 'WEB3',
    image: '/images/specializations/cold_storage_vault_1791357375533.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Risk Management & Cold Storage',
    turnaround: 'Instant digital curriculum / Live security audit session',
    piPrice: 1,
    deliverables: [
      'Hardware Wallet Setup & Air-Gapped Key Storage Masterclass',
      'Multisig Class III Vault Architecture Guide',
      'Seed Phrase Disaster Recovery & Inheritance Planning SOP',
      'Direct Security Consultation Call via WhatsApp / Google Meet'
    ],
    fullOverview: 'Cryptographic custody training. Learn how to isolate private keys using hardware wallets, configure air-gapped signing environments, and avoid phishing attacks.',
    whoIsItFor: 'Digital asset holders, treasury managers, and Web3 builders requiring strong security.'
  },
  {
    id: 'digital-branding-epassport',
    number: 7,
    title: 'Digital Branding & E-Passport',
    shortDesc: 'Digital passport layouts, biometric electronic identity kits, and corporate brand identity packages.',
    category: 'Design & Branding',
    image: '/images/specializations/digital_branding_passport_1791357386594.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital Branding & E-Passport',
    turnaround: '24-48 hours soft copy digital delivery',
    piPrice: 0.5,
    deliverables: [
      'Vector E-Passport Layout Design (Ultra-High Resolution PDF/PNG)',
      'Digital Corporate Brand Identity Kit (Palette, Typography, Logo Specs)',
      'Biometric Style Digital Profile Card with Verification QR',
      'Delivered strictly in electronic soft copy via Email & WhatsApp'
    ],
    fullOverview: 'High-precision layout design for electronic documentation, digital creative assets, portfolio layouts, and custom corporate identity packages.',
    whoIsItFor: 'Digital creators, organizations designing digital badges, and branding agencies.'
  },
  {
    id: 'smart-contract-development',
    number: 8,
    title: 'Smart Contract Development',
    shortDesc: 'Solidity programming, Hardhat testing, token architecture, and contract auditing.',
    category: 'WEB3',
    image: '/images/specializations/smart_contract_solidity_1791357396617.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Smart Contract Development',
    turnaround: '48-72 hours soft copy code delivery & testnet deployment',
    piPrice: 1,
    deliverables: [
      'Production-Ready Solidity Code (.sol files & GitHub repository)',
      'Hardhat / Foundry Unit Test Suites',
      'Security Audit Checklist & Gas Optimization Analysis',
      'Developer Walkthrough and Testnet Deployment Guidance'
    ],
    fullOverview: 'End-to-end smart contract architecture. Write, test, and audit Solidity token contracts, escrow systems, and staking protocols.',
    whoIsItFor: 'Web3 startups, blockchain developers, and decentralized business ventures.'
  },
  {
    id: 'crypto-digital-marketing',
    number: 9,
    title: 'Crypto & Digital Marketing',
    shortDesc: 'Social media growth, conversion copywriting, community acquisition, and campaign blueprints.',
    category: 'Marketing',
    image: '/images/specializations/crypto_digital_marketing_1791357405791.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Crypto & Digital Marketing',
    turnaround: '48-72 hours strategy roadmap delivery',
    piPrice: 1,
    deliverables: [
      '30-Day Multi-Channel Growth & Content Blueprint (PDF)',
      'Web3 Community Growth Strategy (Telegram, X, Discord)',
      'WhatsApp Business Automated Sales Funnel Setup Scripts',
      'High-Converting Copy & Campaign Brief Templates'
    ],
    fullOverview: 'Accelerate your client acquisition and online brand reach with structured growth blueprints and community building strategies.',
    whoIsItFor: 'Online business owners, agency founders, Web3 marketers, and service providers.'
  },
  {
    id: 'web3-blockchain-training',
    number: 10,
    title: 'WEB3 & Blockchain Technology Training',
    shortDesc: 'Comprehensive fundamentals in distributed ledgers, peer-to-peer protocols, and decentralized apps.',
    category: 'WEB3',
    image: '/images/specializations/web3_blockchain_training_1791357430235.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy WEB3 & Blockchain Technology Training',
    turnaround: 'Instant digital curriculum / Weekly Live Cohort',
    piPrice: 1,
    deliverables: [
      'Comprehensive Web3 Video Curriculum & PDF Modules',
      'Smart Contract & DApp Interaction Lab Files',
      'Live Mentorship via Google Meet / Zoom',
      'Verifiable Sirwise AI Academy Certificate of Completion'
    ],
    fullOverview: 'Master decentralized architecture from zero to advanced. Understand distributed ledgers, peer-to-peer protocols, wallet security, and Web3 interfaces.',
    whoIsItFor: 'Tech enthusiasts, developers, students, and professionals entering the decentralized tech economy.'
  },
  {
    id: 'ai-training-solutions',
    number: 11,
    title: 'Artificial Intelligence (AI) Training & Solutions',
    shortDesc: 'Generative AI tools, prompt engineering masterclasses, custom GPT setups, and automated workflows.',
    category: 'AI',
    image: '/images/specializations/ai_training_solutions_1791357439223.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Artificial Intelligence (AI) Training & Solutions',
    turnaround: 'Instant access / 24-48 hours bespoke automation setup',
    piPrice: 1,
    deliverables: [
      '1,000+ Master Copy-Paste Prompt Engineering Library',
      'AI Workflow Automation Video Tutorials & Step-by-Step SOPs',
      'Custom GPTs & Autonomous Agent Setup Templates',
      'Certificate in Applied AI Prompting & Operations'
    ],
    fullOverview: 'Learn to leverage modern Large Language Models and generative AI tools to improve business productivity across prompt engineering and workflow automation.',
    whoIsItFor: 'Entrepreneurs, content creators, digital marketers, agency owners, and corporate teams.'
  },
  {
    id: 'graphic-design-creativity',
    number: 12,
    title: 'Graphic Design & Digital Creativity',
    shortDesc: 'Professional logo design, social media flyers, and corporate brand creative suites delivered in soft copy.',
    category: 'Design & Branding',
    image: '/images/specializations/graphic_design_studio_1791357449970.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Graphic Design & Digital Creativity',
    turnaround: '24-48 hours soft copy digital delivery',
    piPrice: 0.5,
    deliverables: [
      'High-Resolution Print-Ready Soft Copy (PDF, JPG, PNG)',
      'Vector Master Files (SVG / Editable Source File)',
      'Social Media Formats (Square, Story, Banner specs)',
      '2 Rounds of Free Revisions included'
    ],
    fullOverview: 'Professional digital branding. We craft modern logos, social media creatives, corporate pitch decks, flyers, and digital marketing banners delivered directly to your Email and WhatsApp.',
    whoIsItFor: 'Online brands, digital sellers, businesses, event planners, and digital service providers.'
  },
  {
    id: 'digital-id-card-design',
    number: 13,
    title: 'Digital ID Card Design & Digital Branding',
    shortDesc: 'Custom electronic employee and membership ID cards with scannable QR verification delivered in soft copy.',
    category: 'Design & Branding',
    image: '/images/specializations/digital_id_card_1791357459510.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital ID Card Design & Digital Branding',
    turnaround: '24-48 hours soft copy digital delivery',
    piPrice: 0.5,
    deliverables: [
      'Soft Copy Front & Back ID Card Design (Ultra HD PDF & PNG)',
      'Scannable Digital QR Code Embedding for Staff/Member Verification',
      'Electronic Digital Business Card (vCard format)',
      'Ready-to-print soft copy layout specifications'
    ],
    fullOverview: 'Custom electronic identification kits for companies, academic institutions, clubs, and remote teams. Delivered 100% digitally in soft copy with scannable QR verification code.',
    whoIsItFor: 'Companies, organizations, clubs, schools, and private enterprises needing corporate digital identity assets.'
  }
];
