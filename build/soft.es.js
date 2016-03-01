function contains (array, value) {
    for (let i = 0, l = -1 + array.length, m = Math.floor((l + 1) / 2); i <= m; i++) {
        if ( array[i] === value )
            return true
        else if ( array[(l - i)] === value )
            return true
    }
    return false
}

function each(arr, fn) {
    let index = -1
    const length = arr.length

    while (++index < length) {
        fn(arr[index], index, arr)
    }
};

function map(arr, fn) {
    let index = -1
    const length = arr.length
    const result = Array(length)

    while (++index < length) {
        result[index] = fn(arr[index], index, arr)
    }

    return result
};

function filter(arr, predic) {
  let index = -1
  const length = arr.length
  const result = []
  
  while (++index < length) {
    if ( predic(arr[index]) )
      result.push(arr[index])
  }
  
  return result
}

const squotRE = /'/g;
const quotRE$1 = /"/g;
const lfRE =  /\n/g;
const crRE = /\r/g;
const slashRE = /\\/g;
const lineSepRE = /\u2028/;
const paraSepRE = /\u2029/;

function esc(s) {
    return s
            .replace(slashRE, '\\\\')
            .replace(squotRE, '\\\'')
            .replace(quotRE$1, '\\"')
            .replace(lfRE, '\\n')
            .replace(crRE, '\\r')
            .replace(lineSepRE, '\\u2028')
            .replace(paraSepRE, '\\u2029');
  }

function prefixed(obj, prefix) {
  return Array.prototype.concat.call(obj).map(item => prefix + item)
};

function Syntax(prefix) {
  return {
    ENTITY: ['self', 'this', 'here'],
    ATTRIBUTE: prefixed(['is', 'of', 'as'], prefix),
    ELEMENT: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi'], prefix),
    /*void: prefixed('void'),
    voidElements: ['import', 'include'],*/
    HELPER: prefixed('as', prefix),
  };
}

let SYNTAX = Syntax()

const openRE = /^<([^ \/!]+?)( [^>]+)*?>/
const closeRE = /^<\/(?:[^ \/]+?)(?: [^>]+)*?>/
const commentRE = /^<!--(.+?)-->/

const attrRE = /([^= ]+)(?:=("[^"]*"|'[^']*'|[^"'\s>]*))?/g

function openToken(match) {
  const token = {
    t: match[1]
  }
  
  const attributes = match[2]
  
  if (attributes) {
    const attributeMap = {}
    
    let attr
    
    while( attr = attrRE.exec(attributes) ) {
      attributeMap[attr[1]] = attr[2] || true
    }
    
    token.a = attributeMap
  }
  
  return token
}

function lex(str) {
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
    
    if ( m = openRE.exec(remains) ) {
      pos += m[0].length
      
      m = openToken(m)
    } else if ( m = closeRE.exec(remains) ) {
      pos += m[0].length
      
      m = {
        t: 'c'
      }
    } else if ( m = commentRE.exec(remains) ) {
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
  
  if (!m && buf)
    return buf

  return tokens
}


const voidRE = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|import|include)$/i

const softEntities = SYNTAX.ENTITY.join('|')
const softEntityRE = new RegExp(
  '&(?:' + softEntities + ');' + '|' + // plain ol' entities or..
  '&(?:' + softEntities + ')' + // entities with
  '(?:' + '\\.([^;]+)' + '|' + // dot notation or..
  '\\[([^\\]]+)\\]' + ');' // bracket notation
)

const quotRE = /^['"]|['"]$/g

function parseAttribute(attribute, attributes) {
  const val = attributes[attribute]
  if ( typeof val !== 'string' )
    return null
    
  let m
  
  if ( m = val.match(softEntityRE) ) {
    each(SYNTAX.ATTRIBUTE, softAttribute => {
      const item = attributes[softAttribute]
      
      if (item) {
        m.soft = {
          i: item.replace(quotRE, '')
        }
        
        const helper = attributes[SYNTAX.HELPER]
        if (helper)
          m.soft.h = helper.replace(quotRE, '')
      }
    })
    
    attributes[attribute] = m
  }
}

function parseSoftAttribute(attribute, token) {
  const helperName = SYNTAX.HELPER
  if (attribute === helperName) return null;
  
  const attributes = token.a
  const val = attributes[attribute]
  
  if (!token.c) token.c = []
  
  const item = {
    i: val
  }
  
  const helper = attributes[helperName]
  if (helper) item.h = helper
    
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

  const parent = parents[parents.length-1]
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

function parse(str) {
    const tokens = lex(str)
    if (typeof tokens === 'string') return tokens
    
    if (CONFIG.prefix != null) SYNTAX = Syntax(CONFIG.prefix)

    const parents = []
    
    return filter( map(tokens, token => {
        if (!parents.length && typeof token === 'string') {
          return token
        }
        
        return parseElement(token, parents)
      }), Boolean )
}

let CACHE = {}

function compile (body) {
    let parsed = CACHE[body] || ( CACHE[body] = parse(body) )
    parsed = esc( parsed.join('') )
        
    return new Function( 'data', `return '${parsed}'` )
}

const CONFIG = {
  prefix: ':'
}

function configure(options) {
  Object.assign(CONFIG, options)
  
  return soft;
}

function render(body, data){
  return compile(body)(data)
}

export { parse, lex, compile, CONFIG, configure, render };