const router = require('express').Router();
const controller = require('./teacher.controller');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { ROLES } = require('../../config/constants');
const { idParam } = require('../../utils/validators');
const { resetPasswordSchema, listQuerySchema } = require('../users/user.validation');
const { createTeacherSchema, updateTeacherSchema } = require('./teacher.validation');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(listQuerySchema, 'query'), controller.list);
router.post('/', validate(createTeacherSchema), controller.create);
router.get('/:id', validate(idParam, 'params'), controller.get);
router.patch('/:id', validate(idParam, 'params'), validate(updateTeacherSchema), controller.update);
router.patch(
  '/:id/password',
  validate(idParam, 'params'),
  validate(resetPasswordSchema),
  controller.resetPassword
);
router.delete('/:id', validate(idParam, 'params'), controller.remove);

module.exports = router;
