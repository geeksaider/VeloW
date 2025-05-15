const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Authenticated user cart routes
router.get('/', authMiddleware, cartController.getCart);
router.post('/', authMiddleware, cartController.addToCart);
router.put('/:productId', authMiddleware, cartController.updateCartItem);
router.delete('/:productId', authMiddleware, cartController.removeFromCart);
router.delete('/', authMiddleware, cartController.clearCart);

// Guest cart routes
router.get('/guest/:token', cartController.getGuestCart);
router.post('/guest', cartController.addToGuestCart);
router.put('/guest/:token/:productId', cartController.updateGuestCartItem);
router.delete('/guest/:token/:productId', cartController.removeFromGuestCart);
router.delete('/guest/:token', cartController.clearGuestCart);

// Migrate guest cart to user cart
router.post('/migrate', authMiddleware, cartController.migrateGuestCart);

module.exports = router;
