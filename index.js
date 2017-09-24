'use strict'

const parse = require('./parse')
const serialize = require('./serialize')
const splitter = require('./split')
const Bridge = require('./bridge')

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

  bridge (messageDB, objectsDB) {
    return new Bridge(this, messageDB, objectsDB)
  }
}

module.exports.Translator = Translator
