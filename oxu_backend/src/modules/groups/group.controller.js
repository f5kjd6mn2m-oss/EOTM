const asyncHandler = require('../../utils/asyncHandler');
const service = require('./group.service');

const list = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await service.list() });
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.update(req.params.id, req.body) });
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ success: true, message: "Guruh o'chirildi" });
});

module.exports = { list, create, update, remove };
