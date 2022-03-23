import express from 'express';
import loggerRouter from './logger/logger.router';

const api = express.Router();

api.use('/logger', loggerRouter);

export default api;
