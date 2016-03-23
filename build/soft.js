(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.soft = global.soft || {})));
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
  }

  function map(arr, fn) {

    var index = -1;
    var length = arr.length;
    var result = Array(length);

    while (++index < length) {
      result[index] = fn(arr[index], index, arr);
    }

    return result;
  }

  function filter(arr, predic) {

    var index = -1;
    var length = arr.length;
    var result = [];

    while (++index < length) {
      if (predic(arr[index])) result.push(arr[index]);
    }

    return result;
  }

  function esc(s) {

    return s.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/, '\\u2028').replace(/\u2029/, '\\u2029');
  }

  function prefixed(item, prefix) {

    if (typeof item === 'string') return prefix + item;

    return item.map(function (i) {
      return prefix + i;
    });
  }

  function syntax(prefix) {

    return {
      ENTITY: ['self', 'this', 'here'],
      ATTRIBUTE: prefixed(['is', 'of', 'as'], prefix),
      ELEMENT: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi'], prefix),
      HELPER: prefixed('as', prefix)
    };
  }

  var SYNTAX = syntax();

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

  /* eslint-disable max-len */

  var voidRE = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|import|include)$/i;

  /* eslint-enable max-len */

  var softEntities = SYNTAX.ENTITY.join('|');

  /* eslint-disable prefer-template */
  var softEntityRE = new RegExp('&(?:' + softEntities + ');' + '|' + // plain ol' entities or..
  '&(?:' + softEntities + ')' + // entities with
  '(?:' + '\\.([^;]+)' + '|' + // dot notation or..
  '\\[([^\\]]+)\\]' + ');' // bracket notation
  );
  /* eslint-enable prefer-template */

  var quotRE = /^['"]|['"]$/g;

  function parseAttribute(attribute, attributes) {

    var val = attributes[attribute];
    if (typeof val !== 'string') return;

    /* eslint-disable prefer-const */
    var m = undefined;
    /* eslint-enable prefer-const */

    if (m = val.match(softEntityRE)) {
      each(SYNTAX.ATTRIBUTE, function (softAttribute) {

        var item = attributes[softAttribute];

        if (item) {
          m.soft = {
            i: item.replace(quotRE, '')
          };

          var helper = attributes[SYNTAX.HELPER];
          if (helper) {
            m.soft.h = helper.replace(quotRE, '');
          }
        }
      });

      attributes[attribute] = Object.assign({}, m);
    }
  }

  function parseSoftAttribute(attribute, token) {

    var helperName = SYNTAX.HELPER;
    if (attribute === helperName) return;

    var attributes = token.a;
    var val = attributes[attribute];

    if (!token.c) token.c = [];

    var item = {
      i: val.replace(quotRE, '')
    };

    var helper = attributes[helperName];
    if (helper) item.h = helper.replace(quotRE, '');

    token.c.push(item);
  }

  function parseAttributes(token) {

    var attributes = token.a;
    var toDelete = [];

    each(Object.keys(attributes), function (attribute) {

      if (contains(SYNTAX.ATTRIBUTE, attribute)) {
        parseSoftAttribute(attribute, token);
        toDelete.push(attribute);
      } else {
        parseAttribute(attribute, attributes);
      }
    });

    each(toDelete, function (attribute) {
      return delete attributes[attribute];
    });

    token.a = attributes;
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

      if (!isString && !voidRE.test($type)) {
        parents.push(token);
      }

      return null;
    }

    if (isString) return null;

    if (!voidRE.test($type)) parents.push(token);

    return token;
  }

  function parse(str) {

    var tokens = lex(str);
    if (typeof tokens === 'string') return tokens;

    if (config.prefix != null) SYNTAX = syntax(config.prefix);

    var parents = [];

    return filter(map(tokens, function (token) {

      if (!parents.length && typeof token === 'string') {
        return token;
      }

      return parseElement(token, parents);
    }), Boolean);
  }

  var CACHE = {};

  function compile(body) {
    var parsed = CACHE[body] || (CACHE[body] = parse(body));
    parsed = esc(parsed.join(''));

    return new Function('data', 'return \'' + parsed + '\'');
  }

  var config = {
    prefix: ':'
  };

  function configure(options) {

    Object.assign(config, options);

    /* eslint-disable no-undef */
    return soft;
    /* eslint-enable no-undef */
  }

  function render(body, data) {

    return compile(body)(data);
  }

  exports.parse = parse;
  exports.lex = lex;
  exports.compile = compile;
  exports.config = config;
  exports.configure = configure;
  exports.render = render;

}));