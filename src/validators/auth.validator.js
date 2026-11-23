import { db } from '../db/db.connection.js';
import { users } from '../db/schemas.js';
import { eq } from 'drizzle-orm';
import { revokeAllUserRefreshTokens } from '../repositories/token.repo.js';
import { findUserByEmail } from '../repositories/user.repo.js';
import bcrypt from 'bcrypt';

export async function validateUser(email) {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).execute();

    if (existingUser.length > 0) {
        throw new Error('User already exists');
    }
}

export async function validateLogin(email) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

export async function validatePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

}

export async function validateStoredToken(storedToken) {
    if (!storedToken) {
        throw new Error('Refresh token not found');
    }
    
    if (storedToken.revoked) {
        await revokeAllUserRefreshTokens(decoded.id_user);
        throw new Error('Possible misuse of refresh token');
    }

    if (storedToken.expiration_date < new Date()) {
        throw new Error('Refresh token has expired');
    }

}

