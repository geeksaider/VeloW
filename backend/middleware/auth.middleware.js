const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Get token from authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ message: 'Доступ запрещен. Требуется авторизация' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Add user to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный или истекший токен' });
  }
};

module.exports = authMiddleware;
