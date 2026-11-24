const asyncHandler = require('../../utils/asyncHandler');
const service = require('./lesson.service');

const list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.list(req.validatedQuery) });
});

const get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.get(req.params.id) });
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body, req.user._id) });
});

const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.update(req.params.id, req.body) });
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ success: true, message: 'Dars olib tashlandi' });
});

module.exports = { list, get, create, update, remove };
