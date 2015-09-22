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
    
    var attributeRegex = new RegExp(soft.syntax.attributes.join('|'), 'g');
    var elementRegex = new RegExp(soft.syntax.elements.join('|'), 'g');
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
          'use strict';
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
    }
    
    Array.from = Array.from || function (arraylike) {
        return [].slice.call(arraylike);
    };
    
    /* 
        rest
               */
               

    function isVoidElement(element) {
        return !!element.attributes[soft.syntax.void];  
    };

    var attributeActions = {
        
        ':is': function (name) {
            var helper = this.getAttribute(':as') || '';
            if (helper)
                helper = '::' + helper;
                
            var template = '{{' + name + helper + '}}';
            
            if (!isVoidElement(this)) {
                this.innerHTML = template;
            }
            
            Array.from(this.attributes).forEach(function (attribute) {
                attribute.value = attribute.value.replace(selfRegex, template);
            });
        },
        
        ':of': function (name) {
            this.setAttribute('soft-repeat', 'repeat');
            attributeActions[':is'].call(this, name);
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
    }
                      
    function prerender(document) {
        var all = Array.from(document.querySelectorAll('*'));
        prerenderAttributes(all.filter(hasSoftAttributes));
        
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
        if (typeof body !== 'string')
            throw SoftError('cannot parse object of type ' + typeof body);
            
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
    
    var templateRegex = /{{([^}]+?)}}/g;
    
    soft.render = function (template, other) {
        if (typeof template === 'string')
            return soft.compile(template)(other);
            
        Array.from(this.querySelectorAll('[soft-repeat]')).forEach(function (item) {
            var match = templateRegex.exec(item.innerHTML);
            match = match && match[1];
            
            var key = match.split("::")[0];
            
            item.removeAttribute('soft-repeat');
            item.outerHTML = item.outerHTML.repeat(template[key].length);
        });
        
        return this.innerHTML.replace(templateRegex, function (full, text) {
            var parts = text.split('::');
            var helper = soft.helpers[parts[1]];
            var fromTemplate = template[parts[0]];
            
            if (helper) {
                if (typeof fromTemplate === 'string')
                    fromTemplate = helper(fromTemplate)
                else if (Array.isArray(fromTemplate)) {

                }
            }
            
            return fromTemplate;
        }); 
    };
 



    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();