'use strict'

const debug = require('debug')('split')

function split (text, maxlen) {
  if (text.length <= maxlen) return [text]
  const out = []
  let part = 1

  while (true) {
    let len = maxlen - 12  // assumes max 4 digits
    let head = text.slice(0, len)
    debug('head is %j, len is %j', head, len)
    if (len < 1) throw Error('maxlen doesnt have room for header')
    text = text.slice(len)
    debug('.. leaving text as %j', text)
    if (text.length) {
      out.push('[part ' + (part++) + '] ' + head)
      debug(out[out.length - 1])
    } else {
      out.push('[last part] ' + head)
      debug(out[out.length - 1])
      return out
    }
  }
}

module.exports.split = split
