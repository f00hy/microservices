import 'dotenv/config';

const config = {
  port: Number(process.env.PRODUCT_SERVICE_PORT || 3002),
  mongo: process.env.PRODUCT_MONGO_URI || 'mongodb://localhost:27018/products',
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

export default config;
