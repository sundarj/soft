(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.soft = {})));
}(this, function (exports) { 'use strict';

  const contains = (array, value) => {
      for (let i = 0, l = -1 + array.length, m = Math.floor((l + 1) / 2); i <= m; i++) {
          if ( array[i] === value )
              return true
          else if ( array[(l - i)] === value )
              return true
      }
      return false
  }

  const each = (arr, fn) => {
      let index = -1
      let length = arr.length

      while (++index < length) {
          fn(arr[index], index, arr)
      }
  };

  const map = (arr, fn) => {
      let index = -1
      let length = arr.length
      let result = Array(length)

      while (++index < length) {
          result[index] = fn(arr[index], index, arr)
      }

      return result
  };

  const filter = (arr, predic) => {
    let index = -1
    let length = arr.length
    let result = []
    
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

  const esc = (s) => {
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
      return Array.prototype.concat.call(obj).map(item => (prefix||':') + item)
  };

  let Syntax = (prefix) => {
      return {
          ENTITY: ['self', 'this', 'here'],
          ATTRIBUTE: prefixed(['is', 'of', 'as']),
          ELEMENT: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
          /*void: prefixed('void'),
          voidElements: ['import', 'include'],*/
          HELPER: prefixed('as')
      };
  }

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

  const lex = (str) => {
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

  let CACHE = {}

  const compile = (body) => {
      let parsed = CACHE[body] || ( CACHE[body] = parse(body) )
      parsed = esc( parsed.join('') )
          
      return new Function( 'data', `return '${parsed}'` )
  }

  const render = (body, data) => compile(body)(data)

  exports.parse = parse;
  exports.lex = lex;
  exports.compile = compile;
  exports.render = render;

}));