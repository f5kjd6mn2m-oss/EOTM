const asyncHandler = require('../../utils/asyncHandler');
const service = require('./teacher.service');

const list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.list(req.validatedQuery) });
});

const get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.get(req.params.id) });
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.update(req.params.id, req.body) });
});

const resetPassword = asyncHandler(async (req, res) => {
  await service.resetPassword(req.params.id, req.body.password);
  res.json({ success: true, message: "Parol yangilandi" });
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ success: true, message: "O'qituvchi o'chirildi" });
});

module.exports = { list, get, create, update, resetPassword, remove };
