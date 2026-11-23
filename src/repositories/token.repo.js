import {refreshTokens} from '../db/schemas.js';
import { db } from '../db/db.connection.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';
import bcrypt from 'bcrypt';
import { hashToken } from '../utils/token.utils.js';

export async function findRefreshToken(token) {
  const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, hashToken(token))).execute();
  return result;
}

export async function saveRefreshToken(userId, token) {
  const hashedToken = hashToken(token);
  try{
    return await db.insert(refreshTokens)
    .values({
      token: hashedToken, 
      user_id: userId, 
      expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    }).execute();

  }catch(err){
    console.error('Error saving refresh token:', err);
  }
}

export async function deleteRefreshToken(token) {
  console.log('Deleting refresh token:', token);
  return await db.delete(refreshTokens).where(eq(refreshTokens.token, token)).execute();
}

export async function revokeRefreshToken(token) {
  return await db.update(refreshTokens).set({ revoked: true })
  .where(eq(refreshTokens.token, token)).execute();
}

export async function revokeAllUserRefreshTokens(userId) {
  return await db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.user_id, userId)).execute();
}

