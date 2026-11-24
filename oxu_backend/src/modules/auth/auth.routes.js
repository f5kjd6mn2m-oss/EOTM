const router = require('express').Router();
const controller = require('./auth.controller');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { loginLimiter } = require('../../middlewares/rateLimit');
const { loginSchema, changePasswordSchema } = require('./auth.validation');

router.post('/login', loginLimiter, validate(loginSchema), controller.login);
router.get('/me', authenticate, controller.me);
router.patch('/password', authenticate, validate(changePasswordSchema), controller.changePassword);

module.exports = router;
