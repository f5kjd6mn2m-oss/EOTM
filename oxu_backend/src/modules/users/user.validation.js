const { z, objectId } = require('../../utils/validators');

const fullName = z.string().trim().min(3, "Ism kamida 3 belgi bo'lsin").max(120);
const username = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Login kamida 3 belgi bo'lsin")
  .max(40)
  .regex(/^[a-z0-9._-]+$/, "Login faqat lotin harflari, raqam va . _ - belgilaridan iborat bo'lsin");
const password = z.string().min(6, "Parol kamida 6 belgi bo'lsin").max(72);
const optionalText = (max) => z.string().trim().max(max).optional();

const resetPasswordSchema = z.object({ password });

const listQuerySchema = z.object({
  search: z.string().trim().max(60).optional(),
  group: objectId.optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

module.exports = { fullName, username, password, optionalText, resetPasswordSchema, listQuerySchema, z, objectId };
