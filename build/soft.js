(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.soft = {})));
}(this, function (exports) { 'use strict';

  function contains(array, value) {
      for (var i = 0, l = -1 + array.length, m = Math.floor((l + 1) / 2); i <= m; i++) {
          if (array[i] === value) return true;else if (array[l - i] === value) return true;
      }
      return false;
  }

  function each(arr, fn) {
      var index = -1;
      var length = arr.length;

      while (++index < length) {
          fn(arr[index], index, arr);
      }
  };

  function map(arr, fn) {
      var index = -1;
      var length = arr.length;
      var result = Array(length);

      while (++index < length) {
          result[index] = fn(arr[index], index, arr);
      }

      return result;
  };

  function filter(arr, predic) {
      var index = -1;
      var length = arr.length;
      var result = [];

      while (++index < length) {
          if (predic(arr[index])) result.push(arr[index]);
      }

      return result;
  }

  var squotRE = /'/g;
  var quotRE$1 = /"/g;
  var lfRE = /\n/g;
  var crRE = /\r/g;
  var slashRE = /\\/g;
  var lineSepRE = /\u2028/;
  var paraSepRE = /\u2029/;

  function esc(s) {
      return s.replace(slashRE, '\\\\').replace(squotRE, '\\\'').replace(quotRE$1, '\\"').replace(lfRE, '\\n').replace(crRE, '\\r').replace(lineSepRE, '\\u2028').replace(paraSepRE, '\\u2029');
  }

  function prefixed(obj, prefix) {
      return Array.prototype.concat.call(obj).map(function (item) {
          return (prefix || ':') + item;
      });
  };

  function Syntax(prefix) {
      return {
          ENTITY: ['self', 'this', 'here'],
          ATTRIBUTE: prefixed(['is', 'of', 'as']),
          ELEMENT: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
          /*void: prefixed('void'),
          voidElements: ['import', 'include'],*/
          HELPER: prefixed('as')
      };
  }

  var SYNTAX = Syntax();

  var openRE = /^<([^ \/!]+?)( [^>]+)*?>/;
  var closeRE = /^<\/(?:[^ \/]+?)(?: [^>]+)*?>/;
  var commentRE = /^<!--(.+?)-->/;

  var attrRE = /([^= ]+)(?:=("[^"]*"|'[^']*'|[^"'\s>]*))?/g;

  function openToken(match) {
    var token = {
      t: match[1]
    };

    var attributes = match[2];

    if (attributes) {
      var attributeMap = {};

      var attr = undefined;

      while (attr = attrRE.exec(attributes)) {
        attributeMap[attr[1]] = attr[2] || true;
      }

      token.a = attributeMap;
    }

    return token;
  }

  function lex(str) {
    var tokens = [];
    var length = str.length;

    var pos = 0;
    var m = undefined;
    var buf = '';

    while (pos < length) {
      var remains = str.slice(pos);

      // early exit in case of plain text
      if (remains[0] !== '<') {
        buf += str[pos++];

        continue;
      }

      if (m = openRE.exec(remains)) {
        pos += m[0].length;

        m = openToken(m);
      } else if (m = closeRE.exec(remains)) {
        pos += m[0].length;

        m = {
          t: 'c'
        };
      } else if (m = commentRE.exec(remains)) {
        // ignore comments

        pos += m[0].length;
        m = false;
      }

      if (m) {
        if (buf) {
          tokens.push(buf);
          buf = '';
        }

        tokens.push(m);
      }
    }

    if (!m && buf) return buf;

    return tokens;
  }

  var voidRE = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|import|include)$/i;

  var softEntities = SYNTAX.ENTITY.join('|');
  var softEntityRE = new RegExp('&(?:' + softEntities + ');' + '|' + // plain ol' entities or..
  '&(?:' + softEntities + ')' + // entities with
  '(?:' + '\\.([^;]+)' + '|' + // dot notation or..
  '\\[([^\\]]+)\\]' + ');' // bracket notation
  );

  function parseAttribute(attribute, attributes) {
    var val = attributes[attribute];
    if (typeof val !== 'string') return null;

    var m = undefined;

    if (m = val.match(softEntityRE)) attributes[attribute] = m;
  }

  function parseAttributes(token) {
    var tokenAttributes = token.a;

    each(Object.keys(tokenAttributes), function (attribute, index, attributes) {
      if (contains(SYNTAX.ATTRIBUTE, attribute)) {
        //parseSoftAttribute(attribute, token)
        delete token.a[attribute];
      } else {
        parseAttribute(attribute, tokenAttributes);
      }
    });
  }

  function parseElement(token, parents) {
    var $type = token.t;

    if ($type) {
      if ($type === 'c') {
        parents.pop();
        return null;
      }

      if (token.a) parseAttributes(token);
    }

    var parent = parents[parents.length - 1];
    var isString = typeof token === 'string';

    if (parent) {
      if (!parent.c) parent.c = [];

      parent.c.push(token);

      if (!isString && !voidRE.test($type)) parents.push(token);

      return null;
    }

    if (isString) return null;

    if (!voidRE.test($type)) parents.push(token);

    return token;
  }

  function parse(str) {
    var tokens = lex(str);
    if (typeof tokens === 'string') return tokens;

    var parents = [];

    return filter(map(tokens, function (token) {
      if (!parents.length && typeof token === 'string') return token;

      return parseElement(token, parents);
    }), Boolean);
  }

  var CACHE = {};

  function compile(body) {
      var parsed = CACHE[body] || (CACHE[body] = parse(body));
      parsed = esc(parsed.join(''));

      return new Function('data', 'return \'' + parsed + '\'');
  }

  function render(body, data) {
    return compile(body)(data);
  }

  exports.parse = parse;
  exports.lex = lex;
  exports.compile = compile;
  exports.render = render;

}));