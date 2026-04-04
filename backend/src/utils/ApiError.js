class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg, code)    { return new ApiError(400, msg, code) }
  static unauthorized(msg, code)  { return new ApiError(401, msg, code) }
  static forbidden(msg)           { return new ApiError(403, msg, 'FORBIDDEN') }
  static notFound(msg)            { return new ApiError(404, msg, 'NOT_FOUND') }
  static conflict(msg)            { return new ApiError(409, msg, 'CONFLICT') }
  static tooManyRequests(msg)     { return new ApiError(429, msg, 'RATE_LIMITED') }
  static internal(msg)            { return new ApiError(500, msg, 'INTERNAL_ERROR') }
}

module.exports = ApiError;
