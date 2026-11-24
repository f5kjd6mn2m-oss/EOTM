const { z, objectId, fullName, username, password, optionalText } = require('../users/user.validation');

const createStudentSchema = z.object({
  fullName,
  username,
  password,
  group: objectId,
  phone: optionalText(30),
});

const updateStudentSchema = z
  .object({
    fullName: fullName.optional(),
    username: username.optional(),
    group: objectId.optional(),
    phone: optionalText(30),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Hech narsa o'zgartirilmadi" });

module.exports = { createStudentSchema, updateStudentSchema };
