import supertest from 'supertest';
import app from '../app';
import prisma from './prisma';
import { NextFunction, Response } from 'express';
import { verifyToken } from './auth';
import { SignUpReqBody } from '../routes/auth/auth.controller';
import { AUTH } from './../constants/messages';

interface UserResponseHeaders {
  'set-cookie'?: [string];
}

let token: string;
const request = supertest(app);

const mockRequest = (token: string | undefined) => {
  if (!token) {
    return {};
  }
  return {
    cookies: {
      ACCESS_TOKEN: token,
    },
  };
};

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth utils', (): void => {
  describe('verify token', (): void => {
    const userReq: SignUpReqBody = {
      email: 'm@l.com',
      password: 'password',
    };

    beforeAll(async (): Promise<void> => {
      await clearUserDB();
      await setUserToken(userReq);
    });

    afterAll(async (): Promise<void> => {
      await clearUserDB();
    });

    test('It should verify a token and call the next function', async (): Promise<void> => {
      const req = mockRequest(token);
      const res = mockResponse();
      const nextFunction: NextFunction = jest.fn();

      await verifyToken(req, res, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    test('It should 401, not verify without a token and not call the next function', async (): Promise<void> => {
      const {
        ERROR: { NOT_AUTHORIZED },
      } = AUTH;

      const req = mockRequest(undefined);
      const res = mockResponse();
      const nextFunction: NextFunction = jest.fn();

      await verifyToken(req, res, nextFunction);

      expect(nextFunction).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: NOT_AUTHORIZED });
    });

    test('It should 401, not verify with an empty token and not call the next function', async (): Promise<void> => {
      const {
        ERROR: { NOT_AUTHORIZED },
      } = AUTH;

      const req = mockRequest('');
      const res = mockResponse();
      const nextFunction: NextFunction = jest.fn();

      await verifyToken(req, res, nextFunction);

      expect(nextFunction).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: NOT_AUTHORIZED });
    });

    test('It should 401, not verify with an incorrect token and not call the next function', async (): Promise<void> => {
      const {
        ERROR: { NOT_AUTHORIZED },
      } = AUTH;

      const req = mockRequest('12345');
      const res = mockResponse();
      const nextFunction: NextFunction = jest.fn();

      await verifyToken(req, res, nextFunction);

      expect(nextFunction).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: NOT_AUTHORIZED });
    });
  });
});

async function setUserToken(userReq: SignUpReqBody): Promise<void> {
  const response = (await request
    .post('/v1/auth/signup')
    .send(userReq)) as unknown as Partial<Response>;
  const resHeaders = response.header as UserResponseHeaders;
  const authCookie: string = resHeaders['set-cookie'][0];
  token = authCookie.split(';')[0].split('=')[1];
}

async function clearUserDB() {
  await prisma.user.deleteMany({});
}
