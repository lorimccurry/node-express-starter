import supertest from 'supertest';
import app from '../../app';
import prisma from '../../utils/prisma';
import { SignUpReqBody } from './auth.controller';
import { AUTH } from '../../constants/messages';

interface UserResponse {
  body: UserResponseBody;
  headers: UserResponseHeaders;
}

interface UserResponseBody {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

interface UserResponseHeaders {
  'set-cookie'?: [string];
}
describe('auth', (): void => {
  const request = supertest(app);

  const userReq = {
    email: 'l@l.com',
    password: 'password',
  };

  const userReqNoEmail = {
    email: '',
    password: 'password',
  };

  const userReqNoPassword = {
    email: 'l@l.com',
    password: '',
  };

  const unregisteredUser = {
    email: 'l@m.com',
    password: 'password',
  };

  const userIncorrectPassword = {
    email: 'l@m.com',
    password: 'incorrect',
  };

  describe('POST /signup', (): void => {
    afterEach(async () => {
      await clearUserDB();
    });

    test('It should respond with 201 success, new user object and token cookie', async () => {
      await clearUserDB();
      const response: UserResponse = await request
        .post('/v1/auth/signup')
        .send(userReq)
        .expect('Content-Type', /json/)
        .expect(201);

      confirmUserResBody(response.body, userReq);
      confirmHeaderToken(response.headers);
    });

    test('It should catch an empty email', async () => {
      const response: UserResponse = await request
        .post('/v1/auth/signup')
        .send(userReqNoEmail)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe(AUTH.ERROR.SIGN_UP_REQUIREMENTS);
    });

    test('It should catch an empty password', async () => {
      const response: UserResponse = await request
        .post('/v1/auth/signup')
        .send(userReqNoPassword)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe(AUTH.ERROR.SIGN_UP_REQUIREMENTS);
    });

    test('It should not create a user that exists', async () => {
      await request
        .post('/v1/auth/signup')
        .send(userReq)
        .expect('Content-Type', /json/)
        .expect(201);

      const response: UserResponse = await request
        .post('/v1/auth/signup')
        .send(userReq)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe(AUTH.ERROR.SIGN_UP);
    });
  });

  describe('POST /signin', (): void => {
    beforeAll(async () => {
      await clearUserDB();
      await request
        .post('/v1/auth/signup')
        .send(userReq)
        .expect('Content-Type', /json/)
        .expect(201);
    });

    test('It should respond with 200 success, existing user object and token cookie', async () => {
      const response: UserResponse = await request
        .post('/v1/auth/signin')
        .send(userReq)
        .expect('Content-Type', /json/)
        .expect(200);

      confirmUserResBody(response.body, userReq);
      confirmHeaderToken(response.headers);
    });

    test('It should catch an empty email', async () => {
      const response: UserResponse = await request
        .post('/v1/auth/signin')
        .send(userReqNoEmail)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe(AUTH.ERROR.SIGN_IN);
    });

    test('It should catch an empty password', async () => {
      const response: UserResponse = await request
        .post('/v1/auth/signin')
        .send(userReqNoPassword)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe(AUTH.ERROR.SIGN_IN);
    });

    test('It should not sign in a user that does not exist', async () => {
      const response: UserResponse = await request
        .post('/v1/auth/signin')
        .send(unregisteredUser)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe(AUTH.ERROR.SIGN_IN);
    });

    test('It should not sign in a user with an incorrect password.', async () => {
      const response: UserResponse = await request
        .post('/v1/auth/signin')
        .send(userIncorrectPassword)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe(AUTH.ERROR.SIGN_IN);
    });
  });
});

async function clearUserDB() {
  await prisma.user.deleteMany({});
}

function confirmUserResBody(
  resBody: UserResponseBody,
  userReq: SignUpReqBody,
): void {
  const { id, updatedAt, createdAt, email, name } = resBody;
  expect(id).toBeDefined();
  expect(updatedAt).toBeDefined();
  expect(createdAt).toBeDefined();
  expect(email).toEqual(userReq.email);
  expect(name).toBeNull();
}

function confirmHeaderToken(resHeader: UserResponseHeaders): void {
  const tokenHeaderCookie = resHeader['set-cookie'][0];
  expect(tokenHeaderCookie).toContain('ACCESS_TOKEN');
}
