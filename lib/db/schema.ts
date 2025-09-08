import { createId } from '@paralleldrive/cuid2'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = sqliteTable('account', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const verifications = sqliteTable('verification', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  status: text('status').notNull(), // 'draft', 'active', 'paused', 'completed'
  totalLeads: integer('total_leads').default(0),
  successfulLeads: integer('successful_leads').default(0),
  responseRate: real('response_rate').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  campaignId: text('campaign_id').references(() => campaigns.id),
  status: text('status').notNull(), // 'pending', 'contacted', 'responded', 'converted'
  lastContactDate: integer('last_contact_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})