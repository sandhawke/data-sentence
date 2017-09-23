'use strict'

const parse = require('./parse')
const serialize = require('./serialize')

class DataSentenceTranslator {
  constructor (schema) {
    this.schema = schema
  }

  parse (text) {
    return parse(text, this.schema)
  }

  stringify (obj) {
    return serialize(obj, this.schema)
  }
}

module.exports = DataSentenceTranslator
