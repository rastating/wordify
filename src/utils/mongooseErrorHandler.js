// Mongoose validation error handler util function
// If mongoose throws a validation error transform errors object and pass it to the callback function
// If it is not a validation error return next with the error
module.exports = (err, next, cb) => {
  // Check if error is a validation error
  if (err.name === 'ValidationError') {
    // Transform the errors into the object of type { 'field name': 'error message' }
    const mErrors = Object.keys(err.errors).reduce((e, key) => {
      e[key] = err.errors[key].message;
      return e;
    }, {});
    return cb(mErrors);
  }

  return next(err);
};
