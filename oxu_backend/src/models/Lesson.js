const mongoose = require('mongoose');
const { MAX_PAIR } = require('../config/constants');

/**
 * Aniq sanadagi dars: date ("YYYY-MM-DD") + para (1-6).
 * Bir o'qituvchi va bir guruh bir vaqtda faqat bitta darsda bo'la oladi —
 * bu qoida bazaning o'zida unique indekslar bilan kafolatlanadi.
 */
const lessonSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Sana YYYY-MM-DD ko'rinishida bo'lishi kerak"],
    },
    pair: { type: Number, required: true, min: 1, max: MAX_PAIR },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, trim: true, maxlength: 30, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

lessonSchema.index({ teacher: 1, date: 1, pair: 1 }, { unique: true });
lessonSchema.index({ group: 1, date: 1, pair: 1 }, { unique: true });
lessonSchema.index({ date: 1, pair: 1 });

lessonSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Lesson', lessonSchema);
