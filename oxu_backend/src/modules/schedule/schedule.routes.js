const router = require('express').Router();
const controller = require('./schedule.controller');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { ROLES } = require('../../config/constants');
const { idParam } = require('../../utils/validators');
const { gridQuerySchema } = require('./schedule.validation');

router.use(authenticate);

// Hamma rollar: hafta kunlari va para vaqtlari
router.get('/meta', controller.meta);

// Teacher va student: o'z jadvali
router.get('/my', authorize(ROLES.TEACHER, ROLES.STUDENT), controller.mine);

// Faqat admin
router.get('/grid', authorize(ROLES.ADMIN), validate(gridQuerySchema, 'query'), controller.grid);
router.get('/teacher/:id', authorize(ROLES.ADMIN), validate(idParam, 'params'), controller.byTeacher);
router.get('/group/:id', authorize(ROLES.ADMIN), validate(idParam, 'params'), controller.byGroup);

module.exports = router;
