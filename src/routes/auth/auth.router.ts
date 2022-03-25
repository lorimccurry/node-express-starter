import express from 'express';
import { httpSignUp } from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', httpSignUp);

export default authRouter;
