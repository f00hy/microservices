import 'dotenv/config';

const config = {
  port: Number(process.env.API_GATEWAY_PORT || 3000),
  services: {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  },
};

export default config;
