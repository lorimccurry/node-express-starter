import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../envs';
import prisma from './prisma';
import { AUTH } from './../constants/messages';

interface Cookies {
  ACCESS_TOKEN?: string;
}

interface JwtPayload {
  id: number;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { ACCESS_TOKEN: token } = req.cookies as Cookies;
  const {
    ERROR: { NOT_AUTHORIZED, INVALID_USER },
  } = AUTH;

  if (token) {
    let user;
    try {
      const { id } = jwt.verify(token, jwtSecret) as JwtPayload;
      user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new Error(INVALID_USER);
      }
    } catch (error) {
      res.status(401).json({ error: NOT_AUTHORIZED });
      return;
    }
    return next();
  }
};
