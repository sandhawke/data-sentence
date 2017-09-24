'use strict'

const test = require('tape')
const datasent = require('.')

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
  const ds = new datasent.Translator(schema)
  const obj = { given: 'Dr', family: 'Who' }
  const sent = ds.stringify(obj)
  t.equal(sent,
          'This person\'s given name is "Dr" and family name is "Who"')
  const o2 = ds.parse(sent)
  t.deepEqual(o2, obj)
  t.end()
})
