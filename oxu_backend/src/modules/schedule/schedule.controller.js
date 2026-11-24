const asyncHandler = require('../../utils/asyncHandler');
const service = require('./schedule.service');
const { ROLES } = require('../../config/constants');
const { today } = require('../../utils/date');

const meta = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: service.meta() });
});

const grid = asyncHandler(async (req, res) => {
  const date = req.validatedQuery.date || today();
  res.json({ success: true, data: await service.teacherGrid(date) });
});

// Teacher -> o'z jadvali, Student -> guruhining jadvali
const mine = asyncHandler(async (req, res) => {
  const data =
    req.user.role === ROLES.TEACHER
      ? await service.forTeacher(req.user._id)
      : await service.forStudent(req.user);
  res.json({ success: true, data });
});

const byTeacher = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.forTeacherById(req.params.id) });
});

const byGroup = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.forGroupById(req.params.id) });
});

module.exports = { meta, grid, mine, byTeacher, byGroup };
