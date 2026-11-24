// Async controllerlardagi xatoni errorHandler middleware'ga uzatadi
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
