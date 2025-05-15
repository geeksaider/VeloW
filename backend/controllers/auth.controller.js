const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');

// Register a new user
exports.register = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.error('Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Необходимо указать email и пароль' });
    }
    
    // Проверка подключения к базе данных
    try {
      console.log('Checking DB connection...');
      // Простой запрос для проверки соединения
      const [rows] = await User.getDb().execute('SELECT 1');
      console.log('DB connection successful', rows);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
    }
    
    console.log('Checking if email exists:', email);
    // Check if email is already registered
    const userExists = await User.emailExists(email);
    console.log('Email exists check result:', userExists);
    if (userExists) {
      return res.status(400).json({ message: 'Этот email уже зарегистрирован' });
    }
    
    console.log('Creating user...');
    // Create new user
    const user = await User.create({ email, password });
    console.log('User created:', user);
    
    // Generate JWT token
    console.log('Generating token...');
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
    console.log('Token generated successfully');
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    // Более информативные сообщения об ошибках
    let errorMessage = 'Ошибка при регистрации пользователя';
    
    if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = 'Этот email уже зарегистрирован';
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'База данных не найдена';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Не удалось подключиться к базе данных';
    }
    
    res.status(500).json({ message: errorMessage, error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate user credentials
    const user = await User.validateCredentials(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Неправильный email или пароль' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
    
    res.json({
      message: 'Вход выполнен успешно',
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка при входе в систему' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password hash
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Текущий пароль неверен' });
    }
    
    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update user password
    await User.updatePassword(userId, newPasswordHash);
    
    res.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Ошибка при обновлении пароля' });
  }
};
