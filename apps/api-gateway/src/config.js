import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to repo root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  port: Number(process.env.API_GATEWAY_PORT || 3000),
  userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  productService: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
};

export default config;
