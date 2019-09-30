const router = require('express').Router();
const autoSanitizer = require('express-autosanitizer');

const controller = require('../controllers/auth.controller');

router
  .route('/signup')
  .get(controller.createUserForm)
  .post(autoSanitizer.routeUnsafe, controller.validateUser, controller.createUser);

router.route('/login').get(controller.loginUserForm);

module.exports = router;
