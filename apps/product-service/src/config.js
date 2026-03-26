import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to repo root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  port: Number(process.env.PRODUCT_SERVICE_PORT || 3002),
  mongoUri: process.env.PRODUCT_MONGO_URI || 'mongodb://localhost:27017/products',
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
