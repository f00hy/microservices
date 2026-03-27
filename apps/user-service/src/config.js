import 'dotenv/config';

const config = {
  port: Number(process.env.USER_SERVICE_PORT || 3001),
  mongo: process.env.USER_MONGO_URI || 'mongodb://localhost:27017/users',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  salt: Number(process.env.BCRYPT_SALT || 10),
};

export default config;
