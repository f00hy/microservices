import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import config from './config.js';
import { createApp } from './app.js';
import { createConsulRegistry } from './infra/consulRegistry.js';

const PORT = config.port;

async function start() {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET is required to start the Product Service');
  }

  // Ensure DB is connected before accepting requests
  await mongoose.connect(config.mongo);
  console.log('MongoDB connected...');

  const app = createApp();
  const server = await new Promise((resolve, reject) => {
    const s = app.listen(PORT, () => {
      console.log(`Product Service is running on http://localhost:${PORT}`);
      resolve(s);
    });
    s.once('error', reject);
  });

  const consulRegistry = createConsulRegistry();
  await consulRegistry.register();

  const shutdown = async () => {
    try {
      await consulRegistry.deregister();
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('Error during Product Service shutdown:', err);
      process.exit(1);
    }
  };

  // Catch kill signals to shutdown the server
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);

  return server;
}

// Start the Product Service server
// Only when executed directly, not when imported
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((err) => {
    console.error('Product Service startup error:', err);
    process.exit(1);
  });
}
