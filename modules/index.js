'use strict'
var mongoose = require('mongoose');

//创建了一个schema结构。
var fundbug = new mongoose.Schema({
  err: {
    type: String
  },
  path: {
    type: String
  },
  line: {
    type: String
  },
  head: {
    type: Object
  },
  ip: {
    type: String
  },
  unkey: {
    type: String,
    index: true
  },
  meta: {
    createAt: {
      type: Date,
      dafault: Date.now()
    },
    updateAt: {
      type: Date,
      dafault: Date.now()
    }
  }
});

fundbug.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  next()
})

fundbug.statics = {
  findAll: function(opt ={page: 0, size: 5}, cb){
    const query = {}
    opt.unkey ? query.unkey = opt.unkey : ''
    if (opt.starDate && opt.endDate) {
      query['meta.updateAt'] = {
        "$gte": new Date(+opt.starDate),
        "$lt": new Date(+opt.endDate)
      }
    }
    return this
    .find(query)
    .skip(opt.page * opt.size)
    .limit(opt.size)
    .sort({_id: -1})
    .exec(cb)
  }
}
module.exports = mongoose.model('fundbug', fundbug);