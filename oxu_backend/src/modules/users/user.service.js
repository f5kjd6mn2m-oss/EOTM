const User = require('../../models/User');
const Group = require('../../models/Group');
const Lesson = require('../../models/Lesson');
const ApiError = require('../../utils/ApiError');
const { ROLES } = require('../../config/constants');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Teacher va Student uchun umumiy CRUD mantiq (rol bo'yicha).
 * Har bir rolning o'z moduli bu fabrikadan foydalanadi.
 */
function makeUserService(role) {
  const label = role === ROLES.TEACHER ? "O'qituvchi" : 'Talaba';

  async function assertGroup(groupId) {
    const group = await Group.findById(groupId);
    if (!group) throw ApiError.badRequest('Guruh topilmadi');
  }

  async function findOne(id) {
    const user = await User.findOne({ _id: id, role });
    if (!user) throw ApiError.notFound(`${label} topilmadi`);
    return user;
  }

  async function list({ search, group, isActive } = {}) {
    const filter = { role };
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ fullName: rx }, { username: rx }];
    }
    if (group) filter.group = group;
    if (typeof isActive === 'boolean') filter.isActive = isActive;
    return User.find(filter).populate('group', 'name course').sort({ fullName: 1 });
  }

  async function get(id) {
    const user = await findOne(id);
    return user.populate('group', 'name course');
  }

  async function create(data) {
    if (role === ROLES.STUDENT) await assertGroup(data.group);
    const user = await User.create({ ...data, role });
    return user.populate('group', 'name course');
  }

  async function update(id, data) {
    const user = await findOne(id);
    if (role === ROLES.STUDENT && data.group) await assertGroup(data.group);
    Object.assign(user, data);
    await user.save();
    return user.populate('group', 'name course');
  }

  async function resetPassword(id, newPassword) {
    const user = await findOne(id);
    user.password = newPassword;
    await user.save();
  }

  async function remove(id) {
    const user = await findOne(id);
    if (role === ROLES.TEACHER) {
      const lessons = await Lesson.countDocuments({ teacher: user._id });
      if (lessons > 0) {
        throw ApiError.conflict(
          `Bu o'qituvchiga ${lessons} ta dars biriktirilgan. Avval darslarni olib tashlang yoki hisobni bloklang`
        );
      }
    }
    await user.deleteOne();
  }

  return { list, get, create, update, resetPassword, remove };
}

module.exports = { makeUserService };
