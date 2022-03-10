import express, { Request, Response, Application } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
  res.send('Node.js & TS Working!');
});

export default app;
