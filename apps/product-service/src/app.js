import express from 'express';
import productsRouter from './routes/products.routes.js';

export function createApp() {
  const app = express();
  app.use(express.json()); // Parse JSON requests
  app.use(productsRouter);
  return app;
}
