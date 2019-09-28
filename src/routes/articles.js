const router = require('express').Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const Article = mongoose.model('Article');

router.param('articleSlug', (req, res, next, slug) => {
  Article.findOne({ slug })
    .then(article => {
      if (!article) {
        const error = new Error('Article was not found');
        error.status = 404;
        next(error);
      }

      req.article = article;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

router.route('/').get((req, res, next) => {
  Article.find({})
    .sort('-createdAt')
    .then(articles => res.render('home', { articles, empty: Array.isArray(articles) && articles.length }))
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      next(error);
    });
});

router
  .route('/create')
  .get((req, res) => res.render('create', { title: 'New Article' }))
  .post(
    [
      check('title')
        .trim()
        .isLength({ min: 10, max: 128 })
        .withMessage('Title must be between 10 and 128 characters')
        .escape(),

      check('content')
        .trim()
        .isLength({ min: 32 })
        .withMessage('Article content must be at least 32 characters long')
        .escape()
    ],

    // eslint-disable-next-line consistent-return
    (req, res, next) => {
      // Get validation erros after express-validator validation
      const errors = validationResult(req);
      if (!errors.isEmpty())
        // Return the `create` view with errors mapped to an object of type { 'field name': 'error message' }
        return res.render('create', {
          errors: errors.errors.reduce((r, value) => {
            // eslint-disable-next-line no-param-reassign
            r[value.param] = value.msg;
            return r;
          }, {})
        });

      Article.create({ title: req.body.title, content: req.body.content })
        .then(article => {
          req.flash('info', 'Article created!');
          res.redirect(`/a/${article.slug}`);
        })
        .catch(err => {
          // Check for mongoose validation errors
          if (err.name === 'ValidationError') {
            // Transform the errors into the object of type { 'field name': 'error message' }
            const mErrors = Object.keys(err.errors).reduce((e, key) => {
              e[key] = err.errors[key].message;
              return e;
            }, {});
            return res.render('create', { errors: mErrors });
          }

          return next(err);
        });
    }
  );

router
  .route('/a/:articleSlug')
  .get((req, res) => res.render('article', { article: req.article, title: req.article.title }))
  .delete((req, res, next) => {
    Article.deleteOne({ slug: req.article.slug })
      .then(() => {
        req.flash('info', 'Article has been successfully deleted!');
        res.redirect('/');
      })
      .catch(err => next(err));
  });

module.exports = router;
