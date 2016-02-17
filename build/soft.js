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
            HELPER: prefixed('as'),
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
        let remains = str.slice(pos)
        
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
      '&(' + softEntities + ');' + '|' + // plain ol' entities or..
      '&' + '(?:' + softEntities + ')' + // entities with
      '(?:' + 
      '\\.([^;]+)' + '|' + // dot notation or..
      '\\[([^\\]]+)\\]' + // bracket notation
      ')?;'
    )

    function parseAttributes(token) {
      const tokenAttributes = token.a
      
      each(SYNTAX.ATTRIBUTE, attribute => {
        if ( tokenAttributes[attribute] );
      })
    }

    function parseElement(token, parents) { 
      const $type = token.t
      
      if ($type) {
        if ($type === 'c') {
          parents.pop()
          return null
        }
        
        if (token.a)
          parseAttributes(token)
      }

      const parent = parents[parents.length-1]
      const isString = typeof token === 'string'
      
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

    function parse(str) {
        const tokens = lex(str)
        if (typeof tokens === 'string')
          return tokens

        const parents = []
        
        return filter(
          map(tokens, token => {
            if (!parents.length && typeof token === 'string')
              return token
            
            return parseElement(token, parents)
          }),
          Boolean
        )
    }

    let CACHE = {}

    function compile (body) {
        let parsed = CACHE[body] || ( CACHE[body] = parse(body) )
        parsed = esc( parsed.join('') )
            
        return new Function( 'data', `return '${parsed}'` )
    }

    function render(body, data){
      return compile(body)(data)
    }

    exports.parse = parse;
    exports.lex = lex;
    exports.compile = compile;
    exports.render = render;

}));