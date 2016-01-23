(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.soft = {})));
}(this, function (exports) { 'use strict';

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
        let parsed = CACHE[body] || (CACHE[body] = parse(body))
        
        return new Function( 'data', `return ${JSON.stringify(parsed)}` )
    }

    const render = (body, data) => compile(body)(data)

    exports.parse = parse;
    exports.compile = compile;
    exports.render = render;

}));