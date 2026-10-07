-- GOYE DIGITAL - DATABASE SCHEMA FOR gasv.store
-- Compatible with Supabase / PostgreSQL

-- 1. LEADS TABLE - Main lead generation
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  business_type TEXT NOT NULL,
  need_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  project_description TEXT NOT NULL,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('WhatsApp','Email','Phone')),
  services_selected JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACTED','QUALIFIED','QUOTATION_SENT','NEGOTIATION','APPROVED','IN_PROGRESS','COMPLETED','CLOSED')),
  source_page TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- 2. CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  business_challenge TEXT NOT NULL,
  service_required TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACTED','SCHEDULED','COMPLETED','CLOSED')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSESSMENTS TABLE - AI Business Assessment results
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_type TEXT,
  has_website BOOLEAN,
  customer_handling TEXT,
  customer_acquisition TEXT,
  biggest_challenge TEXT,
  team_size TEXT,
  recommended_services JSONB,
  lead_id UUID REFERENCES leads(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES TABLE - Admin editable
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('BUILD','AUTOMATE','GROW')),
  short_description TEXT NOT NULL,
  problem_statement TEXT,
  solution_statement TEXT,
  included_features JSONB DEFAULT '[]',
  who_is_for JSONB DEFAULT '[]',
  process_steps JSONB DEFAULT '[]',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLIENTS TABLE - Future portal
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  country TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  lead_id UUID REFERENCES leads(id),
  title TEXT NOT NULL,
  service_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DISCOVER' CHECK (status IN ('DISCOVER','PLAN','BUILD','LAUNCH','GROW','COMPLETED')),
  description TEXT,
  start_date DATE,
  launch_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUOTES TABLE - Admin editable pricing
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  client_id UUID REFERENCES clients(id),
  title TEXT NOT NULL,
  amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  items JSONB DEFAULT '[]',
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','SENT','APPROVED','REJECTED','EXPIRED')),
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SETTINGS TABLE - Admin can change pricing without code
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('contact_whatsapp', '"+2340000000000"', 'Primary WhatsApp number'),
('contact_email', '"goye@gasv.store"', 'Primary contact email'),
('pricing_mode', '"quote_only"', 'quote_only or packages'),
('packages', '[]', 'Service packages editable by admin'),
('site_name', '"GOYE DIGITAL"', 'Brand name'),
('tagline', '"Build. Automate. Grow."', 'Brand tagline')
ON CONFLICT (key) DO NOTHING;

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  performed_by TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SEED SERVICES
INSERT INTO services (slug, title, category, short_description, seo_title, seo_description) VALUES
('websites', 'Business Websites', 'BUILD', 'Professional business websites that convert visitors to clients', 'Business Website Development Services | GOYE DIGITAL', 'We build professional, mobile-first business websites for growth'),
('web-apps', 'Web Applications', 'BUILD', 'Custom web apps and business portals', 'Web Application Development | GOYE DIGITAL', 'Custom web applications, portals and dashboards'),
('ai-assistants', 'AI Assistants for Business', 'AUTOMATE', 'AI customer support, sales and receptionist assistants', 'AI Assistant for Business | GOYE DIGITAL', 'AI-powered assistants to automate customer support and sales'),
('automation', 'Business Automation', 'AUTOMATE', 'Workflow and business process automation', 'Business Automation Services | GOYE DIGITAL', 'Automate your business workflows and operations'),
('whatsapp', 'WhatsApp Automation', 'AUTOMATE', 'WhatsApp lead capture and customer support automation', 'WhatsApp Automation for Business | GOYE DIGITAL', 'WhatsApp automation for leads and support'),
('digital-marketing', 'Digital Marketing', 'GROW', 'Lead generation and digital growth systems', 'Digital Marketing Services | GOYE DIGITAL', 'Digital marketing and lead generation systems'),
('seo', 'SEO Services', 'GROW', 'Search optimization for business growth', 'SEO Services for Businesses | GOYE DIGITAL', 'Professional SEO services to grow online visibility'),
('branding', 'Business Branding', 'GROW', 'Professional branding and online presence setup', 'Business Branding Services | GOYE DIGITAL', 'Business branding and online presence setup')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
