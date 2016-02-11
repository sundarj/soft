import { each, map, trim } from './util'
import Syntax from './syntax'

let SYNTAX = Syntax()
const DEFAULTS = {}


const openRE = /^<([^ \/]+?)( [^>]+)*?>/
const attrRE = /([^= ]+)(=("[^"]*"|'[^']*'|[^"'\s>]*))?/g

function openToken(match) {
  let token = {
    t: match[1],
    a: {}
  }
  
  if ( match[2] ) {
    each(match[2].match(attrRE), attr => {
      let parts = attr.split(/=(.+)/)
      
      token.a[parts[0]] = parts[1] || true
    })
  }
  
  return token
}

export const lex = (str) => {
  let tokens = []
  let pos = 0
  let length = str.length
  
  let m
  let s = ''
  
  while (pos < length) {
    if ( m = openRE.exec(str.slice(pos)) ) {
      pos += m[0].length
      
      m = openToken(m)
    } else {
      s += str[pos++]
    }
    
    if (m) {
      if (s) {
        tokens.push(s)
        s = ''
      }
      tokens.push(m)
    }
  }

  return tokens
}


const parse = (str, opts) => {
    let tokens = lex(str)
    opts = Object.assign(DEFAULTS, opts)
}

export default parse