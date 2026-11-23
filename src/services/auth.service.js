import bcrypt from 'bcrypt';
import { db } from '../db/db.connection.js';
import { users, refreshTokens } from '../db/schemas.js';
import { env } from '../config/env.js';
import {validateLogin, validatePassword} from '../validators/auth.validator.js';
import { findRefreshToken,  saveRefreshToken, revokeRefreshToken, revokeAllUserRefreshTokens} from '../repositories/token.repo.js';
import { findUserById } from '../repositories/user.repo.js';
import jwt from 'jsonwebtoken';
import {hashToken} from '../utils/token.utils.js';
export async function registerUser({name, email, password}) {

    const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);

    const [newUser] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        is_admin: false,
    }).returning();

    const {password:_, ...userNopass}=newUser;
    return userNopass;

}

export async function loginUser({email, password}) {

    const user = await validateLogin(email);

    await validatePassword(password, user.password);

    const { accessToken, refreshToken } = generateToken(user);
    
    const tokenHash = hashToken(refreshToken);

    await db.insert(refreshTokens).values({
        token: tokenHash,
        user_id: user.id_user,
        expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }).execute();

    const {password:_, ...userNopass}=user;
    return { accessToken: accessToken, refreshToken, user:userNopass };
}


function generateToken(user) {

    const accessToken = jwt.sign({
        id_user: user.id_user,
        name: user.name,
        is_admin: user.is_admin,
    }, env.JWT_SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign({
        id_user: user.id_user,
        name: user.name,
        is_admin: user.is_admin,
    }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
}

export async function restoreRefreshToken(token) {

    if (!token) {
        throw new Error('Refresh token is required');
    }

    let decoded;

    try {
        decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (error) {
        console.error('JWT verify error:', error.name, '-', error.message);
        throw new Error('Invalid refresh token');
    }

    const user = await findUserById(decoded.id_user);

    if (!user) {
        console.error('User not found for ID:', decoded.id_user);
        throw new Error('User not found');
    }

    const storedToken = await findRefreshToken(token);

    await validateStoredToken(storedToken);

    await revokeRefreshToken(token);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateToken(user);
        
    await saveRefreshToken(user.id_user, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}