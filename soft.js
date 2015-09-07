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

    
    
    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();