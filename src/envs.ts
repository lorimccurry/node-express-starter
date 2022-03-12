import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

// Node
const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';
const isTest = env === 'test';

// Base
const appUrl: string = process.env.APP_URL || 'localhost';
const port = Number(process.env.PORT || '8000');

// Database
const dbUsername: string = process.env.DB_USERNAME || '';
const dbPassword: string = process.env.DB_PASSWORD || '';
const dbName: string = process.env.DB_NAME || '';

export {
  env,
  isDevelopment,
  isTest,
  appUrl,
  port,
  dbUsername,
  dbPassword,
  dbName,
};
