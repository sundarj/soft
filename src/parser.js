import { each, map, filter, contains, trim } from './util'
import Syntax from './syntax'

let SYNTAX = Syntax()
const DEFAULTS = {}


const openRE = /^<([^ \/!]+?)( [^>]+)*?>/
const closeRE = /^<\/(?:[^ \/]+?)(?: [^>]+)*?>/
const attrRE = /([^= ]+)(=("[^"]*"|'[^']*'|[^"'\s>]*))?/g
const commentRE = /^<!--(.*?)-->/

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
    let remains = str.slice(pos)
    
    if ( m = openRE.exec(remains) ) {
      pos += m[0].length
      
      m = openToken(m)
    } else if ( m = closeRE.exec(remains) ) {
      pos += m[0].length
      
      m = {
        t: 'c'
      }
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


const parseElement = (token, parents) => { 
  let $type = token.t
  
  if ($type) {
    if ( $type === 'c' ) {
      parents.pop()
      return null
    }
  }

  
  let parent = parents[parents.length-1]
  let isString = typeof token === 'string'
  
  if (parent) {
    parent.c = parent.c || []
    parent.c.push(token)
    
    if (!isString)
      parents.push(token)
    return null
  }
  
  if (isString)
    return null
    
  parents.push(token)
  return token
}

const parse = (str, opts) => {
    let tokens = lex(str)
    opts = Object.assign(DEFAULTS, opts)

    let parents = []
    
    return filter(
      map(tokens, function parseToken(token) {
        if (!parents.length && typeof token === 'string')
          return token
        
        token = parseElement(token, parents)
        
        return token
      }),
      i => i
    )
}

export default parse
