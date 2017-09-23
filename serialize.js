'use strict'

const tokenize = require('./tokenize')
const debug = require('debug')('data_sentence_serialize')

// consider making this a generator for each serialization, instead of
// on the first [in nondeterministic order!], like it is now.

function serialize (obj, schema) {
  debug('trying %o', obj)
  const out = []
  let found = false
  for (const viewName of Object.keys(schema)) {
    const view = schema[viewName]
    // if (!view.wouldAccept(obj)) return

    let def = view.defs[0]
    if (!def) continue

    for (const tok of tokenize(def)) {  // cache it tokenized...?
      switch (tok.type) {
        case 'number':
        case 'delim':
        case 'word':
          out.push(tok.text)
          break
        case 'string':
        // when re-parsing these will be interesting
          out.push(JSON.stringify(tok.text))
          break
        case 'var':
          const value = obj[tok.text]
          if (value === undefined) continue
          out.push(serValue(value))
          break
        default:
          throw Error('unknown token type: ' + tok.type)
      }
    }

    if (found) throw Error('multiple serializations possible')
    found = true
  }
  debug('returning', out)
  return out.join(' ')
}

function serValue (val) {
  return JSON.stringify(val)
}

module.exports = serialize
