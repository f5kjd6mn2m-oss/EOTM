const router = require('express').Router();
const controller = require('./student.controller');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { ROLES } = require('../../config/constants');
const { idParam } = require('../../utils/validators');
const { resetPasswordSchema, listQuerySchema } = require('../users/user.validation');
const { createStudentSchema, updateStudentSchema } = require('./student.validation');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(listQuerySchema, 'query'), controller.list);
router.post('/', validate(createStudentSchema), controller.create);
router.get('/:id', validate(idParam, 'params'), controller.get);
router.patch('/:id', validate(idParam, 'params'), validate(updateStudentSchema), controller.update);
router.patch(
  '/:id/password',
  validate(idParam, 'params'),
  validate(resetPasswordSchema),
  controller.resetPassword
);
router.delete('/:id', validate(idParam, 'params'), controller.remove);

module.exports = router;
