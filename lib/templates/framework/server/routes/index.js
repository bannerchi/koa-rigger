const router = require('koa-router')()

const home = require('./home')
// cross domain
const allowOrigin = require('koa-allow-origin')

router.use(allowOrigin(process.env.NODE_ENV, []));
router.use('/', home.routes(), home.allowedMethods());

module.exports = router;
