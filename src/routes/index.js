const router = require('express').Router();

router.get('/', require('./articles'));

module.exports = router;
