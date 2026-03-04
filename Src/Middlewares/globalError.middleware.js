class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
export class ValidationError extends AppError {
  constructor(message = "Invalid input data") {
    super(message, 400);
  }
}
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Please login to access this resource") {
    super(message, 401);
  }
}
export class AlreadyExist extends AppError {
  constructor(message = "Already exist") {
    super(message, 409);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication Error") {
    super(message, 400);
  }
}

export class UnprocessedEntity extends AppError {
  constructor(message = "Verification Error") {
    super(message, 422);
  }
}

export function globalErrorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${req.method} ${req.url}:`, err.stack);

  return res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
