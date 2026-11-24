const { WEEKDAYS } = require('../config/constants');

// Bugungi kunga dars qo'shish shu soatgacha mumkin (Toshkent vaqti)
const TODAY_CUTOFF_HOUR = 18;
const TIMEZONE = 'Asia/Tashkent';

const WEEKDAY_INDEX = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

function tashkentNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date);
  const weekday = WEEKDAY_INDEX[parts.find((p) => p.type === 'weekday').value];
  const hour = Number(parts.find((p) => p.type === 'hour').value) % 24;
  return { weekday, hour };
}

// Hozir tahrirlash mumkin bo'lgan kunlar: bugun (18:00 gacha) va ertaga
function editableDays(date = new Date()) {
  const { weekday, hour } = tashkentNow(date);
  const days = [];
  if (hour < TODAY_CUTOFF_HOUR) days.push(weekday);
  days.push(weekday === 7 ? 1 : weekday + 1);
  const valid = WEEKDAYS.map((d) => d.number);
  return days.filter((d) => valid.includes(d));
}

const isDayEditable = (day, date = new Date()) => editableDays(date).includes(day);

function lockReason(day, date = new Date()) {
  const { weekday, hour } = tashkentNow(date);
  if (day === weekday && hour >= TODAY_CUTOFF_HOUR) {
    return `Bugungi kunga dars qo'shish ${TODAY_CUTOFF_HOUR}:00 gacha mumkin edi`;
  }
  return "Faqat bugun (18:00 gacha) va ertangi kunga dars qo'shish mumkin";
}

module.exports = { TODAY_CUTOFF_HOUR, tashkentNow, editableDays, isDayEditable, lockReason };