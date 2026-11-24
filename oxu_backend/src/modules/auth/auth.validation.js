const { z } = require('../../utils/validators');

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Login kiritilmagan').max(40),
  password: z.string().min(1, 'Parol kiritilmagan').max(72),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Joriy parol kiritilmagan'),
  newPassword: z.string().min(6, "Yangi parol kamida 6 belgi bo'lsin").max(72),
});

module.exports = { loginSchema, changePasswordSchema };
