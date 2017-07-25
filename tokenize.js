'use strict'

const debug = require('debug')('tokenize')

// One should write a tokenizer by hand at least once a decade, don't
// you think?  No good reason not to use an off-the-shelf lex, I suppose.
// (mostly just feeling burned by js lexer experiences in the past)
//
// Also, implemented so it could be converted to streaming pretty
// easily, I think.  pos handling, esp --pos, would have to be
// slightly different.  But we only back up 2 at most.

// Emacs and I disagree with standard about switch {} indents
/* eslint-disable indent */

// Doing it like this means getting the string wrong will be caught by JS
const START = 'START'
const INWORD = 'INWORD'
const INNUM = 'INNUM'
const INDQSTR = 'INDQSTR'
const INDQSTRBS = 'INDQSTRBS'
const INNUMDOT = 'INNUMDOT'

// as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// after seening nothing better at https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax
function MyError (message) {
  this.name = 'DataSentenceSyntaxError'
  this.message = message || 'Data Sentence Syntax Error'
  this.stack = (new Error(message)).stack
}
MyError.prototype = Object.create(Error.prototype)
MyError.prototype.constructor = MyError

tokenize.Error = MyError

function tokenize (text, cb) {
  const result = []
  if (!cb) cb = tok => result.push(tok)
  let state = START
  let pos = 0
  let token = null
  let char

  const err = () => {
    throw new MyError('Unexpected character ' + JSON.stringify(char) +
                      ' at position ' + pos + ' while in state ' + state)
  }

  const endnum = () => {
    // check for things like 1.1.1
    if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(token.text)) {
      throw new MyError('Bad number syntax: ' +
                        JSON.stringify(token.text))
    }
    // catch things like overflow
    token.value = parseFloat(token.text)
    if (Number.isNaN(token.value) || !Number.isFinite(token.value)) {
      throw new MyError('Number not parseable by JavaScript: ' +
                        JSON.stringify(token.text))
    }
    cb(token)
    token = null
    --pos
    state = START
  }

  while (char !== 'END') {
    if (pos + 1 > text.length) {
      char = 'END'
    } else {
      char = text[pos++]
    }
    debug('consider char', JSON.stringify(char), 'in state', state)
    debug('  token so far', token)

    switch (state) {
    case START:
      if (white(char)) {
        continue
      }
      if (digit(char) || char === '-') {
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
        token = { type: 'string', start: pos, text: '' }
        continue
      }
      if (char === '$') {
        state = INWORD
        token = { type: 'var', start: pos, text: '' }
        continue
      }
      if (char === ',' || char === '.' || char === ';' ||
          char === '=' /*   hold off on these until we're sure
          char === '(' || char === ')' ||
          char === '[' || char === ']' ||
          char === '{' || char === '}' ||
          char === '@' || char === '=' || char === '%' ||
          char === '^' || char === '*' || char === '+' */
         ) {
        token = { type: 'delim', start: pos, text: char }
        cb(token)
        token = null
        continue
      }
      if (char === 'END') continue
      err()
      break

    case INNUM:
      // we're pretty lax, accepting  123.45.6.7e+3eee-+-+45 as a number
      // knowing parseFloat() will catch this stuff later
      if (white(char) || char === ',' || char === 'END') {
        endnum()
        continue
      }
      if (digit(char) ||
          char === 'e' || char === 'E' ||
          char === '+' || char === '-') {
        token.text += char
        continue
      }
      if (char === '.') {
        state = INNUMDOT
        token.text += char
        continue
      }
      err()
      break

    case INNUMDOT:
      if (white(char) || char === 'END') {
        // it was a period at the end of a sentence
        token.text = token.text.slice(0, -1)
        endnum()
        --pos // go all the way back to the dot
        continue
      }
      if (digit(char)) {
        // it was a decimal point in the middle of a number
        token.text += char
        state = INNUM
        continue
      }
      err()
      break

    case INWORD:
      if (white(char) || char === ',' || char === '=' || char === 'END') {
        cb(token)
        token = null
        --pos
        state = START
        continue
        }
        if (letter(char) || digit(char)) {
          token.text += char
          continue
        }
        err()
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
        err()
        break
    }
  }
  return result
}

function white (char) {
  return (char === ' ' || char === '\n' || char === '\t')
}

function letter (char) {
  return /^[a-z_]$/i.test(char)
}

function digit (char) {
  return /^\d$/.test(char)
}

module.exports = tokenize
