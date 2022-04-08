import supertest from 'supertest';
import app from '../app';
import prisma from './prisma';
import { NextFunction } from 'express';
import { verifyToken } from './auth';
import { SignUpReqBody } from '../routes/auth/auth.controller';

interface UserResponseHeaders {
  'set-cookie'?: [string];
}
let token: string;
const request = supertest(app);

describe('auth utils', (): void => {
  describe('verify token', () => {
    const userReq: SignUpReqBody = {
      email: 'l@l.com',
      password: 'password',
    };

    beforeAll(async () => {
      await prisma.user.deleteMany({});
    });
    test('It should verify a token', async () => {
      const req = {
        cookies: {
          ACCESS_TOKEN: token,
        },
      };
      const res = {
        status: jest.fn(),
      };
      const nextFunction: NextFunction = jest.fn();

      await setUserToken(userReq);
      await verifyToken(req, res, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});

async function setUserToken(userReq: SignUpReqBody): Promise<void> {
  const response = (await request
    .post('/v1/auth/signup')
    .send(userReq)) as unknown as Partial<Response>;
  const resHeaders = response.headers as UserResponseHeaders;
  const authCookie: string = resHeaders['set-cookie'][0];
  token = authCookie.split(';')[0].split('=')[1];
}
