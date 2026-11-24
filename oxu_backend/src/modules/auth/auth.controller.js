const asyncHandler = require('../../utils/asyncHandler');
const service = require('./auth.service');
const User = require('../../models/User');

const login = asyncHandler(async (req, res) => {
  const { token, user } = await service.login(req.body.username, req.body.password);
  res.json({ success: true, data: { token, user } });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('group', 'name course');
  res.json({ success: true, data: user });
});

const changePassword = asyncHandler(async (req, res) => {
  await service.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: "Parol o'zgartirildi" });
});

module.exports = { login, me, changePassword };
