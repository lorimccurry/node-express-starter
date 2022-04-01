import supertest from 'supertest';
import app from '../../app';
import prisma from '../../lib/prisma';

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

describe('POST /signup', (): void => {
  const request = supertest(app);

  const newUserReq = {
    email: 'l@l.com',
    password: 'password',
  };

  const newUserReqNoEmail = {
    email: '',
    password: 'password',
  };

  const newUserReqNoPassword = {
    email: 'l@l.com',
    password: '',
  };

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  test('It should respond with 201 success, new user object and token cookie', async () => {
    const response: UserResponse = await request
      .post('/v1/auth/signup')
      .send(newUserReq)
      .expect('Content-Type', /json/)
      .expect(201);

    const { id, updatedAt, createdAt, email, name } = response.body;
    expect(id).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(email).toEqual(newUserReq.email);
    expect(name).toBeNull();

    const tokenHeaderCookie = response.headers['set-cookie'][0];
    expect(tokenHeaderCookie).toContain('ACCESS_TOKEN');
  });

  test('It should catch an empty email', async () => {
    const response: UserResponse = await request
      .post('/v1/auth/signup')
      .send(newUserReqNoEmail)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toBe('Email and Password required to sign up.');
  });

  test('It should catch an empty password', async () => {
    const response: UserResponse = await request
      .post('/v1/auth/signup')
      .send(newUserReqNoPassword)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toBe('Email and Password required to sign up.');
  });

  test('It should not create a user that exists', async () => {
    await request
      .post('/v1/auth/signup')
      .send(newUserReq)
      .expect('Content-Type', /json/)
      .expect(201);

    const response = await request
      .post('/v1/auth/signup')
      .send(newUserReq)
      .expect('Content-Type', /json/)
      .expect(401);

    const { error } = response.body as UserResponseBody;

    expect(error).toBe('This user already exists.');
  });
});
