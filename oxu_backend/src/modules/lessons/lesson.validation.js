const { z, objectId } = require('../../utils/validators');
const { MAX_PAIR } = require('../../config/constants');
const { isValidDate } = require('../../utils/date');

const date = z
  .string()
  .refine(isValidDate, "Sana YYYY-MM-DD ko'rinishida va haqiqiy bo'lishi kerak (masalan 2026-11-19)");
const pair = z.number().int().min(1).max(MAX_PAIR);
const room = z.string().trim().max(30);

const createLessonSchema = z.object({
  date,
  pair,
  group: objectId,
  subject: objectId,
  teacher: objectId,
  room: room.optional(),
});

const updateLessonSchema = z
  .object({
    date: date.optional(),
    pair: pair.optional(),
    group: objectId.optional(),
    subject: objectId.optional(),
    teacher: objectId.optional(),
    room: room.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Hech narsa o'zgartirilmadi" });

const lessonQuerySchema = z.object({
  date: date.optional(),
  group: objectId.optional(),
  teacher: objectId.optional(),
});

module.exports = { createLessonSchema, updateLessonSchema, lessonQuerySchema };
