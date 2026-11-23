import {registerUser, loginUser} from '../services/auth.service.js';
import {validateUser} from '../validators/auth.validator.js';
import { restoreRefreshToken } from '../services/auth.service.js';

export async function handleRegister(req, res, next) {
    
    try{
        const{name, email, password}=req.body;

        await validateUser(email);

        const newUser = await registerUser({
            name,
            email,
            password,
        });

        res.status(201).json({message: 'User registered successfully', user: newUser});

    }catch(error){
        next(error);
    }
}

export async function handleLogin(req, res, next) {
    try{
        const {email, password} = req.body;

        const result = await loginUser({email, password});

        res.status(200).json({message: 'Login successful', ...result});
    }catch(error){

        next(error);

    }
}

export async function handleRefreshToken(req, res, next) {

    try{
        const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
        const tokens = await restoreRefreshToken(refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, // previene que se use js para acceder a la cookie
            secure: true, // obliga a que la cookie se envíe con https
            sameSite: 'strict', // previene que la cookie se envíe en solicitudes de terceros
        });

        res.json({ accessToken: tokens.accessToken });
    }catch(error){
        next(error);
        res.status(500).json({message: 'Error refreshing token'});
    }
}

export async function handleLogout(req, res, next) {
    try{
        const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    }catch(error){
        next(error);
        res.status(500).json({message: 'Error logging out'});
    }
}