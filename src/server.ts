import app from './app';
import config from './config/config';

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  server.close(() => {
    console.info('Server closed');
    process.exit(0);
  });
});