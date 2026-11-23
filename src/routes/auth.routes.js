import {handleLogin, handleRegister, handleRefreshToken} from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/register', handleRegister);

router.post('/login', handleLogin);

router.post('/refresh', handleRefreshToken);

router.post('/logout', handleLogout);



export default router;