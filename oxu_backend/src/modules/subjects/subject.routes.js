const router = require('express').Router();
const controller = require('./subject.controller');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { ROLES } = require('../../config/constants');
const { idParam } = require('../../utils/validators');
const { createSubjectSchema, updateSubjectSchema } = require('./subject.validation');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', controller.list);
router.post('/', validate(createSubjectSchema), controller.create);
router.patch('/:id', validate(idParam, 'params'), validate(updateSubjectSchema), controller.update);
router.delete('/:id', validate(idParam, 'params'), controller.remove);

module.exports = router;
