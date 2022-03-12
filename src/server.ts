import http from 'http';
import app from './app';
import Logger from './lib/logger';
import { port } from './envs';

const PORT = port;

const server = http.createServer(app);

function startServer() {
  server.listen(PORT, (): void => {
    Logger.debug(`Server running @ http://localhost:${PORT}...`);
  });
}

startServer();
