const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const notFound = (req, _res, next) => next(ApiError.notFound(`Yo'l topilmadi: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Server xatosi';
  let details = err.details;

  // Mongo: unique indeks buzildi
  if (err.code === 11000) {
    status = 409;
    const keys = Object.keys(err.keyPattern || {});
    if (keys.includes('teacher')) message = "Bu o'qituvchining shu kun va parada darsi allaqachon bor";
    else if (keys.includes('group')) message = 'Bu guruhning shu kun va parada darsi allaqachon bor';
    else if (keys.includes('username')) message = 'Bu login band, boshqasini tanlang';
    else if (keys.includes('name')) message = 'Bunday nom allaqachon mavjud';
    else message = 'Takroriy yozuv';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = "Ma'lumotlar noto'g'ri";
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Noto'g'ri qiymat: ${err.path}`;
  }

  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message: status >= 500 && env.NODE_ENV === 'production' ? 'Ichki server xatosi' : message,
    ...(details ? { details } : {}),
  });
};

module.exports = { notFound, errorHandler };
