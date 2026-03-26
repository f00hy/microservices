import express from 'express';
import usersRouter from './routes/users.routes.js';

export function createApp() {
  const app = express();
  app.use(express.json()); // Parse JSON requests
  app.use(usersRouter);
  return app;
}
