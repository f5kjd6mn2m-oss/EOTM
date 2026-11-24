const ApiError = require('../utils/ApiError');

/** authenticate dan keyin ishlatiladi: authorize('admin'), authorize('teacher', 'admin') */
const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };

module.exports = { authorize };
