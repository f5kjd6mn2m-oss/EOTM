const ROLES = Object.freeze({
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
});

// Indeks JavaScript getDay() bilan mos: 0 = Yakshanba ... 6 = Shanba
const WEEKDAY_NAMES = Object.freeze([
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
]);

const MONTH_NAMES = Object.freeze([
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
]);

// Para vaqtlari — faqat shu yerda o'zgartiriladi
const PAIRS = Object.freeze([
  { number: 1, start: '08:30', end: '09:50' },
  { number: 2, start: '10:00', end: '11:20' },
  { number: 3, start: '11:30', end: '12:50' },
  { number: 4, start: '13:30', end: '14:50' },
  { number: 5, start: '15:00', end: '16:20' },
  { number: 6, start: '16:30', end: '17:50' },
]);

// "Bugun" qaysi vaqt mintaqasi bo'yicha hisoblanadi (server UTC da bo'lsa ham to'g'ri ishlaydi)
const TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Tashkent';

// Dars qo'shish/o'zgartirish mumkin bo'lgan oraliq: bugundan 1 kun oldin ... bugun
const ALLOWED_DAYS_BACK = 1;
const ALLOWED_DAYS_FORWARD = 0;

module.exports = {
  ROLES,
  ROLE_LIST: Object.values(ROLES),
  WEEKDAY_NAMES,
  MONTH_NAMES,
  PAIRS,
  MAX_PAIR: PAIRS.length,
  TIMEZONE,
  ALLOWED_DAYS_BACK,
  ALLOWED_DAYS_FORWARD,
};
