/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
}

interface UserResponseHeaders {
  'set-cookie'?: [string];
}

describe('POST /signup', (): void => {
  const request = supertest(app);

  const newUserRequest = {
    email: 'l@l.com',
    password: 'password',
  };

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  test('It should respond with 201 success, new user object and token cookie', async () => {
    const response: UserResponse = await request
      .post('/v1/auth/signup')
      .send(newUserRequest)
      .expect('Content-Type', /json/)
      .expect(201);

    const { id, updatedAt, createdAt, email, name } = response.body;
    expect(id).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(email).toEqual(newUserRequest.email);
    expect(name).toBeNull();

    const tokenHeaderCookie = response.headers['set-cookie'][0];
    expect(tokenHeaderCookie).toContain('ACCESS_TOKEN');
  });
});
