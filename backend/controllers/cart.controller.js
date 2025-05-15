const Cart = require('../models/cart.model');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Ошибка при получении корзины' });
  }
};

// Get guest's cart
exports.getGuestCart = async (req, res) => {
  try {
    const guestToken = req.params.token;
    const cartItems = await Cart.getGuestCartItems(guestToken);
    res.json(cartItems);
  } catch (error) {
    console.error('Error getting guest cart:', error);
    res.status(500).json({ message: 'Ошибка при получении корзины гостя' });
  }
};

// Add item to user's cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'ID товара обязателен' });
    }
    
    const cartItems = await Cart.addItem(userId, productId, quantity);
    res.status(201).json(cartItems);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Ошибка при добавлении товара в корзину' });
  }
};

// Add item to guest's cart
exports.addToGuestCart = async (req, res) => {
  try {
    const { guestToken, productId, quantity = 1 } = req.body;
    
    if (!guestToken || !productId) {
      return res.status(400).json({ message: 'Токен гостя и ID товара обязательны' });
    }
    
    const cartItems = await Cart.addGuestItem(guestToken, productId, quantity);
    res.status(201).json(cartItems);
  } catch (error) {
    console.error('Error adding to guest cart:', error);
    res.status(500).json({ message: 'Ошибка при добавлении товара в корзину гостя' });
  }
};

// Update item quantity in user's cart
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Количество должно быть больше 0' });
    }
    
    const cartItems = await Cart.updateItemQuantity(userId, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Ошибка при обновлении количества товара' });
  }
};

// Update item quantity in guest's cart
exports.updateGuestCartItem = async (req, res) => {
  try {
    const guestToken = req.params.token;
    const productId = req.params.productId;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Количество должно быть больше 0' });
    }
    
    const cartItems = await Cart.updateGuestItemQuantity(guestToken, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    console.error('Error updating guest cart item:', error);
    res.status(500).json({ message: 'Ошибка при обновлении количества товара' });
  }
};

// Remove item from user's cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    
    const cartItems = await Cart.removeItem(userId, productId);
    res.json(cartItems);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Ошибка при удалении товара из корзины' });
  }
};

// Remove item from guest's cart
exports.removeFromGuestCart = async (req, res) => {
  try {
    const guestToken = req.params.token;
    const productId = req.params.productId;
    
    const cartItems = await Cart.removeGuestItem(guestToken, productId);
    res.json(cartItems);
  } catch (error) {
    console.error('Error removing from guest cart:', error);
    res.status(500).json({ message: 'Ошибка при удалении товара из корзины гостя' });
  }
};

// Clear user's cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Cart.clearCart(userId);
    res.json({ message: 'Корзина очищена' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Ошибка при очистке корзины' });
  }
};

// Clear guest's cart
exports.clearGuestCart = async (req, res) => {
  try {
    const guestToken = req.params.token;
    
    await Cart.clearGuestCart(guestToken);
    res.json({ message: 'Корзина гостя очищена' });
  } catch (error) {
    console.error('Error clearing guest cart:', error);
    res.status(500).json({ message: 'Ошибка при очистке корзины гостя' });
  }
};

// Migrate guest cart to user cart after login
exports.migrateGuestCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guestToken } = req.body;
    
    if (!guestToken) {
      return res.status(400).json({ message: 'Токен гостя обязателен' });
    }
    
    const cartItems = await Cart.migrateGuestCart(userId, guestToken);
    res.json(cartItems);
  } catch (error) {
    console.error('Error migrating guest cart:', error);
    res.status(500).json({ message: 'Ошибка при переносе корзины гостя' });
  }
};
