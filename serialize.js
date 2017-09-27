'use strict'

const tokenize = require('./tokenize')
const filter = require('datapages/filter')
const debug = require('debug')('data_sentence_serialize')

// consider making this a generator for each serialization, instead of
// on the first [in nondeterministic order!], like it is now.

function serialize (obj, schema) {
  debug('trying %o', obj)
  const out = []
  let found = false
  for (const viewName of Object.keys(schema)) {
    const view = schema[viewName]

    if (!filter.filterForView(view).passes(obj)) {
      debug('rejected by filter %j', view.name)
      continue
    }

    let def = view.defs[0]
    if (!def) continue

    let prevType = null

    for (const tok of tokenize(def)) {  // cache it tokenized...?
      switch (tok.type) {
        case 'delim':
          out.push(tok.text)
          break
        case 'number':
        case 'word':
          if (prevType !== null) out.push(' ')
          out.push(tok.text)
          break
        case 'string':
          if (prevType !== null) out.push(' ')
        // when re-parsing these will be interesting
          out.push(JSON.stringify(tok.text))
          break
        case 'var':
          if (prevType !== null) out.push(' ')
          const value = obj[tok.text]
          if (value === undefined) {
            out.push('NULL')  // or reject it?
          } else {
            out.push(serValue(value))
          }
          break
        default:
          throw Error('unknown token type: ' + tok.type)
      }
      prevType = tok.type
    }

    if (found) throw Error('multiple serializations possible')
    found = true
  }
  debug('returning', out)
  return out.join('')
}

function serValue (val) {
  if (val.id) return val.id
  // reject other objects?
  return JSON.stringify(val)
}

module.exports = serialize
