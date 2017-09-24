'use strict'

const test = require('tape')
const ds = require('.')
const datapages = require('datapages')
const debug = require('debug')('data_sentence_test_live')

test(t => {
  // it'd be better/nicer to just be using a local implementation...
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
  const live = trans.startLive(mdb, odb)
  odb.add({x: 1, y: 2})
  // live.newObject({x: 1, y: 2})
  for (let m of mdb.items()) {
    console.log('m:', m)
  }
  t.end()
})

