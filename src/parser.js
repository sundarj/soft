import { each, map, filter, contains } from './util'
import syntax from './syntax'

let SYNTAX = syntax()

const openRE = /^<([^ \/!]+?)( [^>]+)*?>/
const closeRE = /^<\/(?:[^ \/]+?)(?: [^>]+)*?>/
const commentRE = /^<!--(.+?)-->/

const attrRE = /([^= ]+)(?:=("[^"]*"|'[^']*'|[^"'\s>]*))?/g

function openToken(match) {
  
  const token = {
    t: match[1],
  }
  
  const attributes = match[2]
  
  if (attributes) {
    const attributeMap = {}
    
    let attr
    
    while (( attr = attrRE.exec(attributes) )) {
      attributeMap[attr[1]] = attr[2] || true
    }
    
    token.a = attributeMap
  }
  
  return token
}

export function lex(str) {
  
  const tokens = []
  const length = str.length
  
  let pos = 0
  let m
  let buf = ''
  
  while (pos < length) {
    const remains = str.slice(pos)
    
    // early exit in case of plain text
    if ( remains[0] !== '<' ) {
      buf += str[pos++]
      
      continue
    }
    
    if (( m = openRE.exec(remains) )) {
      pos += m[0].length
      
      m = openToken(m)
    } else if (( m = closeRE.exec(remains) )) {
      pos += m[0].length
      
      m = {
        t: 'c',
      }
    } else if (( m = commentRE.exec(remains) )) {
      // ignore comments
      
      pos += m[0].length
      m = false
    }
    
    if (m) {
      if (buf) {
        tokens.push(buf)
        buf = ''
      }
      
      tokens.push(m)
    }
  }
  
  if (!m && buf) return buf

  return tokens
}

/* eslint-disable max-len */

const voidRE = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|import|include)$/i

/* eslint-enable max-len */

const softEntities = SYNTAX.ENTITY.join('|')

/* eslint-disable prefer-template */
const softEntityRE = new RegExp(
  '&(?:' + softEntities + ');' + '|' + // plain ol' entities or..
  '&(?:' + softEntities + ')' + // entities with
  '(?:' + '\\.([^;]+)' + '|' + // dot notation or..
  '\\[([^\\]]+)\\]' + ');' // bracket notation
)
/* eslint-enable prefer-template */

const quotRE = /^['"]|['"]$/g

function parseAttribute(attribute, attributes) {
  
  const val = attributes[attribute]
  if (typeof val !== 'string') return
  
  /* eslint-disable prefer-const */
  let m
  /* eslint-enable prefer-const */
  
  if (( m = val.match(softEntityRE) )) {
    each(SYNTAX.ATTRIBUTE, softAttribute => {
      
      const item = attributes[softAttribute]
      
      if (item) {
        m.soft = {
          i: item.replace(quotRE, ''),
        }
        
        const helper = attributes[SYNTAX.HELPER]
        if (helper) {
          m.soft.h = helper.replace(quotRE, '')
        }
      }
    })
    
    attributes[attribute] = Object.assign({}, m)
  }
}

function parseSoftAttribute(attribute, token) {
  
  const helperName = SYNTAX.HELPER
  if (attribute === helperName) return
  
  const attributes = token.a
  const val = attributes[attribute]
  
  if (!token.c) token.c = []
  
  const item = {
    i: val.replace(quotRE, ''),
  }
  
  const helper = attributes[helperName]
  if (helper) item.h = helper.replace(quotRE, '')
  
  token.c.push(item)
}

function parseAttributes(token) {
  
  const attributes = token.a
  const toDelete = []
  
  each(Object.keys(attributes), attribute => {
    
    if ( contains(SYNTAX.ATTRIBUTE, attribute) ) {
      parseSoftAttribute(attribute, token)
      toDelete.push(attribute)
    } else {
      parseAttribute(attribute, attributes)
    }
  })
  
  each(toDelete, attribute => delete attributes[attribute])
  
  token.a = attributes
}

function parseElement(token, parents) {
  
  const $type = token.t
  
  if ($type) {
    if ($type === 'c') {
      parents.pop()
      return null
    }
    
    if (token.a) parseAttributes(token)
  }

  const parent = parents[parents.length - 1]
  const isString = typeof token === 'string'
  
  if (parent) {
    if ( !parent.c ) parent.c = []
    
    parent.c.push(token)
    
    if ( !isString && !voidRE.test($type) ) {
      parents.push(token)
    }
      
    return null
  }
  
  if (isString) return null
  
  if ( !voidRE.test($type) ) parents.push(token)
    
  return token
}

import { CONFIG } from './soft'

export default function parse(str) {
  
  const tokens = lex(str)
  if (typeof tokens === 'string') return tokens
  
  if (CONFIG.prefix != null) SYNTAX = syntax(CONFIG.prefix)

  const parents = []
  
  return filter(
    map(tokens, token => {
    
      if (!parents.length && typeof token === 'string') {
        return token
      }
      
      return parseElement(token, parents)
    }
  ), Boolean)
}
