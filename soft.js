"use strict";

(function () {
	
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


    var assert = typeof assert == 'function' ? assert : console.assert.bind(console);
    var document = root.document;

    var lexicon = new Map;

    function prefixed(array) {
        var prefix = ':';
        return array.map(function (item) {
            return item.map ? prefixed(item) : prefix + item;
        });
    }

    lexicon.set("attributes", prefixed(['is', 'of', 'at', 'void']));
    lexicon.set("elements", prefixed([['import', 'include'], 'if', 'else', ['endif', 'fi']]));

    var foundElements = [];
    var foundAttributes = [];

    function flatten(array) {
        return array.reduce(function (a, b) {
            return a.concat(b);
        }, []);
    }

    function initialize() {
        
        var softElements = flatten(lexicon.get('elements'));
        var softAttributes = lexicon.get('attributes');
        
        var elementRegex = new RegExp(softElements.map(function (element) {
            // this is a handy way to create
            // a HTMLElement regex: just use its .outerHTML;
            var el = document.createElement(element);
            el.setAttribute("src", "(\\w(\\\\|/)?)+");
            var closingTagRegex = new RegExp("<\/" + el.nodeName + ">", "i");
            return el.outerHTML.replace(closingTagRegex, '');
        }).join("|"), "g");
  
        // test if soft elements are interpreted as text or an element
        var matches = elementRegex.test(document.body.textContent) ? document.body.textContent : document.body.innerHTML;
        
        matches.replace(elementRegex, function (match) {
            console.log(match);
        });

        [].forEach.call(document.body.querySelectorAll('*'), function (element) {
            if (~element.tagName.toLowerCase().indexOf(softElements)) {
                foundElements.push(element);
            }

            var attributes = new Map;
            [].forEach.call(element.attributes, function (attribute) {
                var name = attribute.nodeName.toLowerCase();
                var value = attribute.nodeValue.toLowerCase();

                if (~softAttributes.indexOf(name)) {
                    attributes.set(name, value);
                }
            });

            if (attributes.size > 0)
                foundAttributes.push([element, attributes]);
        });

    };

    root.foundElements = foundElements;
    root.foundAttributes = foundAttributes;

    window.addEventListener("DOMContentLoaded", initialize);



    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();