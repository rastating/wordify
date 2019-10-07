const router = require('express').Router();
const autoSanitizer = require('express-autosanitizer');

const authMiddleware = require('../utils/auth');
const controller = require('../controllers/articles.controller');

router.param('articleSlug', controller.preLoadArticle);

router.route('/').get(controller.getAllArticles);

router
  .route('/create')
  .get(authMiddleware.ensureAuthenticated, authMiddleware.emailVerified, controller.createArticleForm)
  .post(
    authMiddleware.ensureAuthenticated,
    authMiddleware.emailVerified,
    controller.uploadImage,
    autoSanitizer.routeUnsafe,
    controller.validateArticle,
    controller.createArticle
  );

router
  .route('/a/:articleSlug')
  .get(controller.getArticle)
  .delete(authMiddleware.ensureAuthenticated, authMiddleware.emailVerified, controller.deleteArticle);

router
  .route('/a/:articleSlug/edit')
  .get(authMiddleware.ensureAuthenticated, authMiddleware.emailVerified, controller.editArticleForm)
  .put(
    authMiddleware.ensureAuthenticated,
    authMiddleware.emailVerified,
    controller.uploadImage,
    autoSanitizer.routeUnsafe,
    controller.validateArticle,
    controller.editArticle
  );

module.exports = router;
