/**
 * Birinchi adminni yaratadi:  npm run seed
 * Demo ma'lumotlar bilan:      npm run seed -- --demo
 */
const mongoose = require('mongoose');
const env = require('../config/env');
const connectDB = require('../config/db');
const User = require('../models/User');
const Group = require('../models/Group');
const Subject = require('../models/Subject');
const Lesson = require('../models/Lesson');
const { ROLES } = require('../config/constants');
const { today, addDays } = require('../utils/date');

async function seedAdmin() {
  const username = env.ADMIN_USERNAME.toLowerCase();
  const exists = await User.findOne({ username });
  if (exists) {
    console.log(`Admin allaqachon bor: ${username}`);
    return exists;
  }
  const admin = await User.create({
    fullName: env.ADMIN_FULLNAME,
    username,
    password: env.ADMIN_PASSWORD,
    role: ROLES.ADMIN,
  });
  console.log(`Admin yaratildi → login: ${username}  parol: ${env.ADMIN_PASSWORD}`);
  return admin;
}

async function seedDemo(admin) {
  const groupNames = ['101-guruh', '102-guruh'];
  const subjectNames = ['Matematika', 'Fizika', 'Dasturlash', 'Ingliz tili'];
  const groups = [];
  for (const name of groupNames) {
    groups.push((await Group.findOne({ name })) || (await Group.create({ name })));
  }
  const subjects = [];
  for (const name of subjectNames) {
    subjects.push((await Subject.findOne({ name })) || (await Subject.create({ name })));
  }

  const ensureUser = async (data) =>
    (await User.findOne({ username: data.username })) || User.create(data);

  const t1 = await ensureUser({ fullName: 'Aliyev Anvar', username: 'anvar', password: 'teacher123', role: ROLES.TEACHER });
  const t2 = await ensureUser({ fullName: 'Karimova Dilnoza', username: 'dilnoza', password: 'teacher123', role: ROLES.TEACHER });
  await ensureUser({ fullName: 'Soliyev Bobur', username: 'bobur', password: 'student123', role: ROLES.STUDENT, group: groups[0]._id });

  // Faqat ruxsat etilgan sanalar: kecha va bugun
  const d0 = today();
  const d1 = addDays(d0, -1);
  const demoLessons = [
    { date: d0, pair: 1, group: groups[0], subject: subjects[0], teacher: t1 },
    { date: d0, pair: 2, group: groups[0], subject: subjects[2], teacher: t2 },
    { date: d0, pair: 2, group: groups[1], subject: subjects[0], teacher: t1 },
    { date: d1, pair: 3, group: groups[0], subject: subjects[1], teacher: t1 },
  ];
  for (const l of demoLessons) {
    const exists = await Lesson.findOne({ date: l.date, pair: l.pair, teacher: l.teacher._id });
    if (!exists) {
      await Lesson.create({ ...l, group: l.group._id, subject: l.subject._id, teacher: l.teacher._id, createdBy: admin._id });
    }
  }
  console.log('Demo: o\'qituvchilar anvar / dilnoza (teacher123), talaba bobur (student123)');
}

(async () => {
  try {
    await connectDB();
    const admin = await seedAdmin();
    if (process.argv.includes('--demo')) await seedDemo(admin);
    // Eski (hafta kuniga asoslangan) darslarni tozalaymiz: ularda sana yo'q
    const legacy = await Lesson.deleteMany({ date: { $exists: false } });
    if (legacy.deletedCount) console.log(`Eski formatdagi ${legacy.deletedCount} ta dars o'chirildi`);
    // Indekslarni sxemaga moslaymiz (eski day indekslari olib tashlanadi)
    await Promise.all([User.init(), Group.init(), Subject.init()]);
    await Lesson.syncIndexes();
  } catch (err) {
    console.error('Seed xatosi:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
