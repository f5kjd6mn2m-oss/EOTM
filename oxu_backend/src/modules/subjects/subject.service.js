const Subject = require('../../models/Subject');
const Lesson = require('../../models/Lesson');
const ApiError = require('../../utils/ApiError');

const list = () => Subject.find().sort({ name: 1 });

async function findOne(id) {
  const subject = await Subject.findById(id);
  if (!subject) throw ApiError.notFound('Fan topilmadi');
  return subject;
}

const create = (data) => Subject.create(data);

async function update(id, data) {
  const subject = await findOne(id);
  Object.assign(subject, data);
  return subject.save();
}

async function remove(id) {
  const subject = await findOne(id);
  const lessons = await Lesson.countDocuments({ subject: subject._id });
  if (lessons > 0) throw ApiError.conflict(`Bu fan ${lessons} ta darsda ishlatilgan. Avval darslarni olib tashlang`);
  await subject.deleteOne();
}

module.exports = { list, create, update, remove };
