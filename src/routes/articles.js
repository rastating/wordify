const router = require('express').Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');

router.route('/').get(async (req, res, next) => {
  Article.find({})
    .sort('-createdAt')
    .exec()
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
  .post((req, res, next) => {
    // TODO: Proper article validation
    Article.create({ title: req.body.title, content: req.body.content })
      .then(article => {
        res.send(article);
      })
      .catch(err => {
        // Check for mongoose validation errors
        if (err.name === 'ValidationError') {
          // Transform the errors into the object of type { 'field name': 'error message' }
          const errors = Object.keys(err.errors).reduce((e, key) => {
            e[key] = err.errors[key].message;
            return e;
          }, {});
          return res.render('create', { errors });
        }

        return next(err);
      });
  });

router.route('/a/:articleSlug').get((req, res, next) => {
  Article.findOne({ slug: req.params.articleSlug })
    .then(article => {
      if (!article) {
        const error = new Error('Article was not found');
        error.status = 404;
        next(error);
      }

      res.render('article', { article, title: article.title });
    })
    .catch(err => {
      next(new Error(err));
    });
});

module.exports = router;
