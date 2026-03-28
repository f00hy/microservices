import 'dotenv/config';

const config = {
  name: process.env.PRODUCT_SERVICE_NAME || 'product-service',
  port: Number(process.env.PRODUCT_SERVICE_PORT || 3002),
  mongo: process.env.MONGO_PRODUCT_URI || 'mongodb://localhost:27018/products',
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: Number(process.env.CONSUL_PORT || 8500),
    // Product service hostname in Dockerized Consul's view
    serviceHost: process.env.CONSUL_PRODUCT_SERVICE_HOST || 'host.docker.internal',
  },
};

export default config;
