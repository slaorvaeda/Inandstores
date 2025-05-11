class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;