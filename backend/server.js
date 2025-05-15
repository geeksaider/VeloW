const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { db } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost', 'http://frontend'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Добро пожаловать в API VELO' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';
  
  res.status(statusCode).json({
    success: false,
    message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  
  // Test database connection
  db.getConnection()
    .then(connection => {
      console.log('Успешное подключение к базе данных');
      connection.release();
    })
    .catch(err => {
      console.error('Ошибка подключения к базе данных:', err);
    });
});
