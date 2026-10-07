import { pgTable, uuid, text, timestamp, boolean, numeric, jsonb, date, serial, integer } from 'drizzle-orm/pg-core';

// 1. LEADS TABLE
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: text('full_name').notNull(),
  businessName: text('business_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  businessType: text('business_type').notNull(),
  needType: text('need_type').notNull(),
  budgetRange: text('budget_range').notNull(),
  projectDescription: text('project_description').notNull(),
  contactMethod: text('contact_method').notNull(),
  servicesSelected: jsonb('services_selected').default([]),
  status: text('status').notNull().default('NEW'),
  sourcePage: text('source_page'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 2. CONSULTATIONS TABLE
export const consultations = pgTable('consultations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: text('full_name').notNull(),
  businessName: text('business_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  businessChallenge: text('business_challenge').notNull(),
  serviceRequired: text('service_required').notNull(),
  preferredTime: text('preferred_time').notNull(),
  status: text('status').notNull().default('NEW'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 3. ASSESSMENTS TABLE
export const assessments = pgTable('assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessType: text('business_type'),
  hasWebsite: boolean('has_website'),
  customerHandling: text('customer_handling'),
  customerAcquisition: text('customer_acquisition'),
  biggestChallenge: text('biggest_challenge'),
  teamSize: text('team_size'),
  recommendedServices: jsonb('recommended_services'),
  leadId: uuid('lead_id').references(() => leads.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 4. SERVICES TABLE
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  shortDescription: text('short_description').notNull(),
  problemStatement: text('problem_statement'),
  solutionStatement: text('solution_statement'),
  includedFeatures: jsonb('included_features').default([]),
  whoIsFor: jsonb('who_is_for').default([]),
  processSteps: jsonb('process_steps').default([]),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 5. CLIENTS TABLE
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessName: text('business_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  country: text('country'),
  status: text('status').default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 6. PROJECTS TABLE
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => clients.id),
  leadId: uuid('lead_id').references(() => leads.id),
  title: text('title').notNull(),
  serviceType: text('service_type').notNull(),
  status: text('status').notNull().default('DISCOVER'),
  description: text('description'),
  startDate: date('start_date'),
  launchDate: date('launch_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 7. QUOTES TABLE
export const quotes = pgTable('quotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  leadId: uuid('lead_id').references(() => leads.id),
  clientId: uuid('client_id').references(() => clients.id),
  title: text('title').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }),
  currency: text('currency').default('USD'),
  items: jsonb('items').default([]),
  status: text('status').default('DRAFT'),
  validUntil: date('valid_until'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 8. SETTINGS TABLE
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 9. AUDIT LOGS TABLE
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id'),
  performedBy: text('performed_by'),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// LEGACY TABLE DEFINITIONS FOR BACKWARD COMPATIBILITY
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').references(() => users.uid),
  customerEmail: text('customer_email'),
  orderRef: text('order_ref').notNull(),
  productName: text('product_name').notNull(),
  price: numeric('price').notNull(),
  gateway: text('gateway').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const esimOrders = pgTable('esim_orders', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  iccid: text('iccid'),
  qrCodeUrl: text('qr_code_url'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').references(() => users.uid),
  contractType: text('contract_type').notNull(),
  partyA: text('party_a'),
  partyB: text('party_b'),
  status: text('status').notNull().default('draft'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const academyAccess = pgTable('academy_access', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').references(() => users.uid).unique(),
  hasFullAccess: boolean('has_full_access').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const analyticsClicks = pgTable('analytics_clicks', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id'),
  page: text('page'),
  target: text('target'),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
