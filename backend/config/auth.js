module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'velo_super_secret_key_change_in_production',
  jwtExpiresIn: '24h',
  cookieName: 'velo_token',
  cookieOptions: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
};
