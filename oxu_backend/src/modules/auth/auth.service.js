const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const { signToken } = require('../../utils/token');

async function login(username, password) {
  const user = await User.findOne({ username: username.toLowerCase() })
    .select('+password')
    .populate('group', 'name course');

  // Login yoki parol xato bo'lsa bir xil xabar — foydalanuvchi mavjudligi oshkor bo'lmasin
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Login yoki parol noto'g'ri");
  }
  if (!user.isActive) throw ApiError.forbidden('Hisobingiz bloklangan. Administratorga murojaat qiling');

  return { token: signToken(user), user };
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest("Joriy parol noto'g'ri");
  }
  user.password = newPassword; // pre('save') hash qiladi
  await user.save();
}

module.exports = { login, changePassword };
