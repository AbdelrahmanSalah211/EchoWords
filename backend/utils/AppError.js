class AppError extends Error {
  constructor(message, statusCode, tokenMetadata = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.tokenMetadata = tokenMetadata;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field} already in use. please choose another`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (tokenType = 'token') => 
  new AppError(`Invalid ${tokenType}.`, 401, { tokenType, errorType: 'invalid' });

const handleJWTExpiredError = (tokenType = 'token') => 
  new AppError(`${tokenType} has expired.`, 401, { tokenType, errorType: 'expired' });

const sendError = (err, res) => {
  if (err.isOperational) {
    const responseObj = {
      status: err.status,
      message: err.message,
    };

    if (err.tokenMetadata) {
      responseObj.auth = {
        tokenType: err.tokenMetadata.tokenType,
        errorType: err.tokenMetadata.errorType
      };
    }

    res.status(err.statusCode).json(responseObj);
  } else {
    console.error('error: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

function determineTokenType(req) {
  if (req.path.includes('/refresh') || req.path.includes('/token/refresh')) {
    return 'refresh token';
  }
  return 'access token';
}

const globalErrorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;
  error.tokenMetadata = err.tokenMetadata;

  const tokenType = determineTokenType(req);
  
  if (error.name === "CastError") {
    error = handleCastErrorDB(error);
  }
  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidationErrorDB(error);
  }
  if (error.name === "JsonWebTokenError") {
    error = handleJWTError(tokenType);
  }
  if (error.name === "TokenExpiredError") {
    error = handleJWTExpiredError(tokenType);
  }
  sendError(error, res);
};

module.exports = { globalErrorHandling, AppError };