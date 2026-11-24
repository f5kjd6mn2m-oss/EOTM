const { makeUserService } = require('../users/user.service');
const { ROLES } = require('../../config/constants');

module.exports = makeUserService(ROLES.TEACHER);
