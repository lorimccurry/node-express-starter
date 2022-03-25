import express from 'express';
import loggerRouter from './logger/logger.router';
import authRouter from './auth/auth.router';

const api = express.Router();

api.use('/logger', loggerRouter);
api.use('/auth', authRouter);

export default api;
