const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const upload = require('../utils/awsUpload');
const mongooseError = require('../utils/mongooseErrorHandler');

const Article = mongoose.model('Article');

// Preload article in routes that have slug in their url
exports.preLoadArticle = (req, res, next, slug) => {
  Article.findOne({ slug })
    .populate('author')
    .then(article => {
      if (!article) {
        const error = new Error('Article was not found');
        error.status = 404;
        return next(error);
      }

      req.article = article;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.uploadImage = (req, res, next) => {
  upload.single('image')(req, res, err => {
    if (err) req.fileError = err;

    next();
  });
};

// Article validation middleware
exports.validateArticle = [
  check('title')
    .trim()
    .isLength({ min: 10, max: 128 })
    .withMessage('Title must be between 10 and 128 characters'),

  check('content')
    .trim()
    .isLength({ min: 32 })
    .withMessage('Article content must be at least 32 characters long')
];

// Return home page with all of the articles
exports.getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.p, 10) || 1;
    const articlesPerPage = 10;

    const searchQuery = req.query.s
      ? {
          $text: { $search: req.query.s }
        }
      : {};

    const articles = await Article.find(searchQuery)
      .populate('author')
      .sort('-createdAt')
      .skip((page - 1) * articlesPerPage)
      .limit(articlesPerPage);

    const articleCount = await Article.countDocuments();

    res.render('articles/home', {
      articles,
      page,
      numPages: Math.ceil(articleCount / articlesPerPage),
      empty: !(Array.isArray(articles) && articles.length)
    });
  } catch (err) {
    next(new Error(err));
  }
};

// Render create article form
exports.createArticleForm = (req, res) => {
  res.render('articles/create', { title: 'New Article' });
};

// POST route for creating article
exports.createArticle = (req, res, next) => {
  // Get validation errors after express-validator validation
  const errors = validationResult(req);
  if (!errors.isEmpty() || req.fileError)
    // Return the `create` view with errors mapped to an object of type { 'field name': 'error message' }
    return res.render('articles/create', {
      title: 'New Article',
      errors: {
        ...errors.errors.reduce((r, value) => {
          r[value.param] = value.msg;
          return r;
        }, {}),
        file: req.fileError
      },
      articleTitle: req.body.title,
      articleContent: req.body.content
    });

  Article.create({
    title: req.body.title,
    content: req.body.content,
    image: req.file ? req.file.location : undefined,
    author: req.user
  })
    .then(article => {
      req.flash('info', 'Article created!');
      res.redirect(`/a/${article.slug}`);
    })
    .catch(err =>
      mongooseError(err, next, mErrors =>
        res.render('articles/create', {
          title: 'New Article',
          errors: mErrors,
          articleTitle: req.body.title,
          articleContent: req.body.content
        })
      )
    );
};

// Render a single article
exports.getArticle = (req, res) => {
  res.render('articles/article', { article: req.article, title: req.article.title });
};

// Delete a single article
exports.deleteArticle = (req, res, next) => {
  if (!req.article.author.id === req.user.id) {
    req.flash('error', 'You cannot perform that action');
    return res.redirect(`/a/${req.article.slug}`);
  }

  req.article
    .remove()
    .then(() => {
      req.flash('info', 'Article has been successfully deleted!');
      res.redirect('/');
    })
    .catch(next);
};

// Render edit article form
exports.editArticleForm = (req, res) => {
  if (!req.article.author.id === req.user.id) {
    req.flash('error', 'You cannot perform that action');
    return res.redirect(`/a/${req.article.slug}`);
  }

  res.render('articles/edit', {
    article: req.article,
    title: `Edit Article: ${req.article.title}`
  });
};

// PUT route for editing an article
exports.editArticle = (req, res, next) => {
  if (!req.article.author.id === req.user.id) {
    req.flash('error', 'You cannot perform that action');
    return res.redirect(`/a/${req.article.slug}`);
  }

  req.article.title = req.body.title;
  req.article.content = req.body.content;

  if (req.file) req.article.image = req.file.location;

  // Get validation errors after express-validator validation
  const errors = validationResult(req);
  if (!errors.isEmpty() || req.fileError)
    // Return the `create` view with errors mapped to an object of type { 'field name': 'error message' }
    return res.render('articles/edit', {
      title: `Edit Article: ${req.article.title}`,
      errors: {
        ...errors.errors.reduce((r, value) => {
          r[value.param] = value.msg;
          return r;
        }, {}),
        file: req.fileError
      },
      article: req.article
    });

  req.article.slugify();

  req.article
    .save()
    .then(article => {
      req.flash('info', 'Article successfully updated!');
      res.redirect(`/a/${article.slug}`);
    })
    .catch(err =>
      mongooseError(err, next, mErrors =>
        res.render('articles/edit', {
          title: `Edit Article: ${req.article.title}`,
          errors: mErrors,
          article: req.article
        })
      )
    );
};
