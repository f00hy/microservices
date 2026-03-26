import express from 'express';
import { authJwt } from '../middleware/authJwt.js';
import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/users.controller.js';

const router = express.Router();

router.post('/', createUser);
router.get('/me', authJwt, getUserById);
router.put('/me', authJwt, updateUser);
router.delete('/me', authJwt, deleteUser);

export default router;
