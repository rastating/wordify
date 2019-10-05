const router = require('express').Router();
const autoSanitizer = require('express-autosanitizer');

const authMiddleware = require('../utils/auth');
const controller = require('../controllers/profile.controller');

router
  .route('/update')
  .get(authMiddleware.ensureAuthenticated, controller.profileUpdateForm)
  .post(
    authMiddleware.ensureAuthenticated,
    autoSanitizer.routeUnsafe,
    controller.validateProfile,
    controller.profileUpdate
  );

router.route('/update/avatar').post(authMiddleware.ensureAuthenticated, controller.avatarUpdate);

module.exports = router;
