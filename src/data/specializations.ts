export interface Specialization {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  category: 'WEB3' | 'AI' | 'Design & Branding' | 'Marketing' | 'Digital Operations' | 'Academy';
  icon?: string;
  imageUrl: string;
  imageAlt: string;
  level: string;
  rating: number;
  ratingCount: number;
  badge: string;
  turnaround: string;
  priceNGN: number;
  priceUSD: number;
  deliverables: string[];
  fullOverview: string;
  whoIsItFor: string;
}

export const SPECIALIZATIONS: Specialization[] = [
  // 1. UI/UX DESIGN & WEB DEVELOPMENT TRAINING (Requested #1)
  {
    id: 'uiux-web-dev-training',
    number: 1,
    title: 'UI/UX Design & Web Development Training',
    shortDesc: 'Design responsive UI/UX design systems in Figma and build production web apps with React & Tailwind CSS.',
    category: 'Academy',
    imageUrl: '/images/specializations/uiux_design_laptop_1791357324507.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy UI/UX Design & Web Development Training',
    level: 'Beginner to Advanced',
    rating: 4.95,
    ratingCount: 1840,
    badge: 'TOP RATED COURSE',
    turnaround: 'Self-paced modules + Weekly live mentorship',
    priceNGN: 40000,
    priceUSD: 28,
    deliverables: [
      'Figma Component Architecture & Design System Mastery Lessons',
      'Modern Web Stack Tutorials (HTML5, Tailwind CSS, React, Next.js)',
      '5 Real-World Portfolio Project Source Codes',
      'Verifiable Sirwise AI Academy Certificate with QR Code'
    ],
    fullOverview: 'Learn how to design sleek, user-centered digital interfaces in Figma and translate them into responsive, production-ready web applications. Practical, hands-on, and focused on real-world client delivery following international Coursera and Udemy standards.',
    whoIsItFor: 'Aspiring product designers, frontend web builders, and freelancers looking for high-paying international client contracts.'
  },

  // 2. DIGITAL RECHARGE & VOUCHER SYSTEMS (Requested #2)
  {
    id: 'digital-recharge-voucher-systems',
    number: 2,
    title: 'Digital Recharge & Voucher Systems',
    shortDesc: 'Instant telecom E-PINs, airtime, and global data bundles delivered electronically 24/7.',
    category: 'Digital Operations',
    imageUrl: '/images/specializations/digital_recharge_voucher_1791357335034.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital Recharge & Voucher Systems',
    level: 'Professional',
    rating: 4.92,
    ratingCount: 3290,
    badge: 'INSTANT FULFILLMENT',
    turnaround: 'Instant / 5-15 minutes digital delivery via WhatsApp',
    priceNGN: 5000,
    priceUSD: 4,
    deliverables: [
      'Electronic E-PIN Vouchers sent via WhatsApp (+2348033584736) & Email',
      'Automated Virtual Top-Up & Data Bundle Confirmation Slip',
      'Encrypted Transaction Reference & Downloadable Receipt',
      '24/7 Global Telecom Carrier Support via WhatsApp'
    ],
    fullOverview: 'Instant digital delivery of telecom airtime, high-speed data bundles, and digital utility vouchers. Sent securely in electronic format via WhatsApp (+2348033584736) and email with zero delays across 200+ telecom networks.',
    whoIsItFor: 'Remote workers, international travelers, digital agencies, and individuals needing fast telecom digital connectivity.'
  },

  // 3. DIGITAL DOCUMENTATION & ARCHIVING (Requested #3)
  {
    id: 'digital-documentation-archiving',
    number: 3,
    title: 'Digital Documentation & Archiving',
    shortDesc: 'OCR text recognition, encrypted Google Drive cloud archives, and ISO 15489 compliant document management.',
    category: 'Digital Operations',
    imageUrl: '/images/specializations/documentation_archiving_scanner_1791357344446.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital Documentation & Archiving',
    level: 'Enterprise Standard',
    rating: 4.88,
    ratingCount: 940,
    badge: 'ISO 15489 COMPLIANT',
    turnaround: '24-48 hours soft copy digital delivery',
    priceNGN: 15000,
    priceUSD: 10,
    deliverables: [
      'OCR-Searchable High-Compression PDF Archives',
      'Encrypted Cloud Folder Link (Google Drive / Secure Zip Download)',
      'Digital Document Index Spreadsheet & Metadata Cataloging',
      'Strict Privacy & 30-Day Auto File Purging Protocol'
    ],
    fullOverview: 'Convert messy document scans and unstructured files into searchable, encrypted, and neatly organized electronic archives. Features OCR text indexing, secure PDF encryption, and metadata cataloging under ISO 15489 records management standards.',
    whoIsItFor: 'Legal firms, medical clinics, schools, businesses, and professionals migrating to 100% paperless digital operations.'
  },

  // 4. SIRWISE AI WEB3 ACADEMY CERTIFICATION PROGRAMS (Requested #4)
  {
    id: 'sirwise-certification-programs',
    number: 4,
    title: 'Sirwise AI WEB3 Academy Certification Programs',
    shortDesc: 'Accredited e-learning courses with tamper-proof blockchain hash and publicly verifiable QR code credential.',
    category: 'Academy',
    imageUrl: '/images/specializations/sirwise_certification_credential_1791357353279.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Sirwise AI WEB3 Academy Certification Programs',
    level: 'Accredited Credential',
    rating: 4.98,
    ratingCount: 2410,
    badge: 'GLOBAL ACCREDITATION',
    turnaround: 'Self-paced curriculum + Instant certificate upon assessment pass',
    priceNGN: 45000,
    priceUSD: 30,
    deliverables: [
      'All 8 Master Modules in Applied AI, Web3 & Digital Systems',
      'Verifiable Digital Certificate with Unique Credential ID & QR Code',
      'Cryptographically Signed Blockchain Hash Verification',
      'Lifetime Access to the Sirwise Student Portal & Career Community'
    ],
    fullOverview: 'The flagship academic program by Goyedagosmess Enterprise. Comprehensive mastery of applied artificial intelligence, Web3 protocols, decentralized commerce, and digital entrepreneurship with an accredited, publicly verifiable digital certificate.',
    whoIsItFor: 'Serious pioneers, career switchers, and professionals building verifiable credentials for international opportunities.'
  },

  // 5. DeFi YIELD FARMING (Requested #5)
  {
    id: 'defi-yield-farming',
    number: 5,
    title: 'DeFi Yield Farming',
    shortDesc: 'Automated market makers, liquidity pool provisioning, staking protocols, and maximizing non-custodial APY.',
    category: 'WEB3',
    imageUrl: '/images/specializations/defi_yield_farming_1791357364300.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy DeFi Yield Farming',
    level: 'Intermediate to Advanced',
    rating: 4.91,
    ratingCount: 1670,
    badge: 'BINANCE ACADEMY ALIGNED',
    turnaround: 'Instant digital curriculum / 1-on-1 scheduled sessions',
    priceNGN: 30000,
    priceUSD: 20,
    deliverables: [
      'DeFi Yield Farming & Liquidity Provision Playbook (Uniswap, PancakeSwap)',
      'Impermanent Loss Mitigation & APY Optimization Framework',
      'Cross-Chain Bridge Security & Staking Strategy Guides',
      '1-on-1 Live Portfolio Walkthrough via WhatsApp or Google Meet'
    ],
    fullOverview: 'Demystify decentralized finance without losing funds. Learn liquidity pools, automated market makers (AMMs), staking mechanisms, non-custodial wallet security, and institutional market cycles taught to international DeFi academy standards.',
    whoIsItFor: 'Beginners and intermediate investors seeking safe, knowledge-backed crypto understanding without speculation traps.'
  },

  // 6. RISK MANAGEMENT & COLD STORAGE (Requested #6)
  {
    id: 'risk-management-cold-storage',
    number: 6,
    title: 'Risk Management & Cold Storage',
    shortDesc: 'Ledger hardware wallet custody, air-gapped multisig security, seed backup protocols, and asset protection.',
    category: 'WEB3',
    imageUrl: '/images/specializations/cold_storage_vault_1791357375533.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Risk Management & Cold Storage',
    level: 'Professional Security',
    rating: 4.97,
    ratingCount: 1350,
    badge: 'SECURITY ESSENTIAL',
    turnaround: 'Instant digital curriculum / Live security audit session',
    priceNGN: 25000,
    priceUSD: 18,
    deliverables: [
      'Hardware Wallet Setup & Air-Gapped Key Storage Masterclass',
      'Multisig Class III Vault Architecture Guide (Safe / Gnosis)',
      'Seed Phrase Disaster Recovery & Inheritance Planning SOP',
      'Direct Security Consultation Call via WhatsApp / Google Meet'
    ],
    fullOverview: 'Institutional-grade cryptographic custody. Learn how to isolate private keys using hardware wallets (Ledger, Trezor), configure air-gapped signing environments, avoid phishing attack vectors, and safeguard digital wealth.',
    whoIsItFor: 'Crypto holders, high-net-worth investors, treasury managers, and Web3 founders requiring bulletproof security.'
  },

  // 7. DIGITAL BRANDING & E-PASSPORT (Requested #7)
  {
    id: 'digital-branding-epassport',
    number: 7,
    title: 'Digital Branding & E-Passport',
    shortDesc: 'Digital passport layouts, biometric electronic identity kits, and corporate brand identity packages.',
    category: 'Design & Branding',
    imageUrl: '/images/specializations/digital_branding_passport_1791357386594.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital Branding & E-Passport',
    level: 'Creative Professional',
    rating: 4.89,
    ratingCount: 1120,
    badge: 'PREMIUM ASSET PACK',
    turnaround: '24-48 hours soft copy digital delivery',
    priceNGN: 15000,
    priceUSD: 10,
    deliverables: [
      'Vector E-Passport Layout Design (Ultra-High Resolution PDF/PNG)',
      'Digital Corporate Brand Identity Kit (Palette, Typography, Logo Specs)',
      'Biometric Style Digital Profile Card with Verification QR',
      'Delivered strictly in electronic soft copy via Email & WhatsApp'
    ],
    fullOverview: 'High-precision layout design for electronic documentation, digital travel-themed creative assets, portfolio passports, and custom digital document layouts. 100% digital soft copy format delivered to your inbox.',
    whoIsItFor: 'Digital creators, organizations designing digital badges, global nomads, and branding agencies.'
  },

  // 8. SMART CONTRACT DEVELOPMENT (Requested #8)
  {
    id: 'smart-contract-development',
    number: 8,
    title: 'Smart Contract Development',
    shortDesc: 'Solidity programming, Hardhat testing, Ethereum & BSC token architecture, and contract auditing.',
    category: 'WEB3',
    imageUrl: '/images/specializations/smart_contract_solidity_1791357396617.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Smart Contract Development',
    level: 'Developer Track',
    rating: 4.96,
    ratingCount: 2150,
    badge: 'INDUSTRY STANDARD',
    turnaround: '48-72 hours soft copy code delivery & testnet deployment',
    priceNGN: 50000,
    priceUSD: 35,
    deliverables: [
      'Production-Ready Solidity Code (.sol files & GitHub repository)',
      'Hardhat / Foundry Unit Test Suites (100% coverage)',
      'Security Audit Checklist & Gas Optimization Analysis',
      'Developer Walkthrough and Testnet Deployment Guidance'
    ],
    fullOverview: 'End-to-end smart contract architecture. We write, audit, and deploy secure token contracts (ERC-20, BEP-20), NFT contracts (ERC-721/1155), escrow systems, and custom staking protocols for decentralized operations.',
    whoIsItFor: 'Web3 startups, crypto project founders, token creators, and decentralized business ventures.'
  },

  // 9. CRYPTO & DIGITAL MARKETING (Requested #9)
  {
    id: 'crypto-digital-marketing',
    number: 9,
    title: 'Crypto & Digital Marketing',
    shortDesc: 'Social media growth, conversion copywriting, community acquisition, and targeted campaign blueprints.',
    category: 'Marketing',
    imageUrl: '/images/specializations/crypto_digital_marketing_1791357405791.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Crypto & Digital Marketing',
    level: 'Strategic Growth',
    rating: 4.87,
    ratingCount: 1540,
    badge: 'PROVEN ROI',
    turnaround: '48-72 hours strategy roadmap delivery',
    priceNGN: 25000,
    priceUSD: 18,
    deliverables: [
      '30-Day Multi-Channel Growth & Content Blueprint (PDF)',
      'Crypto & Web3 Community Growth Strategy (Telegram, X, Discord)',
      'WhatsApp Business Automated Sales Funnel Setup Scripts',
      'High-Converting Ad Copy & Campaign Brief Templates'
    ],
    fullOverview: 'Accelerate your client acquisition and online brand reach. We deliver structured growth blueprints, high-converting organic sales strategies, paid ad setup guidelines, and WhatsApp automation funnels for measurable commercial returns.',
    whoIsItFor: 'Online business owners, agency founders, Web3 marketers, and service providers aiming to expand international revenue.'
  },

  // 10. WEB3 & BLOCKCHAIN TECHNOLOGY TRAINING
  {
    id: 'web3-blockchain-training',
    number: 10,
    title: 'WEB3 & Blockchain Technology Training',
    shortDesc: 'Comprehensive fundamentals in distributed ledgers, peer-to-peer protocols, and decentralized apps.',
    category: 'WEB3',
    imageUrl: '/images/specializations/web3_blockchain_training_1791357430235.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy WEB3 & Blockchain Technology Training',
    level: 'Foundational to Advanced',
    rating: 4.94,
    ratingCount: 2890,
    badge: 'CORE CURRICULUM',
    turnaround: 'Instant digital curriculum / Weekly Live Cohort',
    priceNGN: 35000,
    priceUSD: 25,
    deliverables: [
      'Comprehensive Web3 Video Curriculum & PDF Modules',
      'Smart Contract & DApp Interaction Lab Files',
      'Live Mentorship via Google Meet / Zoom',
      'Verifiable Sirwise AI Academy Certificate of Completion'
    ],
    fullOverview: 'Master decentralized architecture from zero to advanced. Understand distributed ledgers, peer-to-peer protocols, wallet security, EVM mechanics, and building production-grade Web3 interfaces.',
    whoIsItFor: 'Tech enthusiasts, developers, students, and professionals looking to break into the global decentralized tech economy.'
  },

  // 11. ARTIFICIAL INTELLIGENCE (AI) TRAINING & SOLUTIONS
  {
    id: 'ai-training-solutions',
    number: 11,
    title: 'Artificial Intelligence (AI) Training & Solutions',
    shortDesc: 'Generative AI tools, prompt engineering masterclasses, custom GPT setups, and automated business workflows.',
    category: 'AI',
    imageUrl: '/images/specializations/ai_training_solutions_1791357439223.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Artificial Intelligence (AI) Training & Solutions',
    level: 'All Levels',
    rating: 4.96,
    ratingCount: 3120,
    badge: 'BESTSELLER',
    turnaround: 'Instant access / 24-48 hours bespoke automation setup',
    priceNGN: 30000,
    priceUSD: 20,
    deliverables: [
      '1,000+ Master Copy-Paste Prompt Engineering Library',
      'AI Workflow Automation Video Tutorials & Step-by-Step SOPs',
      'Custom GPTs & Autonomous Agent Setup Templates',
      'Certificate in Applied AI Prompting & Operations'
    ],
    fullOverview: 'Learn to leverage modern Large Language Models and generative AI tools to multiply business productivity by 10x. Covers prompt engineering, autonomous agents, AI copywriting, and workflow automation.',
    whoIsItFor: 'Entrepreneurs, content creators, digital marketers, agency owners, and corporate executives.'
  },

  // 12. GRAPHIC DESIGN & DIGITAL CREATIVITY
  {
    id: 'graphic-design-creativity',
    number: 12,
    title: 'Graphic Design & Digital Creativity',
    shortDesc: 'Professional certified logo design, social media flyers, and corporate brand creative suites delivered in soft copy.',
    category: 'Design & Branding',
    imageUrl: '/images/specializations/graphic_design_studio_1791357449970.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Graphic Design & Digital Creativity',
    level: 'Professional Creative',
    rating: 4.88,
    ratingCount: 1470,
    badge: 'CREATIVE SUITE',
    turnaround: '24-48 hours soft copy digital delivery',
    priceNGN: 15000,
    priceUSD: 10,
    deliverables: [
      'High-Resolution Print-Ready Soft Copy (PDF, JPG, PNG)',
      'Vector Master Files (SVG / Editable Source File)',
      'Social Media Formats (Square, Story, Banner specs)',
      '2 Rounds of Free Revisions included'
    ],
    fullOverview: 'Professional certified digital branding. We craft modern, eye-catching logos, high-converting social media creatives, corporate pitch decks, flyers, and digital marketing banners delivered directly to your Email and WhatsApp.',
    whoIsItFor: 'Online brands, ecommerce sellers, businesses, event planners, and digital service providers.'
  },

  // 13. DIGITAL ID CARD DESIGN & DIGITAL BRANDING
  {
    id: 'digital-id-card-design',
    number: 13,
    title: 'Digital ID Card Design & Digital Branding',
    shortDesc: 'Custom electronic employee and membership ID cards with scannable QR verification delivered in soft copy.',
    category: 'Design & Branding',
    imageUrl: '/images/specializations/digital_id_card_1791357459510.jpg',
    imageAlt: 'GOYE Store Sirwise AI WEB3 Academy Digital ID Card Design & Digital Branding',
    level: 'Corporate Standard',
    rating: 4.93,
    ratingCount: 1980,
    badge: 'SECURITY VERIFIED',
    turnaround: '24-48 hours soft copy digital delivery',
    priceNGN: 10000,
    priceUSD: 7,
    deliverables: [
      'Soft Copy Front & Back ID Card Design (Ultra HD PDF & PNG)',
      'Scannable Digital QR Code Embedding for Staff/Member Verification',
      'Electronic Digital Business Card (vCard format)',
      'Ready-to-print soft copy layout specifications'
    ],
    fullOverview: 'Custom electronic identification kits for corporate companies, academic institutions, clubs, and remote teams. Delivered 100% digitally in soft copy with scannable QR verification code.',
    whoIsItFor: 'Companies, organizations, clubs, schools, and private enterprises needing corporate digital identity assets.'
  }
];
