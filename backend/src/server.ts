import 'dotenv/config';
import { env } from './lib/env'
import { logger } from './lib/logger';
import app from './app';

const PORT = env.PORT;

// Handle unhandled promise rejections and uncaught exceptions to prevent the server from crashing without logging the error.
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled rejection', { reason });
  process.exit(1);
});

// Handle uncaught exceptions to log the error and exit the process gracefully.
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
});

