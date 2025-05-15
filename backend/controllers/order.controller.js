const Order = require('../models/order.model');

// Create a new order from user's cart
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Create order from cart items
    const order = await Order.createFromCart(userId);
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle empty cart
    if (error.message === 'Корзина пуста') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Ошибка при создании заказа' });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    // Ensure user can only access their own orders
    if (order.user_id !== userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Ошибка при получении заказа' });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.findByUserId(userId);
    
    res.json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ message: 'Ошибка при получении заказов пользователя' });
  }
};
