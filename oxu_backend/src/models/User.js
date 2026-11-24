const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLE_LIST, ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ROLE_LIST, required: true, index: true },
    // Faqat student uchun
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null, index: true },
    // Faqat teacher uchun (ixtiyoriy)
    department: { type: String, trim: true, maxlength: 120, default: '' },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('validate', function (next) {
  if (this.role === ROLES.STUDENT && !this.group) {
    this.invalidate('group', 'Talaba uchun guruh majburiy');
  }
  if (this.role !== ROLES.STUDENT) this.group = null;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
