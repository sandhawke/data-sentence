'use strict'

const test = require('tape')
const splitter = require('./split')

test(t => {
  const o = splitter.split('', 5)
  t.deepEqual(o, [''])
  t.end()
})

test(t => {
  const o = splitter.split('hello', 5)
  t.deepEqual(o, ['hello'])
  t.end()
})

test(t => {
  try {
    splitter.split('goodbye', 5)
  } catch (e) {
    // no room
    t.end()
  }
})

test.only(t => {
  const o = splitter.split('123456789 123456789 123456789 ', 20)
  t.deepEqual(o, [
    '[part 1] 12345678', '[part 2] 9 123456', '[part 3] 789 1234', '[last part] 56789 '
  ])
  t.end()
})
