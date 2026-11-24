const rateLimit = require('express-rate-limit');

// Login uchun: 15 daqiqada 20 urinish (parol terib topishdan himoya)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring" },
});

module.exports = { loginLimiter };
