const express = require('express');
const router = express.Router();
const { protect, admin } = require('../Middleware/AuthMiddleware');

const {
  createOrder,
  getLoggedInUsersOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderAdmin,
} = require('../Controller/OrderController');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.route('/myorders').get(protect, getLoggedInUsersOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/update/:id').post(protect, admin, updateOrderAdmin);

module.exports = router;
