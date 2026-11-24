const Group = require('../../models/Group');
const User = require('../../models/User');
const Lesson = require('../../models/Lesson');
const ApiError = require('../../utils/ApiError');
const { ROLES } = require('../../config/constants');

async function list() {
  const groups = await Group.find().sort({ name: 1 }).lean();
  // Har bir guruhdagi talabalar sonini bitta so'rovda hisoblaymiz
  const counts = await User.aggregate([
    { $match: { role: ROLES.STUDENT, group: { $ne: null } } },
    { $group: { _id: '$group', count: { $sum: 1 } } },
  ]);
  const map = new Map(counts.map((c) => [String(c._id), c.count]));
  return groups.map((g) => ({ ...g, id: String(g._id), studentsCount: map.get(String(g._id)) || 0 }));
}

async function findOne(id) {
  const group = await Group.findById(id);
  if (!group) throw ApiError.notFound('Guruh topilmadi');
  return group;
}

const create = (data) => Group.create(data);

async function update(id, data) {
  const group = await findOne(id);
  Object.assign(group, data);
  return group.save();
}

async function remove(id) {
  const group = await findOne(id);
  const [students, lessons] = await Promise.all([
    User.countDocuments({ group: group._id }),
    Lesson.countDocuments({ group: group._id }),
  ]);
  if (students > 0) throw ApiError.conflict(`Guruhda ${students} ta talaba bor. Avval ularni boshqa guruhga o'tkazing`);
  if (lessons > 0) throw ApiError.conflict(`Guruhga ${lessons} ta dars biriktirilgan. Avval darslarni olib tashlang`);
  await group.deleteOne();
}

module.exports = { list, create, update, remove };
