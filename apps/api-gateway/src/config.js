import 'dotenv/config';

const config = {
  port: Number(process.env.API_GATEWAY_PORT || 3000),
  services: {
    user: process.env.USER_SERVICE_NAME || 'user-service',
    product: process.env.PRODUCT_SERVICE_NAME || 'product-service',
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: Number(process.env.CONSUL_PORT || 8500),
  },
};

export default config;
