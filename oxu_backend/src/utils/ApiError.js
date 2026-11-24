class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }

  static badRequest(msg = "So'rov noto'g'ri", details) {
    return new ApiError(400, msg, details);
  }
  static unauthorized(msg = 'Avtorizatsiyadan o\'tilmagan') {
    return new ApiError(401, msg);
  }
  static forbidden(msg = 'Bu amalga ruxsat yo\'q') {
    return new ApiError(403, msg);
  }
  static notFound(msg = 'Topilmadi') {
    return new ApiError(404, msg);
  }
  static conflict(msg = 'Ziddiyat yuz berdi') {
    return new ApiError(409, msg);
  }
}

module.exports = ApiError;
