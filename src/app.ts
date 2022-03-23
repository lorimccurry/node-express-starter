import express, { Request, Response, Application } from 'express';
import helmet from 'helmet';
import morganMiddleware from './config/morganMiddleware';

import api from './routes/api';

const app: Application = express();

app.use(helmet());

app.use(morganMiddleware);

app.use(express.json());

app.use('/v1', api);

app.get('/', (req: Request, res: Response): void => {
  res.send('Node.js & TS Working!');
});

export default app;
