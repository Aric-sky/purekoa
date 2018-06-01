'use strict';

const path = require('path');

const Koa = require('koa');
var cors = require('koa-cors');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(cors());

// 设置静态资源目录
app.use(statics(path.join(__dirname, 'public')));

app.use(bodyParser());

// routes
const index = require('./routes/index')

app.use(index.routes(), index.allowedMethods())



//最后的中间件404页面
app.use(async function(ctx, next){
	await ctx.redirect('/err');
})

app.listen(3000);
