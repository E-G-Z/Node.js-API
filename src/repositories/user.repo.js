import {users} from '../db/schemas.js';
import { db } from '../db/db.connection.js';
import { eq } from 'drizzle-orm';

export async function findUserById(id) {
    const [user] = await db.select().from(users).where(eq(users.id_user, id)).execute();
    return user;
}

export async function findUserByEmail(email){
    const [user] = await db.select().from(users).where(eq(users.email, email)).execute();
    return user;
}