const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 40 },
    course: { type: Number, min: 1, max: 6, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

groupSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Group', groupSchema);
