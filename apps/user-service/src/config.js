import 'dotenv/config';

const config = {
  port: Number(process.env.USER_SERVICE_PORT || 3001),
  mongoUri: process.env.USER_MONGO_URI || 'mongodb://localhost:27017/users',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  bcryptSalt: Number(process.env.BCRYPT_SALT || 10),
};

export default config;
