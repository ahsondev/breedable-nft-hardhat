const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/index', Controllers.Main.index)

router.post('/auth/twitter/request_token', Controllers.AuthTwitter.getOAuthToken)
router.post('/auth/twitter/access_token', Controllers.AuthTwitter.getAccessToken)
router.post('/auth/twitter/profile_banner', Controllers.AuthTwitter.getProfileBanner)

module.exports = router;
