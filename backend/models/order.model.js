const { db } = require('../config/database');

class Order {
  // Create a new order from user's cart
  static async createFromCart(userId) {
    // Get user's cart items
    const [cartItems] = await db.execute(`
      SELECT ci.product_id, ci.quantity, p.price, p.title, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId]);
    
    if (cartItems.length === 0) {
      throw new Error('Корзина пуста');
    }
    
    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create order
      const [orderResult] = await connection.execute(
        'INSERT INTO orders (user_id, created_at) VALUES (?, NOW())',
        [userId]
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of cartItems) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }
      
      // Clear cart
      await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
      
      await connection.commit();
      
      // Return the created order with items
      return this.findById(orderId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Find order by ID with items
  static async findById(id) {
    // Get order
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    
    if (orders.length === 0) {
      return null;
    }
    
    const order = orders[0];
    
    // Get order items with product details
    const [items] = await db.execute(`
      SELECT oi.*, p.title, p.description, p.image_url, p.category
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    
    // Format items with product information
    const formattedItems = items.map(item => ({
      id: item.id,
      order_id: item.order_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time,
      product: {
        id: item.product_id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        category: item.category
      }
    }));
    
    return {
      ...order,
      items: formattedItems
    };
  }
  
  // Get all orders for a user
  static async findByUserId(userId) {
    // Get all orders for user
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.execute(`
          SELECT oi.*, p.title, p.description, p.image_url, p.category
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [order.id]);
        
        // Format items with product information
        const formattedItems = items.map(item => ({
          id: item.id,
          order_id: item.order_id,
          quantity: item.quantity,
          price_at_time: item.price_at_time,
          product: {
            id: item.product_id,
            title: item.title,
            description: item.description,
            image_url: item.image_url,
            category: item.category
          }
        }));
        
        return {
          ...order,
          items: formattedItems
        };
      })
    );
    
    return ordersWithItems;
  }
}

module.exports = Order;
