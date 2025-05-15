const { db } = require('../config/database');

class Product {
  // Create a new product
  static async create(productData) {
    const { title, description, price, image_url, category } = productData;
    
    const [result] = await db.execute(
      'INSERT INTO products (title, description, price, image_url, category, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [title, description, price, image_url, category]
    );
    
    const productId = result.insertId;
    return this.findById(productId);
  }
  
  // Find a product by ID
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    
    return rows[0] || null;
  }
  
  // Get all products with optional filtering and pagination
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) as total FROM products';
    const queryParams = [];
    const countParams = [];
    const conditions = [];
    
    // Apply category filter
    if (filters.category) {
      conditions.push('category = ?');
      queryParams.push(filters.category);
      countParams.push(filters.category);
    }
    
    // Apply search filter
    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
      countParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }
    
    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-low':
          query += ' ORDER BY price ASC';
          break;
        case 'price-high':
          query += ' ORDER BY price DESC';
          break;
        default:
          query += ' ORDER BY created_at DESC';
      }
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    // Pagination
    let limit = Number(filters.limit);
    let page = Number(filters.page);
    let offset = null;
    if (Number.isFinite(limit) && limit > 0 && Number.isFinite(page) && page > 0) {
      offset = (page - 1) * limit;
      query += ` LIMIT ${limit} OFFSET ${offset}`;
      console.log('[Product.findAll] Using LIMIT/OFFSET:', { limit, page, offset, query });
    } else {
      // Не добавлять LIMIT/OFFSET вообще!
      console.log('[Product.findAll] NO LIMIT/OFFSET:', { limit, page, query });
    }

    // Get total count
    let total = 0;
    if (limit) {
      const [countRows] = await db.execute(countQuery, countParams.length ? countParams : queryParams);
      total = countRows[0]?.total || 0;
    }

    // Debug log
    console.log('[Product.findAll] filters:', filters, 'limit:', limit, 'page:', page, 'queryParams:', queryParams, 'query:', query);

    // Get products
    const [rows] = await db.execute(query, queryParams);
    if (limit) {
      return { products: rows, total };
    } else {
      return rows;
    }
  }

  // Update a product
  static async update(id, productData) {
    const { title, description, price, image_url, category } = productData;
    
    await db.execute(
      'UPDATE products SET title = ?, description = ?, price = ?, image_url = ?, category = ? WHERE id = ?',
      [title, description, price, image_url, category, id]
    );
    
    return this.findById(id);
  }
  
  // Delete a product
  static async delete(id) {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return { id };
  }
  
  // Get all distinct categories
  static async getCategories() {
    const [rows] = await db.execute('SELECT DISTINCT category FROM products');
    return rows.map(row => row.category);
  }
}

module.exports = Product;
