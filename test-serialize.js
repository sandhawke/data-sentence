'use strict'

const test = require('tape')
const serialize = require('./serialize')
const parse = require('./parse')

const schema = {
  people_names: {
    defs: [
      "This person's given name is [given] and family name is [family]",
      'Their name is [given] [family]'
    ]
  },
  other: {
    defs: [
      // not used because FILTER doesn't match??? or NULL?
    ]
  }  //
}

test(t => {
  const obj = { given: 'Dr', family: 'Who' }
  const sent = serialize(obj, schema)
  t.equal(sent,
          'This person\'s given name is "Dr" and family name is "Who"')
  const o2 = parse(sent, schema)
  t.deepEqual(o2, obj)
  t.end()
})
