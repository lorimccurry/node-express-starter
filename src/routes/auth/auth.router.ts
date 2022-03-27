import express from 'express';
import { httpSignUp, httpSignIn } from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', httpSignUp);
authRouter.post('/signin', httpSignIn);

export default authRouter;
