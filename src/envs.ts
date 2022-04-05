import * as dotenv from 'dotenv';

// Node
const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';
const isTest = env === 'test';
const jwtSecret = process.env.JWT_SECRET;
const envFile = isTest ? '.env.test' : '.env';

// Dotenv setup
dotenv.config({ path: `${__dirname}/../${envFile}` });

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
  jwtSecret,
  appUrl,
  port,
  dbUsername,
  dbPassword,
  dbName,
};
