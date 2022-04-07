import express from 'express';
import loggerRouter from './logger/logger.router';
import authRouter from './auth/auth.router';
import { verifyToken } from '../utils/auth';

const api = express.Router();

api.use('/logger', verifyToken, loggerRouter);
api.use('/auth', authRouter);

export default api;
