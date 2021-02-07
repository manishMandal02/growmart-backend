import express from 'express';
const router = express.Router();
import { protect } from '../Middleware/AuthMiddleware.js';

import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
} from '../Controller/UserController.js';

router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/').post(registerUser);

export default router;
