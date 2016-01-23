(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.soft = {})));
}(this, function (exports) { 'use strict';

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

  let openTagRE = /<([^ \/]+?)( [^>]+)*?>/g

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

  const parse = (str, opts) => {
      return lex(str)
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