'use strict'

const debug = require('debug')('data_sentence_bridge')

class Bridge {
  constructor (trans, msgDB, objDB) {
    this.trans = trans
    this.msgDB = msgDB
    this.objDB = objDB
    this.mapsTo = new WeakMap()

    // let msgDB just be the view we want.  if we had better nested
    // views, we wouldn't need this.
    if (this.msgDB.filter && this.msgDB.filter.text) {
      this.msgView = this.msgDB
    } else {
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
    }

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
    if (this.mapsTo.get(msg)) {
      debug('msg already processed, so skip it')
      return
    }
    // TBD defragment...    gather up all the fragments before handling

    debug('its new, parse it')
    const obj = this.trans.parse(msg.text)
    if (obj) {
      obj.__source = msg
      this.mapsTo.set(obj, msg)
      this.mapsTo.set(msg, obj)
      this.objDB.create(obj)
      debug('added obj %o', obj)
    } else {
      debug('no schema match for message %j', msg.text)
    }
  }

  newObject (obj) {
    debug('incoming object %o', obj)
    if (this.mapsTo.get(obj)) {
      debug('obj seen, so skip it')
      return
    }

    const t = this.trans.stringify(obj)
    if (t) {
      debug('got stringified section %j', t)
      const msg = {
        isMessage: true,
        text: t
      }

      this.mapsTo.set(obj, msg)
      this.mapsTo.set(msg, obj)

      debug('marked as seen, so adding them to msgDB should do little')
      this.msgDB.create(msg)
      debug('added msg %o', msg)
    } else {
      debug('no stringification for %o', obj)
    }
  }

  objectDelta (obj, delta) {
    debug('incoming delta, treating like a new object for now')
    // buffer up some deltas...   wait for a 'stable' or a 'tick', I guess
    //
    // OR just try again
    //
    // if we've already mapped this object, then delete the message?
    const msg = this.mapsTo.get(obj)
    if (msg) {
      const t = this.trans.stringify(obj)
      if (t === msg.text) {
        debug('changed object %j stringifies the same; nothing to change', obj)
        return
      }

      debug('overlaying new text for msg, %j', t)
      // this.msgDB.overlay(msg, {text: t})
      this.msgDB.setProperty(msg, 'text', t)
      return
    }
    debug('we havent managed to construct a msg for this obj, so try now')
    this.newObject(obj)
  }

  flushDeltas () {
    // for all the objects for which we've been storing up deltas, generate
    // sentences

  }
}

module.exports = Bridge
