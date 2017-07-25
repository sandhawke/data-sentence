'use strict'

const debug = require('debug')('tokenize')

// One should write a tokenizer by hand at least once a decade, don't
// you think?  No good reason not to use an off-the-shelf lex, I suppose.
// (mostly just feeling burned by js lexer experiences in the past)

// I like this style because my editor spots typos.  Could use START =
// 'START', I suppose.
const START = 100
const INWORD = 101
const INNUM = 102
const INDQSTR = 103
const INDQSTRBS = 104

// This is surely premature optimization.  Sorry.
const ZERO = '0'.charCodeAt(0)
const NINE = '9'.charCodeAt(0)


function tokenize (text, cb) {
  const result = []
  if (!cb) cb = tok => result.push(tok)
  let state = START
  let pos = 0
  let token = null
  let char
  let code 
  while (char !== 'END') {
    if (pos + 1 > text.length) {
      char = 'END'
      code = -1
    } else {
      char = text[pos++]
      code = char.charCodeAt(0)
    }
    debug('consider char', JSON.stringify(char), 'in state', state)
    debug('  token so far', token)

    switch (state) {

    case START:
      if (white(char)) {
        continue
      }
      if (code >= ZERO && code <= NINE || char === '-') {
        state = INNUM
        token = { type: 'number', start: pos, text: char }
        continue
      }
      if (letter(char)) {
        state = INWORD
        token = { type: 'word', start: pos, text: char }
        continue
      }
      if (char === '"') {
        state = INDQSTR
        token = { type: 'string', start: pos, text: ''} 
        continue
      }
      if (char === ',') {
        token = { type: 'delim', start: pos, text: char}
        cb (token)
        token = null
        continue
      }
      throw Error('invalid char in START: ' + JSON.stringify(char))
      break

    case INNUM:
      if (white(char) || char === ',' || char === 'END') {
        // might still be too long
        token.value = parseFloat(token.text)
        cb(token)
        token = null
        --pos
        state = START
        continue
      }
      if (code >= ZERO && code <= NINE) {
        token.text += char
        continue
      }
      throw Error('invalid char in INNUM: ' + JSON.stringify(char))
      break

    case INWORD:
      if (white(char) || char === ',' || char === 'END') {
        cb(token)
        token = null
        --pos
        state = START
        continue
      }
      if (letter(char) || (code >= ZERO && code <= NINE)) {
        token.text += char
        continue
      }
      throw Error('invalid char in INWORD: ' + JSON.stringify(char))
      break
      
    case INDQSTR:
      if (char === '"') {
        cb(token)
        token = null
        state = START
        continue
      }
      if (char === '\\') {
        state = INDQSTRBS
        continue
      }
      token.text += char
      break

    case INDQSTRBS:
      if (char === '\\' || char === '"') {
        token.text += char
        state = INDQSTR
        continue
      }
      if (char === 'n') {
        token.text += '\n'
        state = INDQSTR
        continue
      }
      if (char === 't') {
        token.text += '\t'
        state = INDQSTR
        continue
      }
      throw Error('invalid char in INDQSTRBS: ' + JSON.stringify(char))
      break
    }
  }
  return result
}

function white (char) {
  return (char === ' ' || char === '\n' || char === '\t')
}

function letter (char) {
  return /[a-z_]/i.test(char)
}

  
module.exports = tokenize
