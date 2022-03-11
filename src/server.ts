import http from 'http';
import app from './app';
import Logger from './lib/logger';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

function startServer() {
  server.listen(PORT, (): void => {
    Logger.debug(`Server running @ http://localhost:${PORT}...`);
  });
}

startServer();
