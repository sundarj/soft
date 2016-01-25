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

  const map = (arr, fn) => {
      let index = -1
      let length = arr.length
      let result = Array(length)

      while (++index < length) {
          result[index] = fn(arr[index], index, arr)
      }

      return result
  };

  const trim = (s) => s.trim? s.trim() : s.replace(/^\s*|\s*$/g, '')

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


  const openTagRE = /<([^ \/]+?)( [^>]+)*?>/g

  function lex(str) {
      let ret = []
      let pos = 0
      
      for (let match; match = openTagRE.exec(str);) {
          ret.push( str.slice(pos, match.index) )
          ret.push(match)
          
          pos = (match.index + match[0].length)
      }
      
      return ret
  }

  const attrRE = /([^= ]+)=("[^"]*"|'[^']*'|[^"'\s>]*)/g
  const softAttrRE = () => new RegExp(
      attrRE.source.replace( '[^= ]', SYNTAX.attributes.join('|') ),
      'g'
  )

  function findSoftAttrs(atts) {
      if (!atts) return null
      
      let attrs = atts.match( softAttrRE() )
      /*if (attrs) {
          attrs = attrs.map( attr => attr.split("=") )
      }*/
      
      return attrs
  }

  const _parse = (opts) => {
      return (token, index, tokens) => {
          if ( Array.isArray(token) ) {
              const softAttrs = findSoftAttrs( token[2] )
              
              if (softAttrs) {
                  each(softAttrs, (softAttr) => {
                      token[2] = trim( token[2].replace(softAttr, '') )
                  })
              }
              
              let nextToken = tokens[index + 1]
              if (typeof nextToken === 'string') {
                  token.push(nextToken)
                  delete tokens[index + 1]
              }
          }
          
          return token
      }
  }

  const parse = (str, opts) => {
      let tokens = lex(str)
      opts = Object.assign(DEFAULTS, opts)
      
      if (opts.prefix)
          SYNTAX = Syntax(opts.prefix)
      
      return map( tokens, _parse(opts) )
  }

  let CACHE = {}

  const compile = (body) => {
      let parsed = CACHE[body] || ( CACHE[body] = parse(body) )
      parsed = esc( parsed.join('') )
          
      return new Function( 'data', `return '${parsed}'` )
  }

  const render = (body, data) => compile(body)(data)

  exports.parse = parse;
  exports.compile = compile;
  exports.render = render;

}));