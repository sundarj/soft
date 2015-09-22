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


    soft.isNode = (function (root) {
        return !!(root.require && root.process && root.process.version);
    })(root);

    
    
    
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
    
    
    /*
        Helper functions
                            */

    function SoftError(message) {
        return 'SoftError: ' + message;
    };

    function truthy(x) { return !!x };

    function deescape(html) {
        return html.replace(/&(l|g)t;/g, function (match, direction) {
            if (direction === 'l')
                return '<';
            else
                return '>';
        });
    };

    function reescape(str) {
        return String(str).replace(/[&<>]/g, function (match) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;'
            })[match];
        });

    };

    function stripQuotes(attrValue) {
        return attrValue.replace(/['"]/g, '');
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
                template = reescape(template);
                break;
        }

        return template;

    };
    
    /* 
        rest
               */
               
    function isSoftElement(element) {
        return ~soft.syntax.elements.indexOf(element.tagname);
    };
    
    function isSoftAttribute(attribute) {
        return ~soft.syntax.attributes.indexOf(attribute.name);
    };
               
    function createAttribute(attribute) {
        var attr = ' ' + attribute.name;
        if (stripQuotes(attribute.value)) {
            attr += '=' + attribute.value
        }
        return attr;
    };

    function createOpenTag(tag) {
        if (isSoftElement(tag))
            return '';
            
        var open = '<' + tag.tagname;
        var content = '';
        var helper = '';
        var empty = false;
        
        if (tag.attributes.length) {
            open += tag.attributes.map(function (attribute) {
                if (isSoftAttribute(attribute)) {
                    var name = attribute.name;
                    var value = stripQuotes(attribute.value);
                    var helperName = soft.syntax.helper;
                    var voidName = soft.syntax.void;

                    if (!~[voidName, helperName].indexOf(name)) {
                        content = '((' + value + '))';
                    } else if (name === helperName) {
                        helper = value;
                    } else if (name === voidName) {
                        // element is void element
                        empty = true;
                    }
                        
                    return '';
                };
                return createAttribute(attribute);
            }).join("");
            soft.syntax.self.forEach(function (self) {
                self = new RegExp(self, "g");
                open = open.replace(self, content.replace("))", " "+helper+"))"));
            });
        };
        return open + '>' + (empty? '' : content.replace("))", " "+helper+"))"));
    };
    
    function createSingle(content) {
        if (content.type === 'open tag')
            return createOpenTag(content);
        else if (content.type === 'close tag')
            return '</' + content.tagname + '>';
        else if (content.type === 'text')
            return content.content;
    }
    
    function parseNested(element) {
        element = element.map(function (item) {
            if (Array.isArray(item.content))
                return parseElement(item);
            else
                return createSingle(item);
        }).join('');
        return element;
    };
    
    function parseElement(element) {
        element.content = element.content.map(function (content) {
            if (!content) return '';

            if (Array.isArray(content))
                return parseNested(content);
                
            return createSingle(content);
        }).join('');
        return element.content;
    };

    function useToken(token) {
        
        switch (token.type) {
            case 'text':
                return token.content;
                break;
            case 'comment':
                return '<!--' + token.content + '-->';
                break;
            case 'element':
                return parseElement(token);
                break;
        }
        
    };
    
    soft.parse = function (body) {
        return parser.parse(body).map(useToken);
    };
    
    soft.cache = Object.create(null);
    
    soft.compile = function (string) {
        string = deescape(string);
        var parsed = string in soft.cache?
            soft.cache[string] :
            (soft.cache[string] = soft.parse(string));
        
        return soft.render.bind(parsed);
    };
    
    function renderElement(element) {
        element = element.map(function (part) {
            if (typeof part === 'string')
                return part;
            else
                console.log(part);
        });
    }
    
    soft.render = function (template, other) {
        if (typeof template === 'string')
            return soft.compile(template)(other);
        
        return this.join(''); 
    };
 



    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();