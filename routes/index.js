var router = require('koa-router')();

router.prefix('/api');

router.get('/', async(ctx, next) => {
  ctx.body = {
    code: 1,
    msg: 'suc'
  }
})

module.exports = router