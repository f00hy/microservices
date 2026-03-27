import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import config from './config.js';
import { createApp } from './app.js';

const PORT = config.port;

async function start() {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET is required to start the Product Service');
  }

  // Ensure DB is connected before accepting requests
  await mongoose.connect(config.mongo);
  console.log('MongoDB connected...');

  const app = createApp();

  return app.listen(PORT, () => {
    console.log(`Product Service is running on http://localhost:${PORT}`);
  });
}

// Start the Product Service server
// Only when executed directly, not when imported
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}
