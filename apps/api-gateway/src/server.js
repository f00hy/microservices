import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config.js';

const app = express();
const PORT = config.port;

// Handle requests to the User Service
app.use(
  '/users',
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Error occurred while proxying request to User Service:', err);
      res.status(500).send('Something went wrong with the User Service.');
    },
  }),
);

// Handle requests to the Product Service
app.use(
  '/products',
  createProxyMiddleware({
    target: config.services.product,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Error occurred while proxying request to Product Service:', err);
      res.status(500).send('Something went wrong with the Product Service.');
    },
  }),
);

// Start the API Gateway server
app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
