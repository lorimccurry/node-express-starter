import supertest from 'supertest';
import app from './app';
import { env } from './envs';

describe('Test GET /', (): void => {
  const request = supertest(app);

  test('It should respond with 200 success', async () => {
    const response = await request
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200);

    expect(response.text).toBe(`Node.js & TS Working in ${env}!`);
  });
});
