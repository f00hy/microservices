import 'dotenv/config';

const config = {
  port: Number(process.env.USER_SERVICE_PORT || 3001),
  mongo: process.env.USER_MONGO_URI || 'mongodb://localhost:27017/users',
};

export default config;
