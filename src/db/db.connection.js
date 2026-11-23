import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';

const client = postgres(env.DATABASE_URL)
const db = drizzle(client);

export { db };