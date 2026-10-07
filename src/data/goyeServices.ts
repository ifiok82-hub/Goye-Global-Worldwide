export interface GoyeService {
  id: string;
  slug: string;
  title: string;
  category: 'BUILD' | 'AUTOMATE' | 'GROW';
  tagline: string;
  problem: string;
  solution: string;
  includes: string[];
  forWho: string[];
  processSteps: { title: string; desc: string }[];
  ctaText: string;
  iconName: string;
}

export const CORE_CATEGORIES = [
  {
    id: 'BUILD',
    title: 'BUILD',
    badge: 'Digital Foundations',
    headline: 'High-Converting Websites & Platforms',
    description: 'We design and engineer bespoke web applications, portals, and platforms built for customer acquisition.',
    cta: 'Build My Business',
    color: 'from-cyan-500 to-blue-600',
    icon: 'Layers',
    items: [
      'Business websites',
      'Landing pages',
      'Web applications',
      'Online stores',
      'Business portals',
      'Booking systems',
      'Customer dashboards',
      'Digital business platforms',
      'Mobile-first web experiences',
      'Domain & website setup'
    ]
  },
  {
    id: 'AUTOMATE',
    title: 'AUTOMATE',
    badge: 'AI & Operations',
    headline: '24/7 AI Assistants & Workflows',
    description: 'Automate repetitive customer inquiries, lead capture, sales, and support with custom AI solutions.',
    cta: 'Automate My Business',
    color: 'from-purple-500 to-indigo-600',
    icon: 'Bot',
    items: [
      'AI customer-support assistants',
      'AI website assistants',
      'AI sales assistants',
      'AI receptionists',
      'AI FAQ assistants',
      'WhatsApp automation',
      'Lead-capture automation',
      'Appointment automation',
      'Business workflow automation',
      'AI knowledge assistants'
    ]
  },
  {
    id: 'GROW',
    title: 'GROW',
    badge: 'Scale & Acquisition',
    headline: 'Targeted Marketing & Lead Systems',
    description: 'Drive high-value business leads, optimize conversions, and dominate search engines with growth systems.',
    cta: 'Grow My Business',
    color: 'from-amber-500 to-emerald-500',
    icon: 'TrendingUp',
    items: [
      'Digital marketing',
      'Social media setup',
      'SEO (Search Engine Optimization)',
      'Content systems',
      'Lead-generation systems',
      'Business branding',
      'Marketing landing pages',
      'Conversion optimization',
      'Online presence setup',
      'Digital growth consulting'
    ]
  }
];

export const GOYE_SERVICES: GoyeService[] = [
  {
    id: 'websites',
    slug: 'websites',
    title: 'Business Websites',
    category: 'BUILD',
    tagline: 'Fast, modern, and mobile-optimized web presences built to generate inquiries.',
    problem: 'Outdated, slow, or poorly structured websites fail to build trust and lose prospective clients to competitors.',
    solution: 'We build enterprise-grade, lightning-fast business websites with clear value propositions and embedded client conversion pathways.',
    includes: [
      'Custom UI/UX interface design',
      'Responsive mobile-first layout',
      'Lead capture forms & live messaging',
      'Domain, DNS & SSL configuration',
      'On-page SEO optimization',
      'Content management system setup',
      'Fast global hosting setup'
    ],
    forWho: [
      'Small to mid-sized businesses',
      'Professional service providers & consultants',
      'Schools, clinics, hotels & real estate agencies',
      'Churches, NGOs & international organizations'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Tell us about your business goals, target clients, and market requirements.' },
      { title: '2. PLAN', desc: 'We structure site architecture, key messaging, and conversion triggers.' },
      { title: '3. BUILD', desc: 'Custom frontend design and engineering tailored to your brand identity.' },
      { title: '4. LAUNCH', desc: 'Rigorous testing, SEO setup, domain linkage, and official release.' },
      { title: '5. GROW', desc: 'Optional ongoing maintenance, updates, and conversion optimization.' }
    ],
    ctaText: 'Build My Website',
    iconName: 'Globe'
  },
  {
    id: 'web-apps',
    slug: 'web-apps',
    title: 'Web Applications & Portals',
    category: 'BUILD',
    tagline: 'Custom portals, booking tools, and customer dashboards built for complex business operations.',
    problem: 'Off-the-shelf software often lacks customization, forcing businesses into manual workarounds and disjointed tools.',
    solution: 'We engineer bespoke web applications, customer portals, and internal management tools tailored to your exact operational workflows.',
    includes: [
      'User authentication & RBAC security',
      'Interactive customer dashboards',
      'Booking & scheduling workflows',
      'Database integration & storage',
      'Custom API integrations',
      'Client document upload & access hubs',
      'Scalable cloud infrastructure'
    ],
    forWho: [
      'Service platforms & agencies',
      'Educational institutions & academies',
      'Real estate & property management firms',
      'Logistics & multi-location businesses'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Map core functional workflows, user roles, and data requirements.' },
      { title: '2. PLAN', desc: 'Blueprint database schema, API security, and wireframe interfaces.' },
      { title: '3. BUILD', desc: 'Full-stack engineering with modern React, Express, and secure storage.' },
      { title: '4. LAUNCH', desc: 'Beta testing, client data migration, domain setup, and live deployment.' },
      { title: '5. GROW', desc: 'Feature iterations, security audits, and continuous scaling.' }
    ],
    ctaText: 'Build My Web App',
    iconName: 'Code'
  },
  {
    id: 'ai-assistants',
    slug: 'ai-assistants',
    title: 'AI Customer & Website Assistants',
    category: 'AUTOMATE',
    tagline: 'Smart 24/7 AI assistants trained on your business data to convert traffic into leads.',
    problem: 'Inquiries arrive outside office hours, leading to delayed responses and lost sales opportunities.',
    solution: 'Deploy intelligent AI customer support & sales assistants that engage visitors instantly, answer complex FAQs, and collect qualified leads 24/7.',
    includes: [
      'Custom AI assistant trained on your knowledge base',
      '24/7 immediate customer response system',
      'Lead qualification & contact capture',
      'Website widget & floating chat trigger',
      'Multi-language response capability',
      'CRM & lead notification routing'
    ],
    forWho: [
      'Businesses receiving frequent inquiries',
      'E-commerce & service provider websites',
      'Hotels, clinics & booking platforms',
      'Global companies serving multiple time zones'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Gather FAQs, service catalogs, company policies, and support guidelines.' },
      { title: '2. PLAN', desc: 'Design assistant persona, response guidelines, and fallback rules.' },
      { title: '3. BUILD', desc: 'Train LLM backend, implement web widget, and configure lead triggers.' },
      { title: '4. LAUNCH', desc: 'Test accuracy across scenarios and embed live widget on site.' },
      { title: '5. GROW', desc: 'Monitor chat logs, refine knowledge base, and expand capabilities.' }
    ],
    ctaText: 'Deploy AI Assistant',
    iconName: 'Bot'
  },
  {
    id: 'automation',
    slug: 'automation',
    title: 'Business Workflow Automation',
    category: 'AUTOMATE',
    tagline: 'Eliminate manual repetitive tasks and connect your core software tools seamlessly.',
    problem: 'Employees waste hundreds of hours manually copying data between email, spreadsheets, and CRMs.',
    solution: 'We construct automated digital pipelines that automatically sync lead records, dispatch confirmations, generate quotes, and update databases.',
    includes: [
      'Automated lead intake and routing',
      'Instant email & SMS notification alerts',
      'CRM and database auto-synchronization',
      'Digital document generation & quote triggers',
      'Appointment & calendar booking automation',
      'Custom webhook & API pipeline links'
    ],
    forWho: [
      'Growing sales and service teams',
      'Consultancies & professional services',
      'Event organizers & training institutions',
      'Operations-heavy enterprises'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Audit current manual processes and identify bottleneck tasks.' },
      { title: '2. PLAN', desc: 'Design automated trigger-action workflows and error handling.' },
      { title: '3. BUILD', desc: 'Configure software connections, API scripts, and validation filters.' },
      { title: '4. LAUNCH', desc: 'Execute end-to-end simulations before switching to live production.' },
      { title: '5. GROW', desc: 'Audit workflow analytics and optimize execution speeds.' }
    ],
    ctaText: 'Automate Workflows',
    iconName: 'Zap'
  },
  {
    id: 'whatsapp',
    slug: 'whatsapp',
    title: 'WhatsApp Business Automation',
    category: 'AUTOMATE',
    tagline: 'Turn WhatsApp into an automated client intake, support, and sales machine.',
    problem: 'WhatsApp messaging is the preferred channel for prospective clients, but managing inquiries manually is slow and disorganized.',
    solution: 'Connect an automated WhatsApp system that sends welcome menus, answers inquiries, captures client requirements, and routes urgent chats.',
    includes: [
      'Automated greeting & interactive menu systems',
      'FAQ automated keyword responder',
      'Lead qualification wizard inside WhatsApp',
      'Instant appointment & quote request intake',
      'Team multi-agent inbox setup',
      'WhatsApp button triggers on website'
    ],
    forWho: [
      'African & international businesses utilizing WhatsApp as primary channel',
      'Real estate agents & vehicle dealerships',
      'Clinics, salons, restaurants & booking services',
      'Consultants & course providers'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Define key WhatsApp conversation paths and lead qualification criteria.' },
      { title: '2. PLAN', desc: 'Structure interactive menus, automated replies, and agent handoff.' },
      { title: '3. BUILD', desc: 'Configure WhatsApp Business API integration and chatbot logic.' },
      { title: '4. LAUNCH', desc: 'Connect phone line, test flow across mobile devices, and publish links.' },
      { title: '5. GROW', desc: 'Track conversation metrics, conversion rates, and reply speeds.' }
    ],
    ctaText: 'Automate WhatsApp',
    iconName: 'MessageSquare'
  },
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    title: 'Digital Marketing & Growth',
    category: 'GROW',
    tagline: 'Strategic lead acquisition campaigns engineered to attract high-intent business buyers.',
    problem: 'Traffic without intent results in high bounce rates and zero actionable business inquiries.',
    solution: 'We construct focused digital marketing funnels, high-converting landing pages, and inbound campaign systems that deliver qualified leads.',
    includes: [
      'High-conversion marketing landing pages',
      'Inbound campaign architecture & copy',
      'Social media profile & channel setup',
      'Lead magnet & value asset design',
      'Email capture & nurture sequences',
      'Conversion tracking analytics'
    ],
    forWho: [
      'B2B firms searching for client accounts',
      'Service businesses launching new offers',
      'Startups seeking initial market traction',
      'Established brands expanding into new markets'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Define target client profile, offer positioning, and competitive edge.' },
      { title: '2. PLAN', desc: 'Map customer acquisition journey and high-impact messaging.' },
      { title: '3. BUILD', desc: 'Create landing assets, lead magnets, and conversion triggers.' },
      { title: '4. LAUNCH', desc: 'Deploy campaigns, verify tracking pixels, and begin lead capture.' },
      { title: '5. GROW', desc: 'Analyze funnel conversion rates and optimize ad/landing performance.' }
    ],
    ctaText: 'Grow My Business',
    iconName: 'Target'
  },
  {
    id: 'seo',
    slug: 'seo',
    title: 'Search Engine Optimization (SEO)',
    category: 'GROW',
    tagline: 'Position your business at the top of search engine results for organic client discovery.',
    problem: 'Potential clients search daily for your services on Google, but find your competitors instead.',
    solution: 'We optimize your website code, site speed, keywords, metadata, and structured Schema data so qualified prospects find you organically.',
    includes: [
      'Comprehensive keyword & market research',
      'Technical SEO & site speed acceleration',
      'On-page content optimization & titles',
      'Schema.org structured data (JSON-LD) implementation',
      'Google Search Console & sitemap configuration',
      'Local SEO & Google Business profile guidance'
    ],
    forWho: [
      'Local and global business service providers',
      'Professional firms wanting long-term organic leads',
      'E-commerce platforms & niche web portals',
      'Organizations building authority in their domain'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Audit current organic rankings, site structure, and target search terms.' },
      { title: '2. PLAN', desc: 'Develop keyword strategy, content structure, and technical fixes.' },
      { title: '3. BUILD', desc: 'Optimize HTML meta, heading tags, JSON-LD Schema, and site speed.' },
      { title: '4. LAUNCH', desc: 'Submit updated XML sitemaps to Google and verify indexing.' },
      { title: '5. GROW', desc: 'Track organic impressions, click-through rates, and ranking gains.' }
    ],
    ctaText: 'Optimize Search Visibility',
    iconName: 'Search'
  },
  {
    id: 'branding',
    slug: 'branding',
    title: 'Business Branding & Visual Identity',
    category: 'GROW',
    tagline: 'Craft a sleek, professional digital brand identity that instills trust and commands authority.',
    problem: 'Inconsistent graphics and outdated visual branding make prospective corporate clients question quality.',
    solution: 'We deliver complete digital visual branding packages—from logos and typography to social media templates and brand guidelines.',
    includes: [
      'Primary logo design & brand marks',
      'Color palette & typography systems',
      'Digital brand guidelines & usage rules',
      'Social media banner & post templates',
      'Digital business card & email signature design',
      'Presentation deck & proposal templates'
    ],
    forWho: [
      'New companies & professional practices launching identity',
      'Established businesses rebranding for modern markets',
      'Tech startups & consulting agencies',
      'International brands seeking polished assets'
    ],
    processSteps: [
      { title: '1. DISCOVER', desc: 'Understand brand vision, industry aesthetic standards, and target demographic.' },
      { title: '2. PLAN', desc: 'Moodboard design concepts, typography pairs, and color psychology.' },
      { title: '3. BUILD', desc: 'Draft vector logo marks, palette specs, and collateral assets.' },
      { title: '4. LAUNCH', desc: 'Deliver high-resolution asset packages and brand style guide.' },
      { title: '5. GROW', desc: 'Provide ongoing design support for campaign collateral.' }
    ],
    ctaText: 'Elevate My Brand',
    iconName: 'Sparkles'
  }
];

export const CLIENT_PROCESS = [
  { step: '01', name: 'DISCOVER', desc: 'Tell us about your business objectives, operational challenges, and target market.' },
  { step: '02', name: 'PLAN', desc: 'We analyze requirements and present a clear proposal with defined scope, timeline, and quote.' },
  { step: '03', name: 'BUILD', desc: 'Our engineering team develops and configures your digital solution to high technical standards.' },
  { step: '04', name: 'LAUNCH', desc: 'We conduct final testing, review with your team, and deploy your solution live.' },
  { step: '05', name: 'GROW', desc: 'Optional ongoing management, AI model training, support, and conversion optimization.' }
];

export const TARGET_CLIENTS = [
  'Small Businesses', 'Startups & Tech Founders', 'Entrepreneurs', 'Professional Service Firms',
  'Schools & Educational Institutions', 'Hotels & Hospitality', 'Restaurants & Cafes', 'Clinics & Healthcare',
  'Real Estate & Property Agencies', 'Churches & Religious Bodies', 'NGOs & Non-Profits', 'Online & E-Commerce Merchants',
  'African Enterprises', 'Global & International Companies'
];

export const FAQS = [
  {
    q: 'What is GOYE DIGITAL?',
    a: 'GOYE DIGITAL (gasv.store) is an AI Business Solutions agency specializing in building websites, engineering web applications, setting up AI customer assistants, automating WhatsApp workflows, and driving qualified lead growth.'
  },
  {
    q: 'How do I start a project with GOYE DIGITAL?',
    a: 'You can request a quote, book a free business consultation, or complete our "Tell Us What Your Business Needs" form on gasv.store. Our team will review your requirements and follow up with a tailored project plan.'
  },
  {
    q: 'How does pricing work?',
    a: 'Because every business has unique requirements, we use "Request a Quote" as our primary pricing mechanism. We assess your scope, features, and timeline to provide an accurate, transparent cost without surprise fees.'
  },
  {
    q: 'What is the AI Business Assessment tool?',
    a: 'Our interactive assessment asks a few questions about your current digital setup and operational challenges. Using AI, it recommends whether your business needs BUILD, AUTOMATE, or GROW solutions.'
  },
  {
    q: 'What is the relationship between GOYE DIGITAL and GOYE AI WEB3 SCHOOL?',
    a: 'GOYE DIGITAL (gasv.store) provides B2B digital services and AI business solutions for enterprises. GOYE AI WEB3 SCHOOL (sirwise.online) is our dedicated educational division offering courses in AI and Web3 skills.'
  }
];
