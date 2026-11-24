const { PAIRS } = require('../../config/constants');
const { weekdayName, formatShort } = require('../../utils/date');

// Populate qilingan Lesson hujjatini frontend uchun qulay ko'rinishga o'tkazadi
function toDto(lesson) {
  const pair = PAIRS.find((p) => p.number === lesson.pair);
  const ref = (v) => (v ? { id: String(v._id), name: v.name || v.fullName } : null);

  return {
    id: String(lesson._id),
    date: lesson.date,
    dateLabel: formatShort(lesson.date),
    dayName: weekdayName(lesson.date),
    pair: lesson.pair,
    start: pair ? pair.start : '',
    end: pair ? pair.end : '',
    room: lesson.room || '',
    group: ref(lesson.group),
    subject: ref(lesson.subject),
    teacher: ref(lesson.teacher),
  };
}

const POPULATE = [
  { path: 'group', select: 'name' },
  { path: 'subject', select: 'name' },
  { path: 'teacher', select: 'fullName' },
];

module.exports = { toDto, POPULATE };
