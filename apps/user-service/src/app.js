import express from 'express';
import authRouter from './routes/auth.routes.js';
import usersRouter from './routes/users.routes.js';

export function createApp() {
  const app = express();
  app.use(express.json()); // Parse JSON requests
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  app.use(authRouter);
  app.use(usersRouter);
  return app;
}
