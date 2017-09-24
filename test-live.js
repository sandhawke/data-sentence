'use strict'

const test = require('tape')
const ds = require('.')
const datapages = require('datapages')

test(t => {
  // it'd be better/nicer to just be using a local implementation...
  const mdb = new datapages.DB({serverAddress: 'ws://magrathea:6001'})
  const odb = new datapages.DB({serverAddress: 'ws://magrathea:6001'})
  const schema = {
    a: {
      defs: [
        'testing [x] and [y]'
      ]
    }
  }
  const trans = new ds.Translator(schema)
  trans.startLive(mdb, odb)
  odb.add({x: 1, y: 2})
  for (let m of mdb.items()) {
    console.log('m:', m)
  }
  t.end()
})

