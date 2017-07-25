'use strict'

const test = require('tape')
const match = require('./match')
const tok = require('./tokenize')

test(t => {
  t.plan(2)
  const m = match(tok('$x'), tok('42'))
  t.ok(m)
  t.equal(m.x, 42)
  t.end()
})

test(t => {
  t.plan(1)
  const m = match(tok('$x'), tok('42 x'))
  t.equal(m, null)
  t.end()
})

test(t => {
  t.plan(2)
  const m = match(tok('a $x'), tok('a 42'))
  t.ok(m)
  t.equal(m.x, 42)
  t.end()
})

test(t => {
  t.plan(1)
  const m = match(tok('a $x'), tok('b 42'))
  t.equal(m, null)
  t.end()
})

test(t => {
  t.plan(1)
  const m = match(tok('a 43'), tok('a 42'))
  t.equal(m, null)
  t.end()
})

test(t => {
  t.plan(1)
  const m = match(tok('a 43'), tok('a x'))
  t.equal(m, null)
  t.end()
})

test(t => {
  t.plan(2)
  const m = match(tok('the answer is $x'), tok('the answer is 42'))
  t.ok(m)
  t.equal(m.x, 42)
  t.end()
})

test(t => {
  t.plan(2)
  const m = match(tok('a=$x, b=$y'), tok('a=42,b=100'))
  t.ok(m)
  t.deepEqual({x: 42, y: 100}, m)
  t.end()
})

test(t => {
  t.plan(1)
  const m = match(tok('a=$x, b=$y'), tok('a=42,b=100 x'))
  t.equal(m, null)
  t.end()
})

test(t => {
  t.plan(2)
  const m = match(tok('age $x yr, height $x in'),
                  tok('age 60 yr, height 60 in'))
  t.ok(m)
  t.deepEqual({x: 60}, m)
  t.end()
})

test(t => {
  t.plan(1)
  const m = match(tok('age $x yr, height $x in'),
                  tok('age 60 yr, height 59 in'))
  t.equal(m, null)
  t.end()
})
