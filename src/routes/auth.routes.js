const router = require('express').Router();
const autoSanitizer = require('express-autosanitizer');

const controller = require('../controllers/auth.controller');
const authMiddleware = require('../utils/auth');

router
  .route('/signup')
  .get(authMiddleware.redirectAuthenticated, controller.createUserForm)
  .post(
    authMiddleware.redirectAuthenticated,
    autoSanitizer.routeUnsafe,
    controller.validateUser,
    controller.createUser
  );

router
  .route('/login')
  .get(authMiddleware.redirectAuthenticated, controller.loginUserForm)
  .post(authMiddleware.redirectAuthenticated, controller.loginUser);

router.route('/logout').get(authMiddleware.ensureAuthenticated, controller.logoutUser);

router
  .route('/email/resend')
  .get(authMiddleware.ensureAuthenticated, authMiddleware.emailNotVerified, controller.resendEmail);

router.route('/email/:token').get(controller.verifyEmail);

module.exports = router;
