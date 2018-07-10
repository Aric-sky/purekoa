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

app.use(require('koa-static')(__dirname + '/public'))

router.get('/getbug', async (ctx, next) => {
  const query = ctx.query
  let rdPage = 0
  if (query.page) {
    rdPage = (+query.page) - 1
  }
  var opt = {
    page: rdPage < 0 ? 0 : rdPage,
    size: +query.size || 10
  }
  // console.log(query.prj, 'query.prj ')
  const constParm = {"unkey": query.prj, "starDate": query.starDate, "endDate": query.endDate}
  opt = Object.assign({}, opt, constParm)
  await fundbug.findAll(opt).then( async(data) => {
    const countQuery = {}
    constParm.unkey ? countQuery.unkey = constParm.unkey : ''
    if (constParm.starDate && constParm.endDate) {
      countQuery['meta.updateAt'] = {
        "$gte": new Date(+constParm.starDate),
        "$lt": new Date(+constParm.endDate)
      }
    }
    await fundbug.count(countQuery, (err, counts) => {
      if (!err) {
        ctx.body = {
          code: 200,
          info: 'suc',
          data: data,
          totalCount: counts
        }
      }
    })
  })
})

app.use(router.routes())
   .use(router.allowedMethods());
app.listen(8089);
