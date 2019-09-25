const router = require('express').Router();

router.use('/', require('./articles'));

router.get('/error', (req, res, next) => next(Error('Test error')));

router.all('*', (req, res) => res.status(404).render('notFound', { title: 'Page Not Found' }));

router.use((err, req, res, next) =>
  res.status(err.status || 500).render('error', { status: err.status || 500, message: err.message })
);

module.exports = router;
