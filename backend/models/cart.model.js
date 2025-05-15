const { db } = require('../config/database');

class Cart {
  // Add item to user's cart
  static async addItem(userId, productId, quantity) {
    // Check if item already exists in cart
    const [existingItems] = await db.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (existingItems.length > 0) {
      // Update quantity if item exists
      const newQuantity = existingItems[0].quantity + quantity;
      
      await db.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
      
      return this.getCartItems(userId);
    }
    
    // Add new item if it doesn't exist
    await db.execute(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
    
    return this.getCartItems(userId);
  }
  
  // Add item to guest's cart
  static async addGuestItem(guestToken, productId, quantity) {
    // Check if item already exists in cart
    const [existingItems] = await db.execute(
      'SELECT * FROM cart_items WHERE guest_token = ? AND product_id = ?',
      [guestToken, productId]
    );
    
    if (existingItems.length > 0) {
      // Update quantity if item exists
      const newQuantity = existingItems[0].quantity + quantity;
      
      await db.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
      
      return this.getGuestCartItems(guestToken);
    }
    
    // Add new item if it doesn't exist
    await db.execute(
      'INSERT INTO cart_items (guest_token, product_id, quantity) VALUES (?, ?, ?)',
      [guestToken, productId, quantity]
    );
    
    return this.getGuestCartItems(guestToken);
  }
  
  // Update cart item quantity
  static async updateItemQuantity(userId, productId, quantity) {
    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    
    return this.getCartItems(userId);
  }
  
  // Update guest cart item quantity
  static async updateGuestItemQuantity(guestToken, productId, quantity) {
    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE guest_token = ? AND product_id = ?',
      [quantity, guestToken, productId]
    );
    
    return this.getGuestCartItems(guestToken);
  }
  
  // Remove item from cart
  static async removeItem(userId, productId) {
    await db.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    return this.getCartItems(userId);
  }
  
  // Remove item from guest cart
  static async removeGuestItem(guestToken, productId) {
    await db.execute(
      'DELETE FROM cart_items WHERE guest_token = ? AND product_id = ?',
      [guestToken, productId]
    );
    
    return this.getGuestCartItems(guestToken);
  }
  
  // Clear user's cart
  static async clearCart(userId) {
    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    return [];
  }
  
  // Clear guest's cart
  static async clearGuestCart(guestToken) {
    await db.execute('DELETE FROM cart_items WHERE guest_token = ?', [guestToken]);
    return [];
  }
  
  // Get all cart items for a user with product details
  static async getCartItems(userId) {
    const [rows] = await db.execute(`
      SELECT ci.id, ci.product_id as productId, ci.quantity, 
             p.title, p.price, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId]);
    
    return rows;
  }
  
  // Get all cart items for a guest with product details
  static async getGuestCartItems(guestToken) {
    const [rows] = await db.execute(`
      SELECT ci.id, ci.product_id as productId, ci.quantity, 
             p.title, p.price, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.guest_token = ?
    `, [guestToken]);
    
    return rows;
  }
  
  // Migrate guest cart to user cart
  static async migrateGuestCart(userId, guestToken) {
    const guestItems = await this.getGuestCartItems(guestToken);
    
    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      for (const item of guestItems) {
        // Check if user already has this product in cart
        const [existingItems] = await connection.execute(
          'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
          [userId, item.productId]
        );
        
        if (existingItems.length > 0) {
          // Update quantity if item exists
          const newQuantity = existingItems[0].quantity + item.quantity;
          
          await connection.execute(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [newQuantity, existingItems[0].id]
          );
        } else {
          // Add new item if it doesn't exist
          await connection.execute(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [userId, item.productId, item.quantity]
          );
        }
      }
      
      // Clear guest cart
      await connection.execute(
        'DELETE FROM cart_items WHERE guest_token = ?',
        [guestToken]
      );
      
      await connection.commit();
      return this.getCartItems(userId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Cart;
