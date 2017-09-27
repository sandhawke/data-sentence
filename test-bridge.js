'use strict'

const test = require('tape')
const ds = require('.')
const datapages = require('datapages')
const debug = require('debug')('data_sentence_test_live')

test('simple obj to text', t => {
  const mdb = new datapages.DB({localMode: true})
  const odb = new datapages.DB({localMode: true})
  odb.on('appear', page => {
    debug('odb appear', page)
  })
  odb.on('change', (page, delta) => {
    debug('odb change', page, delta)
  })
  const schema = {
    a: {
      defs: [
        'testing [x] and [y]'
      ]
    }
  }
  const trans = new ds.Translator(schema)
  trans.bridge(mdb, odb)
  debug('*********************** Adding')
  odb.add({x: 1, y: 2})
  debug('*********************** Done Adding')
  for (let m of mdb.items()) {
    t.equal(m.text, 'testing 1 and 2')
    t.end()
  }
})

test('obj to text to obj', t => {
  const mdb = new datapages.DB({localMode: true})
  const odb1 = new datapages.DB({localMode: true})
  const odb2 = new datapages.DB({localMode: true})

  const schema1 = {
    a: {
      defs: [
        'testing [x] and [y]'
      ]
    }
  }

  const schema2 = {
    a: {
      defs: [
        'testing [xx] and [yy]'
      ]
    }
  }

  const trans1 = new ds.Translator(schema1)
  const trans2 = new ds.Translator(schema2)
  trans1.bridge(mdb, odb1)
  trans2.bridge(mdb, odb2)
  odb1.add({x: 1, y: 2})
  for (let m of mdb.items()) {
    t.equal(m.text, 'testing 1 and 2')
  }
  for (let o of odb2.items()) {
    debug('o: %o', o)
    t.equal(o.xx, 1)
    t.equal(o.yy, 2)
    t.end()
  }
})

test('shredding; GRADUAL obj to text', t => {
  const mdb = new datapages.DB({localMode: true})
  const odb = new datapages.DB({localMode: true})
  odb.on('appear', page => {
    debug('odb appear', page)
  })
  odb.on('change', (page, delta) => {
    debug('odb change', page, delta)
  })
  const schema = {
    a: {
      defs: [
        'testing [x] and [y]'
      ]
    }
  }
  const trans = new ds.Translator(schema)
  trans.bridge(mdb, odb)
  debug('*********************** Adding')
  const obj = {}
  odb.add(obj)
  odb.overlay(obj, {x: 1})
  debug('*********************** setting y')
  odb.overlay(obj, {y: 2})
  debug('*********************** Done Adding')
  for (let m of mdb.items()) {
    t.equal(m.text, 'testing 1 and 2')
    t.end()
  }
})
