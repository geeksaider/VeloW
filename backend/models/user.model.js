const { db } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  // Метод для доступа к соединению с базой данных
  static getDb() {
    return db;
  }
  
  // Create a new user
  static async create(userData) {
    const { email, password } = userData;
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, NOW())',
      [email, passwordHash]
    );
    
    const userId = result.insertId;
    return this.findById(userId);
  }
  
  // Find a user by ID
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [id]
    );
    
    return rows[0] || null;
  }
  
  // Find a user by email
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return rows[0] || null;
  }
  
  // Check if a user with the given email exists
  static async emailExists(email) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email]
    );
    
    return rows[0].count > 0;
  }
  
  // Update a user's password
  static async updatePassword(userId, newPasswordHash) {
    await db.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, userId]
    );
    
    return this.findById(userId);
  }
  
  // Validate a user's credentials
  static async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return null;
    }
    
    // Return user without password_hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = User;
