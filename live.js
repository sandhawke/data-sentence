'use strict'

const debug = require('debug')('data_sentence_live')

class Live {
  constructor (trans, msgDB, objDB) {
    this.trans = trans
    this.msgDB = msgDB
    this.objDB = objDB
    this.seen = new WeakMap()

    this.msgView = this.msgDB.view({
      name: 'messages',
      filter: {
        isMessage: true,
        text: { required: true, type: 'string' }
        // inReplyTo: { type: 'object' },   // ref?
        // creator: cccc   User Object Reference
        // date: dddd 
      }
    })

    // should ask for reply, with 
    //  - replayAndListen(...)
    //  - onSince(0, ...
    this.msgView.on('appear', this.newMessage.bind(this))

    this.objDB.on('appear', this.newObject.bind(this))
    this.objDB.on('change', this.objectDelta.bind(this))
    debug('constructed')
  }

  newMessage (msg) {
    debug('incoming message %o', msg)
    if (this.seen.get(msg)) {
      debug('msg seen, so skip it')
      return
    }
    // TBD defragment...    gather up all the fragments before handling
    
    const obj = this.trans.parse(msg.text)
    if (obj) {
      obj.__source = msg
      this.seen.set(obj, true)
      this.seen.set(msg, true)
      this.objDB.add(obj)
      debug('added obj %o', obj)
    } else {
      debug('no schema match for message %j', msg.text)
    }
  }

  newObject (obj) {
    debug('incoming object %o', obj)
    if (this.seen.get(obj)) {
      debug('msg seen, so skip it')
      return
    }

    // this is only useful when the object comes in with all its
    // properties.  If it came over the network, it would have been
    // shredded and we'll need to buffer up deltas, etc.

    let prev = null
    for (const t of this.trans.stringifySplit(obj)) {
      const msg = {
        isMessage: true,
        text: t
      }
      if (prev) msg.inReplyTo = prev
      prev = msg

      this.seen.set(obj, true)
      this.seen.set(msg, true)

      this.msgDB.add(msg)
      debug('added msg %o', msg)
    }
  }
  

  objectDelta (obj, delta) {
    // buffer up some deltas...   wait for a 'stable' or a 'tick', I guess
    
  }

  flushDeltas () {
    // for all the objects for which we've been storing up deltas, generate
    // sentences
    
  }
}

module.exports = Live
