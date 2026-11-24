/**
 * Sana yordamchilari. Sanalar "YYYY-MM-DD" qator ko'rinishida saqlanadi —
 * shunda vaqt mintaqasi tufayli kun siljib ketmaydi.
 */
const {
  TIMEZONE,
  WEEKDAY_NAMES,
  MONTH_NAMES,
  ALLOWED_DAYS_BACK,
  ALLOWED_DAYS_FORWARD,
} = require('../config/constants');

const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const parse = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const toStr = (dt) => dt.toISOString().slice(0, 10);

/** Haqiqiy sana ekanini tekshiradi (2026-02-30 kabilar o'tmaydi) */
const isValidDate = (s) => typeof s === 'string' && DATE_RE.test(s) && toStr(parse(s)) === s;

/** Hozirgi sana, sozlangan vaqt mintaqasida */
const today = () => formatter.format(new Date());

const addDays = (s, n) => {
  const dt = parse(s);
  dt.setUTCDate(dt.getUTCDate() + n);
  return toStr(dt);
};

const weekdayName = (s) => WEEKDAY_NAMES[parse(s).getUTCDay()];

/** "19-noyabr" */
const formatShort = (s) => {
  const [, m, d] = s.split('-').map(Number);
  return `${d}-${MONTH_NAMES[m - 1]}`;
};

/** Dars qo'shish mumkin bo'lgan oraliq: { from, to } */
const allowedRange = () => {
  const t = today();
  return { from: addDays(t, -ALLOWED_DAYS_BACK), to: addDays(t, ALLOWED_DAYS_FORWARD) };
};

const isAllowedDate = (s) => {
  const { from, to } = allowedRange();
  return s >= from && s <= to; // YYYY-MM-DD qatorlarini tartib bo'yicha solishtirish to'g'ri ishlaydi
};

/** Ruxsat etilgan sanalar ro'yxati (kecha, bugun) — frontend tanlagichi uchun */
const allowedDates = () => {
  const { from, to } = allowedRange();
  const list = [];
  for (let d = from; d <= to; d = addDays(d, 1)) {
    list.push({ date: d, name: weekdayName(d), label: formatShort(d), isToday: d === today() });
  }
  return list;
};

/** Berilgan sana joylashgan haftaning (Dushanba–Yakshanba) 7 kuni */
const weekOf = (s) => {
  const monday = addDays(s, -((parse(s).getUTCDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
};

module.exports = {
  isValidDate,
  today,
  addDays,
  weekdayName,
  formatShort,
  allowedRange,
  isAllowedDate,
  allowedDates,
  weekOf,
};
