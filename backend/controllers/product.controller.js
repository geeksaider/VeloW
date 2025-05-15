const Product = require('../models/product.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'));
    }
  }
}).single('image');

// Get all products with filtering and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, page, limit } = req.query;
    const filters = { category, search, sort, page, limit };

    const result = await Product.findAll(filters);
    // Если есть пагинация, возвращаем объект { products, total }
    if (limit) {
      res.json(result);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Ошибка при получении списка товаров' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Ошибка при получении информации о товаре' });
  }
};

// Get all product categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: 'Ошибка при получении категорий товаров' });
  }
};

// Create a new product
exports.createProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const { title, description, price, category } = req.body;
      
      // Validate required fields
      if (!title || !description || !price || !category) {
        return res.status(400).json({ message: 'Все поля обязательны к заполнению' });
      }
      
      // Handle image path
      let image_url = req.body.image_url || null;
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
      }
      
      const productData = {
        title,
        description,
        price: parseFloat(price),
        category,
        image_url
      };
      
      const product = await Product.create(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Ошибка при создании товара' });
    }
  });
};

// Update a product
exports.updateProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const productId = req.params.id;
      const { title, description, price, category } = req.body;
      
      // Get existing product
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Товар не найден' });
      }
      
      // Handle image update
      let image_url = req.body.image_url || existingProduct.image_url;
      if (req.file) {
        // Delete old image if it exists
        if (existingProduct.image_url) {
          const oldImagePath = path.join(__dirname, '..', existingProduct.image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        image_url = `/uploads/${req.file.filename}`;
      }
      
      const productData = {
        title: title || existingProduct.title,
        description: description || existingProduct.description,
        price: price ? parseFloat(price) : existingProduct.price,
        category: category || existingProduct.category,
        image_url
      };
      
      const updatedProduct = await Product.update(productId, productData);
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Ошибка при обновлении товара' });
    }
  });
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Get existing product to delete image file
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    // Delete image file if it exists
    if (existingProduct.image_url) {
      const imagePath = path.join(__dirname, '..', existingProduct.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Product.delete(productId);
    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Ошибка при удалении товара' });
  }
};
