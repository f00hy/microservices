import 'dotenv/config';

const config = {
  name: process.env.USER_SERVICE_NAME || 'user-service',
  port: Number(process.env.USER_SERVICE_PORT || 3001),
  mongo: process.env.MONGO_USER_URI || 'mongodb://localhost:27017/users',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  salt: Number(process.env.BCRYPT_SALT || 10),
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: Number(process.env.CONSUL_PORT || 8500),
    // User service hostname in Dockerized Consul's view
    serviceHost: process.env.CONSUL_USER_SERVICE_HOST || 'host.docker.internal',
  },
};

export default config;
