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

    function lex(str) {
        let ret = []
        
        each(str, (char) => {
            ret.push(char)
        })
        
        return ret
    }

    function parse(str, opts) {
        return lex(str)
    }

    function compile() {}
    function render() {
        return compile()
    }

    exports.parse = parse;
    exports.compile = compile;
    exports.render = render;

}));