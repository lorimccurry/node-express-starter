import http from 'http';
import app from './app';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

function startServer() {
  server.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}...`);
  });
}

startServer();
