const router = require('express').Router();
const controller = require('./lesson.controller');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { ROLES } = require('../../config/constants');
const { idParam } = require('../../utils/validators');
const { createLessonSchema, updateLessonSchema, lessonQuerySchema } = require('./lesson.validation');

// Darslarni biriktirish/o'zgartirish faqat admin uchun
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(lessonQuerySchema, 'query'), controller.list);
router.post('/', validate(createLessonSchema), controller.create);
router.get('/:id', validate(idParam, 'params'), controller.get);
router.patch('/:id', validate(idParam, 'params'), validate(updateLessonSchema), controller.update);
router.delete('/:id', validate(idParam, 'params'), controller.remove);

module.exports = router;
