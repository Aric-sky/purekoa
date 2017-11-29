'use strict';

const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
var cors = require('koa-cors');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');


const app = new Koa();

app.use(cors());

// 设置静态资源目录
app.use(statics(path.join(__dirname, 'public')));

const router = new Router();
app.use(router.routes());

app.use(bodyParser());

router.get('/', function(ctx, next) {
  ctx.redirect('/home');
});



// 开始服务并生成路由
app.use(router.routes())
   .use(router.allowedMethods());
app.listen(3030);
