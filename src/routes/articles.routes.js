const router = require('express').Router();
const autoSanitizer = require('express-autosanitizer');

const authMiddleware = require('../utils/auth');
const controller = require('../controllers/articles.controller');

router.param('articleSlug', controller.preLoadArticle);

router.route('/').get(controller.getAllArticles);

router
  .route('/create')
  .get(authMiddleware.ensureAuthenticated, controller.createArticleForm)
  .post(
    authMiddleware.ensureAuthenticated,
    controller.uploadImage,
    autoSanitizer.routeUnsafe,
    controller.validateArticle,
    controller.createArticle
  );

router
  .route('/a/:articleSlug')
  .get(controller.getArticle)
  .delete(authMiddleware.ensureAuthenticated, controller.deleteArticle);

router
  .route('/a/:articleSlug/edit')
  .get(authMiddleware.ensureAuthenticated, controller.editArticleForm)
  .put(
    authMiddleware.ensureAuthenticated,
    autoSanitizer.routeUnsafe,
    controller.validateArticle,
    controller.editArticle
  );

module.exports = router;
