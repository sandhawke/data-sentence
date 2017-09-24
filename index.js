'use strict'

const parse = require('./parse')
const serialize = require('./serialize')
const splitter = require('./split')

class DataSentenceTranslator {
  constructor (schema) {
    this.schema = schema
  }

  parse (text) {
    // unsplit, ... but how does the system know what to hand to us?
    return parse(text, this.schema)
  }

  stringify (obj) {
    return serialize(obj, this.schema)
  }

  stringifySplit (obj, max = 140) {
    return splitter.split(this.stringify(obj), max)
  }
}

module.exports = DataSentenceTranslator
