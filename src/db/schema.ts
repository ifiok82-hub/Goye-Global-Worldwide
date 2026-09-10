import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, boolean, numeric, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
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

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  sourceDomain: text('source_domain'),
  convertedToBuyer: boolean('converted_to_buyer').default(false),
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

export const adminSettings = pgTable('admin_settings', {
  id: serial('id').primaryKey(),
  keyName: text('key_name').notNull().unique(), // 'payment_settings'
  piApiKey: text('pi_api_key'),
  piWallet: text('pi_wallet'),
  piSandbox: text('pi_sandbox').default('true'),
  paystackPublicKey: text('paystack_public_key'),
  paystackSecretKey: text('paystack_secret_key'),
  flutterwavePublicKey: text('flutterwave_public_key'),
  flutterwaveSecretKey: text('flutterwave_secret_key'),
  usdtAddress: text('usdt_address'),
  usdcAddress: text('usdc_address'),
  opayAccount: text('opay_account'),
  opayName: text('opay_name'),
  updatedByAdminUid: text('updated_by_admin_uid'),
  updatedAt: timestamp('updated_at').defaultNow(),
});


