'use strict'

const parse = require('./parse')
const serialize = require('./serialize')
const splitter = require('./split')
const Live = require('./live')

class Translator {
  constructor (schema) {
    this.schema = schema
    this.maxLen = 140 - '@msgsink '.length
  }

  parse (text) {
    // unsplit, ... but how does the system know what to hand to us?
    return parse(text, this.schema)
  }

  stringify (obj) {
    return serialize(obj, this.schema)
  }

  stringifySplit (obj, max) {
    if (max === undefined) max = this.maxLen
    return splitter.split(this.stringify(obj), max)
  }

  startLive (messageDB, objectsDB) {
    return new Live(this, messageDB, objectsDB)
  }
}

module.exports.Translator = Translator
