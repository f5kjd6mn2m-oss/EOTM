const { z, fullName, username, password, optionalText } = require('../users/user.validation');

const createTeacherSchema = z.object({
  fullName,
  username,
  password, // admin o'qituvchiga login va parol beradi
  department: optionalText(120),
  phone: optionalText(30),
});

const updateTeacherSchema = z
  .object({
    fullName: fullName.optional(),
    username: username.optional(),
    department: optionalText(120),
    phone: optionalText(30),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Hech narsa o'zgartirilmadi" });

module.exports = { createTeacherSchema, updateTeacherSchema };
