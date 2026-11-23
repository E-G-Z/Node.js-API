import { pgTable, varchar, boolean, serial, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id_user:serial('id_user').primaryKey(),
    name: varchar('name', { length:255 }).notNull(),
    email: varchar('email', { length:255 }).notNull().unique(),
    password: varchar('password', { length:255 }).notNull(),
    is_admin: boolean('is_admin').notNull(),
});

export const refreshTokens = pgTable('refresh_tokens', {
    id_token: serial('id_token').primaryKey(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    user_id: integer('user_id').notNull().references(() => users.id_user),
    expiration_date: timestamp('expiration_date', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { length: 255 }).notNull(),
    revoked: boolean('revoked').notNull().default(false),
});
