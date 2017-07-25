'use strict'

const test = require('tape')
const tok = require('./tokenize')

test(t => {
  t.deepEqual(tok(''), [])
  t.deepEqual(tok(' '), [])
  t.deepEqual(tok('  '), [])
  t.deepEqual(tok('\n'), [])
  t.deepEqual(tok(' \n \t '), [])
  t.end()
})

test(t => {
  t.deepEqual(tok('0 '), [
    { start: 1, text: '0', type: 'number', value: 0 }
  ])
  t.deepEqual(tok('0'), [
    { start: 1, text: '0', type: 'number', value: 0 }
  ])
  t.deepEqual(tok('0, 12345'), [
    { start: 1, text: '0', type: 'number', value: 0 },
    { start: 2, text: ',', type: 'delim' },
    { start: 4, text: '12345', type: 'number', value: 12345 }
  ])
  t.end()
})

test(t => {
  t.deepEqual(tok('hello'), [
    { start: 1, text: 'hello', type: 'word' }
  ])
  t.deepEqual(tok('  hello \n \t '), [
    { start: 3, text: 'hello', type: 'word' }
  ])
  t.deepEqual(tok('a bb ccc,dddd'), [
    { start: 1, text: 'a', type: 'word' },
    { start: 3, text: 'bb', type: 'word' },
    { start: 6, text: 'ccc', type: 'word' },
    { start: 9, text: ',', type: 'delim' },
    { start: 10, text: 'dddd', type: 'word' }
  ])
  t.end()
})

test(t => {
  t.deepEqual(tok('"hello"'), [
    { start: 1, text: 'hello', type: 'string' }
  ])
  t.deepEqual(tok('  "hello " \n \t '), [
    { start: 3, text: 'hello ', type: 'string' }
  ])
  t.deepEqual(tok('a bb "ccc",dddd'), [
    { start: 1, text: 'a', type: 'word' },
    { start: 3, text: 'bb', type: 'word' },
    { start: 6, text: 'ccc', type: 'string' },
    { start: 11, text: ',', type: 'delim' },
    { start: 12, text: 'dddd', type: 'word' }
  ])
  t.end()
})

test(t => {
  t.deepEqual(tok('""'), [
    { start: 1, text: '', type: 'string' }
  ])
  t.deepEqual(tok('"a"'), [
    { start: 1, text: 'a', type: 'string' }
  ])
  t.deepEqual(tok('"\\\\"'), [
    { start: 1, text: '\\', type: 'string' }
  ])
  t.deepEqual(tok('"\\""'), [
    { start: 1, text: '"', type: 'string' }
  ])
  t.deepEqual(tok('"hello\nthere\t \\\\ \\""'), [
    { start: 1, text: 'hello\nthere\t \\ "', type: 'string' }
  ])
  t.end()
})

test(t => {
  t.plan(1)
  try {
    tok('"\\a"')
    t.fail()
  } catch (e) {
    // console.log('expected error:', e)
    t.ok(e instanceof tok.Error)
  }
  t.end()
})
