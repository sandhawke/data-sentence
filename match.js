'use strict'

const debug = require('debug')('match')

// Emacs and I disagree with standard about switch {} indents
/* eslint-disable indent */

/*

  query[4].type === 'var' .value='x'

  solution.x = msg[4].value

*/

function match (query, msg) {
  debug('matching', query, msg)
  const solution = {}
  if (query.length !== msg.length) {
    debug('... fail, different length')
    return null
  }
  for (let i = 0; i < query.length; i++) {
    const q = query[i]
    const m = msg[i]
    if (q.type === 'var') {
      const already = solution[q.text]
      if (already) {
        if (already !== m.value) {
          debug('... fail, variable bound to different values')
          return null
        }
      } else {
        solution[q.text] = m.value
      }
    } else {
      if (!tokenMatch(q, m)) {
        debug('... fail token mismatch', q, m)
        return null
      }
    }
  }
  debug('... match!  soln=', solution)
  return solution
}

function tokenMatch (q, m) {
  if (q.type !== m.type) return false
  switch (q.type) {
  case 'number':
    return q.value === m.value
  case 'word':
  case 'string':
  case 'delim':
    return q.text === m.text
  default:
    throw Error('tokenMatch doesnt know type: ' + JSON.stringify(q.type))
  }
}

module.exports = match
