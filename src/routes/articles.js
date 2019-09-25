const router = require('express').Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');

router.get('/', async (req, res, next) => {
  Article.find({})
    .exec()
    .then(articles => res.render('home', { articles, empty: Array.isArray(articles) && articles.length }))
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      next(error);
    });
});

module.exports = router;
