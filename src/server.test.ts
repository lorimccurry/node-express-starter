import 'jest';
import supertest from 'supertest';
import app from './app';

describe('Test GET /', (): void => {
  const request = supertest(app);

  test('It should respond with 200 success', async () => {
    const response = await request
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200);

    expect(response.text).toEqual('Node.js & TS Working!');
  });
});
