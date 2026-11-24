const { z } = require('../../utils/validators');

const createSubjectSchema = z.object({
  name: z.string().trim().min(2, 'Fan nomi kamida 2 belgi').max(120),
});

const updateSubjectSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Hech narsa o'zgartirilmadi" });

module.exports = { createSubjectSchema, updateSubjectSchema };
