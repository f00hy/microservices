import 'dotenv/config';

const config = {
  port: Number(process.env.PRODUCT_SERVICE_PORT || 3002),
  mongoUri: process.env.PRODUCT_MONGO_URI || 'mongodb://localhost:27017/products',
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
