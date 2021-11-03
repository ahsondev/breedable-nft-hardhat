const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/index', Controllers.Main.index)

router.post('/auth/twitter/reverse', Controllers.Auth.getRequestToken)
router.post('/auth/twitter', Controllers.Auth.getOAuthToken)

module.exports = router;
