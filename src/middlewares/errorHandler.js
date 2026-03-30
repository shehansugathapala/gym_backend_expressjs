module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} →`, err);
  }

  const response = {
    success: false,
    message: statusCode >= 500 && !isDev ? 'Internal server error' : err.message,
  };

  if (isDev && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
