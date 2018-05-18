'use strict';

const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');
var cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
var mongoose = require('mongoose')
var db = 'mongodb://web:web123abc0@54.215.163.225:27017/web'
// var db = 'mongodb://127.0.0.1/web'
require('./modules/index')

mongoose.Promise = require('bluebird')
mongoose.connect(db)

var fundbug = mongoose.model('fundbug')

const app = new Koa();

app.use(cors());

const router = new Router();
app.use(router.routes());

app.use(bodyParser());

router.get('/', async (ctx, next) => {
  var opt = {
    err: ctx.query.err,
    path: ctx.query.path,
    line: ctx.query.line,
    head: ctx.header,
    ip: ctx.request.ip || '',
    unkey: ctx.query.key || (new Date()).getTime()
  }
  var bugData = new fundbug(opt)
  try{
    bugData.save()
    ctx.body = {
      code: 1,
      msg: 'suc'
    }
  } catch(e) {
    ctx.body = {
      code: -1,
      msg: e
    }
  }
})

app.use(router.routes())
   .use(router.allowedMethods());
app.listen(8087);
