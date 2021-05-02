//const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res) => {
  const error = { ...err };
  // const statusCode = 500;
  // const message = '';

  error.message = err.message;

  // Log to console for dev
  // console.log('pera?',err);

  // Mongoose bad objectId
  if (err.name === 'CastError') {
    error.message = `Document not found with the id ${err.value}`;
    error.statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = `Duplicate Field Value Entered`;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message);
    error.statusCode = 400;
  }

  // error = new ErrorResponse(message, statusCode);

  res.status(error.statusCode || 404).json({
    message: error.message || 'General Error',
  });
};

module.exports = errorHandler;
