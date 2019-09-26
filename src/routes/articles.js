const router = require('express').Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');

router.route('/').get(async (req, res, next) => {
  Article.find({})
    .exec()
    .then(articles => res.render('home', { articles, empty: Array.isArray(articles) && articles.length }))
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      next(error);
    });
});

router.route('/articles/:articleSlug').get((req, res, next) => {
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
