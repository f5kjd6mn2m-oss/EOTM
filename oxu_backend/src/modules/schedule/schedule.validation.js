const { z } = require('../../utils/validators');
const { isValidDate } = require('../../utils/date');

const gridQuerySchema = z.object({
  date: z
    .string()
    .refine(isValidDate, "Sana YYYY-MM-DD ko'rinishida bo'lishi kerak")
    .optional(),
});

module.exports = { gridQuerySchema };
