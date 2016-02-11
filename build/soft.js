(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.soft = {})));
}(this, function (exports) { 'use strict';

  const each = (arr, fn) => {
      let index = -1
      let length = arr.length

      while (++index < length) {
          fn(arr[index], index, arr)
      }
  };

  const squotRE = /'/g;
  const quotRE = /"/g;
  const lfRE =  /\n/g;
  const crRE = /\r/g;
  const slashRE = /\\/g;
  const lineSepRE = /\u2028/;
  const paraSepRE = /\u2029/;

  const esc = (s) => {
      return s
              .replace(slashRE, '\\\\')
              .replace(squotRE, '\\\'')
              .replace(quotRE, '\\"')
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
          entity: ['self', 'this', 'here'],
          attributes: prefixed(['is', 'of', 'as']),
          elements: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
          void: prefixed('void'),
          voidElements: ['import', 'include'],
          helper: prefixed('as')
      };
  }

  let SYNTAX = Syntax()
  const DEFAULTS = {}


  const openRE = /^<([^ \/!]+?)( [^>]+)*?>/
  const closeRE = /^<\/(?:[^ \/]+?)(?: [^>]+)*?>/
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
      
      return tokens
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