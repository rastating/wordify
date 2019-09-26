const router = require('express').Router();

router.use('/', require('./articles'));

router.all('*', (req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).render('error', {
    status: err.status || 500,
    message: err.status && err.status < 500 ? err.message : 'Oops, Something went wrong!'
  });
});

module.exports = router;
