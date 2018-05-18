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
  findAll: function(opt ={}, cb){
    return this
    .find(opt)
    .sort('meta.updateAt')
    .exec(cb)
  }
}
module.exports = mongoose.model('fundbug', fundbug);