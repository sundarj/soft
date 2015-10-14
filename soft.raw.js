(function () {
    
    "use strict";
	
    // UMD from underscorejs.org

    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    var soft = function (obj) {
        if (obj instanceof soft) return obj;
        if (!(this instanceof soft)) return new soft;
    }

    if (typeof exports != 'undefined') {
        if (typeof module != 'undefined' && module.exports) {
            exports = module.exports = soft;
        }
        exports.soft = soft;
    } else {
        root.soft = soft;
    }
    
    /*
        start soft.js code 
        Initialization
                            */

    var SOFT_PREFIX = ':';

    function prefixed(array) {
        return array.map(function (item) {
            return SOFT_PREFIX + item;
        });
    };

    soft.syntax = {
        self: prefixed(['self', 'this', 'here']),
        attributes: prefixed(['is', 'of', 'as', 'void']),
        elements: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
        void: ':void',
        helper: ':as'
    };
    
    var selfRegex = new RegExp(soft.syntax.self.join('|'), 'g')
    
    
    /*
        Helper functions
                            */

    function SoftError(message) {
        return 'SoftError: ' + message;
    };
    
    function htmlify(string) {
        return string.replace(/&(l|g)t;/g, function (match, direction) {
            if (direction === 'l')
                return '<';
            else
                return '>';
        });
    };
    
    function htmlescape(str) {
        return String(str).replace(/[&<>]/g, function (char) {
            return ({
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;'
            })[char];
        });

    };

    function typeOf(obj) {
        return Object.prototype.toString.call(obj)
            .replace(/\[object |\]/g, '');
    };

    function deepEscape(template) {

        switch (typeOf(template)) {
            case 'Array':
                template = template.map(deepEscape);
                break;
            case 'Object':
                Object.keys(template).forEach(function (item) {
                    template[item] = deepEscape(template[item]);
                });
                break;
            case 'String':
                template = htmlescape(template);
                break;
        }

        return template;

    };
    
    function noop(x) { return x };
    
    if (!Object.assign) {
      Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
          if (target === undefined || target === null) {
            throw new TypeError('Cannot convert first argument to object');
          }
    
          var to = Object(target);
          for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource === undefined || nextSource === null) {
              continue;
            }
            nextSource = Object(nextSource);
    
            var keysArray = Object.keys(Object(nextSource));
            for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
              var nextKey = keysArray[nextIndex];
              var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
              if (desc !== undefined && desc.enumerable) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
          return to;
        }
      });
    };
    
    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
            if (this == null) {
                throw new TypeError('can\'t convert ' + this + ' to object');
            }
            var str = '' + this;
            count = +count;
            if (count != count) {
                count = 0;
            }
            if (count < 0) {
                throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
                throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
                return '';
            }
            // Ensuring count is a 31-bit integer allows us to heavily optimize the
            // main part. But anyway, most current (August 2014) browsers can't handle
            // strings 1 << 28 chars or longer, so:
            if (str.length * count >= 1 << 28) {
                throw new RangeError('repeat count must not overflow maximum string size');
            }
            var rpt = '';
            for (;;) {
                if ((count & 1) == 1) {
                    rpt += str;
                }
                count >>>= 1;
                if (count == 0) {
                    break;
                }
                str += str;
            }
            return rpt;
        }
    }
    
    Array.from = Array.from || function (arraylike) {
        return [].slice.call(arraylike);
    };
    
    function isString(obj) {
        return typeof obj === 'string';
    };
    
    function isArray(obj) {
        return Array.isArray(obj);
    };
    
    function isObject(obj) {
        return typeOf(obj) === 'Object';  
    };
    
    function matchAll(string) {
        return new RegExp(string, "g");
    };
    
    /* 
        rest
               */
               
 


    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();