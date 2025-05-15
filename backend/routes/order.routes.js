const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All order routes require authentication
router.use(authMiddleware);

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders for the authenticated user
router.get('/', orderController.getUserOrders);

// Get a specific order by ID
router.get('/:id', orderController.getOrderById);

module.exports = router;
