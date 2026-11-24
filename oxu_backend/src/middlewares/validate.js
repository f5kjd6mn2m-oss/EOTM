const ApiError = require('../utils/ApiError');

/**
 * validate(schema, 'body' | 'query' | 'params')
 * Zod sxemasi bo'yicha tekshiradi va tozalangan qiymatni req[source] ga yozadi.
 */
const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(ApiError.badRequest("Ma'lumotlar noto'g'ri kiritilgan", details));
    }
    if (source === 'query') {
      // Express 5 da req.query o'zgarmas bo'lishi mumkin — shuning uchun alohida saqlaymiz
      req.validatedQuery = result.data;
    } else {
      req[source] = result.data;
    }
    next();
  };

module.exports = validate;
