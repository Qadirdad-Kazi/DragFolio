import { pgTable, serial, text, timestamp, boolean, json, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  bio: text('bio'),
  avatar: text('avatar'),
  socialLinks: json('social_links').$type<{
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Portfolios table
export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  sections: json('sections').$type<Array<{
    id: string;
    type: 'about' | 'projects' | 'skills' | 'resume' | 'testimonials' | 'blog' | 'contact';
    title: string;
    content: any;
    order: number;
    layout: 'full' | 'half' | 'two-columns';
    settings?: Record<string, any>;
  }>>().notNull(),
  theme: json('theme').$type<{
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
  }>().notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  subdomain: varchar('subdomain', { length: 50 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Templates table
export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  thumbnail: text('thumbnail').notNull(),
  sections: json('sections').$type<Array<{
    id: string;
    type: 'about' | 'projects' | 'skills' | 'resume' | 'testimonials' | 'blog' | 'contact';
    title: string;
    content: any;
    order: number;
    layout: 'full' | 'half' | 'two-columns';
    settings?: Record<string, any>;
  }>>().notNull(),
  theme: json('theme').$type<{
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
  }>().notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios)
}));

export const portfoliosRelations = relations(portfolios, ({ one }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id]
  })
}));
