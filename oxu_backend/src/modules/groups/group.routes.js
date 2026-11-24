const router = require('express').Router();
const controller = require('./group.controller');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { ROLES } = require('../../config/constants');
const { idParam } = require('../../utils/validators');
const { createGroupSchema, updateGroupSchema } = require('./group.validation');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', controller.list);
router.post('/', validate(createGroupSchema), controller.create);
router.patch('/:id', validate(idParam, 'params'), validate(updateGroupSchema), controller.update);
router.delete('/:id', validate(idParam, 'params'), controller.remove);

module.exports = router;
