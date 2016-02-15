import { each, map, filter, contains, trim } from './util'
import Syntax from './syntax'

let SYNTAX = Syntax()
const DEFAULTS = {}


const openRE = /^<([^ \/!]+?)( [^>]+)*?>/
const closeRE = /^<\/(?:[^ \/]+?)(?: [^>]+)*?>/
const commentRE = /^<!--(.+?)-->/

const attrRE = /([^= ]+)(=("[^"]*"|'[^']*'|[^"'\s>]*))?/g

function openToken(match) {
  let token = {
    t: match[1]
  }
  
  if ( match[2] ) {
    token.a = {}
    
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
    } else if ( m = commentRE.exec(remains) ) {
      pos += m[0].length
      m = false
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


const voidRE = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|import|include)$/i

const softEntities = SYNTAX.ENTITY.join('|')
const softEntityRE = new RegExp(
  '&(' + softEntities + ');' + '|' + // plain ol' entities or..
  '&' + '(?:' + softEntities + ')' + // entities with
  '(?:' + 
  '\\.([^;]+)' + '|' + // dot notation or..
  '\\[([^\\]]+)\\]' + // bracket notation
  ')?;'
)

const quotRE = /['"]/g

const parseSoftAttribute = (name, token, attributes) => {
  let tokenAttributes = token.a
  
  each(attributes, function(attribute) {
    if ( !contains(SYNTAX.ATTRIBUTE, attribute) ) {
      let value = tokenAttributes[attribute]
      
      if ( softEntityRE.test(value) && !Array.isArray(value) ) {
        token.a[attribute] = [
          value,
          {
            i: tokenAttributes[name].replace(quotRE, '')
          }
        ]
      }
    }
  })
}

const parseAttributes = (token) => {
  each(Object.keys(token.a), function(name, index, attributes) {
    if ( contains(SYNTAX.ATTRIBUTE, name) ) {
      parseSoftAttribute(name, token, attributes)
      
      delete token.a[name]
    }
  })
}

const parseElement = (token, parents) => { 
  let $type = token.t
  
  if ($type) {
    if ($type === 'c') {
      parents.pop()
      return null
    }
    if (token.a)
      parseAttributes(token)
  }

  let parent = parents[parents.length-1]
  let isString = typeof token === 'string'
  
  if (parent) {
    parent.c = parent.c || []
    parent.c.push(token)
    
    if ( !isString && !voidRE.test($type) )
      parents.push(token)
    return null
  }
  
  if (isString)
    return null
  
  if ( !voidRE.test($type) )
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
        
        return parseElement(token, parents)
      }),
      Boolean
    )
}

export default parse
