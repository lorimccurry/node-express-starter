import express, { Request, Response, Application } from 'express';
import helmet from 'helmet';
import Logger from './lib/logger';
import morganMiddleware from './config/morganMiddleware';

const app: Application = express();

app.use(helmet());

app.use(morganMiddleware);

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
  res.send('Node.js & TS Working!');
});

app.get('/logger', (_, res) => {
  Logger.error('This is an error log');
  Logger.warn('This is a warn log');
  Logger.info('This is a info log');
  Logger.http('This is a http log');
  Logger.debug('This is a debug log');

  res.send('Hello logging world!');
});

export default app;
