const { z } = require('../../utils/validators');

const createGroupSchema = z.object({
  name: z.string().trim().min(1, 'Guruh nomi kiritilmagan').max(40),
  course: z.number().int().min(1).max(6).optional(),
});

const updateGroupSchema = z
  .object({
    name: z.string().trim().min(1).max(40).optional(),
    course: z.number().int().min(1).max(6).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Hech narsa o'zgartirilmadi" });

module.exports = { createGroupSchema, updateGroupSchema };
