import express, { Response } from 'express';
import Logger from '../../utils/logger';

const loggerRouter = express.Router();

loggerRouter.get('/', (_, res: Response) => {
  Logger.error('This is an error log');
  Logger.warn('This is a warn log');
  Logger.info('This is a info log');
  Logger.http('This is a http log');
  Logger.debug('This is a debug log');

  res.send('Hello logging world!');
});

export default loggerRouter;
