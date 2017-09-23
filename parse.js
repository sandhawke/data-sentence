'use strict'

const tokenize = require('./tokenize')
const match = require('./match')
const debug = require('debug')('data_sentence_parse')

// super inefficient proof-of-concept brute force version.  Lots of
// ways to make it much faster.  This version has an O(schema-size)
// factor which shouldn't be necessary.
//
// plus right now it re-parses the schema every run
//
// I guess we'll want to compile the schema producing a nice .parse()
// and .serialize() function for objects, which could be pretty
// optimal.  That could actually tell you if the schema gives you an
// lalr grammar, or needs backtracking, or is ambiguous, or whatever,
// if you want, I suppose.  Not sure we care about that level of
// performance.

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
