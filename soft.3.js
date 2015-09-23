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
        return String(str).replace(/[&<>]/g, function (match) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;'
            })[match];
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
    
    function noop() { };
    
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
               

    function isVoidElement(element) {
        return !!element.attributes[soft.syntax.void];  
    };

    var attributeActions = {
        
        ':is': function (name, key) {
            var helper = this.getAttribute(':as') || '';
            if (helper)
                helper = '::' + helper;
                
            key = key || '';
            if (key)
                key = '.' + key;
                
            var template = '{{' + name + key + helper + '}}';
            var innerHTML = this.innerHTML;
            
            if (!isVoidElement(this)) {
                soft.syntax.self.forEach(function (self) {
                    var selfElement = '&lt;' + self + '&gt;';
                    if (~innerHTML.indexOf(selfElement))
                        innerHTML = innerHTML.replace(selfElement, template);
                }, this);
                
                if (!~innerHTML.indexOf(template)) {
                    innerHTML = template;
                }
                
                this.innerHTML = innerHTML;
            }
            
            console.log(this);
            
            Array.from(this.attributes).forEach(function (attribute) {
                attribute.value = attribute.value.replace(selfRegex, template);
            });
        },
        
        ':of': function (name) {
            this.setAttribute('soft-repeat', 'repeat');
            var key = this.getAttribute(':is');
            this.removeAttribute(':is');
            
            attributeActions[':is'].call(this, name, key);
        },
        
        ':as': noop,
        ':void': noop
        
    };
    
    soft.helpers = soft.helpers || {};
    soft.helper = function (name, action) {
        soft.helpers[name] = action;
    };

    function prerenderAttributes(elements) {
        elements.forEach(function (element) {
            Array.from(element.attributes).forEach(function (attribute) {
                var action = attributeActions[attribute.name];
                if (action) {
                    action.call(element, attribute.value);
                    element.removeAttribute(attribute.name);
                }
            });
        });
    };
    
    function hasSoftAttributes(element) {
        return Array.from(element.attributes).some(function (attribute) {
            return ~soft.syntax.attributes.indexOf(attribute.name);
        });
    };
    
    var allElements;
                      
    function prerender(document) {
        allElements = Array.from(document.querySelectorAll('*'));
        prerenderAttributes(allElements.filter(hasSoftAttributes));
        
        return document;
    };
    
    var document = root.document;
        
    if (typeof document == 'undefined') {
        document = {
            createElement: function () {
                var jsdom = require('jsdom').jsdom;
                return jsdom('<body></body>').body;
            }
        };
    };
    
    soft.document = document.createElement('body'); 
    
    soft.parse = function (body) {
        if (!isString(body))
            throw SoftError('cannot parse object of type ' + typeOf(body));
            
        soft.document.innerHTML = body;
        
        return prerender(soft.document);
    };
    
    soft.cache = Object.create(null);
    
    var defaults = {
        autoescape: true
    };
    
    soft.compile = function (string, opts) {
        var parsed = string in soft.cache?
            soft.cache[string] :
            (soft.cache[string] = soft.parse(string));
        
        return soft.render.bind(parsed);
    };
    
    var templateRegex = /{{([^}]+?)}}/;
    
    function renderSingle(element, template) {
        var matches = element.outerHTML.match(templateRegex);
        
        if (!matches)
            return;
        
        var full = matches[0];
        var name = matches[1];
        
        var nameParts = name.split("::");
        var fromTemplate = template[nameParts[0]];
        var helper = soft.helpers[nameParts[1]];
        
        if (helper) {
            fromTemplate = helper(fromTemplate);
        };
        
        element.outerHTML = element.outerHTML.replace(matchAll(full), fromTemplate);
    };
    
    function renderList(element, template) {
        var matches = element.innerHTML.match(templateRegex);
        
        Array.from(element.children).forEach(function (child) {
            child.removeAttribute('soft-repeat');
        });
        
        var full = matches[0];
        var name = matches[1];
        
        var nameParts = name.split("::");
        var fromTemplate = template[nameParts[0]];
        
        if (!isArray(fromTemplate))
            throw SoftError('value passed to :of must be of type Array, not ' + typeof fromTemplate);
        
        var helper = soft.helpers[nameParts[1]];
        
        if (helper) {
            fromTemplate = fromTemplate.map(helper);
        };
        
        var repl = element.innerHTML;
        
        fromTemplate.forEach(function (item, index) {
            var replacement = repl.replace(matchAll(full), item);
            
            if (index < 1)
                element.innerHTML = replacement;
            else
                element.innerHTML += replacement;
        });
    }
    
    soft.render = function (template, other) {
        if (isString(template))
            return soft.compile(template)(other);
        
        allElements.forEach(function (element) {
            if (element.children.length)
                return // do not attempt to render container elements
            
            if (element.getAttribute('soft-repeat')) {
                renderList(element.parentNode, template);
            } else {
                renderSingle(element, template);
            }
        });
        
        return this.innerHTML;
    };
 



    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();