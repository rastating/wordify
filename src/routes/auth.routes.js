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

router.get('/logout').get(authMiddleware.ensureAuthenticated, controller.logoutUser);

module.exports = router;
