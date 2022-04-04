import express, { Request, Response, Application } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morganMiddleware from './config/morganMiddleware';
import { env } from './envs';

import api from './routes/api';

const app: Application = express();

app.use(helmet());

app.use(morganMiddleware);

app.use(express.json());

app.use(cookieParser());

app.use('/v1', api);

app.get('/', (req: Request, res: Response): void => {
  res.send(`Node.js & TS Working in ${env}!`);
});

export default app;
