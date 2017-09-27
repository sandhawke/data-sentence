'use strict'

const test = require('tape')
const serialize = require('./serialize')
const parse = require('./parse')

test(t => {
  const schema = {
    people_names: {
      defs: [
        "This person's given name is [given] and family name is [family]",
        'Their name is [given] [family]'
      ]
    }
  }

  const obj = { given: 'Dr', family: 'Who' }
  const sent = serialize(obj, schema)
  t.equal(sent,
          'This person\'s given name is "Dr" and family name is "Who"')
  const o2 = parse(sent, schema)
  t.deepEqual(o2, obj)
  t.end()
})

test(t => {
  const schema = {
    people_names: {
      defs: [
        "This person's given name is [given] and family name is [family]",
        'Their name is [given] [family]'
      ],
      filter: {
        family: {lt: 'Who'}
      }
    },
    special: {
      defs: [
        'The Oncoming Storm, in Dalek'
      ],
      filter: {
        given: 'Dr',
        family: 'Who'
      }
    }
  }

  const obj = { given: 'Dr', family: 'Who' }
  const sent = serialize(obj, schema)
  t.equal(sent, 'The Oncoming Storm, in Dalek')

  const o2 = parse(sent, schema)
  t.deepEqual(o2, obj)
  t.end()
})
