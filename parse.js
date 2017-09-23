'use strict'

const tokenize = require('./tokenize')
const match = require('./match')
const debug = require('debug')('data_sentence_parse')

// Inefficient, but simple and flexible brute force version.  Lots of
// ways to make it much faster.  It could probably even be compiled
// into a regexp, or at least a pushdown automaton.

function parse (text, schema) {
  debug('trying', text)
  const msg = tokenize(text)
  for (const viewName of Object.keys(schema)) {
    const view = schema[viewName]
    for (const def of view.defs) {
      const deftok = tokenize(def)
      const m = match(deftok, msg)
      debug('solved', m)
      if (m) return m
      // doesn't even warn if there's more than one!
    }
  }
  return null
}

module.exports = parse
