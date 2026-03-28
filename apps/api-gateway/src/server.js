import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config.js';
import { createConsulRegistry } from './consulRegistry.js';

const PORT = config.port;

const app = express();
const consulRegistry = createConsulRegistry();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle requests to the User Service
app.use(
  '/users',
  createProxyMiddleware({
    router: () => consulRegistry.getUserService(),
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
    router: () => consulRegistry.getProductService(),
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Error occurred while proxying request to Product Service:', err);
      res.status(500).send('Something went wrong with the Product Service.');
    },
  }),
);

// Start the API Gateway server
const server = app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});

// Handle errors in the API Gateway server
server.on('error', (err) => {
  console.error('API Gateway error:', err);
  process.exit(1);
});

// Shutdown the API Gateway server
function shutdown() {
  try {
    consulRegistry.close();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Error during API Gateway shutdown:', err);
    process.exit(1);
  }
}

// Catch kill signals to shutdown the server
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
