const Lesson = require('../../models/Lesson');
const User = require('../../models/User');
const Group = require('../../models/Group');
const ApiError = require('../../utils/ApiError');
const { ROLES, PAIRS } = require('../../config/constants');
const { today, weekOf, weekdayName, formatShort, allowedDates } = require('../../utils/date');
const { toDto, POPULATE } = require('../lessons/lesson.mapper');

/**
 * Joriy hafta (Dushanba–Yakshanba) darslari, har bir sana bo'yicha guruhlangan.
 * Dars bo'lmagan kunlar ham bo'sh ro'yxat bilan chiqadi.
 */
async function weeklyFor(filter) {
  const todayStr = today();
  const dates = weekOf(todayStr);
  const lessons = await Lesson.find({ ...filter, date: { $in: dates } })
    .populate(POPULATE)
    .sort({ date: 1, pair: 1 });
  const dtos = lessons.map(toDto);

  return {
    today: todayStr,
    pairs: PAIRS,
    days: dates.map((date) => ({
      date,
      name: weekdayName(date),
      label: formatShort(date),
      lessons: dtos.filter((l) => l.date === date),
    })),
  };
}

/**
 * Admin uchun: tanlangan sana bo'yicha "o'qituvchilar × paralar" jadvali.
 * Dars bor katak -> lesson to'ldirilgan (frontendda qizil), yo'q katak -> lesson: null.
 */
async function teacherGrid(date) {
  const [teachers, lessons] = await Promise.all([
    User.find({ role: ROLES.TEACHER, isActive: true }).select('fullName department').sort({ fullName: 1 }),
    Lesson.find({ date }).populate(POPULATE),
  ]);

  const byKey = new Map();
  lessons.forEach((l) => byKey.set(`${l.teacher._id}:${l.pair}`, toDto(l)));

  const rows = teachers.map((t) => ({
    teacher: { id: String(t._id), fullName: t.fullName, department: t.department },
    cells: PAIRS.map((p) => ({ pair: p.number, lesson: byKey.get(`${t._id}:${p.number}`) || null })),
  }));

  return {
    date,
    dayName: weekdayName(date),
    dateLabel: formatShort(date),
    pairs: PAIRS,
    totalLessons: lessons.length,
    rows,
  };
}

/** O'qituvchi o'z jadvali */
const forTeacher = (teacherId) => weeklyFor({ teacher: teacherId });

/** Talaba o'z guruhining jadvali */
async function forStudent(user) {
  if (!user.group) throw ApiError.notFound('Siz hali guruhga biriktirilmagansiz');
  const group = await Group.findById(user.group).select('name');
  const data = await weeklyFor({ group: user.group });
  return { ...data, group: group ? { id: String(group._id), name: group.name } : null };
}

/** Admin: istalgan o'qituvchi yoki guruh jadvalini ko'rish */
async function forTeacherById(id) {
  const teacher = await User.findOne({ _id: id, role: ROLES.TEACHER }).select('fullName');
  if (!teacher) throw ApiError.notFound("O'qituvchi topilmadi");
  return { ...(await weeklyFor({ teacher: id })), teacher: { id: String(teacher._id), fullName: teacher.fullName } };
}

async function forGroupById(id) {
  const group = await Group.findById(id).select('name');
  if (!group) throw ApiError.notFound('Guruh topilmadi');
  return { ...(await weeklyFor({ group: id })), group: { id: String(group._id), name: group.name } };
}

const meta = () => ({ pairs: PAIRS, today: today(), allowedDates: allowedDates() });

module.exports = { meta, teacherGrid, forTeacher, forStudent, forTeacherById, forGroupById };
