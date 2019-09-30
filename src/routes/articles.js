const router = require('express').Router();
const autoSanitizer = require('express-autosanitizer');

const controller = require('../controllers/articles.controller');

router.param('articleSlug', controller.preLoadArticle);

router.route('/').get(controller.getAllArticles);

router
  .route('/create')
  .get(controller.createArticleForm)
  .post(autoSanitizer.routeUnsafe, controller.validateArticle, controller.createArticle);

router
  .route('/a/:articleSlug')
  .get(controller.getArticle)
  .delete(controller.deleteArticle);

router
  .route('/a/:articleSlug/edit')
  .get(controller.editArticleForm)
  .put(autoSanitizer.routeUnsafe, controller.validateArticle, controller.editArticle);

module.exports = router;
