const Lesson = require('../../models/Lesson');
const Group = require('../../models/Group');
const Subject = require('../../models/Subject');
const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const { ROLES, PAIRS } = require('../../config/constants');
const { weekdayName, formatShort, isAllowedDate, allowedRange } = require('../../utils/date');
const { toDto, POPULATE } = require('./lesson.mapper');

const pairTime = (n) => {
  const p = PAIRS.find((x) => x.number === n);
  return p ? `${p.start}–${p.end}` : '';
};
const whenText = (date, pair) => `${formatShort(date)} (${weekdayName(date)}), ${pair}-para (${pairTime(pair)})`;

/**
 * Faqat kecha va bugun uchun dars qo'shish/o'zgartirish mumkin.
 * Server vaqti emas, sozlangan vaqt mintaqasi (Asia/Tashkent) bo'yicha hisoblanadi.
 */
function assertDateAllowed(date) {
  if (isAllowedDate(date)) return;
  const { from, to } = allowedRange();
  throw ApiError.badRequest(
    `Faqat kecha (${formatShort(from)}) va bugun (${formatShort(to)}) uchun dars qo'shish mumkin. ` +
      `${formatShort(date)} sanasi ruxsat etilgan oraliqdan tashqarida`
  );
}

/** Group, subject va teacher haqiqatan mavjudligini tekshiradi */
async function assertRefs({ group, subject, teacher }) {
  const [g, s, t] = await Promise.all([
    Group.findById(group),
    Subject.findById(subject),
    User.findOne({ _id: teacher, role: ROLES.TEACHER }),
  ]);
  if (!g) throw ApiError.badRequest('Guruh topilmadi');
  if (!g.isActive) throw ApiError.badRequest('Bu guruh faol emas');
  if (!s) throw ApiError.badRequest('Fan topilmadi');
  if (!s.isActive) throw ApiError.badRequest('Bu fan faol emas');
  if (!t) throw ApiError.badRequest("O'qituvchi topilmadi");
  if (!t.isActive) throw ApiError.badRequest("Bu o'qituvchining hisobi bloklangan");
}

/** O'qituvchi yoki guruh shu sana/parada band bo'lsa, aniq xabar bilan 409 qaytaradi */
async function assertNoConflict({ date, pair, group, teacher }, excludeId) {
  const notSelf = excludeId ? { _id: { $ne: excludeId } } : {};
  const when = whenText(date, pair);

  const teacherBusy = await Lesson.findOne({ date, pair, teacher, ...notSelf }).populate(POPULATE);
  if (teacherBusy) {
    throw ApiError.conflict(
      `${teacherBusy.teacher.fullName} ${when} da band: ${teacherBusy.group.name} guruhida "${teacherBusy.subject.name}"`
    );
  }
  const groupBusy = await Lesson.findOne({ date, pair, group, ...notSelf }).populate(POPULATE);
  if (groupBusy) {
    throw ApiError.conflict(
      `${groupBusy.group.name} guruhi ${when} da band: ${groupBusy.teacher.fullName} — "${groupBusy.subject.name}"`
    );
  }
}

async function list({ date, group, teacher } = {}) {
  const filter = {};
  if (date) filter.date = date;
  if (group) filter.group = group;
  if (teacher) filter.teacher = teacher;
  const lessons = await Lesson.find(filter).populate(POPULATE).sort({ date: 1, pair: 1 });
  return lessons.map(toDto);
}

async function get(id) {
  const lesson = await Lesson.findById(id).populate(POPULATE);
  if (!lesson) throw ApiError.notFound('Dars topilmadi');
  return toDto(lesson);
}

async function create(data, adminId) {
  assertDateAllowed(data.date);
  await assertRefs(data);
  await assertNoConflict(data);
  const lesson = await Lesson.create({ ...data, createdBy: adminId });
  return get(lesson._id);
}

async function update(id, data) {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw ApiError.notFound('Dars topilmadi');

  // Eski (muddati o'tgan) darslar qulflangan: ularni o'zgartirib bo'lmaydi
  assertDateAllowed(lesson.date);
  if (data.date) assertDateAllowed(data.date);

  const merged = {
    date: data.date ?? lesson.date,
    pair: data.pair ?? lesson.pair,
    group: data.group ?? lesson.group,
    subject: data.subject ?? lesson.subject,
    teacher: data.teacher ?? lesson.teacher,
  };
  await assertRefs(merged);
  await assertNoConflict(merged, lesson._id);

  Object.assign(lesson, data);
  await lesson.save();
  return get(lesson._id);
}

async function remove(id) {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw ApiError.notFound('Dars topilmadi');
  assertDateAllowed(lesson.date);
  await lesson.deleteOne();
}

module.exports = { list, get, create, update, remove };
