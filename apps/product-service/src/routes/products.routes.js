import express from 'express';
import { authJwt } from '../middleware/authJwt.js';
import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from '../controllers/products.controller.js';

const router = express.Router();

router.post('/', authJwt, createProduct);
router.get('/:id', getProductById);
router.put('/:id', authJwt, updateProduct);
router.delete('/:id', authJwt, deleteProduct);

export default router;
