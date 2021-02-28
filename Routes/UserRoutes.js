const express = require('express');

const router = express.Router();
const { protect, admin } = require('../Middleware/AuthMiddleware');

const {
  authUser,
  deleteUser,
  getAllUsers,
  getUserProfile,
  registerUser,
  updateUserProfile,
  updateUserProfileAdmin,
} = require('../Controller/UserController');

router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/').post(registerUser).get(protect, admin, getAllUsers);
router
  .route('/:id')
  .post(protect, admin, updateUserProfileAdmin)
  .get(protect, admin, deleteUser);

module.exports = router;
